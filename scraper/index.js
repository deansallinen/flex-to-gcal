// scraper index.js

require('dotenv').config()
const moment = require('moment-timezone');
const axios = require('axios');
const { updateDB } = require('./updateDB')
const { getDetailsInOrder } = require('./getDetails')
const { getFlexCal } = require('./getFlex');
const { post, messages } = require('../slackbot')
const { summarize } = require('./doNotifications')

// console.log(process.env)


// ENABLE BEFORE PUSHING TO NOW
const keepalive = () => axios.get(`https://flex-to-gcal.now.sh/v1`);
setInterval(keepalive, 300000); // keepalive for scraper 300000 = 5 min

const scrape = async () => {
  const scrapeStart = new Date();
  console.log("\nStarting scrape... ", scrapeStart)
  const [fcal, COOKIE] = await getFlexCal(
    moment.tz('America/Vancouver'),                 // Start date
    moment.tz('America/Vancouver').add(1, 'week')   // End Date
    );

  console.log("Received: ", fcal.length)
  const cals = await getDetailsInOrder(fcal, COOKIE);

  const sortedArrays = updateDB(cals);

  const scrapeFinished = new Date();
  const runTime = scrapeFinished - scrapeStart

  console.log('\n', runTime, "milliseconds to complete");
  console.log("Skipped:", fcal.length - cals.length)
  console.log("Inserted: ", sortedArrays.inserted.length)
  console.log("Updated: ", sortedArrays.updated.length)
  console.log("Deleted: ", sortedArrays.deleted.length)

  // summarize({ sortedArrays, runTime })

};

scrape()

module.exports = {
  scrape,
};
