import Deployment from '../models/Deployment.js'
import Project from '../models/Project.js'
import { detectFramework, validateProject } from './frameworkDetector.js'

const BASE_URL = process.env.BASE_URL || 'https://'

function generateUrl(projectId, deploymentId) {
  const slug = projectId.toString().slice(-8) + '-' + deploymentId.toString().slice(-6)
  return `${BASE_URL}${slug}.shipfast.app`
}

function* buildLogGenerator(framework) {
  yield { message: 'Cloning repository...', level: 'info' }
  yield { message: 'Detecting framework: ' + framework, level: 'info' }
  yield { message: 'Installing dependencies...', level: 'info' }
  yield { message: 'Running build...', level: 'info' }
  yield { message: 'Build completed successfully.', level: 'info' }
  yield { message: 'Deploying to edge...', level: 'info' }
  yield { message: 'Deployment complete.', level: 'info' }
}

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

  const { framework } = detectFramework(packageJson, project.repoName || project.name)
  await Project.findByIdAndUpdate(projectId, { framework })

  const deployment = await Deployment.create({
    projectId,
    status: 'building',
    commitHash: options.commitHash || 'abc123',
    commitMessage: options.commitMessage || 'Initial deploy',
    logs: [],
  })

  const start = Date.now()
  const gen = buildLogGenerator(framework)
  const logs = []
  for (const entry of gen) {
    logs.push({ ...entry, time: new Date() })
    await Deployment.findByIdAndUpdate(deployment._id, {
      $push: { logs: entry },
      status: entry.message.includes('Deploying') ? 'deploying' : 'building',
    })
  }

  const buildTimeMs = Date.now() - start
  const url = generateUrl(projectId, deployment._id)
  await Deployment.findByIdAndUpdate(deployment._id, {
    status: 'success',
    url,
    buildTimeMs,
    $push: { logs: { message: 'Live at ' + url, level: 'info' } },
  })

  return await Deployment.findById(deployment._id)
}
