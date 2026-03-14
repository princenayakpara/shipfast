import React from 'react'

const LEVEL_ICON = {
  info: (
    <svg className="w-3.5 h-3.5 text-ship-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
    </svg>
  ),
  warn: (
    <svg className="w-3.5 h-3.5 text-ship-warning flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  error: (
    <svg className="w-3.5 h-3.5 text-ship-error flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
}

const LEVEL_CLASS = {
  info: 'text-ship-muted',
  warn: 'text-ship-warning',
  error: 'text-ship-error',
}

export default function LogViewer({ logs = [], className = '' }) {
  return (
    <div className={`font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto bg-ship-dark/80 rounded-xl p-4 border border-ship-border/20 ${className}`}>
      {logs.length === 0 ? (
        <div className="text-ship-muted flex items-center gap-2">
          <span className="terminal-cursor"> </span>
          Waiting for logs...
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 py-0.5 ${LEVEL_CLASS[log.level] || LEVEL_CLASS.info}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-ship-border/60 select-none w-6 text-right flex-shrink-0 text-xs leading-5">
                {String(i + 1).padStart(2, '0')}
              </span>
              {LEVEL_ICON[log.level] || LEVEL_ICON.info}
              <span className="flex-1">
                {log.time && (
                  <span className="text-ship-border mr-2 text-xs">
                    {new Date(log.time).toLocaleTimeString()}
                  </span>
                )}
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
