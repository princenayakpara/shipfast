import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, name)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ship-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-radial-glow absolute inset-0 pointer-events-none" />
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-20" />

      <div className="relative w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold gradient-text font-mono">ShipFast</h1>
          </Link>
          <p className="text-ship-muted text-sm mt-2">Start deploying in minutes</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 shadow-card animate-fade-in-up delay-100"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Create account</h2>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-ship-error/10 border border-ship-error/20 text-ship-error text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ship-muted mb-1.5">Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-ship-dark/80 border border-ship-border rounded-xl text-white placeholder-ship-muted/50 focus-ring transition-colors hover:border-ship-muted/50"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ship-muted mb-1.5">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-ship-dark/80 border border-ship-border rounded-xl text-white placeholder-ship-muted/50 focus-ring transition-colors hover:border-ship-muted/50"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ship-muted mb-1.5">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-ship-dark/80 border border-ship-border rounded-xl text-white placeholder-ship-muted/50 focus-ring transition-colors hover:border-ship-muted/50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-ship-success hover:bg-ship-success-bright text-ship-dark font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-glow-sm"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account…
              </span>
            ) : 'Create account'}
          </button>
        </form>

        <p className="text-center text-ship-muted text-sm mt-6 animate-fade-in-up delay-200">
          Already have an account?{' '}
          <Link to="/login" className="text-ship-accent hover:text-ship-accent-bright transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
