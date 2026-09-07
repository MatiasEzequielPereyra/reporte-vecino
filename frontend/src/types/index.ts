export type ReportStatus = 
  | 'recibido' 
  | 'en_revision' 
  | 'en_proceso' 
  | 'resuelto' 
  | 'cerrado' 
  | 'duplicado'

export type ReportCategory = 
  | 'bache'
  | 'luminaria'
  | 'basura'
  | 'vereda'
  | 'semaforo'
  | 'accesibilidad'
  | 'arbol'
  | 'otro'

export interface Report {
  id: string
  category: ReportCategory
  description?: string
  lat: number
  lng: number
  photoUrl?: string
  status: ReportStatus
  createdAt: string
  updatedAt: string
  trackingCode?: string
}

export interface StatusHistoryItem {
  id: string
  reportId: string
  status: ReportStatus
  comment?: string
  changedAt: string
  changedBy?: string
}

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  bache: 'Bache / Calle en mal estado',
  luminaria: 'Luminaria apagada o rota',
  basura: 'Basura acumulada',
  vereda: 'Vereda rota o peligrosa',
  semaforo: 'Semáforo',
  accesibilidad: 'Problema de accesibilidad',
  arbol: 'Árbol caído o peligroso',
  otro: 'Otro'
}

export const STATUS_LABELS: Record<ReportStatus, string> = {
  recibido: 'Recibido',
  en_revision: 'En revisión',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
  duplicado: 'Duplicado'
}

export const STATUS_COLORS: Record<ReportStatus, string> = {
  recibido: '#f59e0b',
  en_revision: '#3b82f6',
  en_proceso: '#8b5cf6',
  resuelto: '#22c55e',
  cerrado: '#6b7280',
  duplicado: '#ef4444'
}
