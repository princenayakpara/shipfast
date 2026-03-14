import mongoose from 'mongoose'

const envVarSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false })

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  repoUrl: { type: String },
  repoName: { type: String },
  framework: { type: String, default: 'unknown' },
  envVars: [envVarSchema],
  buildCommand: { type: String },
  outputDir: { type: String },
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)
