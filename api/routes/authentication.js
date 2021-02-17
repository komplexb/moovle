import AuthenticationController from '../controllers/authentication.controller'
const { Router } = require('express')
const router = Router()
const passport = require('passport')

router.post('/auth/login', async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err) {
      // todo: log fails
      return res.status(500).send(err)
    } else if (!user) {
      // todo: log fails
      return res.status(403).send(message)
    } else {
      const token = AuthenticationController.signUserToken(user)
      return res.send({ token })
    }
  })(req, res)
})

router.get('/auth/user', async (req, res) => {
  // console.log(req.cookies['auth._token.local'])

  passport.authenticate('jwt', { session: false }, (err, user, message) => {
    if (err) {
      // todo: log fails
      return res.status(400).send(err)
    } else if (!user) {
      // todo: log fails
      return res.status(403).send({ message })
    } else {
      return res.send({ user })
    }
  })(res, req)
})

router.post('/auth/register', async (req, res) => {
  // console.warn('body', req.headers)
  const password = req.body.password
  const email = req.body.email
  const hashedPassword = await AuthenticationController.generatePasswordHash(
    password
  )
  await AuthenticationController.CreateUser(email, hashedPassword)
    .then(() => {
      res.send({ message: 'An account has been created!' })
    })
    .catch((err) => {
      throw err
    })
})

module.exports = router
