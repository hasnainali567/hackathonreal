import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['interested', 'helping', 'completed'],
      default: 'interested'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    ratingFeedback: {
      type: String,
      maxLength: [500, 'Feedback cannot exceed 500 characters']
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    wasHelpful: {
      type: Boolean
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Add indexes
contributionSchema.index({ helper: 1 });
contributionSchema.index({ request: 1 });
contributionSchema.index({ status: 1 });

export default mongoose.models.Contribution || mongoose.model('Contribution', contributionSchema);
