const fastifyPlugin = require('fastify-plugin')

async function authDecorator(fastify, opts) {
  fastify.register(require("@fastify/jwt"), {
    secret: "djsS^57$8DJsowjdsIDIhwJF@4$SDK2ksl",
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