const diskdb = require('diskdb');
const { getFlexCal, getFlexDetails } = require('./getFlex');
const Event = require('./Event');

const db = diskdb.connect('./', ['data']);

const testId = 'f3c10bf0-0dca-11e8-9702-0030489e8f64';


const getSchedule = async (start, end) => {
  const flexCal = await getFlexCal(start, end);
  const schedule = await flexCal.map(each => new Event(each));
  return schedule;
  //   return detailedSchedule;
};

const saveSchedule = async (scheduleInput) => {
  const schedule = await scheduleInput;
  return schedule.map(event => db.data.update({ elementId: event.elementId }, event, { upsert: true }));
};

const getEventDetails = async (schedule) => {
  schedule.map(event => console.log(event.elementId));
//   const detailedEvent = Object.assign(getEventDetails(event.elementId), event);
//   return detailedEvent;
};

const getOneEvent = id => db.data.findOne({ elementId: id });
const eventExists = id => !!(getOneEvent(id));

const main = async () => {
  const schedule = await getSchedule(new Date(), new Date());
  const detailedSchedule = await getEventDetails(schedule);
  const saved = await saveSchedule(schedule);
  const details = await addEventDetails();
};
main();
