import Project from '../models/Project.js'
import Deployment from '../models/Deployment.js'
import { runDeployment } from '../services/deployService.js'

export async function deploy(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    const deployment = await runDeployment(project._id, {
      packageJson: req.body.packageJson,
      commitHash: req.body.commitHash,
      commitMessage: req.body.commitMessage,
    })
    res.status(201).json(deployment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getDeployment(req, res) {
  try {
    const deployment = await Deployment.findById(req.params.id)
    if (!deployment) return res.status(404).json({ error: 'Deployment not found' })
    const project = await Project.findOne({ _id: deployment.projectId, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Deployment not found' })
    res.json(deployment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
