// const deepequal = require('deep-equal');
const { addMonths, subMonths } = require('date-fns');
const moment = require('moment');
const axios = require('axios');

const { getFlexCal, getFlexDetails, getFlexFinancials } = require('./getFlex');
const Event = require('../models/Event');

const now = new Date();
const startDate = subMonths(now, 1);
const endDate = addMonths(now, 1);

const mergeDetails = (event, details, financials) => ({
  ...event,
  ...details,
  ...financials,
  lastScraped: now,
  dateModified: details.dateModified ? moment(details.dateModified, 'DD-MM-YYYY HH:ss') : null,
  loadInDate: details.loadInDate ? moment(details.loadInDate, 'DD-MM-YYYY HH:ss') : null,
  loadOutDate: details.loadOutDate ? moment(details.loadOutDate, 'DD-MM-YYYY HH:ss') : null,
});

const getOneEvent = async (elementId) => {
  try {
    const res = await axios.get(`http://localhost:3000/v1/events/${elementId}`);
    return res;
  } catch (err) {
    console.error(err);
  }
};

const upsertEvent = (event) => {
  Event.findOneAndUpdate({ elementId: event.elementId }, event, { upsert: true })
    .then(res => console.log(res));
};

// const getOneEvent = elementId => Event.findOne({ elementId }).exec();
// const upsertEvent = (event) => {
//   Event.findOneAndUpdate({ elementId: event.elementId }, event, { upsert: true })
//     .then(res => console.log(res));
// };


// const addAction = async (event) => {
//   try {
//     const res = await getOneEvent(event.elementId); // could speed this up with just necessary fields
//     if (res) {
//       if (parse(event.dateModified) > parse(res.lastScraped)) {
//         // update db Event.
//         if (['Cancelled', 'Closed'].includes(event.status)) {
//           return ({ ...event, actionNeeded: 'delete' });
//         }
//         return ({ ...event, actionNeeded: 'update' });
//       }
//       return ({ ...event, actionNeeded: 'none' });
//     }
//     // insert to db
//     if (['Cancelled', 'Closed'].includes(event.status)) {
//       return ({ ...event, actionNeeded: 'none' });
//     }
//     return ({ ...event, actionNeeded: 'insert' });
//   } catch (err) {
//     throw err;
//   }
// };

// const sortToDB = (event) => {
//   try {
//     const res = await getOneEvent(event.elementId); // could speed this up with just necessary fields
//     if (res) {
//       if (parse(event.dateModified) > parse(res.lastScraped)) {
//         // update db Event.
//         if (['Cancelled', 'Closed'].includes(event.status)) {
//           return ({ ...event, actionNeeded: 'delete' });
//         }
//         return ({ ...event, actionNeeded: 'update' });
//       }
//       return ({ ...event, actionNeeded: 'none' });
//     }
//     // insert to db
//     if (['Cancelled', 'Closed'].includes(event.status)) {
//       return ({ ...event, actionNeeded: 'none' });
//     }
//     return ({ ...event, actionNeeded: 'insert' });
//   } catch (err) {
//     throw err;
//   }
// };

// const createStagingObject = (sortedCal) => {
//   const toDelete = sortedCal.filter(event => event.actionNeeded === 'delete');
//   const toUpdate = sortedCal.filter(event => event.actionNeeded === 'update');
//   const toInsert = sortedCal.filter(event => event.actionNeeded === 'insert');
//   return { toDelete, toUpdate, toInsert };
// };


const main = async () => {
  const fcal = await getFlexCal(startDate, endDate);
  const details = fcal.map(async event => mergeDetails(event, await getFlexDetails(event.elementId), await getFlexFinancials(event.elementId)));
  // const sortedCal = details.map(async event => sortToStagingArray(await event));
  // const cals = createStagingObject(await Promise.all(sortedCal));
  // const actions = details.map(async event => addAction(await event));
  const cals = details.map(async event => upsertEvent(await event));
  return cals;
};

// main();

getOneEvent('19ee3ab0-8aca-11e8-9e13-0030489e8f64').then(res => console.log(res.data.strike));

module.exports = {
  main,
  mergeDetails,
  upsertEvent,
  getOneEvent,
};
