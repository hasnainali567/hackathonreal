import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fromEmail: {
      type: String,
      index: true,
      lowercase: true,
      trim: true,
      default: ''
    },
    fromName: {
      type: String,
      trim: true,
      default: ''
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    toEmail: {
      type: String,
      index: true,
      lowercase: true,
      trim: true,
      default: ''
    },
    toName: {
      type: String,
      trim: true,
      default: ''
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
messageSchema.index({ fromEmail: 1, toEmail: 1 });
messageSchema.index({ from: 1, to: 1 });
messageSchema.index({ request: 1 });
messageSchema.index({ createdAt: -1 });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
