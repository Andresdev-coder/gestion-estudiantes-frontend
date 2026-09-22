import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Plus, Search, BookOpen, Users, GraduationCap, Mail, Pencil, Trash2, X, Moon, Sun } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import StatCards from './components/StatCards.jsx'
import ChartsSection from './components/ChartsSection.jsx'
import StudentsTable from './components/StudentsTable.jsx'
import StudentModal from './components/StudentModal.jsx'
import { estudiantesApi, cursosApi } from './api.js'

const navItems = ['Dashboard', 'Estudiantes', 'Cursos', 'Configuración']
const courseEmpty = { nombre: '', codigo: '', creditos: 3, cupoMaximo: 30, docente: '' }

function errorMessage(error, action) {
  if (error?.response) {
    const detail = error.response.data?.message
    if (error.response.status === 404 && action.includes('cursos')) return 'Render aún no tiene publicada la ruta /api/v1/cursos. Despliega la versión actualizada del backend.'
    return detail || `No se pudo ${action} (error ${error.response.status}).`
  }
  if (error?.code === 'ECONNABORTED') return 'Render tardó demasiado en responder. Intenta de nuevo en unos segundos.'
  return 'No se pudo alcanzar la API de Render. Verifica que el servicio esté activo y que CORS esté habilitado.'
}

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [estudiantes, setEstudiantes] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [courseForm, setCourseForm] = useState(courseEmpty)
  const [saving, setSaving] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('gestion-theme') === 'dark')

  useEffect(() => { cargar() }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    localStorage.setItem('gestion-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])
  async function cargar() {
    setLoading(true)
    const [studentsResult, coursesResult] = await Promise.allSettled([estudiantesApi.listar(), cursosApi.listar()])
    if (studentsResult.status === 'fulfilled') setEstudiantes(studentsResult.value)
    else toast.error(errorMessage(studentsResult.reason, 'cargar estudiantes'))
    if (coursesResult.status === 'fulfilled') setCursos(coursesResult.value)
    else { setCursos([]); toast.error(errorMessage(coursesResult.reason, 'cargar cursos')) }
    setLoading(false)
  }
  function abrirNuevo() { setEditing(null); setCourseForm(courseEmpty); setModalOpen(true) }
  function abrirEditar(item) { setEditing(item); setCourseForm(item); setModalOpen(true) }
  async function guardarEstudiante(form) {
    setSaving(true)
    try {
      if (editing) { const updated = await estudiantesApi.actualizar(editing.id, form); setEstudiantes(xs => xs.map(x => x.id === editing.id ? updated : x)); toast.success('Estudiante actualizado') }
      else { const created = await estudiantesApi.crear(form); setEstudiantes(xs => [...xs, created]); toast.success('Estudiante registrado') }
      setModalOpen(false)
    } catch (e) { toast.error(errorMessage(e, 'guardar el estudiante')) }
    finally { setSaving(false) }
  }
  async function guardarCurso(e) {
    e.preventDefault(); setSaving(true)
    try {
      const saved = editing ? await cursosApi.actualizar(editing.id, courseForm) : await cursosApi.crear(courseForm)
      setCursos(xs => editing ? xs.map(x => x.id === editing.id ? saved : x) : [...xs, saved])
      setModalOpen(false); toast.success(editing ? 'Curso actualizado' : 'Curso creado')
    } catch (err) { toast.error(errorMessage(err, 'guardar el curso')) }
    finally { setSaving(false) }
  }
  async function eliminar(item, type) {
    if (!window.confirm(`¿Eliminar ${type === 'curso' ? 'el curso' : 'a'} ${item.nombre}?`)) return
    try {
      if (type === 'curso') { await cursosApi.eliminar(item.id); setCursos(xs => xs.filter(x => x.id !== item.id)) }
      else { await estudiantesApi.eliminar(item.id); setEstudiantes(xs => xs.filter(x => x.id !== item.id)) }
      toast.success(`${type === 'curso' ? 'Curso' : 'Estudiante'} eliminado`)
    } catch (error) { toast.error(errorMessage(error, `eliminar ${type === 'curso' ? 'el curso' : 'el estudiante'}`)) }
  }
  const filteredStudents = estudiantes.filter(e => `${e.nombre} ${e.email} ${e.codigo}`.toLowerCase().includes(query.toLowerCase()))
  const filteredCourses = cursos.filter(c => `${c.nombre} ${c.codigo} ${c.docente || ''}`.toLowerCase().includes(query.toLowerCase()))

  return <div className="app-shell">
    <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: 14 } }} />
    <Sidebar active={page} onNavigate={label => { setPage(label); setQuery('') }} />
    <main className="main">
      <div className="topbar">
        <div><div className="eyebrow">Panel académico</div><h1>{page === 'Dashboard' ? 'Gestión académica' : page}</h1></div>
        {(page === 'Dashboard' || page === 'Estudiantes' || page === 'Cursos') && <button className="btn-primary" onClick={abrirNuevo}><Plus size={16} />{page === 'Cursos' ? 'Nuevo curso' : 'Nuevo estudiante'}</button>}
      </div>
      {loading ? <div className="panel loading-state">Cargando información académica…</div> : <>
        {page === 'Dashboard' && <><StatCards estudiantes={estudiantes} /><ChartsSection estudiantes={estudiantes} /><StudentsTable estudiantes={estudiantes.slice(0, 5)} onEdit={item => { setPage('Estudiantes'); abrirEditar(item) }} onDelete={eliminar} /></>}
        {page === 'Estudiantes' && <>
          <div className="section-intro"><div><h2>Comunidad estudiantil</h2><p>Administra matrículas y datos de contacto desde un solo lugar.</p></div><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre, correo o código" /></div></div>
          <div className="mini-stats"><div className="panel mini-stat"><span className="mini-icon purple"><Users size={18}/></span><div><strong>{estudiantes.length}</strong><small>Estudiantes registrados</small></div></div><div className="panel mini-stat"><span className="mini-icon green"><Mail size={18}/></span><div><strong>{new Set(estudiantes.map(e => e.email?.split('@')[1]).filter(Boolean)).size}</strong><small>Dominios de correo</small></div></div><div className="panel mini-stat"><span className="mini-icon orange"><BookOpen size={18}/></span><div><strong>{cursos.length}</strong><small>Cursos disponibles</small></div></div></div>
          <StudentsTable estudiantes={filteredStudents} onEdit={abrirEditar} onDelete={eliminar} />
        </>}
        {page === 'Cursos' && <>
          <div className="section-intro"><div><h2>Oferta académica</h2><p>Organiza asignaturas, docentes, créditos y cupos disponibles.</p></div><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar curso, código o docente" /></div></div>
          <div className="mini-stats"><div className="panel mini-stat"><span className="mini-icon purple"><BookOpen size={18}/></span><div><strong>{cursos.length}</strong><small>Cursos activos</small></div></div><div className="panel mini-stat"><span className="mini-icon green"><GraduationCap size={18}/></span><div><strong>{cursos.reduce((n, c) => n + Number(c.creditos || 0), 0)}</strong><small>Créditos ofertados</small></div></div><div className="panel mini-stat"><span className="mini-icon orange"><Users size={18}/></span><div><strong>{cursos.reduce((n, c) => n + Number(c.cupoMaximo || 0), 0)}</strong><small>Cupos disponibles</small></div></div></div>
          <div className="panel"><div className="panel-heading"><div><div className="panel-title">Cursos registrados</div><div className="panel-sub">{filteredCourses.length} {filteredCourses.length === 1 ? 'curso' : 'cursos'} en el catálogo</div></div><span className="heading-icon"><BookOpen size={19}/></span></div>
            {filteredCourses.length === 0 ? <div className="empty-state"><BookOpen size={28}/><div>{query ? 'No encontramos cursos con esa búsqueda.' : 'Todavía no hay cursos registrados.'}</div><div className="empty-hint">Crea el primer curso para completar la oferta académica.</div></div> : <div className="table-wrap"><table><thead><tr><th>Curso</th><th>Código</th><th>Docente</th><th>Créditos</th><th>Cupo</th><th style={{textAlign:'right'}}>Acciones</th></tr></thead><tbody>{filteredCourses.map(c => <tr key={c.id}><td><div className="course-name"><span className="course-icon"><BookOpen size={16}/></span><strong>{c.nombre}</strong></div></td><td><span className="pill course-pill">{c.codigo}</span></td><td>{c.docente || <span className="muted">Sin asignar</span>}</td><td>{c.creditos}</td><td><span className="capacity-pill">{c.cupoMaximo} cupos</span></td><td><div className="row-actions" style={{justifyContent:'flex-end'}}><button className="icon-btn" onClick={() => abrirEditar(c)} aria-label="Editar curso"><Pencil size={15}/></button><button className="icon-btn danger" onClick={() => eliminar(c, 'curso')} aria-label="Eliminar curso"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>}
          </div>
        </>}
        {page === 'Configuración' && <>
          <div className="section-intro"><div><h2>Apariencia</h2><p>Elige el tema que prefieres para el panel.</p></div></div>
          <section className="panel theme-setting"><span className="theme-icon">{darkMode ? <Moon size={20}/> : <Sun size={20}/>}</span><div className="theme-copy"><strong>Modo oscuro</strong><span>Reduce el brillo de la interfaz.</span></div><button className={`theme-toggle ${darkMode ? 'enabled' : ''}`} role="switch" aria-checked={darkMode} aria-label="Activar modo oscuro" onClick={() => setDarkMode(value => !value)}><span/></button></section>
        </>}
      </>}
    </main>
    {modalOpen && (page === 'Cursos' ? <div className="modal-backdrop" onClick={() => setModalOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">Oferta académica</span><h2>{editing ? 'Editar curso' : 'Nuevo curso'}</h2></div><button className="icon-btn" onClick={() => setModalOpen(false)} aria-label="Cerrar"><X size={17}/></button></div><form onSubmit={guardarCurso}><div className="field"><label>Nombre del curso</label><input required maxLength="100" value={courseForm.nombre} onChange={e => setCourseForm(f => ({...f, nombre:e.target.value}))} placeholder="Ej. Arquitectura de software" /></div><div className="field"><label>Código del curso</label><input required maxLength="20" value={courseForm.codigo} onChange={e => setCourseForm(f => ({...f, codigo:e.target.value}))} placeholder="Ej. ARQ-301" /></div><div className="form-row"><div className="field"><label>Créditos</label><input required type="number" min="1" max="30" value={courseForm.creditos} onChange={e => setCourseForm(f => ({...f, creditos:e.target.value}))}/></div><div className="field"><label>Cupo máximo</label><input required type="number" min="1" value={courseForm.cupoMaximo} onChange={e => setCourseForm(f => ({...f, cupoMaximo:e.target.value}))}/></div></div><div className="field"><label>Docente</label><input maxLength="100" value={courseForm.docente || ''} onChange={e => setCourseForm(f => ({...f, docente:e.target.value}))} placeholder="Nombre del docente" /></div><div className="modal-actions"><button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancelar</button><button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar curso'}</button></div></form></div></div> : <StudentModal initial={editing} saving={saving} onClose={() => setModalOpen(false)} onSave={guardarEstudiante} />)}
  </div>
}
