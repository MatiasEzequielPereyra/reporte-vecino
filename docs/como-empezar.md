# Cómo empezar a desarrollar

## Requisitos

- Node.js 18 o superior
- npm o pnpm
- (Opcional) PostgreSQL para más adelante

## Instalación

```bash
# Clonar el repo (cuando esté en GitHub)
git clone <url-del-repo>
cd reporte-vecino

# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# En otra terminal - Frontend
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:3001

## Flujo de trabajo recomendado

1. Trabajar primero el frontend con datos mock (ya está así).
2. Conectar el frontend al backend real.
3. Agregar base de datos cuando el flujo funcione.
4. Mejorar el panel de administración.
5. Hacer pruebas con gente real de un barrio.

## Estructura de carpetas importante

- `frontend/src/pages/` → pantallas principales
- `frontend/src/components/` → componentes reutilizables
- `frontend/src/types/` → tipos TypeScript
- `backend/src/routes/` → endpoints de la API
- `docs/` → documentación del proyecto
