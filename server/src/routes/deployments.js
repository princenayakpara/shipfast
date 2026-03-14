import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import Deployment from '../models/Deployment.js'
import Project from '../models/Project.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/:id', async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id)
    if (!deployment) return res.status(404).json({ error: 'Deployment not found' })
    const project = await Project.findOne({ _id: deployment.projectId, userId: req.user._id })
    if (!project) return res.status(404).json({ error: 'Deployment not found' })
    res.json(deployment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
