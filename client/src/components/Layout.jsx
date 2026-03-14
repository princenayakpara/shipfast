import React from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-ship-dark flex">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-ship-dark">
        <div className="bg-radial-glow fixed inset-0 pointer-events-none opacity-30" />
        <div className="relative">
          {children}
        </div>
      </main>
    </div>
  )
}
