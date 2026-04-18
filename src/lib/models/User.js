import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    location: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['need-help', 'can-help', 'both'],
      default: 'both'
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    contributions: {
      type: Number,
      default: 0
    },
    helpsGiven: {
      type: Number,
      default: 0
    },
    helpsSolved: {
      type: Number,
      default: 0
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    badges: {
      type: [String],
      enum: [
        "Design Ally",
        "Fast Responder",
        "Top Mentor",
        "Code Master",
        "Great Communicator",
        "Rising Star",
        "Newcomer Star",
        "Helpful",
        "Patient Teacher"
      ],
      default: []
    },
    requestsCreated: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    }],
    requestsSolved: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    }],
    notifications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ trustScore: -1 });
userSchema.index({ contributions: -1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
