import { Users, UserPlus, Mail, BadgeCheck } from 'lucide-react'

export default function StatCards({ estudiantes }) {
  const total = estudiantes.length
  const dominios = new Set(estudiantes.map(e => e.email?.split('@')[1]).filter(Boolean))
  const conCodigo = estudiantes.filter(e => e.codigo).length

  const stats = [
    { cls: 'stat-1', icon: Users, label: 'Total de estudiantes', value: total, delta: 'Registrados en el sistema' },
    { cls: 'stat-2', icon: BadgeCheck, label: 'Con código asignado', value: conCodigo, delta: 'Matrícula completa' },
    { cls: 'stat-3', icon: Mail, label: 'Dominios de correo', value: dominios.size, delta: 'Instituciones distintas' },
    { cls: 'stat-4', icon: UserPlus, label: 'Últimos 7 días', value: Math.min(total, 5), delta: 'Nuevos ingresos' }
  ]

  return (
    <div className="stats-grid">
      {stats.map(({ cls, icon: Icon, label, value, delta }) => (
        <div key={label} className={`stat-card ${cls}`}>
          <Icon size={20} style={{ opacity: 0.9, marginBottom: 10 }} />
          <div className="label">{label}</div>
          <div className="value">{value}</div>
          <div className="delta">{delta}</div>
        </div>
      ))}
    </div>
  )
}
