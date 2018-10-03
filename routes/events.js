// events.js

const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controllers/events.js')

router.get('/toinsert', Ctrl.findAllToInsert)
// router.get('/toupdate', Ctrl.findAll)
// router.get('/todelete', Ctrl.findAll)

router.get('/:id', Ctrl.findOne)
router.post('/', Ctrl.create)
router.post('/:id', Ctrl.update)
// router.delete('/:id', Ctrl.destroy)


module.exports = router.routes()