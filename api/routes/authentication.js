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
    user.resetPassword = true
    user.save()

    const signedVerificationToken = signVerificationToken(user)

    await MailerController.SendPasswordChangeToken(
      user.email,
      'Moovle - Reset Password',
      signedVerificationToken
    )
    return res.send({ message: 'Link sent, check your email.' })
  } else {
    return res.send({
      message: `Unable to reset password, please contact admin, or create a new account.`,
    })
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
    user.resetPassword === true
  ) {
    try {
      user.password = await generatePasswordHash(password)
      user.resetPassword = false
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
      'Moovle - Resend Registration Confirmation',
      signedVerificationToken
    )

    return res.send({ message: 'Check your inbox for a verification link.' })
  } else {
    res.send(`Token can't be resent`)
  }
})

/**
 * Passport exposes a logout() function on req (also aliased as logOut())
 * to terminate a login session.
 * Invoking logout() will remove the req.user property and
 * clear the login session (if any).
 */
router.post('/auth/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

/**
 * Authenticate access to the app with the `local` strategy
 * defined in the authentication controller.
 *
 * If authentication succeeds,
 * the next handler will be invoked and the req.user property will be set to the authenticated user.
 */
router.post('/auth/login', (req, res) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, message) => {
      if (err) {
        // todo: log fails
        return res.status(500).send(err)
      } else if (!user) {
        // todo: log fails
        return res.status(403).send(message)
      } else {
        const token = signUserToken(user)
        if (process.env.NODE_ENV == 'production') {
          await MailerController.SendMail(
            user.email,
            'Moovle - Login Notification',
            `Someone just logged into your Moovle account. If that wasn't you, please contact Support.`
          )
        }
        return res.send({ token })
      }
    }
  )(req, res)
})

router.get('/auth/user', (req, res) => {
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
  const password = req.body.password
  const email = req.body.email
  const hashedPassword = await generatePasswordHash(password)
  await CreateUser(email, hashedPassword)
    .then(async (user) => {
      const signedVerificationToken = signVerificationToken(user)
      await MailerController.SendRegistrationToken(
        email,
        'Moovle - Registration Confirmation',
        signedVerificationToken
      )
      res.send({ message: 'Check your inbox for a verification link.' })
    })
    .catch((err) => {
      throw err
    })
})

module.exports = router
