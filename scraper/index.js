// scraper index.js

require('dotenv').config()
const moment = require('moment-timezone');
const axios = require('axios');
const { updateDB } = require('./updateDB')
const { getDetailsInOrder } = require('./getDetails')
const { getFlexCal } = require('./getFlex');
const { post, messages } = require('../slackbot')
const { summarize } = require('./doNotifications')

const num = 1

const now = moment.tz('America/Vancouver');
// const startDate = subMonths(now, 1);
// const endDate = addMonths(now, 1);
const startDate = now;
// const endDate = now;
// const startDate = moment.tz('America/Vancouver').subtract(1, 'week');
// const startDate = moment.tz('America/Vancouver').add(num, 'days');
const endDate = moment.tz('America/Vancouver').add(num, 'week');

// ENABLE BEFORE PUSHING TO NOW
const keepalive = () => axios.get(`https://flex-to-gcal.now.sh`);
setInterval(keepalive, 300000); // keepalive for scraper 300000 = 5 min

const scrape = async () => {
  const scrapeStart = new Date();
  console.log("Starting scrape... ", scrapeStart)
  const fcal = await getFlexCal(startDate, endDate);

  console.log("Received: ", fcal.length)
  const cals = await getDetailsInOrder(fcal);

  const sortedArrays = updateDB(cals);

  const scrapeFinished = new Date();
  const runTime = scrapeFinished - scrapeStart

  console.log('\n', runTime, "milliseconds to complete");
  console.log("Skipped:", fcal.length - cals.length)
  console.log("Inserted: ", sortedArrays.inserted.length)
  console.log("Updated: ", sortedArrays.updated.length)
  console.log("Deleted: ", sortedArrays.deleted.length)

  summarize({ sortedArrays, runTime })

};

// used for testing
// DISABLE BEFORE PUSHING TO NOW
scrape();

module.exports = {
  scrape,
};
