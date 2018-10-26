// documents controller
const Event = require('../models/Event')

async function findAll (ctx) {
  const documents = await Event.find({typeName: 'Document'})
ctx.body = documents;
}

module.exports = {
  findAll
}
