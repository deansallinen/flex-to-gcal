const { getFlexCal, getFlexDetails } = require('./getFlex');
const Event = require('./Event');

const startDate = new Date();
const endDate = new Date();

const mergeDetails = (event, details) => ({ ...event, ...details, lastScraped: new Date() });

const upsertEvent = (event) => {
  Event.findOneAndUpdate({ elementId: event.elementId }, event, { upsert: true });
};

const main = () => getFlexCal(startDate, endDate)
  .then(fcal => fcal.map(event => getFlexDetails(event.elementId)
    .then(details => mergeDetails(event, details))
    .then(readyEvent => upsertEvent(readyEvent))
    .catch((err) => { throw err; })))
  .catch((err) => { throw err; });

main();

module.exports = {
  main,
  mergeDetails,
  upsertEvent,
};
