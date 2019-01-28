const { web } = require('./web');

const moment = require('moment')

const conversationId = 'GDDL2A4Q2';

const post = getText => async (eventData) => {
  web.chat
    .postMessage({
      channel: conversationId,
      text: await getText(eventData),

    })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch(console.error);
};

const postAttach = (eventData) => (channel = 'GDDL2A4Q2') => {
  // console.log("event data:", eventData)
  const attachments = [newAttachment(eventData)]
  // console.log("attachments:", attachments)
  web.chat
    .postMessage({
      channel,
      attachments
    })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch(console.error);
};

const newField = (title, value, short = true) => {
  return { title, value, short }
}

const newAttachment = (event) => {

  const { displayText, status, actionNeeded, personResponsibleName, elementId, loadInDate, loadOutDate, typeName } = event;

  const colors = {
    insert: "good",
    update: "warning",
    delete: "danger"
  }

  const prefix = {
    insert: "New",
    update: "Updated",
    delete: "Removed"
  }

  const fields = [
    newField("Manager", personResponsibleName),
    newField("Status", status),
    newField("Load In", moment(loadInDate).format("YYYY-MM-DD HH:mm")),
    newField("Load Out", moment(loadOutDate).format("YYYY-MM-DD HH:mm")),
  ]

  return {
    "fallback": displayText,
    "color": colors[actionNeeded],
    "pretext": "Hey <@U5DSN0KC3>!",
    "author_name": prefix[actionNeeded].concat(" ", typeName),
    "title": displayText,
    "title_link": `https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}`,
    fields: typeName === "Quote" ? fields : [],
    "ts": moment().format("X")
  }
}

const summary = async (args) => {

  const { sortedArrays, runTime } = args;
  const { inserted, updated, deleted } = sortedArrays;
  const summary =
  {
    "fallback": "Required plain-text summary of the attachment.",
    "pretext": "Summary:",
    "text": inserted.length && `:sparkle:   ${inserted.length} insertions\n` +
            updated.length && `:warning:   ${updated.length} updates\n` +
            deleted.length && `:no_entry_sign:   ${deleted.length} marked for deletion\n` +
            `:stopwatch:   ${runTime / 1000}s to complete`,
    "ts": moment().format("X")
  }
  // const attachmentsInsert = inserted.map(async each => newAttachment(await each))
  // const attachmentsUpdate = updated.map(async each => newAttachment(await each))
  // const attachmentsDelete = deleted.map(async each => newAttachment(await each))
  // const attachmentsPromise = Promise.all([
  //   summary,
  //   ...attachmentsInsert,
  //   ...attachmentsUpdate,
  //   ...attachmentsDelete,
  // ])

  // attachmentsPromise.then((attachments) => {
  // console.log(attachments)
  web.chat
    .postMessage({
      channel: conversationId,
      attachments: [summary]
    })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch(console.error);
  // })

};

module.exports = {
  post,
  postAttach,
  summary
};
