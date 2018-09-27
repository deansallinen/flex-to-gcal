const main = require('./main');
const { getFlexCookie, getFlexCal, getFlexDetails } = require('./getFlex');
const axios = require('axios');

const fcal = async () => {
  const cal = await getFlexCal(new Date(), new Date());
  const event = cal[0];
  return event;
};

jest.mock('axios');

test.skip('Finds one event in db', async () => {
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

test('Returns correct action: insert', async () => {
  const now = new Date();
  const resp = { data: null };
  axios.get.mockResolvedValue(resp);
  const event = { elementId: '1', dateModified: now, status: 'Confirmed' };
  const res = await main.getAction(event);
  // console.log(res);
  expect(res).toBe('insert');
});

test('Returns correct action: update', async () => {
  const now = new Date();
  const resp = { data: { elementId: '1', dateModified: new Date(), status: 'Ready' } };
  axios.get.mockResolvedValue(resp);
  const event = { elementId: '1', dateModified: now, status: 'Confirmed' };
  const res = await main.getAction(event);
  // console.log(res);
  expect(res).toBe('update');
});

test('Returns correct action: delete', async () => {
  const now = new Date();
  const resp = { data: { elementId: '1', dateModified: new Date(), status: 'Ready' } };
  axios.get.mockResolvedValue(resp);
  const event = { elementId: '1', dateModified: now, status: 'Closed' };
  const res = await main.getAction(event);
  // console.log(res);
  expect(res).toBe('delete');
});

test('Returns correct action: No update needed', async () => {
  const now = new Date();
  const resp = { data: { elementId: '1', dateModified: now, status: 'Ready' } };
  axios.get.mockResolvedValue(resp);
  const event = { elementId: '1', dateModified: now, status: 'Ready' };
  const res = await main.getAction(event);
  // console.log(res);
  expect(res).toBe(null);
});

test('Returns correct action: No insert needed', async () => {
  const now = new Date();
  const resp = { data: null };
  axios.get.mockResolvedValue(resp);
  const event = { elementId: '1', dateModified: now, status: 'Closed' };
  const res = await main.getAction(event);
  // console.log(res);
  expect(res).toBe(null);
});
