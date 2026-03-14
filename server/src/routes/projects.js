import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import Project from '../models/Project.js'
import Deployment from '../models/Deployment.js'
import { runDeployment } from '../services/deploymentSimulator.js'
import { detectFramework } from '../services/frameworkDetector.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, repoUrl, repoName, packageJson } = req.body
    const project = await Project.create({
      userId: req.user._id,
      name: name || 'Untitled Project',
      repoUrl: repoUrl || '',
      repoName: repoName || name || 'project',
    })
    if (packageJson) {
      const detected = detectFramework(packageJson, project.repoName)
      await Project.findByIdAndUpdate(project._id, detected)
    }
    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    )
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    await Deployment.deleteMany({ projectId: project._id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/env', async (req, res) => {
  try {
    const { envVars } = req.body
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { envVars: Array.isArray(envVars) ? envVars : [] },
      { new: true }
    )
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/:id/deploy', async (req, res) => {
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
})

router.get('/:id/deployments', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    const deployments = await Deployment.find({ projectId: project._id }).sort({ createdAt: -1 })
    res.json(deployments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
