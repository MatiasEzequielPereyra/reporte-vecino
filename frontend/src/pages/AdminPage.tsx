import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Report,
  ReportStatus,
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS
} from '../types'
import { getReports, updateReportStatus } from '../lib/api'

const ALL_STATUSES: ReportStatus[] = [
  'recibido',
  'en_revision',
  'en_proceso',
  'resuelto',
  'cerrado',
  'duplicado'
]

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<ReportStatus | 'todos'>('todos')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [newStatus, setNewStatus] = useState<ReportStatus>('en_revision')
  const [comment, setComment] = useState('')

  const loadReports = () => {
    setLoading(true)
    getReports()
      .then(setReports)
      .catch(() => setError('No se pudieron cargar los reportes'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReports()
  }, [])

  const filtered =
    filter === 'todos'
      ? reports
      : reports.filter((r) => r.status === filter)

  const openUpdate = (report: Report) => {
    setSelectedReport(report)
    setNewStatus(report.status === 'recibido' ? 'en_revision' : report.status)
    setComment('')
  }

  const handleUpdate = async () => {
    if (!selectedReport) return
    setUpdatingId(selectedReport.id)
    try {
      await updateReportStatus(selectedReport.id, newStatus, comment || undefined)
      setSelectedReport(null)
      loadReports()
    } catch {
      alert('Error al actualizar el estado')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
        Cargando reportes...
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</p>
        <button className="btn btn-primary" onClick={loadReports}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22 }}>Panel de administración</h1>
        <Link to="/" style={{ fontSize: 14 }}>← Mapa</Link>
      </div>

      <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 16 }}>
        {reports.length} reporte{reports.length !== 1 ? 's' : ''} en total
      </p>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          className="btn"
          style={{
            padding: '6px 12px',
            fontSize: 13,
            background: filter === 'todos' ? 'var(--primary)' : 'var(--gray-200)',
            color: filter === 'todos' ? 'white' : 'var(--gray-700)'
          }}
          onClick={() => setFilter('todos')}
        >
          Todos
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            className="btn"
            style={{
              padding: '6px 12px',
              fontSize: 13,
              background: filter === s ? STATUS_COLORS[s] : 'var(--gray-200)',
              color: filter === s ? 'white' : 'var(--gray-700)'
            }}
            onClick={() => setFilter(s)}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Lista de reportes */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 40 }}>
          No hay reportes con este filtro.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((report) => (
            <div key={report.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    background: STATUS_COLORS[report.status] + '22',
                    color: STATUS_COLORS[report.status],
                    marginBottom: 6
                  }}>
                    {STATUS_LABELS[report.status]}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {CATEGORY_LABELS[report.category]}
                  </div>
                  {report.description && (
                    <p style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 4 }}>
                      {report.description}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {new Date(report.createdAt).toLocaleString('es-AR')}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 12px', fontSize: 13, whiteSpace: 'nowrap' }}
                  onClick={() => openUpdate(report)}
                >
                  Cambiar estado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal simple de actualización */}
      {selectedReport && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 2000,
          padding: 16
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 420, padding: 20 }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>
              Actualizar reporte
            </h2>
            <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 16 }}>
              {CATEGORY_LABELS[selectedReport.category]}
            </p>

            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
              Nuevo estado
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--gray-300)',
                marginBottom: 14,
                background: 'white'
              }}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>

            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ej: Derivado a cuadrilla de Obras"
              rows={2}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--gray-300)',
                marginBottom: 16,
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setSelectedReport(null)}
                disabled={!!updatingId}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleUpdate}
                disabled={!!updatingId}
              >
                {updatingId ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
