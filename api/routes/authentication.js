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
// @ts-ignore
const { body, validationResult } = require('express-validator')

/**
 * Via email, issue verification token to validate password change request
 * Toggle resetPassword boolean so password can only be changed while the token is valid
 * and boolean is true.
 */
router.post(
  '/auth/password/reset',
  body('email').trim().isEmail(),
  async (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ validation: validationErrors.array() })
    }

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
      return res.send({ message: 'Link sent, please check your email.' })
    } else {
      return res.send({
        message: `Unable to reset password, please contact admin, or create a new account.`,
      })
    }
  }
)

/**
 * Accept the new password
 */
router.post(
  '/auth/password/change',
  body('token').isJWT(),
  body('password').isStrongPassword({
    minUppercase: 0,
    minSymbols: 0,
  }),
  async (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ validation: validationErrors.array() })
    }

    const token = req.body.token
    const password = req.body.password
    let email
    let verificationToken

    try {
      const vt = verifySignedVerificationToken(token)
      email = vt.email
      verificationToken = vt.verificationToken
    } catch (err) {
      return res.status(400).json({
        message:
          'Token is invalid. Please try the link in your email once more, or reset your password again.',
      })
    }
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
  }
)

router.post('/auth/confirmation', body('token').isJWT(), async (req, res) => {
  const token = req.body.token

  let email
  let verificationToken

  try {
    const vt = verifySignedVerificationToken(token)
    email = vt.email
    verificationToken = vt.verificationToken
  } catch (err) {
    return res.status(400).json({
      message:
        'Token is invalid. Please try the link in your email once more, or request a new token.',
    })
  }

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

router.post(
  '/auth/confirmation/resend',
  body('email').trim().isEmail(),
  async (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ validation: validationErrors.array() })
    }

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
  }
)

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
router.post(
  '/auth/login',
  body('email').trim().isEmail(),
  body('password').not().isEmpty(),
  (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ validation: validationErrors.array() })
    } else {
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
    }
  }
)

// only authenticated users can access this
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

router.post(
  '/auth/register',
  body('email').trim().isEmail(),
  body('password').isStrongPassword({
    minUppercase: 0,
    minSymbols: 0,
  }),
  async (req, res) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ validation: validationErrors.array() })
    }
    const email = req.body.email
    const password = req.body.password
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
  }
)

module.exports = router
