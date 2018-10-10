// events controller
const Event = require('../models/Event')

// Google Calendar Requests

async function findAllToInsert (ctx) {
    // fetch all to Insert
    const events = await Event.find({typeName: 'Quote', actionNeeded: 'insert'})
        .sort('-lastScraped')
        .where('status').nin(['Cancelled', 'Closed']);
    ctx.body = events;
}

async function findAllToUpdate (ctx) {
    // fetch all to Update
    const events = await Event.find({typeName: 'Quote', actionNeeded: 'update'})
        .sort('-lastScraped')
        .where('status').nin(['Cancelled', 'Closed']);
    ctx.body = events;
}

async function findAllToDelete (ctx) {
    // fetch all to Delete
    const events = await Event.find({typeName: 'Quote', actionNeeded: 'delete'})
        .sort('-lastScraped')
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
    // console.log(ctx.request.body)
    const elementId = ctx.params.id;
    const update = ctx.request.body;
    const event = await Event.findOneAndUpdate({elementId}, update);
    ctx.body = event;
    // console.log(ctx)
}



module.exports = {
    findAllToInsert,
    findAllToUpdate,
    findAllToDelete,
    findOne,
    create,
    update,
}