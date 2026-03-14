import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import * as deployController from '../controllers/deployController.js'
import Project from '../models/Project.js'

const router = express.Router()

router.get('/:id', authMiddleware, deployController.getDeployment)

// Deploy is under projects in API design; we keep POST /api/projects/:id/deploy in projectRoutes
// and a separate deploy route here for optional REST style. Use projectRoutes for deploy.
export default router
