const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connectionString = `mongodb+srv://dev:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB}.ecnog.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`

const connection = mongoose.createConnection(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  favouriteCharacters: { type: Array, required: false, default: [] },
  isVerified: { type: Boolean, required: true, default: false },
  password: { type: String, required: true },
  resetPassword: { type: Boolean, required: true, default: false },
  scope: { type: Array, required: true, default: ['user'] },
  verificationToken: { type: String, required: true },
  verificationTokenExpire: { type: Date, required: true },
})

const User = connection.model('User', UserSchema)

export default connection
