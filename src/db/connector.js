const fastifyPlugin = require('fastify-plugin')
const mongodb = require('@fastify/mongodb')

async function dbConnector (fastify, options) {
  fastify.register(mongodb, {
    url: 'mongodb://localhost:27017/juice'
  })
}

module.exports = fastifyPlugin(dbConnector)