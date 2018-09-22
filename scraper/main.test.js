const main = require('./main');
const { getFlexCookie, getFlexCal, getFlexDetails } = require('./getFlex');

const fcal = async () => {
  const cal = await getFlexCal(new Date(), new Date());
  const event = cal[0];
  return event;
};

test('Merges event with details', async () => {
  const event = await fcal();
  const details = await getFlexDetails(event.elementId);
  const merged = main.mergeDetails(event, details);
  expect(merged).toBeDefined();
  expect(merged).toHaveProperty('startDate');
  expect(merged).toHaveProperty('loadInDate');
});

// test('Deep equals', () => {
//   const a = { one: 'one', obj: { a: 'a' } };
//   const b = { one: 'one', obj: { a: 'a' } };
//   const res = main.areEqual(a, b);
//   expect(res).toBe(true);
// });

test('Finds one event', async () => {
  const id = '0d809ae0-9504-11e8-9e13-0030489e8f64';
  const res = await main.getOneEvent(id);
  expect(res).toBeDefined();
  expect(res).toHaveProperty('startDate');
  expect(res).toHaveProperty('loadInDate');
});

// test('Sort to staging array', () => {

// })
