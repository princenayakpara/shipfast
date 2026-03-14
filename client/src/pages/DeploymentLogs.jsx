import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as api from '../services/api'
import LogViewer from '../components/LogViewer'

const STATUS_CONFIG = {
  pending:   { color: 'text-ship-muted',   bg: 'bg-ship-muted/10',   dot: 'bg-ship-muted' },
  building:  { color: 'text-ship-warning', bg: 'bg-ship-warning/10', dot: 'bg-ship-warning animate-pulse' },
  deploying: { color: 'text-ship-warning', bg: 'bg-ship-warning/10', dot: 'bg-ship-warning animate-pulse' },
  success:   { color: 'text-ship-success', bg: 'bg-ship-success/10', dot: 'bg-ship-success' },
  failed:    { color: 'text-ship-error',   bg: 'bg-ship-error/10',   dot: 'bg-ship-error' },
}

export default function DeploymentLogs() {
  const { deploymentId } = useParams()
  const navigate = useNavigate()
  const [deployment, setDeployment] = useState(null)
  const [project, setProject] = useState(null)

  useEffect(() => {
    if (!deploymentId) return
    api.getDeployment(deploymentId)
      .then(d => {
        setDeployment(d)
        return d.projectId && api.getProject(d.projectId)
      })
      .then(p => p && setProject(p))
      .catch(() => navigate('/dashboard'))
  }, [deploymentId, navigate])

  if (!deployment) {
    return (
      <div className="p-8 max-w-4xl animate-pulse">
        <div className="h-4 bg-ship-border rounded w-24 mb-4" />
        <div className="h-8 bg-ship-border rounded w-1/3 mb-8" />
        <div className="h-64 bg-ship-card border border-ship-border rounded-2xl" />
      </div>
    )
  }

  const cfg = STATUS_CONFIG[deployment.status] || STATUS_CONFIG.pending

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <button
          onClick={() => navigate(project ? `/project/${project._id}` : '/dashboard')}
          className="text-ship-muted hover:text-white text-sm mb-3 inline-flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to {project ? project.name : 'Dashboard'}
        </button>
        <h1 className="text-2xl font-bold text-white mb-3">Deployment Logs</h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${cfg.bg} ${cfg.color} text-sm font-medium`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {deployment.status}
          </span>
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
          {deployment.buildTimeMs != null && (
            <span className="text-ship-muted text-sm font-mono">⏱ {deployment.buildTimeMs}ms</span>
          )}
        </div>
      </div>

      {/* Terminal */}
      <div className="glass rounded-2xl overflow-hidden shadow-card animate-fade-in-up delay-100">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-ship-border/50 bg-ship-dark/40">
          <div className="w-3 h-3 rounded-full bg-ship-error/60" />
          <div className="w-3 h-3 rounded-full bg-ship-warning/60" />
          <div className="w-3 h-3 rounded-full bg-ship-success/60" />
          <span className="ml-2 text-xs text-ship-muted font-mono">
            deployment-logs — {project?.name || 'project'}
          </span>
        </div>
        {/* Pipeline steps */}
        <div className="px-5 py-3 border-b border-ship-border/30 flex flex-wrap gap-3 text-xs font-mono text-ship-muted">
          {['Install', 'Build', 'Deploy', 'Live'].map((step, i) => (
            <span key={step} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="text-ship-border">→</span>}
              <span className={i < 3 || deployment.status === 'success' ? 'text-ship-success' : ''}>
                {step}
              </span>
            </span>
          ))}
        </div>
        {/* Log output */}
        <div className="p-4">
          <LogViewer logs={deployment.logs || []} />
        </div>
      </div>
    </div>
  )
}
