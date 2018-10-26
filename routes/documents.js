const Router = require('koa-router')
const router = new Router()
const Ctrl = require('../controllers/documents')

router.get('/', Ctrl.findAll)

module.exports = router.routes()
