require('dotenv').config({ debug: process.env.DEBUG })
const Koa = require('koa')
const Router = require('koa-router')
const Logger = require('koa-logger')
const Cors = require('@koa/cors')
const BodyParser = require('koa-bodyparser')
const Helmet = require('koa-helmet')
const respond = require('koa-respond')
const mongoose = require('mongoose');
// const { DBUSER, DBPASS } = require('./secrets.js');
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

setInterval(scraper.scrape, 300000)

// API routes
require('./routes')(router)
app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
