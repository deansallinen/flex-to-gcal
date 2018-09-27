// scraper

const { addMonths, subMonths, parse } = require('date-fns');
const moment = require('moment');
const axios = require('axios');

const { getFlexCal, getFlexDetails, getFlexFinancials } = require('./getFlex');
// const Event = require('../models/Event');

const now = new Date();
// const startDate = subMonths(now, 1);
// const endDate = addMonths(now, 1);
const startDate = now;
const endDate = now;


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
    const res = await getOneEvent(event.elementId); // could speed this up with just necessary fields
    if (res) {
      if (parse(event.dateModified) !== parse(res.dateModified)) {
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
  const toUpdate = calendarArray.filter(event => ['update', 'delete'].includes(event.actionNeeded));
  const toInsert = calendarArray.filter(event => event.actionNeeded === 'insert');
  // could send an array to the db in the future for a single request
  // const inserted = toInsert.map(async event => axios.post(`${API}/events/`, await event));
  // const updated = toUpdate.map(async event => axios.post(`${API}/events/${event.elementId}`, await event));
  // return { inserted, updated };
  return [...toUpdate, ...toInsert];
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
  ...detailedEvent,
  lastScraped: now,
  dateModified: detailedEvent.dateModified ? moment(detailedEvent.dateModified, 'DD-MM-YYYY HH:ss') : null,
  loadInDate: detailedEvent.loadInDate ? moment(detailedEvent.loadInDate, 'DD-MM-YYYY HH:ss') : null,
  loadOutDate: detailedEvent.loadOutDate ? moment(detailedEvent.loadOutDate, 'DD-MM-YYYY HH:ss') : null,
  actionNeeded: await getAction(detailedEvent),
});

const main = async () => {
  const fcal = await getFlexCal(startDate, endDate);
  const details = fcal.map(await getDetails);
  const actions = details.map(await addMeta);
  const cals = updateDB(actions);
  return cals;
};

// main();


// getOneEvent('19ee3ab0-8aca-11e8-9e13-0030489e8f64').then(res => console.log(res.data));

module.exports = {
  main,
  getAction,
  getOneEvent,
  getDetails,
};
