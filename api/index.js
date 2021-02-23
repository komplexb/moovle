// refer: https://github.com/nuxt-community/express-template
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
// const passport = require('passport')

const marvel = require('./routes/marvel')
const auth = require('./routes/authentication')
// const adminPages = require('./routes/admin')

app.use(express.json()) // support json encoded bodies
app.use(express.urlencoded({ extended: true })) // support encoded bodies
app.use(cookieParser())

app.use('/marvel', marvel)
// app.use('/admin', passport.authenticate('jwt', { session: false }), adminPages)
app.use(auth)

module.exports = app
