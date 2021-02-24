// refer: https://github.com/nuxt-community/express-template
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const apicache = require('apicache')
const cache = apicache.middleware
const passport = require('passport')

const marvel = require('./routes/marvel')
const favourites = require('./routes/favourites')
const auth = require('./routes/authentication')

app.use(passport.initialize())
app.use(express.json()) // support json encoded bodies
app.use(express.urlencoded({ extended: true })) // support encoded bodies
app.use(cookieParser())

app.use('/marvel', [cache(process.env.CACHE)], marvel)
app.use([cache(process.env.CACHE)], favourites)
app.use(auth)

module.exports = app
