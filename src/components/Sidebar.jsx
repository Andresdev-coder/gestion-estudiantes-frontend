import { LayoutDashboard, Users, GraduationCap, Settings, LogOut } from 'lucide-react'

const items = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Estudiantes' },
  { icon: GraduationCap, label: 'Cursos' },
  { icon: Settings, label: 'Configuración' }
]

export default function Sidebar({ active = 'Dashboard', onNavigate = () => {} }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">GE</div>
        <div>
          <div className="brand-name">Gestión de Estudiantes</div>
          <div className="brand-sub">Panel académico</div>
        </div>
      </div>

      {items.map(({ icon: Icon, label }) => (
        <button key={label} onClick={() => onNavigate(label)} className={`nav-item ${active === label ? 'active' : ''}`}>
          <Icon size={17} />
          {label}
        </button>
      ))}

      <div style={{ marginTop: 'auto' }}>
        <button className="nav-item">
          <LogOut size={17} />
          Salir
        </button>
      </div>
    </aside>
  )
}
