const axios = require('axios');
const moment = require('moment');
const main = require('.');
const { getFlexCookie, getFlexCal, getFlexDetails } = require('./getFlex');

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

test.only('Returns detailed event', async () => {
  const event = { elementId: '67926830-6e74-11e8-9689-0030489e8f64' };
  const details = { dateModified: '1995-12-17T03:24:00Z' }
  const database = { dateModified: '1995-12-17T03:24:00Z' }
  const resp = [details, database]
  console.log(resp)
  // axios.get.mockResolvedValue(resp);
  // axios.get.mockResolvedValue(resp);
  const res = await main.shouldDoUpdate(event);
  console.log(res);
  expect(res).toHaveProperty('loadInDate');
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
  const now = moment();
  const resp = { data: { elementId: '1', dateModified: moment('1995-12-17T03:24:00'), status: 'Ready' } };
  axios.get.mockResolvedValue(resp);
  const event = { elementId: '1', dateModified: now, status: 'Confirmed' };
  const res = await main.getAction(event);
  // console.log(res);
  expect(res).toBe('update');
});

test('Returns correct action: delete', async () => {
  const now = new Date();
  const resp = { data: { elementId: '1', dateModified: new Date('1995-12-17T03:24:00'), status: 'Ready' } };
  axios.get.mockResolvedValue(resp);
  const event = { elementId: '1', dateModified: now, status: 'Closed' };
  const res = await main.getAction(event);
  // console.log(res);
  expect(res).toBe('delete');
});

test('Returns correct action: No update needed', async () => {
  const resp = { data: { elementId: '1', dateModified: moment('2018-09-28T16:00:19.000Z'), status: 'Ready' } };
  axios.get.mockResolvedValue(resp);
  const event = { elementId: '1', dateModified: moment('2018-09-28T16:00:19.000Z'), status: 'Ready' };
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

test('Add metadata on event object', async () => {
  const now = new Date();
  const resp = new Promise(((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: { elementId: '1', dateModified: now, status: 'Confirmed' } });
    }, 300);
  }));
  const detailedEvent = new Promise(((resolve, reject) => {
    setTimeout(() => {
      resolve({ elementId: '1', dateModified: now, status: 'Ready' });
    }, 300);
  }));
  axios.get.mockResolvedValue(resp);
  const res = await main.addMeta(detailedEvent);
  // console.log(res);
  expect(res).toHaveProperty('elementId');
  expect(res.actionNeeded).toBeDefined();
  expect(res.actionNeeded).toBe('update');
});


test('Returns properly formatted UTC date string', async () => {
  const input = "28/09/2018 13:37"
  const date = moment(input, 'DD-MM-YYYY HH:mm')
  const res1 = main.getMoment(input)
  const res2 = main.setTz(res1)
  console.log(date.utc().format())
  console.log(res1.utc().format())
  console.log(res2)
  expect(date.utc().format()).not.toEqual(res1.utc().format())
  expect(date.utc().format()).not.toEqual(res2.utc().format())
})