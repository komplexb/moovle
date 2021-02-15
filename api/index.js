// refer: https://github.com/nuxt-community/express-template
const express = require('express')
const apicache = require('apicache')
const rateLimit = require('express-rate-limit')

// use limiter on a per route basis
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

const app = express()
const cache = apicache.middleware // cache globally

const marvel = require('./routes/marvel')

app.use(cache('1 day'))
app.use(marvel('/search'))
app.use(marvel('/character/:id', [limiter]))
app.use(marvel('/comics/:id', [limiter]))

module.exports = app
