require('dotenv').config()
const mongoose = require('mongoose')
const { User } = require('./models/auth')

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.create({ email: 'admin@zetech.ac.ke', password: 'admin123', role: 'admin' })
  console.log('Admin created')
  process.exit(0)
})