const { CLIENT_DOMAIN, CLIENT_DOMAIN_PROTOCOL, CLIENT_DOMAIN_PORT } = process.env

const fastify = require('fastify')({
  logger: true
})
const cors = require('@fastify/cors')
fastify.register(require('./src/db/connector'))

fastify.register(require('@fastify/cookie'))
fastify.register(require('./src/decorators/authenticate'))
fastify.register(cors, {
  origin: [`${CLIENT_DOMAIN_PROTOCOL}://${CLIENT_DOMAIN}:${CLIENT_DOMAIN_PORT}`],
  credentials: true
})
fastify.register(require('fastify-bcrypt'), {
  saltWorkFactor: 12
})

fastify.register(require('./src/routes/auth'))
fastify.register(require('./src/routes/ingredients'))
fastify.register(require('./src/routes/recipes'))

fastify.listen({ port: 8001 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
