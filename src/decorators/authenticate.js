const { jwtSecret } = require('../env')()
const fastifyPlugin = require('fastify-plugin')

async function authDecorator(fastify, opts) {
  fastify.register(require("@fastify/jwt"), {
    secret: jwtSecret,
    cookie: {
      cookieName: 'jwt-t',
      signed: false
    }
  })

  fastify.decorate("authenticate", async function(request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}

module.exports = fastifyPlugin(authDecorator)