import User from '../models/user'

const crypto = require('crypto')
const mongoose = require('mongoose')
const connectionString = `mongodb+srv://dev:${process.env.MONGODB_PASSWORD}@moovle-dev.ecnog.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`
const bcrypt = require('bcrypt')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const authUserSecret = process.env.AUTH_USER_SECRET

const JwtStrategy = require('passport-jwt').Strategy
const jwt = require('jsonwebtoken')

const expireSpan = 3600 * 1000 * 24
const authEmailVerificationSecret = process.env.AUTH_EMAIL_VERIFICATION_SECRET

;(async () => {
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
})()

function generateVerificationToken() {
  return crypto.randomBytes(30).toString('hex')
}

function generateVerificationTokenExpire() {
  return new Date(Date.now() + expireSpan)
}

function signVerificationToken(email, verificationToken) {
  return jwt.sign(
    {
      email,
      verificationToken,
    },
    authEmailVerificationSecret
  )
}

function verifySignedVerificationToken(token) {
  return jwt.verify(token, authEmailVerificationSecret)
}

/**
 * In Express.js there are no req object in the req object as it is in nuxt.js.
 * @param {*} req
 */
const tokenExtractor = function (req) {
  let token = null
  if (req.req && req.req.cookies && req.req.cookies['auth._token.local']) {
    const rawToken = req.req.cookies['auth._token.local'].toString()
    token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
  } else if (req && req.cookies && req.cookies['auth._token.local']) {
    const rawToken = req.cookies['auth._token.local'].toString()
    token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
  }
  return token
}

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: tokenExtractor,
      secretOrKey: authUserSecret,
    },
    function (jwtPayload, done) {
      return GetUser(jwtPayload.email)
        .then((user) => {
          if (user) {
            return done(null, {
              email: user.email,
            })
          } else {
            return done(null, false, 'Failed')
          }
        })
        .catch((err) => {
          return done(err)
        })
    }
  )
)

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, done) {
      await GetUser(email)
        .then((user) => {
          return user
        })
        .then(async (user) => {
          if (!user) {
            return done(null, false, { message: 'Authentication failed.' })
          }
          const validation = await comparePasswords(password, user.password)
          if (validation) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Authentication failed.' })
          }
        })
        .catch((err) => {
          // console.warn(err)
          return done(err)
        })
    }
  )
)

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

function signUserToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    authUserSecret
  )
}

async function generatePasswordHash(plainPassword) {
  return await bcrypt.hash(plainPassword, 12)
}

async function CreateUser(email, password) {
  const verificationToken = generateVerificationToken()
  const verificationTokenExpire = generateVerificationTokenExpire()
  // console.log(verificationToken, verificationTokenExpire)
  // debugger
  return await User.create({
    email,
    password,
    verificationToken,
    verificationTokenExpire,
  })
    .then((data) => {
      return data
    })
    .catch((error) => {
      throw error
    })
}

async function GetUser(email) {
  return await User.findOne({ email })
    .then((data) => {
      return data
    })
    .catch((error) => {
      throw error
    })
}

export default {
  CreateUser,
  GetUser,
  generatePasswordHash,
  signUserToken,
  generateVerificationToken,
  generateVerificationTokenExpire,
  signVerificationToken,
  verifySignedVerificationToken,
}
