// events controller
const Event = require('../../Event.js')

async function findAll (ctx) {
    // fetch all toInsert
    const toInsert = await Event.find({typeName: 'Quote'})
        .sort('-lastScraped')
        .where('status').nin(['Cancelled', 'Closed']);
    ctx.body = toInsert;
}

module.exports = {
    findAll
}