const mongoose = require('mongoose');
const { DBUSER, DBPASS } = require('./secrets');

mongoose.connect(`mongodb://${DBUSER}:${DBPASS}@ds028559.mlab.com:28559/flex-to-gcal`, { useNewUrlParser: true });

module.exports = mongoose;
