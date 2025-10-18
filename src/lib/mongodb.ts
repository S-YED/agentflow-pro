import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agentflow-pro'

async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      return mongoose
    }
    
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')
    return mongoose
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default connectDB