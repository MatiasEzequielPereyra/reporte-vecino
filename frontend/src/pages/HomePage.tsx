import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { Report, CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../types'
import { getReports } from '../lib/api'

// Fix iconos de Leaflet en Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getReports()
      .then(setReports)
      .catch(() => setError('No se pudieron cargar los reportes'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        Cargando mapa...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: 20 }}>
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>¿Está corriendo el backend en el puerto 3001?</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <MapContainer
        center={[-34.6037, -58.3816]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <Marker key={report.id} position={[report.lat, report.lng]}>
            <Popup>
              <strong>{CATEGORY_LABELS[report.category]}</strong>
              <br />
              <span style={{
                display: 'inline-block',
                marginTop: 4,
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 12,
                background: STATUS_COLORS[report.status] + '22',
                color: STATUS_COLORS[report.status]
              }}>
                {STATUS_LABELS[report.status]}
              </span>
              {report.description && (
                <p style={{ margin: '8px 0 0', fontSize: 13 }}>{report.description}</p>
              )}
              <Link to={`/reporte/${report.id}`} style={{ fontSize: 13, marginTop: 6, display: 'inline-block' }}>
                Ver detalle →
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Contador simple */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 1000,
        background: 'white',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: 'var(--shadow)',
        fontSize: 14,
        fontWeight: 500
      }}>
        {reports.length} reporte{reports.length !== 1 ? 's' : ''} en el mapa
      </div>
    </div>
  )
}
