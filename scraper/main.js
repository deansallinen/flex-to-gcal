// scraper

const moment = require('moment');
const axios = require('axios');

const { getFlexCal, getFlexDetails, getFlexFinancials } = require('./getFlex');
// const Event = require('../models/Event');

const now = moment();
// const startDate = subMonths(now, 1);
// const endDate = addMonths(now, 1);
const startDate = now.subtract(1, 'week');
const endDate = now.add(1, 'week');


const API = 'http://localhost:3000/v1';

const getOneEvent = async (elementId) => {
  try {
    const res = await axios.get(`${API}/events/${elementId}`);
    // console.log(res.data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const getAction = async (event) => {
  try {
    const res = await getOneEvent(await event.elementId); // could speed this up with just necessary fields
    if (res) {
      console.log(res);
      if (!moment(event.dateModified).isSame(res.dateModified)) {
        // update db Event.
        if (['Cancelled', 'Closed'].includes(event.status)) {
          return 'delete';
        }
        return 'update';
      }
      return null;
    }
    // insert to db
    if (['Cancelled', 'Closed'].includes(event.status)) {
      return null;
    }
    return 'insert';
  } catch (err) {
    throw err;
  }
};

const updateDB = (calendarArray) => {
  // could send an array to the db in the future for a single request?
  const updated = calendarArray
    .filter(event => ['update', 'delete'].includes(event.actionNeeded))
    .map(event => axios.post(`${API}/events/${event.elementId}`, event));
  const inserted = calendarArray
    .filter(event => event.actionNeeded === 'insert')
    .map(event => axios.post(`${API}/events/`, event));
  return { inserted, updated };
};


const getDetails = async (event) => {
  const eventId = await event.elementId;
  try {
    const [details, financials] = await Promise.all([
      getFlexDetails(eventId),
      getFlexFinancials(eventId),
    ]);
    return { ...event, ...details, ...financials };
  } catch (err) {
    throw err;
  }
};

const addMeta = async detailedEvent => ({
  ...await detailedEvent,
  lastScraped: now,
  dateModified: detailedEvent.dateModified ? moment(detailedEvent.dateModified, 'DD-MM-YYYY HH:ss') : null,
  loadInDate: detailedEvent.loadInDate ? moment(detailedEvent.loadInDate, 'DD-MM-YYYY HH:ss') : null,
  loadOutDate: detailedEvent.loadOutDate ? moment(detailedEvent.loadOutDate, 'DD-MM-YYYY HH:ss') : null,
  actionNeeded: await getAction({
    status: detailedEvent.status,
    elementId: detailedEvent.elementId,
    dateModified: this.dateModified,
  }),
});

// Promise chain resolves events in order. This slows down the process
// but avoids overloading the API with too many requests.
const getDetailsInOrder = (arr) => {
  const results = [];
  return arr.reduce(
    (promiseChain, item) => promiseChain.then(() => getDetails(item)
      .then(detailedItem => addMeta(detailedItem))
      .then(data => results.push(data))),
    Promise.resolve(), // Starts the chain with a resolved promise
  ).then(() => results);
};

const main = async () => {
  const fcal = await getFlexCal(startDate, endDate);
  const cals = getDetailsInOrder(fcal);
  const updated = updateDB(await cals);
  console.log(updated);
};

main();

// getOneEvent('19ee3ab0-8aca-11e8-9e13-0030489e8f64').then(res => console.log(res.data));

module.exports = {
  main,
  getAction,
  getOneEvent,
  getDetails,
  addMeta,
};
