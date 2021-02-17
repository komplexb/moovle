import AuthenticationController from '../controllers/authentication.controller'
const { Router } = require('express')
const router = Router()

router.post('/auth/login', async (req, res, next) => {})

router.get('/auth/user', async (req, res, next) => {
  res.send({ ok: 'ok' })
})

router.post('/auth/register', async (req, res, next) => {
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
