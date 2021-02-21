// refer: https://github.com/nuxt-community/express-template
const express = require('express')
const app = express()

const marvel = require('./routes/marvel')
const auth = require('./routes/authentication')

app.use(express.json()) // support json encoded bodies
app.use(express.urlencoded({ extended: true })) // support encoded bodies

app.use('/marvel', marvel)
app.use(auth)

module.exports = app
