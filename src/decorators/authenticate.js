const fastifyPlugin = require('fastify-plugin')

async function authDecorator(fastify, opts) {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET,
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