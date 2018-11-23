// updateDB.js

// const { post, messages } = require('../slackbot')
const axios = require('axios')

const API = process.env.API;

const sendToDB = async (args) => {
    const { method, url, data } = args;
    try {
        return axios({
            baseURL: API,
            method,
            url,
            data,
        })
    } catch (error) {
        throw error
    }
}

const updateDB = calendarArray => {
    // could send an array to the db in the future for a single request?
    const updated = calendarArray
        .filter(event => event.actionNeeded === 'update')
        // .filter(event => ['update', 'delete'].includes(event.actionNeeded))
        .map(async data => {
            const res = await sendToDB({ url: `/events/${data.objectIdentifier}`, method: "POST", data })
            return res.data
        })

    const inserted = calendarArray
        .filter(event => event.actionNeeded === 'insert')
        .map(async data => {
            const res = await sendToDB({ url: `/events/`, method: "POST", data })
            return res.data
        })

    const deleted = calendarArray
        .filter(event => event.actionNeeded === 'delete')
        .map(async data => {
            const res = await sendToDB({ url: `/events/${data.objectIdentifier}`, method: "POST", data })
            return res.data
        })

    // const nothing = calendarArray.filter(event => event.actionNeeded === null);

    // const counts = {
    //     inserted: inserted.length,
    //     updated: updated.length,
    //     deleted: deleted.length,
    //     // nothing: calendarArray.length - inserted.length - updated.length
    // }


    return {
        inserted,
        updated,
        deleted
    };
};

module.exports = { updateDB }