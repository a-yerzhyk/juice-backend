const { clientOrigin, serverPort } = require('./src/env')()

const fastify = require('fastify')({
  logger: true
})
const cors = require('@fastify/cors')
fastify.register(require('./src/db/connector'))

fastify.register(require('@fastify/cookie'))
fastify.register(require('./src/decorators/authenticate'))
fastify.register(cors, {
  origin: ['https://libjuice.com', clientOrigin],
  credentials: true
})
fastify.register(require('fastify-bcrypt'), {
  saltWorkFactor: 12
})

fastify.register(require('./src/routes/auth'))
fastify.register(require('./src/routes/ingredients'))
fastify.register(require('./src/routes/recipes'))
fastify.register(require('./src/routes/test'))

fastify.listen({ port: serverPort, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
