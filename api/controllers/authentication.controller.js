import connection from '../models/user'
const User = connection.models.User

const crypto = require('crypto')
const bcrypt = require('bcrypt')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const authUserSecret = process.env.AUTH_USER_SECRET

const JwtStrategy = require('passport-jwt').Strategy
const jwt = require('jsonwebtoken')

const expireSpan = 3600 * 1000 * 24 // one day
const authEmailVerificationSecret = process.env.AUTH_EMAIL_VERIFICATION_SECRET

function generateVerificationToken() {
  return crypto.randomBytes(30).toString('hex')
}

function generateVerificationTokenExpire() {
  return new Date(Date.now() + expireSpan)
}

function signVerificationToken({ email, verificationToken }) {
  return jwt.sign(
    {
      email,
      verificationToken,
    },
    authEmailVerificationSecret
  )
}

/**
 * Couple an user email and a token.
 * Avoids disclosure of real token to a user and
 * support fast query to the database by using the contained values
 * @param {string} token provided by email query param
 */
function verifySignedVerificationToken(token) {
  return jwt.verify(token, authEmailVerificationSecret)
}

/**
 * use npm cookie-parser to extract token
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

/**
 * This module lets you authenticate endpoints using a JSON web token.
 * It is intended to be used to secure RESTful endpoints without sessions.
 * http://www.passportjs.org/packages/passport-jwt/
 *
 * `jwtFromRequest` Function that accepts a request as the only parameter and returns
 * either the JWT as a string or null.
 * `secretOrKey` is a string or buffer containing the secret (symmetric) or PEM-encoded
 * public key (asymmetric) for verifying the token's signature.
 *
 * Confused? Watch this series: https://bit.ly/37HptYz
 */
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
              scope: user.scope,
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

/**
 * The local authentication strategy authenticates users using a username and password.
 * If any of the following steps fail, the user cannot login
 * - Compare entered password to db
 * - Check if user has verified their email address
 * http://www.passportjs.org/packages/passport-local/
 * Confused? Watch this series: https://bit.ly/37HptYz
 */
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
            return done(null, false, {
              message: 'Authentication failed - User Not Found.',
            })
          }

          const validation = await comparePasswords(password, user.password)
          if (validation && user.isVerified) {
            return done(null, user)
          } else if (validation) {
            return done(null, false, {
              message: 'Check your email to verify your account.',
            })
          } else {
            return done(null, false, {
              message: 'Authentication failed - Unable to verify user.',
            })
          }
        })
        .catch((err) => {
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
  // return jwt.sign(({ id, email } = user), authUserSecret)
}

/**
 * bcrypt is good but pbkdf2 is better: https://bit.ly/301qCGx
 * https://www.npmjs.com/package/pbkdf2
 * @param {*} plainPassword
 */
async function generatePasswordHash(plainPassword) {
  return await bcrypt.hash(plainPassword, Number(process.env.BCRYPT_HASH))
}

async function CreateUser(email, password) {
  const verificationToken = generateVerificationToken()
  const verificationTokenExpire = generateVerificationTokenExpire()
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

/**
 * Setup favourite scope check as middleware
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const favouritesScope = (req, res, next) => {
  if (!req.user.scope.includes('favourites')) {
    return res.status(403).send({
      status: 'fail',
      message: 'Access Denied!',
    })
  }
  next()
}

export {
  CreateUser,
  GetUser,
  generatePasswordHash,
  signUserToken,
  generateVerificationToken,
  generateVerificationTokenExpire,
  signVerificationToken,
  verifySignedVerificationToken,
  favouritesScope,
}
