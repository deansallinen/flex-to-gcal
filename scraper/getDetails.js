// getDetails.js

// require('dotenv').configure()
const { getFlexDetails, getFlexFinancials } = require('./getFlex');
const { addMeta, getMoment } = require('./addMeta');
const { doNotifications } = require('./doNotifications');
const moment = require('moment-timezone');
const axios = require('axios');
const { post, messages, postAttach } = require('../slackbot');

const API = process.env.API;

const getOneEvent = async elementId => {
  console.log('Getting one event...');
  try {
    const res = await axios.get(`${API}/events/${elementId}`);
    // console.log(!!res);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const getAction = status => {
  // updated event
  console.log('Getting Action for status:', status);
  if (['Cancelled', 'Closed'].includes(status)) {
    return 'delete';
  }
  return 'update';
};

const datesMatch = (flexDate, dbDate) => {
  if (!flexDate && !dbDate) return [false, null, null];
  const newDate = getMoment(flexDate);
  const oldDate = moment
    .tz(dbDate, 'America/Vancouver')
    // .add(1, 'days')
    .format();
  return [newDate === oldDate, oldDate, newDate];
};

const shouldDoUpdate = async (eventID, status, cookie) => {
  console.log('\nChecking if update needed: ', eventID);

  try {
    const [details, res] = await Promise.all([
      getFlexDetails(eventID, cookie),
      getOneEvent(eventID),
    ]);

    console.log('Found Flex: ', !!details, '\nFound DB: ', !!res);

    if (!res) {
      // new event
      console.log('No result in DB!');
      return { ...details, actionNeeded: 'insert' };
    }

    const [modifiedDatesMatch] = datesMatch(
      details.dateModified,
      res.dateModified
    );
    const [loadInDatesMatch, oldLoadInDate, newLoadInDate] = datesMatch(
      details.loadInDate,
      res.loadInDate
    );
    const [loadOutDatesMatch, oldLoadOutDate, newLoadOutDate] = datesMatch(
      details.loadOutDate,
      res.loadOutDate
    );

    console.log('Modified Dates match:', modifiedDatesMatch);
    console.log('Load In Dates match:', loadInDatesMatch);
    console.log('Load Out Dates match:', loadOutDatesMatch);

    // // For notifications on load dates changing, TODO: Format dates correctly
    // const conditions = () => {
    //   res.typeName === 'Quote' && (!loadInDatesMatch || !loadOutDatesMatch);
    // };

    // if (conditions) {
    //   //   post(messages.loadInChange)({ ...res, oldLoadInDate, newLoadInDate });
    //   postAttach({
    //     ...res,
    //     loadInDatesMatch,
    //     oldLoadInDate,
    //     newLoadInDate,
    //     loadOutDatesMatch,
    //     oldLoadOutDate,
    //     newLoadOutDate,
    //   })();
    // }

    return {
      ...details,
      actionNeeded: !datesMatch ? getAction(status) : null,
    };
  } catch (err) {
    throw err;
  }
};

const mergeObjects = (...args) => {
  return args.reduce((p, c, i, a) => ({ ...p, ...c }));
};

// Promise chain resolves events in order. This slows down the process
// but avoids overloading the API with too many requests.
const getDetailsInOrder = (arr, cookie) => {
  const results = [];
  return arr
    .reduce(
      (promiseChain, item) =>
        promiseChain.then(async () => {
          const details = await shouldDoUpdate(
            item.elementId,
            item.status,
            cookie
          );
          const data = addMeta(details);

          if (!data.actionNeeded) {
            console.log('No action needed.');
            return Promise.resolve();
          }

          console.log('Action needed:', data.actionNeeded);

          if (data.actionNeeded === 'delete') {
            console.log('Add to delete list.');
            results.push(doNotifications(data));
            console.log('No further action needed.');
            return Promise.resolve();
          }

          return getFlexFinancials(item.elementId, cookie)
            .then(financials => mergeObjects(item, financials, data))
            .then(data => doNotifications(data))
            .then(data => results.push(data));
        }),
      Promise.resolve() // Starts the chain with a resolved promise
    )
    .then(() => results);
};

module.exports = {
  getDetailsInOrder,
};
