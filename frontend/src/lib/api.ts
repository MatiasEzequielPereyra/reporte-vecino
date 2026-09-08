import { Report, ReportStatus } from '../types'

const API_BASE = '/api'

export async function getReports(): Promise<Report[]> {
  const res = await fetch(`${API_BASE}/reports`)
  if (!res.ok) throw new Error('Error al cargar reportes')
  return res.json()
}

export async function getReport(id: string): Promise<Report & { history?: any[] }> {
  const res = await fetch(`${API_BASE}/reports/${id}`)
  if (!res.ok) throw new Error('Reporte no encontrado')
  return res.json()
}

export async function createReport(data: {
  category: string
  description?: string
  lat: number
  lng: number
  photo?: File | null
}): Promise<Report> {
  const formData = new FormData()
  formData.append('category', data.category)
  if (data.description) formData.append('description', data.description)
  formData.append('lat', String(data.lat))
  formData.append('lng', String(data.lng))
  if (data.photo) formData.append('photo', data.photo)

  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Error al crear el reporte')
  }

  return res.json()
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  comment?: string
): Promise<Report> {
  const res = await fetch(`${API_BASE}/reports/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, comment })
  })

  if (!res.ok) throw new Error('Error al actualizar el estado')
  return res.json()
}
