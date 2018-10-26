module.exports = (router) => {
  router.prefix('/v1')
  router.use('/reports', require('./reports'))
  router.use('/events', require('./events'))
  router.use('/documents', require('./documents'))
  router.get('/', (ctx, next) => {ctx.body = 'Hello API';})
}
