require('dotenv').config({ debug: process.env.DEBUG })
const Koa = require('koa')
const Router = require('koa-router')
const Logger = require('koa-logger')
const Cors = require('@koa/cors')
const BodyParser = require('koa-bodyparser')
const Helmet = require('koa-helmet')
const respond = require('koa-respond')
const mongoose = require('mongoose');
const scraper = require('./scraper')

mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@ds028559.mlab.com:28559/flex-to-gcal`, { useNewUrlParser: true });


const app = new Koa()
const router = new Router()

app.use(Helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(Logger())
}

app.use(Cors())
app.use(BodyParser({
  enableTypes: ['json'],
  jsonLimit: '5mb',
  strict: true,
  onerror: function (err, ctx) {
    ctx.throw('body parse error', 422)
  }
}))

app.use(respond())

// setInterval(scraper.scrape, 86400000) // Once a day
setInterval(scraper.scrape, 60 * 60 * 1000) // Once an hour
// setInterval(scraper.scrape, 5 * 60 * 1000) // Every five minutes

// API routes
// router.get('/', (ctx, next) => {ctx.body = 'Hello Dean';})
require('./routes')(router)
app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
