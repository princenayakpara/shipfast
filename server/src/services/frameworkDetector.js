/**
 * Detects framework from package.json-like object or repo URL / project name.
 * Used for zero-config deployment.
 */
export function detectFramework(packageJson = {}, repoName = '') {
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
  if (repoName && (repoName.includes('python') || repoName.includes('flask') || repoName.includes('django'))) {
    return { framework: 'Python', buildCommand: null, outputDir: '.' }
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
