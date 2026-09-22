import axios from 'axios'

// La URL base viene de una variable de entorno (Vite la expone como import.meta.env.VITE_*).
// En desarrollo, crea un archivo .env con: VITE_API_URL=https://gestion-estudiantes-hclw.onrender.com/api/v1
const BASE_URL = import.meta.env.VITE_API_URL || 'https://gestion-estudiantes-hclw.onrender.com/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
})

export const estudiantesApi = {
  listar: () => api.get('/estudiantes').then(r => r.data),
  crear: (estudiante) => api.post('/estudiantes', estudiante).then(r => r.data),
  buscar: (id) => api.get(`/estudiantes/${id}`).then(r => r.data),
  actualizar: (id, estudiante) => api.put(`/estudiantes/${id}`, estudiante).then(r => r.data),
  eliminar: (id) => api.delete(`/estudiantes/${id}`)
}

export const cursosApi = {
  listar: () => api.get('/cursos').then(r => r.data),
  crear: (curso) => api.post('/cursos', curso).then(r => r.data),
  actualizar: (id, curso) => api.put(`/cursos/${id}`, curso).then(r => r.data),
  eliminar: (id) => api.delete(`/cursos/${id}`)
}

export default api
