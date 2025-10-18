import mongoose from 'mongoose'

const distributedListSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  totalItems: {
    type: Number,
    required: [true, 'Total items count is required'],
    min: [0, 'Total items cannot be negative']
  },
  distributions: [{
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent ID is required']
    },
    agentName: {
      type: String,
      required: [true, 'Agent name is required'],
      trim: true
    },
    items: [{
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
      },
      notes: {
        type: String,
        default: '',
        trim: true
      }
    }]
  }]
}, {
  timestamps: true
})

// Index for better query performance
distributedListSchema.index({ createdAt: -1 })
distributedListSchema.index({ 'distributions.agentId': 1 })

export default mongoose.models.DistributedList || mongoose.model('DistributedList', distributedListSchema)