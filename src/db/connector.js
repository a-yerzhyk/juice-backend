const { dbHref } = require('../env')()
const fastifyPlugin = require('fastify-plugin')
const mongodb = require('@fastify/mongodb')

async function dbConnector (fastify, options) {
  fastify.register(mongodb, {
    url: `mongodb://${dbHref}`,
  })
}

module.exports = fastifyPlugin(dbConnector)