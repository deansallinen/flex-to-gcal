const { web } = require('./web');

const moment = require('moment');

const conversationId = 'GDDL2A4Q2';

const post = getText => async eventData => {
  web.chat
    .postMessage({
      channel: conversationId,
      text: await getText(eventData),
    })
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(console.error);
};

const postAttach = eventData => (channel = 'GDDL2A4Q2') => {
  // console.log("event data:", eventData)
  const attachments = [newAttachment(eventData)];
  // console.log("attachments:", attachments)
  web.chat
    .postMessage({
      channel,
      attachments,
    })
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(console.error);
};

const newAttachment = event => {
  const {
    displayText,
    status,
    actionNeeded,
    personResponsibleName,
    elementId,
    loadInDate,
    loadOutDate,
    typeName,
    loadInDatesMatch,
    loadOutDatesMatch,
    oldLoadInDate,
    newLoadInDate,
    oldLoadOutDate,
    newLoadOutDate,
  } = event;

  const colors = {
    insert: 'good',
    update: 'warning',
    delete: 'danger',
  };

  const prefix = {
    insert: 'New',
    update: 'Updated',
    delete: 'Removed',
  };

  const newField = (title, value, short = true) => {
    return { title, value, short };
  };

  const baseFields = [
    newField('Manager', personResponsibleName),
    newField('Status', status),
  ];

  const loadInFields = [
    newField('Old Load In', moment(oldLoadInDate).format('MMM-DD HH:mm')),
    newField('New Load In', moment(newLoadInDate).format('MMM-DD HH:mm')),
  ];

  const loadOutFields = [
    newField('Old Load Out', moment(oldLoadOutDate).format('MMM-DD HH:mm')),
    newField('New Load Out', moment(newLoadOutDate).format('MMM-DD HH:mm')),
  ];

  const fields = [
    ...baseFields,
    ...(loadInDatesMatch ? [] : loadInFields),
    ...(loadOutDatesMatch ? [] : loadOutFields),
  ];

  return {
    fallback: displayText,
    color: colors[actionNeeded],
    // pretext: 'Hey <@U5DSN0KC3>!',
    author_name: prefix[actionNeeded]
      ? prefix[actionNeeded].concat(' ', typeName)
      : null,
    title: displayText,
    title_link: `https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}`,
    fields: baseFields,
    ts: moment().format('X'),
  };
};

const summary = async args => {
  const { sortedArrays, runTime } = args;
  const { inserted, updated, deleted } = sortedArrays;
  const summary = {
    fallback: 'Required plain-text summary of the attachment.',
    pretext: `:stopwatch:   ${runTime / 1000}s to complete`,
    text: `${
      !!inserted.length ? `:sparkle:   ${inserted.length} insertions` : ''
    }
${!!updated.length ? `:warning:   ${updated.length} updates` : ''}
${
  !!deleted.length
    ? `:no_entry_sign:   ${deleted.length} marked for deletion`
    : ''
}`,
  };
  web.chat
    .postMessage({
      channel: conversationId,
      attachments: [summary],
    })
    .then(res => {
      // console.log(res);
      return res;
    })
    .catch(console.error);
  // })
};

module.exports = {
  post,
  postAttach,
  summary,
};
