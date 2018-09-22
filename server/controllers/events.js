// events controller
const Event = require('../../models/Event')

// Google Calendar Requests

async function findAllToInsert (ctx) {
    // fetch all to Insert
    const events = await Event.find({typeName: 'Quote'})
        .sort('-lastScraped')
        .where('status').nin(['Cancelled', 'Closed']);
    ctx.body = events;
}

async function findAllToUpdate (ctx) {
    // fetch all to Update
    const events = await Event.find({typeName: 'Quote'})
        .sort('-lastScraped')
        .where('status').nin(['Cancelled', 'Closed']);
    ctx.body = events;
}

async function findAllToDelete (ctx) {
    // fetch all to Delete
    const events = await Event.find({typeName: 'Quote'})
        .sort('-lastScraped')
        .where('status').nin(['Cancelled', 'Closed']);
    ctx.body = events;
}

// CRUD Functions

async function findOne (ctx) {
    // fetch one by id
    const elementId = ctx.params.id;
    const event = await Event.findOne({elementId})
    ctx.body = event;
}

async function create (ctx) {
    // create new event
    const newEvent = new Event(ctx.request.body);
    const savedEvent = await newEvent.save();
    ctx.body = savedEvent;
}

async function update (ctx) {
    // updates existing event
    const elementId = ctx.params.id;
    const event = await Event.findOne({elementId});
    // can do things with event object here
    const updatedEvent = await event.save();
    ctx.body = updatedEvent;
}



module.exports = {
    findAllToInsert,
    findAllToUpdate,
    findAllToDelete,
    findOne,
    create,
    update,
}