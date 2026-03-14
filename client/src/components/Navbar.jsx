import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <header className="h-16 border-b border-ship-border/50 glass sticky top-0 z-50 flex items-center justify-between px-6">
      <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-ship-accent/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-ship-accent animate-rocket" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
        </div>
        <span className="font-bold text-white font-mono text-lg">ShipFast</span>
      </Link>

      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="text-sm text-ship-muted hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/analytics" className="text-sm text-ship-muted hover:text-white transition-colors">
              Analytics
            </Link>
            <div className="w-8 h-8 rounded-full bg-ship-accent/15 flex items-center justify-center text-ship-accent text-sm font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-ship-muted hover:text-white transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm px-4 py-2 bg-ship-accent text-ship-dark font-medium rounded-xl hover:bg-ship-accent-bright transition-all duration-300"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
