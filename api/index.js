// refer: https://github.com/nuxt-community/express-template
const express = require('express')
const app = express()

const marvel = require('./routes/marvel')

app.use('/marvel', marvel)

module.exports = app
