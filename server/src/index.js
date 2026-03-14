import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import deploymentRoutes from './routes/deployments.js'
import analyticsRoutes from './routes/analytics.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/deployments', deploymentRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (_, res) => {
  const dbOk = mongoose.connection.readyState === 1
  res.json({ status: 'ok', database: dbOk ? 'connected' : 'disconnected' })
})

// Start server immediately so the app is reachable even while MongoDB connects
app.listen(PORT, () => console.log(`ShipFast API running on http://localhost:${PORT}`))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shipfast')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message))
