import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['new-request', 'help-offer', 'status-change', 'message', 'trend', 'badge', 'follow'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Add indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
