// refer: https://github.com/nuxt-community/express-template
const express = require('express')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')

// use limiter on a per route basis
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

const app = express()

const marvel = require('./routes/marvel')
const auth = require('./routes/authentication')

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.use(marvel('/search'))
app.use(marvel('/character/:id', [limiter]))
app.use(marvel('/comics/:id', [limiter]))

app.use(auth)

module.exports = app
