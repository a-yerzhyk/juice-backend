async function routes (fastify, options) {
  fastify.get('/test', (request, reply) => {
    return reply.code(201).send('answer')
  })
}

// CommonJs
module.exports = routes