import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const features = [
  {
    title: 'Zero Configuration',
    desc: 'No build commands, no server setup. We detect your framework and handle everything automatically.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: 'Instant Live URL',
    desc: 'Every deployment gets a unique public URL. Share and test your app within minutes.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Logs',
    desc: 'Watch install, build, and deploy logs live in a terminal-style viewer. Debug errors instantly.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: 'Framework Detection',
    desc: 'React, Next.js, Vue, Angular, Python — we auto-detect and configure the right build pipeline.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-2.297 2.297a2.25 2.25 0 01-1.591.659h-3.824a2.25 2.25 0 01-1.591-.659L8.2 14.5" />
      </svg>
    ),
  },
  {
    title: 'Environment Variables',
    desc: 'Securely manage API keys and secrets through the dashboard. Encrypted and isolated per project.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: 'Deploy History',
    desc: 'Track every deployment with status, build time, logs, and generated URLs. Full audit trail.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const steps = [
  { num: '01', label: 'Connect Repository', desc: 'Link your GitHub repo' },
  { num: '02', label: 'Detect Framework', desc: 'React, Next.js, Node, Python…' },
  { num: '03', label: 'Install Dependencies', desc: 'Automatic npm/pip install' },
  { num: '04', label: 'Build Project', desc: 'Optimized production build' },
  { num: '05', label: 'Start Server', desc: 'Launch your application' },
  { num: '06', label: 'Live URL', desc: 'Share your app instantly' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-ship-dark">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-radial-glow absolute inset-0 pointer-events-none" />
        <div className="bg-grid absolute inset-0 pointer-events-none opacity-40" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-ship-muted mb-8">
            <span className="w-2 h-2 rounded-full bg-ship-success animate-pulse-dot" />
            Zero-configuration deployment platform
          </div>

          <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-white">Deploy in </span>
            <span className="gradient-text">minutes</span>
            <br />
            <span className="text-white">not hours</span>
          </h1>

          <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-ship-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect your repository. We detect the framework, install dependencies, build, and deploy — with a live URL ready to share.
          </p>

          <div className="animate-fade-in-up delay-300 flex flex-wrap gap-4 justify-center">
            <Link
              to="/signup"
              className="group px-8 py-3.5 bg-ship-accent text-ship-dark font-semibold rounded-xl hover:bg-ship-accent-bright transition-all duration-300 shadow-glow-sm hover:shadow-glow-md"
            >
              Get started free
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 glass text-ship-muted hover:text-white font-medium rounded-xl transition-all duration-300 hover:border-ship-accent/30"
            >
              Sign in
            </Link>
          </div>

          {/* Terminal preview */}
          <div className="animate-fade-in-up delay-500 mt-16 max-w-2xl mx-auto">
            <div className="glass rounded-2xl overflow-hidden shadow-card">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-ship-border/50">
                <div className="w-3 h-3 rounded-full bg-ship-error/60" />
                <div className="w-3 h-3 rounded-full bg-ship-warning/60" />
                <div className="w-3 h-3 rounded-full bg-ship-success/60" />
                <span className="ml-2 text-xs text-ship-muted font-mono">shipfast deploy</span>
              </div>
              <div className="p-5 font-mono text-sm text-left space-y-1.5">
                <div className="text-ship-success">✓ Cloning repository...</div>
                <div className="text-ship-success">✓ Detected framework: React (Vite)</div>
                <div className="text-ship-success">✓ Installing dependencies...</div>
                <div className="text-ship-success">✓ Building project...</div>
                <div className="text-ship-success">✓ Starting server...</div>
                <div className="text-ship-accent font-semibold">
                  ✓ Live at https://myapp-x82k9f.shipfast.app
                </div>
                <div className="text-ship-muted terminal-cursor"> </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-ship-border/50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to <span className="gradient-text-blue">ship fast</span>
            </h2>
            <p className="text-ship-muted text-lg max-w-xl mx-auto">
              Built for developers who want to focus on code, not infrastructure.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`animate-fade-in-up delay-${(i + 1) * 100} bg-ship-card border border-ship-border rounded-2xl p-6 card-hover group`}
              >
                <div className="w-10 h-10 rounded-xl bg-ship-accent/10 text-ship-accent flex items-center justify-center mb-4 group-hover:bg-ship-accent/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">{f.title}</h3>
                <p className="text-ship-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment flow */}
      <section className="border-t border-ship-border/50 py-20 relative">
        <div className="bg-radial-glow absolute inset-0 pointer-events-none opacity-50" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-ship-muted text-lg max-w-xl mx-auto">
              From git push to live URL in six simple steps.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`animate-fade-in-up delay-${(i + 1) * 100} glass rounded-2xl p-6 card-hover`}
              >
                <div className="text-ship-accent font-mono text-sm font-semibold mb-3">{s.num}</div>
                <h3 className="font-semibold text-white mb-1">{s.label}</h3>
                <p className="text-ship-muted text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ship-border/50 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to <span className="gradient-text">ship</span>?
          </h2>
          <p className="text-ship-muted text-lg mb-8">
            Create an account and deploy your first project in minutes. No credit card required.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-ship-success text-ship-dark font-semibold rounded-xl hover:bg-ship-success-bright transition-all duration-300 shadow-lg hover:shadow-glow-sm text-lg"
          >
            <svg className="w-5 h-5 animate-rocket" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ship-border/50 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-ship-accent font-semibold">ShipFast</div>
          <p className="text-ship-muted text-sm">
            © {new Date().getFullYear()} ShipFast. Deploy faster, build better.
          </p>
        </div>
      </footer>
    </div>
  )
}
