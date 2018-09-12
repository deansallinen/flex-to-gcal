const {
  mergeDetails, main, upsertEvent, createEvent,
} = require('./main');
const { getFlexCookie, getFlexCal, getFlexDetails } = require('./getFlex');

const fcal = async () => {
  const cal = await getFlexCal(new Date(), new Date());
  const event = cal[0];
  return event;
};

test('Merges event with details', async () => {
  const event = await fcal();
  const details = await getFlexDetails(event.elementId);
  const merged = mergeDetails(event, details);
  expect(merged).toBeDefined();
  expect(merged).toHaveProperty('startDate');
  expect(merged).toHaveProperty('loadInDate');
});

test('Event updates to db', async () => {
  const event = createEvent(await fcal());
  console.log(event);
  const data = upsertEvent(event);
  // expect(event).toHaveProperty('iconId');
  // expect(event).toBeDefined();
});
