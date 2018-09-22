const { getFlexCookie, getFlexCal, getFlexDetails } = require('./getFlex');
const { USERNAME, PASSWORD } = require('../secrets');

test('login successful', async () => {
  const cookie = await getFlexCookie(USERNAME, PASSWORD);
  expect(cookie).toBeDefined();
  expect(cookie).toMatch(/JSESSIONID/);
});

test('retrieves calendar', async () => {
  const data = await getFlexCal(new Date(), new Date());
  expect(data).toBeDefined();
  expect(data).not.toHaveLength(0);
  expect(data[0]).toHaveProperty('elementId');
  expect(data[0]).toHaveProperty('startDate');
  expect(data[0]).toHaveProperty('endDate');
  expect(data[0]).toHaveProperty('status');
  expect(data[0]).toHaveProperty('displayText');
  expect(data[0]).toHaveProperty('typeId');
  expect(data[0]).toHaveProperty('locationName');
  expect(data[0]).not.toHaveProperty('manager');
});

test('gets details for event', async () => {
  const testId = '036c3130-8f83-11e8-9e13-0030489e8f64';
  const data = await getFlexDetails(testId);
  expect(data).toBeDefined();
  expect(data).toHaveProperty('loadInDate');
  expect(data).toHaveProperty('loadOutDate');
});
