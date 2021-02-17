const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connectionString = `mongodb+srv://dev:${process.env.MONGODB_PASSWORD}@moovle-dev.ecnog.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`

;(async () => {
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
})()

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

export default mongoose.model('User', UserSchema)
