// scraper

const moment = require('moment-timezone');
const axios = require('axios');

const { getFlexCal, getFlexDetails, getFlexFinancials } = require('./getFlex');
// const Event = require('../models/Event');

const now = moment.tz('America/Vancouver');
// const startDate = subMonths(now, 1);
// const endDate = addMonths(now, 1);
const startDate = now;
const endDate = now;
// const startDate = now.subtract(1, 'week');
// const endDate = now.add(1, 'week');

setInterval(function(){axios.get(`flextogcal-hglzjqywbi.now.sh`)}, 300000) // keepalive for scraper

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
  return { inserted: inserted.length, updated: updated.length };
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

const getMoment = dateTime => dateTime ? moment(dateTime, 'DD-MM-YYYY HH:ss') : null
const setTz = dateTime => dateTime ? moment.tz(dateTime, 'America/Vancouver') : null

const addMeta = async (detailedEvent) => {
  const loadOutDate = setTz(getMoment(await detailedEvent.loadOutDate)) 
  const loadInDate = setTz(getMoment(await detailedEvent.loadInDate ))
  const dateModified = setTz(getMoment(await detailedEvent.dateModified ))
  const plannedStartDate = setTz(await detailedEvent.plannedStartDate)
  const plannedEndDate = setTz(await detailedEvent.plannedEndDate)
  return {
    ...await detailedEvent,
    lastScraped: now,
    dateModified,
    loadInDate,
    loadOutDate,
    plannedStartDate,
    plannedEndDate,
    actionNeeded: await getAction({
      status: await detailedEvent.status,
      elementId: await detailedEvent.elementId,
      dateModified,
    }),
  };
};

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

const scrape = async () => {
  const fcal = await getFlexCal(startDate, endDate);
  const cals = getDetailsInOrder(fcal);
  const updated = updateDB(await cals);
  console.log(updated);
};

// scrape();

// getOneEvent('19ee3ab0-8aca-11e8-9e13-0030489e8f64').then(res => console.log(res.data));

module.exports = {
  scrape,
  getAction,
  getOneEvent,
  getDetails,
  addMeta,
};
