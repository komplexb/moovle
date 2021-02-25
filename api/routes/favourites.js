import {
  GetUser,
  favouritesScope,
} from '../controllers/authentication.controller'

import { generateHash } from '../../utils/generateHash'
const express = require('express')
const axios = require('axios')

const rateLimit = require('express-rate-limit')
const passport = require('passport')

// use limiter on a per route basis
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

const router = express.Router()

// GET /v1/public/characters Fetches lists of characters.
const baseURL = `${process.env.MARVEL_API_URL}/characters`

router.use(limiter)

// only authenticated users with 'favourites' scope can access this
router.get(
  '/favourites',
  [passport.authenticate('jwt', { session: false }), favouritesScope],
  async (req, res, next) => {
    const timestamp = Date.now()
    const hash = generateHash(timestamp)

    const { favouriteCharacters } = await GetUser(req.user.email)

    try {
      const params = new URLSearchParams({
        apikey: process.env.MARVEL_PUK,
        ts: timestamp,
        hash,
      })

      const results = favouriteCharacters.map(async (character) => {
        const { request, data } = await axios.get(
          `${baseURL}?name=${character}`,
          {
            params,
          }
        )
        return data.data.results[0]
      })

      await Promise.all(results).then((data) => res.json(data))
    } catch (error) {
      next(error)
    }
  }
)

router.use(function (err, req, res, next) {
  console.error(err.stack)
  res
    .status(500)
    .send(
      'Sorry, there was an error retrieving your favourite heroes, please try again or contact Support.'
    )
  // next(err)
})

module.exports = router
