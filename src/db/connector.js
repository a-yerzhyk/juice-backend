const fastifyPlugin = require('fastify-plugin')
const mongodb = require('@fastify/mongodb')

async function dbConnector (fastify, options) {
  fastify.register(mongodb, {
    url: `${process.env.DB_URL}/${process.env.DB_NAME}`,
  })
}

module.exports = fastifyPlugin(dbConnector)