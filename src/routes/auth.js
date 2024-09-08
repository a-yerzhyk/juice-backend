const crypto = require('crypto')

const { domain, clientOrigin } = require('../env')()

async function routes (fastify, options) {
  const usersCollection = fastify.mongo.db.collection('users')
  const activationsCollection = fastify.mongo.db.collection('activations')

  const registerOpts = {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' }
        }
      },
    }
  }

  const sendActivationEmail = async (userId) => { 
    const activationToken = crypto.randomBytes(32).toString('hex')
    await activationsCollection.insertOne({
      userId: userId,
      token: activationToken,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    })
  }

  fastify.post('/register', registerOpts, async (request, reply) => {
    const { name, email, password } = request.body
    if (!name || !email || !password) {
      return reply.code(400).send({ msg: 'Fill all fields' })
    }
    const user = await usersCollection.findOne({ email: request.body.email })
    if (user) {
      return reply.code(400).send({ msg: 'User already exists' })
    }
    const hashedPassword = await fastify.bcrypt.hash(password)
    const registrationResult = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      verified: false
    })
    await sendActivationEmail(registrationResult.insertedId)
    if (registrationResult) {
      return reply.code(201).redirect(`${clientOrigin}/registration-success`)
    } else {
      return reply.code(500).send({ msg: 'Error during user registration' })
    }
  })

  const loginOpts = {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      },
    }
  }

  fastify.post('/login', loginOpts, async (request, reply) => {
    const { email, password } = request.body
    if (!email || !password) {
      return reply.code(400).send({ msg: 'Fill all fields' })
    }
    const user = await usersCollection.findOne({ email: request.body.email })
    if (!user) {
      return reply.code(404).send({ msg: 'User not found' })
    }
    const isPasswordCorrect = await fastify.bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return reply.code(400).send({ msg: 'Incorrect password' })
    }
    const payload = { id: user._id, name: user.name, email: user.email, verified: user.verified }
    const token = fastify.jwt.sign({ payload })
    const setCookieOpts = {
      path: '/',
      domain: domain,
      httpOnly: true,
      secure: false,
      sameSite: true
    }
    reply.setCookie('jwt-t', token, setCookieOpts)
    .code(200)
    .send({ msg: `Logged in` })
  })

  fastify.post('/logout', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    reply.clearCookie('jwt-t', {
      path: '/',
      domain: domain,
    })
    .code(200)
    .send({ msg: 'Logged out' })
  })

  fastify.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify()
      return reply.code(200).send(request.user.payload)
    } catch (err) {
      return reply.code(200).send(JSON.stringify(null))
    }
  })

  fastify.get('/verify/:token', async (request, reply) => {
    const { token } = request.params
    const activation = await activationsCollection.findOne({
      token
    })
    if (!activation) {
      return reply.code(404).send({ msg: 'Activation not found' })
    }
    await activationsCollection.deleteOne({ token })
    const isExpired = activation.expiredAt < new Date()
    if (isExpired) {
      return reply.code(400).send({ msg: 'Activation expired' })
    } else {
      await usersCollection.updateOne({ _id: activation.userId }, { $set: { verified: true } })
      await activationsCollection.deleteOne({ token })
      return reply.redirect(`${clientOrigin}/verification-success`)
    }
  })

  fastify.get('/verify/refresh', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const user = request.user.payload
    if (user.verified) {
      return reply.code(400).send({ msg: 'User already verified' })
    }
    const activation = await activationsCollection.findOne({ userId: user.id })
    const isExpired = activation.expiredAt < new Date()
    if (!isExpired) {
      return reply.code(400).send({ msg: 'Activation not expired' })
    }
    const userId = request.user.payload.id
    await sendActivationEmail(userId)
  })
}

// CommonJs
module.exports = routes