import express from 'express'
import * as authController from '../controllers/authController.js'

const router = express.Router()

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res)).catch(next)
}

router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.get('/me', asyncHandler(authController.me))

export default router
