// addMeta.js

const moment = require('moment-timezone')

const getMoment = dateTime => {
    try {
        return dateTime ?
            moment.tz(dateTime, 'DD-MM-YYYY HH:mm', 'America/Vancouver').format() :
            null;
    } catch (err) {
        console.log("Offending date:", dateTime)
        throw err;
    }
}

const setTz = dateTime => {
    try {
        return dateTime ? moment.tz(dateTime, 'America/Vancouver').format() : null;
    } catch (err) {
        console.log("Offending date:", dateTime)
        throw err;
    }
}

const addMeta = detailedEvent => {
    console.log("Adding meta information...")
    return {
        ...detailedEvent,
        lastScraped: moment.tz('America/Vancouver'),
        dateModified: getMoment(detailedEvent.dateModified),
        loadInDate: getMoment(detailedEvent.loadInDate),
        loadOutDate: getMoment(detailedEvent.loadOutDate),
        plannedStartDate: getMoment(detailedEvent.plannedStartDate),
        plannedEndDate: getMoment(detailedEvent.plannedEndDate),
        // plannedStartDate: setTz(detailedEvent.plannedStartDate),
        // plannedEndDate: setTz(detailedEvent.plannedEndDate),
    };
};

module.exports = { addMeta, getMoment, setTz }