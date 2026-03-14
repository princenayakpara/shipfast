import React, { useState, useEffect } from 'react'
import * as api from '../services/api'
import ProjectCard from '../components/ProjectCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRepo, setNewRepo] = useState('')
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    api.getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      const project = await api.createProject({
        name: newName || 'New Project',
        repoUrl: newRepo || undefined,
        repoName: newRepo ? newRepo.split('/').pop()?.replace(/\.git$/, '') : undefined,
      })
      setProjects(p => [project, ...p])
      setShowAdd(false)
      setNewName('')
      setNewRepo('')
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-ship-muted text-sm mt-1">Manage and deploy your projects</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-ship-accent hover:bg-ship-accent-bright text-ship-dark font-semibold rounded-xl transition-all duration-300 shadow-glow-sm hover:shadow-glow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New project
        </button>
      </div>

      {/* Quick stats */}
      {!loading && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3 mb-8 animate-fade-in-up delay-100">
          <div className="glass rounded-2xl p-5">
            <div className="text-ship-muted text-sm">Total Projects</div>
            <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-ship-muted text-sm">With Repositories</div>
            <div className="text-2xl font-bold text-ship-accent mt-1">
              {projects.filter(p => p.repoUrl).length}
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-ship-muted text-sm">Frameworks</div>
            <div className="text-2xl font-bold text-ship-purple mt-1">
              {new Set(projects.map(p => p.framework).filter(Boolean)).size}
            </div>
          </div>
        </div>
      )}

      {/* Add project modal */}
      {showAdd && (
        <div className="mb-8 glass rounded-2xl p-6 animate-fade-in-up shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Add project</h2>
            <button
              onClick={() => setShowAdd(false)}
              className="text-ship-muted hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {error && <p className="text-ship-error text-sm mb-4 animate-fade-in">{error}</p>}
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm text-ship-muted mb-1.5">Project name</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full max-w-md px-4 py-3 bg-ship-dark/80 border border-ship-border rounded-xl text-white placeholder-ship-muted/50 focus-ring transition-colors"
                placeholder="my-awesome-app"
              />
            </div>
            <div>
              <label className="block text-sm text-ship-muted mb-1.5">Repository URL (optional)</label>
              <input
                type="text"
                value={newRepo}
                onChange={e => setNewRepo(e.target.value)}
                className="w-full max-w-md px-4 py-3 bg-ship-dark/80 border border-ship-border rounded-xl text-white font-mono text-sm placeholder-ship-muted/50 focus-ring transition-colors"
                placeholder="https://github.com/user/repo"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ship-success hover:bg-ship-success-bright text-ship-dark font-medium rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {creating ? 'Creating…' : 'Create project'}
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-5 py-2.5 text-ship-muted hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-ship-card border border-ship-border rounded-2xl p-6 animate-pulse">
              <div className="h-5 bg-ship-border rounded w-1/3 mb-3" />
              <div className="h-4 bg-ship-border rounded w-2/3 mb-2" />
              <div className="h-3 bg-ship-border rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-ship-accent/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-ship-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No projects yet</h3>
          <p className="text-ship-muted mb-6">Create your first project and deploy it with zero config.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ship-accent hover:bg-ship-accent-bright text-ship-dark font-semibold rounded-xl transition-all duration-300 shadow-glow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <div key={project._id} className={`animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
