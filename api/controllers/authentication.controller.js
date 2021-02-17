import User from '../models/user'

const mongoose = require('mongoose')
const connectionString = `mongodb+srv://dev:${process.env.MONGODB_PASSWORD}@moovle-dev.ecnog.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`
const bcrypt = require('bcrypt')

async function generatePasswordHash(plainPassword) {
  return await bcrypt.hash(plainPassword, 12)
}

;(async () => {
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
})()

async function CreateUser(email, password) {
  return await User.create({ email, password })
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
}
