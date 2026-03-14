import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import * as api from '../services/api'
import DeployButton from '../components/DeployButton'
import LogViewer from '../components/LogViewer'

const STATUS_CONFIG = {
  pending:   { color: 'text-ship-muted',   bg: 'bg-ship-muted/10',   dot: 'bg-ship-muted' },
  building:  { color: 'text-ship-warning', bg: 'bg-ship-warning/10', dot: 'bg-ship-warning animate-pulse' },
  deploying: { color: 'text-ship-warning', bg: 'bg-ship-warning/10', dot: 'bg-ship-warning animate-pulse' },
  success:   { color: 'text-ship-success', bg: 'bg-ship-success/10', dot: 'bg-ship-success' },
  failed:    { color: 'text-ship-error',   bg: 'bg-ship-error/10',   dot: 'bg-ship-error' },
}

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [deployments, setDeployments] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [envKey, setEnvKey] = useState('')
  const [envValue, setEnvValue] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState('')
  const [selectedDeploy, setSelectedDeploy] = useState(null)

  useEffect(() => {
    api.getProject(id)
      .then(setProject)
      .catch(() => navigate('/dashboard'))
  }, [id, navigate])

  useEffect(() => {
    if (!id) return
    api.getDeployments(id)
      .then(setDeployments)
      .catch(() => setDeployments([]))
  }, [id])

  if (!project) {
    return (
      <div className="p-8 max-w-5xl animate-pulse">
        <div className="h-8 bg-ship-border rounded w-1/4 mb-4" />
        <div className="h-4 bg-ship-border rounded w-1/2 mb-8" />
        <div className="h-64 bg-ship-card border border-ship-border rounded-2xl" />
      </div>
    )
  }

  async function handleDeploy() {
    setError('')
    setDeploying(true)
    try {
      const deployment = await api.deployProject(id, {
        packageJson: { dependencies: { react: '^18.0.0' }, scripts: { build: 'npm run build' } },
      })
      setDeployments(d => [deployment, ...d])
      setSelectedDeploy(deployment._id)
      setActiveTab('deployments')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeploying(false)
    }
  }

  async function handleAddEnv(e) {
    e.preventDefault()
    if (!envKey.trim()) return
    const envVars = [...(project.envVars || []), { key: envKey.trim(), value: envValue }]
    try {
      const updated = await api.setProjectEnv(id, envVars)
      setProject(updated)
      setEnvKey('')
      setEnvValue('')
    } catch (err) {
      setError(err.message)
    }
  }

  function removeEnv(index) {
    const envVars = project.envVars.filter((_, i) => i !== index)
    api.setProjectEnv(id, envVars).then(setProject).catch(() => {})
  }

  const deployment = selectedDeploy
    ? deployments.find(d => d._id === selectedDeploy)
    : deployments[0]

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
    { key: 'deployments', label: 'Deployments', icon: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' },
    { key: 'env', label: 'Environment', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-ship-muted hover:text-white text-sm mb-3 inline-flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to projects
          </button>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-ship-muted text-sm font-mono mt-1">
            {project.repoUrl || 'No repository connected'}
          </p>
          {project.framework && (
            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-ship-accent/10 text-ship-accent text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-ship-accent" />
              {project.framework}
            </span>
          )}
        </div>
        <DeployButton onClick={handleDeploy} disabled={deploying} loading={deploying} />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-ship-error/10 border border-ship-error/20 text-ship-error text-sm animate-fade-in">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-ship-card/50 rounded-xl p-1 border border-ship-border/50 animate-fade-in-up delay-100">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-ship-accent/15 text-ship-accent shadow-inner'
                : 'text-ship-muted hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in-up">
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-white mb-4 text-lg">Project Overview</h2>
            <p className="text-ship-muted text-sm mb-6 leading-relaxed">
              ShipFast auto-detects your framework and deploys with zero config. Connect a repo or click Deploy to run a build.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 bg-ship-dark/60 rounded-xl border border-ship-border/30">
                <div className="text-ship-muted text-sm">Total deployments</div>
                <div className="text-2xl font-bold text-white mt-1">{deployments.length}</div>
              </div>
              <div className="p-4 bg-ship-dark/60 rounded-xl border border-ship-border/30">
                <div className="text-ship-muted text-sm">Successful</div>
                <div className="text-2xl font-bold text-ship-success mt-1">
                  {deployments.filter(d => d.status === 'success').length}
                </div>
              </div>
              <div className="p-4 bg-ship-dark/60 rounded-xl border border-ship-border/30">
                <div className="text-ship-muted text-sm">Last deployed</div>
                <div className="text-white font-mono text-sm mt-2">
                  {deployments[0] ? new Date(deployments[0].createdAt).toLocaleString() : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployments tab */}
      {activeTab === 'deployments' && (
        <div className="space-y-4 animate-fade-in-up">
          {deployments.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-ship-accent/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-ship-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
              <p className="text-ship-muted">No deployments yet. Click Deploy to run your first build.</p>
            </div>
          ) : (
            <>
              {/* Deployment selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {deployments.map(d => {
                  const cfg = STATUS_CONFIG[d.status] || STATUS_CONFIG.pending
                  const isActive = (selectedDeploy || deployments[0]._id) === d._id
                  return (
                    <button
                      key={d._id}
                      onClick={() => setSelectedDeploy(d._id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-mono whitespace-nowrap border transition-all duration-200 ${
                        isActive
                          ? 'border-ship-accent bg-ship-accent/10 text-ship-accent shadow-glow-sm'
                          : 'border-ship-border text-ship-muted hover:text-white hover:border-ship-muted/50'
                      }`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${cfg.dot}`} />
                      {d.status} · {new Date(d.createdAt).toLocaleTimeString()}
                    </button>
                  )
                })}
              </div>

              {/* Selected deployment details */}
              {deployment && (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-ship-border/50 flex flex-wrap items-center gap-4">
                    {(() => {
                      const cfg = STATUS_CONFIG[deployment.status] || STATUS_CONFIG.pending
                      return (
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${cfg.bg} ${cfg.color} text-sm font-medium`}>
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          {deployment.status}
                        </span>
                      )
                    })()}
                    {deployment.url && (
                      <a
                        href={deployment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ship-accent hover:text-ship-accent-bright font-mono text-sm transition-colors inline-flex items-center gap-1"
                      >
                        {deployment.url}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                    <Link
                      to={`/deployment/${deployment._id}/logs`}
                      className="text-ship-accent hover:text-ship-accent-bright text-sm transition-colors inline-flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      Full logs
                    </Link>
                    {deployment.buildTimeMs != null && (
                      <span className="text-ship-muted text-sm font-mono">
                        ⏱ {deployment.buildTimeMs}ms
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <LogViewer logs={deployment.logs || []} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Environment tab */}
      {activeTab === 'env' && (
        <div className="glass rounded-2xl p-6 animate-fade-in-up">
          <h2 className="font-semibold text-white mb-5 text-lg">Environment Variables</h2>
          <form onSubmit={handleAddEnv} className="flex flex-wrap gap-2 mb-6">
            <input
              type="text"
              value={envKey}
              onChange={e => setEnvKey(e.target.value)}
              placeholder="KEY"
              className="px-4 py-2.5 bg-ship-dark/80 border border-ship-border rounded-xl text-white font-mono text-sm w-36 focus-ring transition-colors"
            />
            <input
              type="password"
              value={envValue}
              onChange={e => setEnvValue(e.target.value)}
              placeholder="value"
              className="px-4 py-2.5 bg-ship-dark/80 border border-ship-border rounded-xl text-white font-mono text-sm flex-1 min-w-[140px] focus-ring transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-ship-accent/15 hover:bg-ship-accent/25 text-ship-accent rounded-xl text-sm font-medium transition-colors"
            >
              Add variable
            </button>
          </form>
          <div className="space-y-2">
            {(project.envVars || []).map((v, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 px-4 rounded-xl bg-ship-dark/40 border border-ship-border/30 group"
              >
                <span className="font-mono text-ship-accent text-sm font-medium">{v.key}</span>
                <span className="font-mono text-ship-muted text-sm flex-1">••••••••</span>
                <button
                  onClick={() => removeEnv(i)}
                  className="text-ship-muted hover:text-ship-error text-sm opacity-0 group-hover:opacity-100 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
            {(!project.envVars || project.envVars.length === 0) && (
              <p className="text-ship-muted text-sm py-4">No environment variables configured.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
