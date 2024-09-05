const { CLIENT_ENDPOINT, CLIENT_PROTOCOL, CLIENT_PORT } = process.env

const fastify = require('fastify')({
  logger: true
})
const cors = require('@fastify/cors')
fastify.register(require('./src/db/connector'))

fastify.register(require('@fastify/cookie'))
fastify.register(require('./src/decorators/authenticate'))
fastify.register(cors, {
  origin: [`${CLIENT_PROTOCOL}://${CLIENT_ENDPOINT}:${CLIENT_PORT}`],
  credentials: true
})
fastify.register(require('fastify-bcrypt'), {
  saltWorkFactor: 12
})

fastify.register(require('./src/routes/auth'))
fastify.register(require('./src/routes/ingredients'))
fastify.register(require('./src/routes/recipes'))
fastify.register(require('./src/routes/test'))

fastify.listen({ port: process.env.SERVER_PORT, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
