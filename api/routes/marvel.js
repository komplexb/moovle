import { generateHash } from '../../utils/generateHash'
const express = require('express')
const axios = require('axios')

const router = express.Router()

function configureRoute(route, middleware = []) {
  const baseURL = `${process.env.MARVEL_API_URL}/characters`

  return router.use(route, middleware, async (req, res, next) => {
    const timestamp = Date.now()
    const hash = generateHash(timestamp)

    try {
      const params = new URLSearchParams({
        apikey: process.env.MARVEL_PUK,
        ts: timestamp,
        hash,
        ...req.query,
      })

      // character || comics request
      let url = ''
      if (route.includes('character')) {
        url = `/${req.params.id}`
      } else if (route.includes('comics')) {
        url = `/${req.params.id}/comics`
      }

      const { request, data } = await axios.get(`${baseURL}${url}`, {
        params,
      })
      // console.warn(request)
      res.json(data)
    } catch (error) {
      // console.warn(error)
      next(error)
    }
  })
}

module.exports = configureRoute
