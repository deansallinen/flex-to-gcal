// const deepequal = require('deep-equal');
const { parse } = require('date-fns');
const moment = require('moment');

moment().format();
const { getFlexCal, getFlexDetails, getFlexFinancials } = require('./getFlex');
const Event = require('./Event');

const startDate = new Date();
const endDate = new Date();

const mergeDetails = (event, details, financials) => ({
  ...event,
  ...details,
  ...financials,
  lastScraped: new Date(),
  dateModified: details.dateModified ? moment(details.dateModified, 'DD-MM-YYYY HH:ss') : null,
  loadInDate: details.loadInDate ? moment(details.loadInDate, 'DD-MM-YYYY HH:ss') : null,
  loadOutDate: details.loadOutDate ? moment(details.loadOutDate, 'DD-MM-YYYY HH:ss') : null,
});

const getOneEvent = elementId => Event.findOne({ elementId }).exec();
const upsertEvent = (event) => {
  Event.findOneAndUpdate({ elementId: event.elementId }, event, { upsert: true })
    .then(res => console.log(res));
};
// const insertEvent = (event) => {
//   Event.create(event, (err, doc) => {
//     if (err) return err;
//     return doc;
//   });
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

// const writeToDB = (cals) => {
//   Event.insertMany(cals.toInsert, { ordered: false }, (err, docs) => {
//     if (err) throw err; console.log(docs);
//   });
//   [...cals.toDelete, ...cals.toUpdate].map((event) => {
//     Event.update({ elementId: event.elementId }, event, (err, doc) => {
//       if (err) throw err; console.log(doc);
//     });
//   });
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

main();

module.exports = {
  main,
  mergeDetails,
  upsertEvent,
  getOneEvent,
};
