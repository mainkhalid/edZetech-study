const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
})


userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(pass) {
  return await bcrypt.compare(pass, this.password);
};

const User = mongoose.model('User', userSchema)


const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) throw new Error()
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' })
    }
    
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' })
  }
}

// Auth Routes
const authRoutes = require('express').Router()

authRoutes.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    
    if (!user || user.role !== 'admin' || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.json({ token, user: { email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = { User, adminAuth, authRoutes }