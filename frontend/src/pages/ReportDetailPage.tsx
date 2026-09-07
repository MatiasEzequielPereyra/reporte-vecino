import { useParams, Link } from 'react-router-dom'
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../types'

// Mock por ahora
const MOCK = {
  id: '1',
  category: 'bache' as const,
  description: 'Bache grande en la esquina, peligroso',
  lat: -34.6037,
  lng: -58.3816,
  status: 'en_proceso' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  history: [
    { status: 'recibido', changedAt: new Date(Date.now() - 86400000 * 2).toISOString(), comment: 'Reporte recibido' },
    { status: 'en_revision', changedAt: new Date(Date.now() - 86400000).toISOString(), comment: 'Derivado a Obras' },
    { status: 'en_proceso', changedAt: new Date().toISOString(), comment: 'Cuadrilla asignada' }
  ]
}

export default function ReportDetailPage() {
  const { id } = useParams()
  const report = MOCK // TODO: fetch real

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <Link to="/" style={{ fontSize: 14, marginBottom: 16, display: 'inline-block' }}>
        ← Volver al mapa
      </Link>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 600,
          background: STATUS_COLORS[report.status] + '22',
          color: STATUS_COLORS[report.status],
          marginBottom: 12
        }}>
          {STATUS_LABELS[report.status]}
        </div>

        <h1 style={{ fontSize: 20, marginBottom: 8 }}>
          {CATEGORY_LABELS[report.category]}
        </h1>

        {report.description && (
          <p style={{ color: 'var(--gray-700)', marginBottom: 12 }}>
            {report.description}
          </p>
        )}

        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          Reportado el {new Date(report.createdAt).toLocaleDateString('es-AR')}
        </p>
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Historial de seguimiento</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {report.history.map((item, idx) => (
          <div key={idx} className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS]}
            </div>
            {item.comment && (
              <p style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 4 }}>
                {item.comment}
              </p>
            )}
            <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>
              {new Date(item.changedAt).toLocaleString('es-AR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
