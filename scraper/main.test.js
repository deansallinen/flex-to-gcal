const main = require('./main');
const { getFlexCookie, getFlexCal, getFlexDetails } = require('./getFlex');

const fcal = async () => {
  const cal = await getFlexCal(new Date(), new Date());
  const event = cal[0];
  return event;
};

test('Finds one even in db', async () => {
  const id = '67926830-6e74-11e8-9689-0030489e8f64';
  const res = await main.getOneEvent(id);
  expect(res).toBeDefined();
  expect(res).toHaveProperty('startDate');
  expect(res).toHaveProperty('loadInDate');
});

test('Returns detailed event', async () => {
  const event = await fcal();
  const res = await main.getDetails(event);
  // console.log(res);
  expect(res).toHaveProperty('loadInDate');
  expect(res).toHaveProperty('plannedRevenue');
});

// test('Returns correct action', async () => {
//   const event = await fcal();
//   expect(event).toHaveProperty('elementId');
//   expect(event).toHaveProperty('dateModified');
//   // const res = await main.getAction(event);
// });
