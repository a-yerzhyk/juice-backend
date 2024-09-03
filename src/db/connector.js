const fastifyPlugin = require('fastify-plugin')
const mongodb = require('@fastify/mongodb')

async function dbConnector (fastify, options) {
  fastify.register(mongodb, {
    url: process.env.DB_URL,
  })
}

module.exports = fastifyPlugin(dbConnector)