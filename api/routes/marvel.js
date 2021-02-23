import { generateHash } from '../../utils/generateHash'
const express = require('express')
const axios = require('axios')

const apicache = require('apicache')
const rateLimit = require('express-rate-limit')
const cache = apicache.middleware // cache globally

// use limiter on a per route basis
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

const router = express.Router()

// GET /v1/public/characters Fetches lists of characters.
const baseURL = `${process.env.MARVEL_API_URL}/characters`

router.use(cache('1 day'))
router.use(limiter)

/**
 * only accept {name || nameStartsWith } for search
 * {name} Return only characters matching the specified full character name (e.g. Spider-Man).
 * {nameStartsWith} Return characters with names that begin with the specified string (e.g. Sp).
 */
router.get('/search', function (req, res, next) {
  if (req.query?.name || req.query?.nameStartsWith) {
    next()
  } else {
    throw new Error('Invalid search, please try again.')
  }
})

// GET {baseURL}/{characterId} Fetches a single character by id.
router.get('/character/:id', function (req, res, next) {
  req.marvelPath = `/${req.params.id}`
  next()
})

// GET {baseURL}/{characterId}/comics
// Fetches lists of comics filtered by a character id.
router.get('/comics/:id', function (req, res, next) {
  req.marvelPath = `/${req.params.id}/comics`
  next()
})

// all /marvel requests fallthrough here
// use {marvelPath} defined by routes to build request
router.use(async (req, res, next) => {
  const timestamp = Date.now()
  const hash = generateHash(timestamp)

  try {
    const params = new URLSearchParams({
      apikey: process.env.MARVEL_PUK,
      ts: timestamp,
      hash,
      ...req.query,
    })

    const { request, data } = await axios.get(
      `${baseURL}${req?.marvelPath || ''}`,
      {
        params,
      }
    )
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(err.message)
  // next(err)
})

module.exports = router
