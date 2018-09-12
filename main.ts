const { getFlexCal, getFlexDetails } = require('./getFlex');
const Event = require('./Event');
const db = require('./db.js');

const startDate = new Date();
const endDate = new Date();

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

// const testId = 'f3c10bf0-0dca-11e8-9702-0030489e8f64';

const createSchedule = flexCal => flexCal.map(each => new Event(each));

const saveSchedule = scheduleInput => scheduleInput.map(event => (
  event.update({ elementId: event.elementId }, event, { upsert: true })
));

const getEventDetails = async (events) => {
  const data = await events.map(async (event) => {
    try {
      const details = await getFlexDetails(event.elementId);
      const detailedEvent = await { ...event, ...details };
      return detailedEvent;
    } catch (err) {
      throw err;
    }
  });
  return data;
};

// const getOneEvent = id => db.data.findOne({ elementId: id });
// const eventExists = id => !!(getOneEvent(id));


const main = async () => {
  try {
    const fcal = await getFlexCal(startDate, endDate);
    const detailedFcal = await getEventDetails(fcal);
    const schedule = Promise.all(detailedFcal).then(events => createSchedule(events));
    return await saveSchedule(schedule);
  } catch (err) {
    throw err;
  } finally {
    console.log('Schedule finished');
  }
};
main().then(Event.findOne({ manager: 'Phoebe Gerges' }));

module.exports = {
  createSchedule,
  getEventDetails,
  main,
};
