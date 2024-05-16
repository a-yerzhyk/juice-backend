async function routes (fastify, options) {
  const recipesCollection = fastify.mongo.db.collection('recipes')
  const ingredientsCollection = fastify.mongo.db.collection('ingredients')

  const postOpts = {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'ingredients'],
        properties: {
          name: { type: 'string' },
          ingredients: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                ingredientId: { type: 'string' },
                quantity: { type: 'string' }
              }
            }
          }
        }
      },
    }
  }

  fastify.post('/recipes/add', postOpts, async (request, reply) => {
    if (!request.body.name) {
      return reply.code(400).send({ msg: 'Fill all fields' })
    }
    // TODO: Add ingredients to recipe
    const result = await recipesCollection.insertOne({ name: request.body.name, ingredients: request.body.ingredients })
    if (result) {
      return reply.code(201).send({ msg: 'Recipe created' })
    }
    return reply.code(500).send({ msg: 'Ingredient not created' })
  })

  // const getStructure = {
  //   type: 'array',
  //   items: {
  //     type: 'object',
  //     properties: {
  //       _id: { type: 'string' },
  //       name: { type: 'string' },
  //       ingredients: {
  //         type: 'array',
  //         items: {
  //           type: 'object',
  //           properties: {
  //             ingredientId: { type: 'string' },
  //             quantity: { type: 'string' }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // TODO: search by ingredients, return all if no filter
  fastify.get('/recipes', async (request, reply) => {
    const ingredients = await ingredientsCollection.find().toArray()
    let recipes = await recipesCollection.find().toArray()
    recipes = recipes.map(recipe => {
      return {
        ...recipe,
        ingredients: recipe.ingredients.map(ingredient => {
          const found = ingredients.find(i => i._id.toString() === ingredient.ingredientId)
          return {
            ...ingredient,
            name: found?.name
          }
        })
      
      }
    })
    reply.code(200).send(recipes)
  })
}

// CommonJs
module.exports = routes