import React from 'react'
import { Link } from 'react-router-dom'

const FRAMEWORK_COLORS = {
  'React':        'text-sky-400 bg-sky-400/10',
  'React (Vite)': 'text-sky-400 bg-sky-400/10',
  'Next.js':      'text-white bg-white/10',
  'Vue':          'text-emerald-400 bg-emerald-400/10',
  'Angular':      'text-red-400 bg-red-400/10',
  'Node.js':      'text-green-400 bg-green-400/10',
  'Python':       'text-yellow-400 bg-yellow-400/10',
  'static':       'text-ship-muted bg-ship-muted/10',
}

export default function ProjectCard({ project }) {
  const fwClass = FRAMEWORK_COLORS[project.framework] || 'text-ship-muted bg-ship-muted/10'

  return (
    <Link
      to={`/project/${project._id}`}
      className="block bg-ship-card border border-ship-border rounded-2xl p-6 card-hover gradient-border group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg group-hover:text-ship-accent transition-colors">
            {project.name}
          </h3>
          <p className="text-ship-muted text-sm mt-1.5 font-mono truncate">
            {project.repoUrl || 'No repo connected'}
          </p>
          {project.framework && (
            <span className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-lg text-xs font-medium ${fwClass}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {project.framework}
            </span>
          )}
        </div>
        <svg
          className="w-5 h-5 text-ship-border group-hover:text-ship-accent group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  )
}
