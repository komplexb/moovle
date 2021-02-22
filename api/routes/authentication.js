import {
  CreateUser,
  GetUser,
  generatePasswordHash,
  signUserToken,
  generateVerificationToken,
  generateVerificationTokenExpire,
  signVerificationToken,
  verifySignedVerificationToken,
} from '../controllers/authentication.controller'
import MailerController from '../controllers/mailer.controller'

const { Router } = require('express')
const router = Router()
const passport = require('passport')

router.post('/auth/password/reset', async (req, res) => {
  const email = req.body.email
  const user = await GetUser(email)

  if (user) {
    const verificationToken = generateVerificationToken()
    const verificationTokenExpire = generateVerificationTokenExpire()

    user.verificationToken = verificationToken
    user.verificationTokenExpire = verificationTokenExpire
    user.passwordReset = true
    user.save()

    const signedVerificationToken = signVerificationToken(user)

    await MailerController.SendPasswordChangeToken(
      user.email,
      'Password resetting',
      signedVerificationToken
    )
    return res.send({ message: 'Link sent, check your email.' })
  } else {
    return res.send({ message: `Password can't be renewed.` })
  }
})

router.post('/auth/password/change', async (req, res) => {
  const token = req.body.token
  const password = req.body.password

  const { email, verificationToken } = verifySignedVerificationToken(token)
  const user = await GetUser(email)
  if (
    user &&
    user.verificationToken === verificationToken &&
    user.verificationTokenExpire >= new Date() &&
    user.passwordReset === true
  ) {
    try {
      user.password = await generatePasswordHash(password)
      user.passwordReset = false
      user.save()
      return res.send({ message: 'Password has been changed.' })
    } catch (err) {
      return res.send({
        message: 'An error has ocurred. Contact administrator.',
      })
    }
  } else {
    return res.send({ message: 'Token is invalid. Please try again.' })
  }
})

router.post('/auth/confirmation', async (req, res) => {
  const token = req.body.token
  const { email, verificationToken } = verifySignedVerificationToken(token)
  const user = await GetUser(email)

  if (
    user &&
    user.verificationToken === verificationToken &&
    user.verificationTokenExpire >= new Date()
  ) {
    user.isVerified = true
    user.save()

    return res.send({
      confirmationStatus: 'verified',
      message: 'Your email has been verified.',
    })
  } else {
    return res.send({
      confirmationStatus: 'unverified',
      message: `Email can't be verified! Token likely expired.`,
    })
  }
})

router.post('/auth/confirmation/resend', async (req, res) => {
  const email = req.body.email
  const user = await GetUser(email)

  if (user && user.isVerified() === true) {
    return res.send('Already verified.')
  } else if (user) {
    const verificationToken = generateVerificationToken()
    const verificationTokenExpire = generateVerificationTokenExpire()

    user.verificationToken = verificationToken
    user.verificationTokenExpire = verificationTokenExpire
    user.save()

    const signedVerificationToken = signVerificationToken(user)

    await MailerController.SendRegistrationToken(
      user.email,
      'Registration confirmation - resend',
      signedVerificationToken
    )

    return res.send('Token has been resent.')
  } else {
    res.send(`Token can't be resent`)
  }
})

router.post('/auth/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err) {
      // todo: log fails
      return res.status(500).send(err)
    } else if (!user) {
      // todo: log fails
      return res.status(403).send(message)
    } else {
      const token = signUserToken(user)
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
  const hashedPassword = await generatePasswordHash(password)
  await CreateUser(email, hashedPassword)
    .then(async (user) => {
      const signedVerificationToken = signVerificationToken(user)
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

module.exports = router
