// const db = require('diskdb');
// db.connect('./', ['data']);
const db = require('mongoose');
const { DBUSER, DBPASS } = require('./secrets');

db.connect(`mongodb://${DBUSER}:${DBPASS}@ds028559.mlab.com:28559/flex-to-gcal`, { useNewUrlParser: true });

module.exports = db;
