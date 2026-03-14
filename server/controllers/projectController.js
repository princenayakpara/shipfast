import Project from '../models/Project.js'
import Deployment from '../models/Deployment.js'
import { detectFramework } from '../services/buildService.js'
import { runDeployment } from '../services/deployService.js'

export async function listProjects(req, res) {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createProject(req, res) {
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
}

export async function getProject(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateProject(req, res) {
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
}

export async function deleteProject(req, res) {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    await Deployment.deleteMany({ projectId: project._id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function setProjectEnv(req, res) {
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
}

export async function getProjectDeployments(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    const deployments = await Deployment.find({ projectId: project._id }).sort({ createdAt: -1 })
    res.json(deployments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
