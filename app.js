const fastify = require('fastify')({
  logger: true
})
const cors = require('@fastify/cors')
fastify.register(require('./src/db/connector'))

fastify.register(require('@fastify/cookie'))
fastify.register(require('./src/decorators/authenticate'))
fastify.register(cors, {
  origin: ['http://127.0.0.1:5173', 'http://192.168.50.250:5173'],
  credentials: true
})
fastify.register(require('fastify-bcrypt'), {
  saltWorkFactor: 12
})

fastify.register(require('./src/routes/auth'))
fastify.register(require('./src/routes/ingredients'))
fastify.register(require('./src/routes/recipes'))

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
