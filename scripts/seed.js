const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

// Import the User model (we'll use require since this is a .js file)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

const seedDatabase = async () => {
  try {
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' })
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists')
      process.exit(0)
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      mobile: '+1234567890',
      password: 'admin123',
      role: 'admin'
    })

    await admin.save()
    
    console.log('🎉 Admin user created successfully!')
    console.log('📧 Email: admin@example.com')
    console.log('🔑 Password: admin123')
    console.log('')
    console.log('🚀 You can now start the development server:')
    console.log('   npm run dev')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()