import mongoose from 'mongoose';
import './User';

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Request title is required'],
      trim: true,
      maxLength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minLength: [20, 'Description must be at least 20 characters'],
      maxLength: [5000, 'Description cannot exceed 5000 characters']
    },
    category: {
      type: String,
      enum: ['web', 'mobile', 'design', 'backend', 'business', 'career', 'general'],
      default: 'general'
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    tags: {
      type: [String],
      default: []
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: {
      type: String,
      default: 'Anonymous'
    },
    location: {
      type: String,
      default: 'Unknown'
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'solved', 'closed'],
      default: 'open'
    },
    views: {
      type: Number,
      default: 0
    },
    helpersInterested: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    solvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    aiSummary: {
      type: String,
      default: ''
    },
    solvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Add index for better query performance
requestSchema.index({ category: 1, urgency: 1, status: 1 });
requestSchema.index({ author: 1 });
requestSchema.index({ createdAt: -1 });

export default mongoose.models.Request || mongoose.model('Request', requestSchema);
