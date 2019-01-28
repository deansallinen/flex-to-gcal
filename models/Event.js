const { addHours, parse, format } = require('date-fns');
const mongoose = require('mongoose');
// const { DBUSER, DBPASS } = require('../secrets');

mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@ds028559.mlab.com:28559/flex-to-gcal`, { useNewUrlParser: true });

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  elementId: String,
  startDate: Date,
  endDate: Date,
  status: String,
  personResponsibleName: { type: String, alias: 'manager' },
  displayText: String,
  typeId: String,
  typeName: String,
  locationName: String,
  loadInDate: Date,
  loadOutDate: Date,
  lastScraped: Date,
  dateModified: Date,
  plannedRevenue: Number,
  actionNeeded: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

eventSchema.virtual('title').get(function () {
  return this.displayText.slice(10);
});

eventSchema.virtual('number').get(function () {
  return this.displayText.slice(0, 7);
});

eventSchema.virtual('isClientPickup').get(function () {
  return this.venueId === '6a668b70-55e0-11e7-b718-003048de147e'; // Client Pickup ID
});

eventSchema.virtual('description').get(function () {
  return `Status: ${this.status}
Quote Number: ${this.number}
Account Manager: ${this.manager}
Last Checked: ${this.lastScraped}`;
});

eventSchema.virtual('load').get(function () {
  const id = 'l'.concat(this.elementId.replace(/-/g, ''));
  const date = format(this.loadInDate, 'YYYY-MM-DD');
  const isClientPickup = this.venueId === '6a668b70-55e0-11e7-b718-003048de147e'
  return {
    id,
    colorId: 4,
    summary: isClientPickup ? 'Ship - '.concat(this.title) : 'Load - '.concat(this.title),
    description: this.description.concat(`\nID:${id}`),
    start: isClientPickup ? { date } : { dateTime: this.loadInDate, timeZone: 'America/Vancouver' },
    end: isClientPickup ? { date } : { dateTime: addHours(this.loadInDate, 1), timeZone: 'America/Vancouver' },
  };
});

eventSchema.virtual('strike').get(function () {
  const id = 's'.concat(this.elementId.replace(/-/g, ''));
  const date = format(this.loadOutDate, 'YYYY-MM-DD');
  const isClientPickup = this.venueId === '6a668b70-55e0-11e7-b718-003048de147e'
  return {
    id,
    colorId: 1,
    summary: isClientPickup ? 'Receive - '.concat(this.title) : 'Strike - '.concat(this.title),
    description: this.description.concat(`\nID:${id}`),
    start: isClientPickup ? { date } : { dateTime: this.loadOutDate, timeZone: 'America/Vancouver' },
    end: isClientPickup ? { date } : { dateTime: addHours(this.loadOutDate, 1), timeZone: 'America/Vancouver' },
  };
});

const Event = mongoose.model('Event', eventSchema);

module.exports = mongoose.model('Event');
