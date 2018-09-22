module.exports = (router) => {
  router.prefix('/v1')
  router.use('/reports', require('./reports'))
  router.use('/events', require('./events'))
}
