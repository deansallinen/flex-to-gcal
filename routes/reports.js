// reports.js

const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controllers/reports.js')

router.get('/weekly', Ctrl.weeklySum)
router.get('/monthly', Ctrl.monthlySum)

module.exports = router.routes()