// Event.test.js
const Event = require('./Event');

const query = Event.findOne({ }).exec();

test('Event Description', async () => {
  const res = await query;
  expect(res.description).toBeDefined();
});

test('Event Load Object', async () => {
  const res = await query;
  expect(res.load).toBeDefined();
  expect(res.load).toHaveProperty('id');
  expect(res.load).toHaveProperty('colorId');
  expect(res.load).toHaveProperty('summary');
  expect(res.load).toHaveProperty('description');
  expect(res.load).toHaveProperty('start');
  expect(res.load).toHaveProperty('end');
  if (res.venueId === '6a668b70-55e0-11e7-b718-003048de147e') {
    expect(res.load.start).toHaveProperty('date');
    expect(res.load.start.date).not.toBeNull();
    expect(res.load.end).toHaveProperty('date');
    expect(res.load.end.date).not.toBeNull();
  } else {
    expect(res.load.start).toHaveProperty('dateTime');
    expect(res.load.start.dateTime).not.toBeNull();
    expect(res.load.end).toHaveProperty('dateTime');
    expect(res.load.start.dateTime).not.toBeNull();
  }
});

test('Event strike Object', async () => {
  const res = await query;
  expect(res.strike).toBeDefined();
  expect(res.strike).toHaveProperty('id');
  expect(res.strike).toHaveProperty('colorId');
  expect(res.strike).toHaveProperty('summary');
  expect(res.strike).toHaveProperty('description');
  expect(res.strike).toHaveProperty('start');
  expect(res.strike).toHaveProperty('end');
  if (res.venueId === '6a668b70-55e0-11e7-b718-003048de147e') {
    expect(res.strike.start).toHaveProperty('date');
    expect(res.strike.start.date).not.toBeNull();
    expect(res.strike.end).toHaveProperty('date');
    expect(res.strike.end.date).not.toBeNull();
  } else {
    expect(res.strike.start).toHaveProperty('dateTime');
    expect(res.strike.start.dateTime).not.toBeNull();
    expect(res.strike.end).toHaveProperty('dateTime');
    expect(res.strike.start.dateTime).not.toBeNull();
  }
});
