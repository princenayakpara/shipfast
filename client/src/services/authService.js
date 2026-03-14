import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token for authenticated requests (e.g. /auth/me)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shipfast_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (!err.response) {
      return Promise.reject(new Error('Cannot reach server. Is the backend running on port 5000?'))
    }
    const message = err.response.data?.error || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export async function register(email, password, name) {
  return api.post('/auth/register', { email, password, name })
}

export async function login(email, password) {
  return api.post('/auth/login', { email, password })
}

export async function getMe() {
  return api.get('/auth/me')
}
