// getDetails.js

// require('dotenv').configure()
const { getFlexDetails, getFlexFinancials } = require('./getFlex');
const { addMeta, getMoment } = require('./addMeta')
const { doNotifications } = require('./doNotifications')
const moment = require('moment-timezone')
const axios = require('axios')
// const { post, messages } = require('../slackbot')

const API = process.env.API;

const getOneEvent = async elementId => {
    // console.log("Getting one event...")
    try {
        const res = await axios.get(`${API}/events/${elementId}`);
        // console.log(!!res);
        return res.data;
    } catch (err) {
        throw err;
    }
};

const getAction = status => {
    // updated event
    console.log("Getting Action for status:", status)
    if (['Cancelled', 'Closed'].includes(status)) {
        return 'delete';
    }
    return 'update';
}

const shouldDoUpdate = async (eventID, status) => {
    console.log("\nChecking if update needed: ", eventID)

    try {
        const [details, res] = await Promise.all([
            getFlexDetails(eventID),
            getOneEvent(eventID)
        ]);

        console.log("Found Flex: ", !!details, "\nFound DB: ", !!res)

        if (!res) {
            // new event

            console.log("No result in DB!")
            return { ...details, actionNeeded: "insert" }
        }

        const detailsDate = getMoment(details.dateModified)
        const resDate = moment(res.dateModified).format()
        const datesMatch = detailsDate == resDate

        console.log(detailsDate)
        console.log(resDate)
        console.log("Dates match:", datesMatch)
        // post(messages.pullSheetCreatedText)(details)

        return {
            ...details,
            actionNeeded: !datesMatch ? getAction(status) : null
        }

    } catch (err) {
        throw err;
    }
}

const mergeObjects = (...args) => {
    return args.reduce((p, c, i, a) => ({ ...p, ...c }))
}

// Promise chain resolves events in order. This slows down the process
// but avoids overloading the API with too many requests.
const getDetailsInOrder = arr => {
    const results = [];
    return arr
        .reduce(
            (promiseChain, item) =>
                promiseChain.then(async () => {

                    const details = await shouldDoUpdate(item.elementId, item.status)
                    const data = addMeta(details)

                    if (!data.actionNeeded) {
                        console.log("No action needed.")
                        return Promise.resolve();
                    }

                    console.log("Action needed:", data.actionNeeded)

                    if (data.actionNeeded === 'delete') {
                        console.log("Add to delete list.")
                        results.push(doNotifications(data))
                        console.log("No further action needed.")
                        return Promise.resolve();
                    }

                    return getFlexFinancials(item.elementId)
                        .then(financials => mergeObjects(item, financials, data))
                        .then(data => doNotifications(data))
                        .then(data => results.push(data))

                }),
            Promise.resolve() // Starts the chain with a resolved promise
        )
        .then(() => results);
};

module.exports = {
    getDetailsInOrder
}