import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

function IconMap({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconAdmin({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      {active && <path d="M9 12l2 2 4-4" strokeWidth="2" />}
    </svg>
  )
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isNew = location.pathname === '/nuevo'
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="app-header-title">
          ReporteVecino
        </Link>
        {isAdmin && (
          <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>
            Administración
          </span>
        )}
      </header>

      <main className="app-main">
        {children}
      </main>

      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${isHome ? 'active' : ''}`}>
          <IconMap active={isHome} />
          Mapa
        </Link>

        <div className={`nav-fab-wrap ${isNew ? 'active' : ''}`}>
          <Link to="/nuevo" className="nav-fab" aria-label="Nuevo reporte">
            <IconPlus />
          </Link>
          <span className="nav-fab-label">Reportar</span>
        </div>

        <Link to="/admin" className={`nav-item ${isAdmin ? 'active' : ''}`}>
          <IconAdmin active={isAdmin} />
          Admin
        </Link>
      </nav>
    </div>
  )
}
