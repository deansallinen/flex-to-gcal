// scraper

const moment = require('moment-timezone');
const axios = require('axios');

const {
  getFlexCal,
  getFlexDetails,
  getFlexFinancials
} = require('./getFlex');
// const Event = require('../models/Event');

const now = moment.tz('America/Vancouver');
// const startDate = subMonths(now, 1);
// const endDate = addMonths(now, 1);
const startDate = now;
const endDate = now;
// const startDate = moment.tz('America/Vancouver').subtract(1, 'week');
// const endDate = moment.tz('America/Vancouver').add(1, 'week');

const keepalive = () => axios.get(`https://flex-to-gcal.now.sh`);

setInterval(keepalive, 300000); // keepalive for scraper 300000 = 5 min

const API = 'https://flex-to-gcal.now.sh/v1';

const getOneEvent = async elementId => {
  // console.log("Getting one event...")
  try {
    const res = await axios.get(`${API}/events/${elementId}`);
    // console.log(!!res);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const getAction = status => {
  console.log("Getting Action for status:", status)
  if (['Cancelled', 'Closed'].includes(status)) {
    return 'delete';
  }
  return 'update';
}

const shouldDoUpdate = async (eventID, status) => {
  console.log("\nChecking if update needed: ", eventID)

  try {
    const [details, res] = await Promise.all([
      getFlexDetails(eventID),
      getOneEvent(eventID)
    ]);

    console.log("Found Flex: ", !!details, "\nFound DB: ", !!res)

    if (!res) {
      console.log("No result in DB!")
      return { ...details, actionNeeded: "insert" }
    }

    const detailsDate = getMoment(details.dateModified)
    const resDate = moment(res.dateModified).format()
    const datesMatch = detailsDate == resDate

    console.log(detailsDate)
    console.log(resDate)
    console.log("Match:", datesMatch)

    return {
      ...details,
      actionNeeded: !datesMatch ? getAction(status) : null
    }

  } catch (err) {
    throw err;
  }
}

const getMoment = dateTime =>
  dateTime ?
    moment.tz(dateTime, 'DD-MM-YYYY HH:mm', 'America/Vancouver').format() :
    null;

const setTz = dateTime =>
  dateTime ? moment.tz(dateTime, 'America/Vancouver').format() : null;

const addMeta = async detailedEvent => {
  console.log("Adding meta information...")
  return {
    ...detailedEvent,
    lastScraped: moment.tz('America/Vancouver'),
    dateModified: getMoment(detailedEvent.dateModified),
    loadInDate: getMoment(detailedEvent.loadInDate),
    loadOutDate: getMoment(detailedEvent.loadOutDate),
    plannedStartDate: setTz(detailedEvent.plannedStartDate),
    plannedEndDate: setTz(detailedEvent.plannedEndDate),
  };
};

const mergeObjects = (...args) => {
  return args.reduce((p, c, i, a) => ({ ...p, ...c }))
}

// Promise chain resolves events in order. This slows down the process
// but avoids overloading the API with too many requests.
const getDetailsInOrder = arr => {
  const results = [];
  return arr
    .reduce(
      (promiseChain, item) =>
        promiseChain.then(async () => {

          const details = await shouldDoUpdate(item.elementId, item.status)

          if (!details.actionNeeded) {
            console.log("No action needed.")
            return Promise.resolve();
          }

          console.log("Action needed:", details.actionNeeded)

          if (details.actionNeeded === 'delete') {
            console.log("Add to delete list.")
            results.push(addMeta(details))
            console.log("No further action needed.")
            return Promise.resolve();
          }

          return getFlexFinancials(item.elementId)
            .then(financials => mergeObjects(item, financials, details))
            .then(detailedItem => addMeta(detailedItem))
            .then(data => results.push(data))

        }),
      Promise.resolve() // Starts the chain with a resolved promise
    )
    .then(() => results);
};

const sendToDB = async (args) => {
  const { method, url, data } = args;
  try {
    return axios({
      baseURL: API,
      method,
      url,
      data,
    })
  } catch (error) {
    throw error
  }
}

const updateDB = calendarArray => {
  // could send an array to the db in the future for a single request?
  // calendarArray.forEach(e => console.log(e.actionNeeded, e.dateModified))

  const updated = calendarArray
    .filter(event => ['update', 'delete'].includes(event.actionNeeded))
    .map(data => sendToDB({ url: `/events/${data.objectIdentifier}`, method: "POST", data }));

  const inserted = calendarArray
    .filter(event => event.actionNeeded === 'insert')
    .map(data => sendToDB({ url: `/events/`, method: "POST", data }));

  // const deleted = calendarArray
  //   .filter(event => event.actionNeeded === 'delete')
  //   .map(data => sendToDB({ url: `/events/${data.objectIdentifier}`, method: "POST", data }));

  // const nothing = calendarArray.filter(event => event.actionNeeded === null);

  return {
    inserted: inserted.length,
    updated: updated.length,
    // deleted: deleted.length,
    // nothing: calendarArray.length - inserted.length - updated.length
  };
};

const scrape = async () => {
  console.log("Starting scrape... ")
  const fcal = await getFlexCal(startDate, endDate);
  console.log("Received: ", fcal.length)
  const cals = await getDetailsInOrder(fcal);
  console.log("Updating DB with: ", cals.length)
  // console.log(cals[0])
  const updated = updateDB(cals);
  console.log("Skipped:", fcal.length - cals.length)
  console.log('\n', new Date(), updated);
};

scrape();

module.exports = {
  scrape,
  getAction,
  getOneEvent,
  shouldDoUpdate,
  addMeta,
  getMoment,
  setTz
};
