import mongoose from 'mongoose'

const logEntrySchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  message: { type: String },
  level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
}, { _id: false })

const deploymentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: {
    type: String,
    enum: ['pending', 'building', 'deploying', 'success', 'failed'],
    default: 'pending',
  },
  url: { type: String },
  buildTimeMs: { type: Number },
  logs: [logEntrySchema],
  error: { type: String },
  commitHash: { type: String },
  commitMessage: { type: String },
}, { timestamps: true })

export default mongoose.model('Deployment', deploymentSchema)
