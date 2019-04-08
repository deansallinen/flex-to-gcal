// Messages to post
const { getUserId } = require('./getUsers');
const moment = require('moment-timezone');

const unconfirmedEventText = async args => {
  const { personResponsibleName, displayText, status, elementId } = args;
  const userId = await getUserId(personResponsibleName);
  return `Hey ${userId}, the event <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> is still at status ${status} with less than 72 hours before the event!`;
};

const loadInChange = async args => {
  const { oldLoadInDate, newLoadInDate, elementId, displayText } = args;
  const formatTime = time => moment(time).format('dddd, MMM Do [at] HH:mm');
  return `Hey <@U5DSN0KC3>, Load In for <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> changed from ${formatTime(
    oldLoadInDate
  )} to ${formatTime(newLoadInDate)}  `;
};

const documentUpdatedText = async args => {
  const { personResponsibleName, displayText, elementId } = args;
  // const userId = await getUserId(personResponsibleName);
  return `Hey <@U5DSN0KC3>, ${personResponsibleName} uploaded a document for: <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>`;
};

const confirmedNoPullSheetText = async args => {
  const { personResponsibleName, displayText, status, elementId } = args;
  const userId = await getUserId(personResponsibleName);
  return `Hey ${userId}, the event <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> is ${status} without a Pull Sheet less than 72 hours before the event!`;
};

const orderReturnedText = async args => {
  const { personResponsibleName, displayText, elementId } = args;
  const userId = await getUserId(personResponsibleName);
  return `Hey ${userId}, the inventory for <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> has been received by yvr-warehouse!`;
};

const manifestCreatedText = async args => {
  const { personResponsibleName, displayText, elementId } = args;
  const userId = await getUserId(personResponsibleName);
  return `Hey ${userId}, <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> has been pulled by yvr-warehouse!`;
};

const pullSheetCreatedText = async args => {
  const { displayText, elementId } = args;
  return `Hey yvr-warehouse, the Pull Sheet is ready for <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>!`;
};

module.exports = {
  unconfirmedEventText,
  documentUpdatedText,
  confirmedNoPullSheetText,
  orderReturnedText,
  manifestCreatedText,
  pullSheetCreatedText,
  loadInChange,
};
