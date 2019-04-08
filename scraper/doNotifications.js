const { post, messages, summary, postAttach } = require('../slackbot');

const doNotifications = event => {
  if (event.definitionName === 'Document') {
    postAttach(event)();
  }
  if (event.definitionName === 'Rental PO') {
    postAttach(event)();
  }

  return event;
};

const summarize = args => {
  try {
    return summary({ ...args });
  } catch (err) {
    throw err;
  }
};

module.exports = { doNotifications, summarize };
