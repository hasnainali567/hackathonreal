import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxLength: [2000, 'Message cannot exceed 2000 characters']
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for efficient querying
messageSchema.index({ from: 1, to: 1 });
messageSchema.index({ request: 1 });
messageSchema.index({ createdAt: -1 });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
