import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReportCategory, CATEGORY_LABELS } from '../types'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ReportCategory[]

export default function NewReportPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ReportCategory | ''>('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización')
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
        setLocating(false)
      },
      (err) => {
        setError('No se pudo obtener la ubicación. Activá el GPS e intentá de nuevo.')
        setLocating(false)
        console.error(err)
      },
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) {
      setError('Elegí una categoría')
      return
    }
    if (!location) {
      setError('Necesitamos tu ubicación')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // TODO: enviar al backend real
      // const formData = new FormData()
      // formData.append('category', category)
      // formData.append('description', description)
      // formData.append('lat', String(location.lat))
      // formData.append('lng', String(location.lng))
      // if (photo) formData.append('photo', photo)
      // const res = await fetch('/api/reports', { method: 'POST', body: formData })

      // Simulación
      await new Promise(r => setTimeout(r, 800))
      alert('¡Reporte enviado! (modo demo)')
      navigate('/')
    } catch (err) {
      setError('Error al enviar el reporte. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Nuevo reporte</h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: 24, fontSize: 14 }}>
        Contanos qué problema encontraste. Cuanto más clara la foto y la ubicación, mejor.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Categoría */}
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          ¿Qué problema es?
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ReportCategory)}
          required
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid var(--gray-300)',
            marginBottom: 20,
            background: 'white'
          }}
        >
          <option value="">Elegí una categoría</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>

        {/* Foto */}
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Foto (recomendado)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={() => fileInputRef.current?.click()}
          style={{ marginBottom: 12 }}
        >
          {photo ? 'Cambiar foto' : 'Tomar o elegir foto'}
        </button>
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Vista previa"
            style={{
              width: '100%',
              maxHeight: 220,
              objectFit: 'cover',
              borderRadius: 12,
              marginBottom: 20
            }}
          />
        )}

        {/* Ubicación */}
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Ubicación
        </label>
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={getLocation}
          disabled={locating}
          style={{ marginBottom: 12 }}
        >
          {locating ? 'Obteniendo ubicación...' : location ? '✓ Ubicación obtenida' : 'Usar mi ubicación actual'}
        </button>
        {location && (
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>
            Lat: {location.lat.toFixed(5)} · Lng: {location.lng.toFixed(5)}
          </p>
        )}

        {/* Descripción */}
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Descripción (opcional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Bache profundo frente al kiosco, peligroso para motos..."
          rows={3}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid var(--gray-300)',
            marginBottom: 24,
            resize: 'vertical'
          }}
        />

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#b91c1c',
            padding: '12px 14px',
            borderRadius: 12,
            marginBottom: 16,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? 'Enviando...' : 'Enviar reporte'}
        </button>
      </form>
    </div>
  )
}
