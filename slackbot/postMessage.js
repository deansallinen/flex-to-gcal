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
    // "author_link": "http://flickr.com/bobby/",
    // "author_icon": "http://flickr.com/icons/bobby.jpg",
    "title": displayText,
    "title_link": `https://loungeworks.flexrentalsolutions.com/ui/goto/${elementId}`,
    // "text": personResponsibleName,
    fields: typeName === "Quote" ? fields : [],
    // "image_url": "http://my-website.com/path/to/image.jpg",
    // "thumb_url": "http://example.com/path/to/thumb.png",
    // "footer": "Slack API",
    // "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
    "ts": moment().format("X")
  }
}

const summary = async (args) => {

  const { sortedArrays, runTime } = args;
  const { inserted, updated, deleted } = sortedArrays;
  const summary =
  {
    "fallback": "Required plain-text summary of the attachment.",
    // "color": "#2eb886",
    "pretext": "Summary:",
    // "author_name": "Bobby Tables",
    // "author_link": "http://flickr.com/bobby/",
    // "author_icon": "http://flickr.com/icons/bobby.jpg",
    // "title": "Slack API Documentation",
    // "title_link": "https://api.slack.com/",
    "text": `:sparkle:   ${inserted.length} insertions
:warning:   ${updated.length} updates
:no_entry_sign:   ${deleted.length} marked for deletion
:stopwatch:   ${runTime / 1000}s to complete`,
    // "fields": [
    //   {
    //     "title": ":sparkle: Inserted",
    //     "value": inserted.length,
    //     "short": true
    //   },
    //   {
    //     "title": ":warning: Updated",
    //     "value": updated.length,
    //     "short": true
    //   },
    //   {
    //     "title": ":no_entry_sign: Deleted",
    //     "value": deleted.length,
    //     "short": true
    //   },
    //   {
    //     "title": ":stopwatch: Run Time",
    //     "value": runTime / 1000,
    //     "short": true
    //   },
    // ],
    // "image_url": "http://my-website.com/path/to/image.jpg",
    // "thumb_url": "http://example.com/path/to/thumb.png",
    // "footer": "Slack API",
    // "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
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
