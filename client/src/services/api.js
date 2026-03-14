import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Auto-attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shipfast_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Unwrap response data and normalize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export async function getProjects() {
  return api.get('/projects')
}

export async function getProject(id) {
  return api.get(`/projects/${id}`)
}

export async function createProject(body) {
  return api.post('/projects', body)
}

export async function updateProject(id, body) {
  return api.patch(`/projects/${id}`, body)
}

export async function deleteProject(id) {
  return api.delete(`/projects/${id}`)
}

export async function setProjectEnv(id, envVars) {
  return api.put(`/projects/${id}/env`, { envVars })
}

export async function deployProject(id, options = {}) {
  return api.post(`/projects/${id}/deploy`, options)
}

export async function getDeployments(projectId) {
  return api.get(`/projects/${projectId}/deployments`)
}

export async function getDeployment(id) {
  return api.get(`/deployments/${id}`)
}

export async function getAnalytics() {
  return api.get('/analytics')
}
