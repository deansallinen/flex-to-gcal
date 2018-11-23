// Messages to post
const { getUserId } = require('./getUsers');

const unconfirmedEventText = async (args) => {
  const {
    personResponsibleName, displayText, status, elementId,
  } = args;
  const userId = await getUserId(personResponsibleName);
  return `Hey ${userId}, the event <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> is still at status ${status} with less than 72 hours before the event!`;
};

const documentUpdatedText = async (args) => {
  const { personResponsibleName, displayText, elementId } = args;
  // const userId = await getUserId(personResponsibleName);
  return `Hey <@U5DSN0KC3>, ${personResponsibleName} uploaded a document for: <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>`;
};

const confirmedNoPullSheetText = async (args) => {
  const {
    personResponsibleName, displayText, status, elementId,
  } = args;
  const userId = await getUserId(personResponsibleName);
  return `Hey ${userId}, the event <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> is ${status} without a Pull Sheet less than 72 hours before the event!`;
};

const orderReturnedText = async (args) => {
  const { personResponsibleName, displayText, elementId } = args;
  const userId = await getUserId(personResponsibleName);
  return `Hey ${userId}, the inventory for <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> has been received by yvr-warehouse!`;
};

const manifestCreatedText = async (args) => {
  const { personResponsibleName, displayText, elementId } = args;
  const userId = await getUserId(personResponsibleName);
  return `Hey ${userId}, <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}> has been pulled by yvr-warehouse!`;
};

const pullSheetCreatedText = async (args) => {
  const { displayText, elementId } = args;
  return `Hey yvr-warehouse, the Pull Sheet is ready for <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>!`;
};

// const databaseUpdated = async (args) => {
//   const { sortedArrays, runTime } = args;
//   const { inserted, updated, deleted } = sortedArrays;
//   return `Summary:
//   :sparkle:   ${inserted.length} insertions
//   :warning:   ${updated.length} updates
//   :no_entry_sign:   ${deleted.length} marked for deletion
//   :stopwatch:   ${runTime / 1000}s to complete
//   `;
// };

// const newEvent = async (args) => {
//   const { displayText, elementId } = args;
//   return `Hey yvr-warehouse, new quote created: <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>!`;
// };

// const eventDeleted = async (args) => {
//   const { displayText, elementId } = args;
//   return `Event deleted: <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>!`;
// };

// const summarizeInserted = async (inserted) => {
//   return Promise.all(inserted)
//     .then((inserted) => {
//       return `Events inserted: ${
//         inserted.map((event, i) => {
//           const { elementId, displayText } = event
//           return `\n\t${i + 1}: <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>`
//         })
//         }`
//     })
// };

// const summarizeUpdated = async (updated) => {
//   return Promise.all(updated)
//     .then((updated) => {
//       return `Events updated: ${
//         updated.map((event, i) => {
//           const { elementId, displayText } = event
//           return `\n\t${i + 1}: <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>`
//         })
//         }`
//     })
// };

// const summarizeDeleted = async (deleted) => {
//   return Promise.all(deleted)
//     .then((deleted) => {
//       return `Events deleted: ${
//         deleted.map((event, i) => {
//           const { elementId, displayText } = event
//           return `\n\t${i + 1}: <https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}|${displayText}>`
//         })
//         }`
//     })
// };


module.exports = {
  unconfirmedEventText,
  documentUpdatedText,
  confirmedNoPullSheetText,
  orderReturnedText,
  manifestCreatedText,
  pullSheetCreatedText,
  // databaseUpdated,
  // newEvent,
  // eventDeleted,
  // summarizeInserted,
  // summarizeDeleted,
  // summarizeUpdated
};
