/**
 * Framework detection and build logic.
 * Rules: package.json → Node/React, next.config.js → Next.js, requirements.txt → Python.
 */

export function detectFramework(packageJson = {}, repoName = '', detectedFiles = []) {
  const hasNext = detectedFiles.includes('next.config.js') || (packageJson.dependencies && packageJson.dependencies['next'])
  const hasRequirements = detectedFiles.includes('requirements.txt') || (repoName && /python|flask|django/i.test(repoName))

  if (hasRequirements) {
    return { framework: 'Python', buildCommand: null, outputDir: '.' }
  }
  if (hasNext) {
    return { framework: 'Next.js', buildCommand: 'npm run build', outputDir: '.next' }
  }

  if (!packageJson.dependencies && !packageJson.devDependencies) {
    return { framework: 'static', buildCommand: null, outputDir: 'dist' }
  }
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies } || {}

  if (deps['next']) {
    return { framework: 'Next.js', buildCommand: 'npm run build', outputDir: '.next' }
  }
  if (deps['react-scripts'] || (deps['react'] && deps['vite'])) {
    return { framework: 'React (Vite)', buildCommand: 'npm run build', outputDir: 'dist' }
  }
  if (deps['react']) {
    return { framework: 'React', buildCommand: 'npm run build', outputDir: 'build' }
  }
  if (deps['vue']) {
    return { framework: 'Vue', buildCommand: 'npm run build', outputDir: 'dist' }
  }
  if (deps['@angular/core']) {
    return { framework: 'Angular', buildCommand: 'npm run build', outputDir: 'dist' }
  }
  if (packageJson.scripts?.build) {
    return { framework: 'Node.js', buildCommand: 'npm run build', outputDir: 'dist' }
  }
  return { framework: 'Node.js', buildCommand: 'npm install', outputDir: '.' }
}

export function validateProject(packageJson = {}) {
  const errors = []
  if (!packageJson.name && !packageJson.dependencies) {
    errors.push('No package.json or project manifest found')
  }
  return { valid: errors.length === 0, errors }
}

/** Returns ordered build log messages for a deployment (install → build → start). */
export function getBuildLogSteps(framework) {
  return [
    'Cloning repository...',
    `Detecting framework: ${framework}`,
    'Installing dependencies...',
    'Building project...',
    'Starting server...',
    'Deployment successful',
  ]
}
