import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import * as projectController from '../controllers/projectController.js'
import * as deployController from '../controllers/deployController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', projectController.listProjects)
router.post('/', projectController.createProject)
router.get('/:id', projectController.getProject)
router.patch('/:id', projectController.updateProject)
router.delete('/:id', projectController.deleteProject)
router.put('/:id/env', projectController.setProjectEnv)
router.post('/:id/deploy', deployController.deploy)
router.get('/:id/deployments', projectController.getProjectDeployments)

export default router
