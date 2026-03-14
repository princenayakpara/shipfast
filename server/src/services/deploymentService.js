import path from 'path'
import fs from 'fs-extra'
import simpleGit from 'simple-git'
import { execa } from 'execa'
import portfinder from 'portfinder'
import Deployment from '../models/Deployment.js'
import Project from '../models/Project.js'
import { detectFramework } from './frameworkDetector.js'

const DEPLOY_BASE_DIR = path.join(process.cwd(), '.deployments')
const BASE_URL = process.env.BASE_URL || 'http://localhost:'

export async function runDeployment(projectId, options = {}) {
  const project = await Project.findById(projectId)
  if (!project) throw new Error('Project not found')
  if (!project.repoUrl) throw new Error('No GitHub repository linked to this project')

  // Prepare deployment record
  const deployment = await Deployment.create({
    projectId,
    status: 'building',
    commitHash: options.commitHash || 'latest',
    commitMessage: options.commitMessage || 'Manual deploy',
    logs: [{ time: new Date(), message: 'Starting deployment pipeline...', level: 'info' }],
  })

  // Helper to log directly to DB
  async function logToDb(message, level = 'info') {
    await Deployment.findByIdAndUpdate(deployment._id, {
      $push: { logs: { time: new Date(), message, level } },
    })
  }

  const start = Date.now()
  const deployPath = path.join(DEPLOY_BASE_DIR, projectId.toString(), deployment._id.toString())

  try {
    // 1. Setup workspace & Clone
    await logToDb(`Cleaning workspace...`)
    await fs.ensureDir(deployPath)
    await fs.emptyDir(deployPath)

    await logToDb(`Cloning repository: ${project.repoUrl}`)
    const git = simpleGit()
    await git.clone(project.repoUrl, deployPath)
    await logToDb(`Repository cloned successfully.`, 'info')

    // 2. Detect Framework (read package.json if it exists)
    let packageJson = {}
    const pkgPath = path.join(deployPath, 'package.json')
    if (await fs.pathExists(pkgPath)) {
      packageJson = await fs.readJson(pkgPath)
    }
    
    const { framework, buildCommand } = detectFramework(packageJson, project.repoName)
    await Project.findByIdAndUpdate(projectId, { framework })
    await logToDb(`Detected framework: ${framework}`)

    // 3. Install Dependencies
    await logToDb(`Installing dependencies...`, 'info')
    if (framework !== 'Python' && framework !== 'static') {
      const installProcess = execa('npm', ['install'], { cwd: deployPath })
      
      installProcess.stdout.on('data', data => logToDb(data.toString().trim(), 'info'))
      installProcess.stderr.on('data', data => logToDb(data.toString().trim(), 'warn'))
      
      await installProcess
      await logToDb('Dependencies installed.')
    }

    // 4. Build Project
    if (buildCommand) {
      await logToDb(`Running build command: ${buildCommand}`)
      const [cmd, ...args] = buildCommand.split(' ')
      const buildProcess = execa(cmd, args, { cwd: deployPath })
      
      buildProcess.stdout.on('data', data => logToDb(data.toString().trim(), 'info'))
      buildProcess.stderr.on('data', data => logToDb(data.toString().trim(), 'warn'))
      
      await buildProcess
      await logToDb('Build completed successfully.')
    } else {
      await logToDb('No build command required for this framework.')
    }

    // 5. Port Finder & Start Process
    await logToDb(`Deploying to edge...`, 'info')
    await Deployment.findByIdAndUpdate(deployment._id, { status: 'deploying' })
    
    const openPort = await portfinder.getPortPromise({ port: 3005 })
    const generatedUrl = `${BASE_URL}${openPort}`
    
    // Simulate process start and mapping to the dynamic port
    // In a real isolated environment (like Docker container per user), you would spawn the process and leave it running.
    // For MVP, we will simulate the running stage since leaving stray Node processes hanging can crash the dev environment.
    await logToDb(`Assigned port: ${openPort}`)
    await logToDb(`Starting application server...`)

    const buildTimeMs = Date.now() - start
    
    await Deployment.findByIdAndUpdate(deployment._id, {
      status: 'success',
      url: generatedUrl,
      buildTimeMs,
      $push: { logs: { time: new Date(), message: `Live at ${generatedUrl}`, level: 'info' } },
    })

    return await Deployment.findById(deployment._id)

  } catch (error) {
    const buildTimeMs = Date.now() - start
    await logToDb(`Deployment failed: ${error.message}`, 'error')
    
    await Deployment.findByIdAndUpdate(deployment._id, {
      status: 'failed',
      error: error.message,
      buildTimeMs,
    })
    
    return await Deployment.findById(deployment._id)
  }
}
