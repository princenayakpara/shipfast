import React, { useState, useEffect } from 'react'
import * as api from '../services/api'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl">
        <div className="h-8 bg-ship-border rounded w-1/4 mb-2 animate-pulse" />
        <div className="h-4 bg-ship-border rounded w-1/3 mb-8 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-ship-card border border-ship-border rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-ship-border rounded w-1/2 mb-3" />
              <div className="h-8 bg-ship-border rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 lg:p-8">
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-ship-error">Failed to load analytics. Make sure you have deployments.</p>
        </div>
      </div>
    )
  }

  const { totalDeployments, successCount, failedCount, successRate, averageBuildTimeMs, deploymentsByFramework, recentDeployments } = data

  const stats = [
    { label: 'Total Deployments', value: totalDeployments, color: 'text-white' },
    { label: 'Successful', value: successCount, color: 'text-ship-success' },
    { label: 'Failed', value: failedCount, color: 'text-ship-error' },
    { label: 'Success Rate', value: `${successRate}%`, color: 'text-ship-accent' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-ship-muted text-sm mt-1">Deployment statistics and build performance</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-6 card-hover animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-ship-muted text-sm mb-1">{s.label}</div>
            <div className={`text-3xl font-bold ${s.color} font-mono`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Build time + Framework distribution */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="glass rounded-2xl p-6 animate-fade-in-up delay-200">
          <h2 className="font-semibold text-white mb-4 text-lg">Average Build Time</h2>
          <div className="text-4xl font-bold text-white font-mono">
            {averageBuildTimeMs ? `${averageBuildTimeMs}` : '—'}
            <span className="text-lg text-ship-muted ml-1">ms</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 animate-fade-in-up delay-300">
          <h2 className="font-semibold text-white mb-4 text-lg">By Framework</h2>
          <div className="space-y-3">
            {Object.entries(deploymentsByFramework || {}).map(([fw, count]) => {
              const pct = totalDeployments ? Math.round((count / totalDeployments) * 100) : 0
              return (
                <div key={fw}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ship-muted">{fw}</span>
                    <span className="text-white font-mono">{count}</span>
                  </div>
                  <div className="h-1.5 bg-ship-dark/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ship-accent rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {(!deploymentsByFramework || Object.keys(deploymentsByFramework).length === 0) && (
              <p className="text-ship-muted text-sm">No data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent deployments */}
      <div className="glass rounded-2xl p-6 animate-fade-in-up delay-400">
        <h2 className="font-semibold text-white mb-5 text-lg">Recent Deployments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ship-muted border-b border-ship-border/50">
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Build Time</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentDeployments || []).map(d => (
                <tr key={d._id} className="border-b border-ship-border/20 hover:bg-ship-dark/30 transition-colors">
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 ${
                      d.status === 'success' ? 'text-ship-success' : d.status === 'failed' ? 'text-ship-error' : 'text-ship-muted'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        d.status === 'success' ? 'bg-ship-success' : d.status === 'failed' ? 'bg-ship-error' : 'bg-ship-muted'
                      }`} />
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-ship-muted">
                    {d.buildTimeMs ? `${d.buildTimeMs} ms` : '—'}
                  </td>
                  <td className="py-3 text-ship-muted">
                    {new Date(d.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!recentDeployments || recentDeployments.length === 0) && (
          <p className="text-ship-muted text-sm py-4 text-center">No deployments yet.</p>
        )}
      </div>
    </div>
  )
}
