async function routes (fastify, options) {
  const collection = fastify.mongo.db.collection('ingredients')

  const postOpts = {
    schema: {
      body: {
        type: 'object',
        required: ['ingredientName'],
        properties: {
          ingredientName: { type: 'string' }
        }
      },
    }
  }

  fastify.post('/ingredients/add', postOpts, async (request, reply) => {
    if (!request.body.ingredientName) {
      return reply.code(400).send({ msg: 'Fill all fields' })
    }
    const exsistingIngredient = await collection.findOne({ name: request.body.ingredientName })
    if (exsistingIngredient) {
      return reply.code(400).send({ msg: 'Ingredient already exists' })
    }
    const result = await collection.insertOne({ name: request.body.ingredientName })
    if (result) {
      return reply.code(201).send({ msg: 'Ingredient created' })
    }
    return reply.code(500).send({ msg: 'Error during ingredient creation' })
  })

  fastify.get('/ingredients', async (request, reply) => {
    const result = await collection.find().toArray()
    reply.code(200).send(result)
  })
}

// CommonJs
module.exports = routes