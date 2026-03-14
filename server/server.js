import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import deployRoutes from './routes/deployRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/deployments', deployRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (_, res) => {
  const dbOk = mongoose.connection.readyState === 1
  res.json({ status: 'ok', database: dbOk ? 'connected' : 'disconnected' })
})

// Ensure all errors return JSON (no empty or HTML responses)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`ShipFast API running on http://localhost:${PORT}`))

connectDB()
