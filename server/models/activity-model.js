const { Schema, model } = require("mongoose");

const activitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  activityType: {
    type: String,
    required: true,
    enum: [
      'compliance_calendar',
      'policy_generation', 
      'document_generation',
      'meeting_assistance',
      'notice_reply',
      'form_submission',
      'profile_update',
      'settings_change',
      'feature_usage'
    ]
  },
  feature: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  inputData: {
    type: Schema.Types.Mixed,
    required: false
  },
  outputData: {
    type: Schema.Types.Mixed,
    required: false
  },
  metadata: {
    type: Schema.Types.Mixed,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  sessionId: {
    type: String,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ userId: 1, activityType: 1, timestamp: -1 });
activitySchema.index({ userId: 1, feature: 1, timestamp: -1 });

// TTL index to automatically delete old activities after 1 year (optional)
activitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

const Activity = model("Activity", activitySchema);

module.exports = Activity;
