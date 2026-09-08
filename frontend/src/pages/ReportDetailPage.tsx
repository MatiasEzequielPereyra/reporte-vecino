import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS, Report } from '../types'
import { getReport } from '../lib/api'

interface ReportWithHistory extends Report {
  history?: Array<{
    status: string
    comment?: string
    changedAt: string
  }>
}

export default function ReportDetailPage() {
  const { id } = useParams()
  const [report, setReport] = useState<ReportWithHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getReport(id)
      .then(setReport)
      .catch(() => setError('No se pudo cargar el reporte'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
        Cargando...
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', marginBottom: 16 }}>{error || 'Reporte no encontrado'}</p>
        <Link to="/" className="btn btn-primary">Volver al mapa</Link>
      </div>
    )
  }

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

        {report.photoUrl && (
          <img
            src={report.photoUrl.startsWith('http') ? report.photoUrl : `http://localhost:3001${report.photoUrl}`}
            alt="Foto del reporte"
            style={{
              width: '100%',
              maxHeight: 260,
              objectFit: 'cover',
              borderRadius: 12,
              marginBottom: 12
            }}
          />
        )}

        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          Reportado el {new Date(report.createdAt).toLocaleDateString('es-AR')}
        </p>
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Historial de seguimiento</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(report.history || []).map((item, idx) => (
          <div key={idx} className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status}
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
