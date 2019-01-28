const { post, messages, summary, postAttach } = require('../slackbot')

const doNotifications = (event) => {

    // if (event.definitionName === "Quote") {
    //     if (event.actionNeeded === 'insert') {
    //         console.log('should post insert message')
    //         postAttach(event)
    //     }
    //     if (event.actionNeeded === 'delete') {
    //         console.log('should post delete message')
    //         postAttach(event)
    //     }
    // }
    // console.log(event.definitionName)
    if (event.definitionName === "Document") {
        postAttach(event)()
    }

    return event
}

const summarize = (args) => {
    try {
        return summary({ ...args })
    } catch (err) {
        throw err
    }
}

module.exports = { doNotifications, summarize }