import AuthenticationController from '../controllers/authentication.controller'
import MailerController from '../controllers/mailer.controller'

const { Router } = require('express')
const router = Router()
const passport = require('passport')

router.post('/auth/login', (req, res) => {
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

router.get('/auth/user', (req, res) => {
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
    .then(async (user) => {
      const signedVerificationToken = AuthenticationController.signVerificationToken(
        user.email,
        user.verificationToken
      )
      await MailerController.SendRegistrationToken(
        email,
        'Registration Confirmation',
        signedVerificationToken
      )
      res.send({ message: 'Check your inbox for a verification link.' })
    })
    .catch((err) => {
      throw err
    })
})

router.post('/auth/mail', async (req, res) => {
  const email = req.body.email
  await MailerController.SendMail(
    email,
    'Registration Confirmation',
    'Registration Successful',
    '<p>Registration Successful - You have been registered!</p>'
  )
    .then(async () => {
      res.send({ status: 'ok' })
    })
    .catch((err) => {
      throw err
    })
})

module.exports = router
