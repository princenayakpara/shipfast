import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import Deployment from '../models/Deployment.js'
import Project from '../models/Project.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const projectIds = (await Project.find({ userId: req.user._id }).select('_id')).map(p => p._id)
    const deployments = await Deployment.find({ projectId: { $in: projectIds } })
    const total = deployments.length
    const success = deployments.filter(d => d.status === 'success').length
    const failed = deployments.filter(d => d.status === 'failed').length
    const withTime = deployments.filter(d => d.buildTimeMs)
    const avgBuildTime = withTime.length ? withTime.reduce((a, d) => a + d.buildTimeMs, 0) / withTime.length : 0
    const byFramework = {}
    const projects = await Project.find({ userId: req.user._id })
    for (const p of projects) {
      const count = deployments.filter(d => d.projectId.equals(p._id)).length
      const fw = p.framework || 'unknown'
      byFramework[fw] = (byFramework[fw] || 0) + count
    }
    res.json({
      totalDeployments: total,
      successCount: success,
      failedCount: failed,
      successRate: total ? Math.round((success / total) * 100) : 0,
      averageBuildTimeMs: Math.round(avgBuildTime),
      deploymentsByFramework: byFramework,
      recentDeployments: deployments.slice(0, 10),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
