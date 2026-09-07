import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isNew = location.pathname === '/nuevo'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid var(--gray-200)',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--gray-900)' }}>
          ReporteVecino
        </Link>
        {!isNew && (
          <Link to="/nuevo" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 14 }}>
            + Nuevo reporte
          </Link>
        )}
      </header>

      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>

      {/* Bottom nav simple */}
      <nav style={{
        background: 'white',
        borderTop: '1px solid var(--gray-200)',
        padding: '8px 0',
        display: 'flex',
        justifyContent: 'space-around',
        position: 'sticky',
        bottom: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: 12,
          color: isHome ? 'var(--primary)' : 'var(--gray-500)',
          padding: '4px 12px'
        }}>
          <span style={{ fontSize: 20 }}>🗺️</span>
          Mapa
        </Link>
        <Link to="/nuevo" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: 12,
          color: isNew ? 'var(--primary)' : 'var(--gray-500)',
          padding: '4px 12px'
        }}>
          <span style={{ fontSize: 20 }}>📷</span>
          Reportar
        </Link>
      </nav>
    </div>
  )
}
