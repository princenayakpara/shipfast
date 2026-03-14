import Deployment from '../models/Deployment.js'
import Project from '../models/Project.js'
import { detectFramework, validateProject, getBuildLogSteps } from './buildService.js'

const BASE_URL = process.env.BASE_URL || 'https://'

function generateUrl(projectId, deploymentId) {
  const slug = projectId.toString().slice(-8) + '-' + deploymentId.toString().slice(-6)
  return `${BASE_URL}${slug}.shipfast.app`
}

/**
 * Deployment flow: clone → detect framework → install deps → build → start server → generate URL.
 */
export async function runDeployment(projectId, options = {}) {
  const project = await Project.findById(projectId)
  if (!project) throw new Error('Project not found')

  const packageJson = options.packageJson || {
    dependencies: { react: '^18.0.0' },
    scripts: { build: 'npm run build' },
  }
  const { valid, errors } = validateProject(packageJson)
  if (!valid) {
    const deployment = await Deployment.create({
      projectId,
      status: 'failed',
      error: errors.join('; '),
      logs: errors.map(e => ({ message: e, level: 'error' })),
    })
    return deployment
  }

  const { framework } = detectFramework(packageJson, project.repoName || project.name, options.detectedFiles || [])
  await Project.findByIdAndUpdate(projectId, { framework })

  const deployment = await Deployment.create({
    projectId,
    status: 'building',
    commitHash: options.commitHash || 'abc123',
    commitMessage: options.commitMessage || 'Initial deploy',
    logs: [],
  })

  const start = Date.now()
  const steps = getBuildLogSteps(framework)
  for (const message of steps) {
    await Deployment.findByIdAndUpdate(deployment._id, {
      $push: { logs: { message, level: 'info', time: new Date() } },
      status: message.includes('Starting server') ? 'deploying' : 'building',
    })
  }

  const buildTimeMs = Date.now() - start
  const url = generateUrl(projectId, deployment._id)
  await Deployment.findByIdAndUpdate(deployment._id, {
    status: 'success',
    url,
    buildTimeMs,
    $push: { logs: { message: 'Live at ' + url, level: 'info', time: new Date() } },
  })

  return await Deployment.findById(deployment._id)
}
