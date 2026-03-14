/**
 * Git / repository service.
 * In production: clone repo, list branches, get file contents.
 * Here: simulated clone and file detection for framework detection.
 */

/**
 * Simulates cloning a repository. Returns mock file presence for framework detection.
 * @param {string} repoUrl
 * @returns {Promise<{ hasPackageJson: boolean, hasNextConfig: boolean, hasRequirementsTxt: boolean }>}
 */
export async function cloneRepository(repoUrl) {
  // Simulated: in production we would run `git clone` and read files
  const lower = (repoUrl || '').toLowerCase()
  return {
    hasPackageJson: true, // assume Node/React by default for demo
    hasNextConfig: lower.includes('next'),
    hasRequirementsTxt: lower.includes('python') || lower.includes('flask') || lower.includes('django'),
  }
}

/**
 * Get list of files in repo root (simulated).
 */
export async function getRepoFiles(repoUrl) {
  const clone = await cloneRepository(repoUrl)
  const files = []
  if (clone.hasPackageJson) files.push('package.json')
  if (clone.hasNextConfig) files.push('next.config.js')
  if (clone.hasRequirementsTxt) files.push('requirements.txt')
  return files.length ? files : ['package.json']
}
