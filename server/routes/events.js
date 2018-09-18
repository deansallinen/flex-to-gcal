// routes.js

const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controllers/events.js')

router.get('/toinsert', Ctrl.findAll)
// router.post('/insert', Ctrl.findAll)

// router.get('/update', Ctrl.findAll)
// router.post('/update', Ctrl.findAll)

// router.get('/delete', Ctrl.findAll)
// router.post('/delete', Ctrl.findAll)

module.exports = router.routes()