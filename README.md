# ReporteVecino

App ciudadana de reportes de problemas urbanos con seguimiento transparente.

**Objetivo:** Permitir que los vecinos reporten baches, luminarias, basura, veredas y otros problemas de infraestructura, y puedan seguir el estado de cada reclamo de forma clara y pública.

Esta herramienta está pensada para regalarse a municipios. Es gratuita, de código abierto y orientada al impacto social.

## Características del MVP

- Crear reporte con foto + ubicación GPS + categoría
- Mapa público con todos los reportes
- Seguimiento de estados (Recibido → En revisión → En proceso → Resuelto)
- Historial de cambios
- Panel de administración simple
- PWA instalable (funciona como app en el celular)
- Funcionamiento parcial offline

## Stack técnico

**Frontend**
- Vite + React + TypeScript
- Leaflet (mapas)
- vite-plugin-pwa

**Backend**
- Node.js + Express
- PostgreSQL + PostGIS (recomendado) o SQLite para desarrollo
- Multer (subida de fotos)

## Estructura del proyecto

```
reporte-vecino/
├── frontend/          # App React (PWA)
├── backend/           # API
├── docs/              # Documentación
└── README.md
```

## Cómo empezar (desarrollo local)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Base de datos
Ver instrucciones en `docs/database.md`.

## Roadmap resumido

1. MVP funcional (reporte + mapa + estados)
2. Prueba piloto con vecinos de un barrio
3. QA y estabilización
4. Documentación + panel admin mejorado
5. Entrega al municipio

## Licencia

MIT (o la que elijas). Pensada para ser libremente usada y mejorada por municipios y ciudadanos.

## Contacto / Contribuciones

Abrí un issue o un pull request. Toda mejora orientada a usabilidad y transparencia es bienvenida.
