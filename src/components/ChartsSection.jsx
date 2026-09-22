import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const PIE_COLORS = ['#4338CA', '#D97706', '#059669', '#E11D48', '#0284C7']

export default function ChartsSection({ estudiantes }) {
  // Estudiantes agrupados por inicial del código (ej: prefijo de carrera/cohorte)
  const porPrefijo = Object.values(
    estudiantes.reduce((acc, e) => {
      const prefijo = (e.codigo || '—').slice(0, 3).toUpperCase() || 'N/A'
      acc[prefijo] = acc[prefijo] || { grupo: prefijo, estudiantes: 0 }
      acc[prefijo].estudiantes += 1
      return acc
    }, {})
  )

  const porDominio = Object.values(
    estudiantes.reduce((acc, e) => {
      const dominio = e.email?.split('@')[1] || 'sin dominio'
      acc[dominio] = acc[dominio] || { name: dominio, value: 0 }
      acc[dominio].value += 1
      return acc
    }, {})
  )

  return (
    <div className="charts-grid">
      <div className="panel">
        <div className="panel-title">Estudiantes por grupo de código</div>
        <div className="panel-sub">Agrupados por los primeros caracteres del código de estudiante</div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={porPrefijo.length ? porPrefijo : [{ grupo: 'Sin datos', estudiantes: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5F3" vertical={false} />
            <XAxis dataKey="grupo" tick={{ fontSize: 12, fill: '#5B5779' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#5B5779' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#F6F5FB' }} />
            <Bar dataKey="estudiantes" fill="#4338CA" radius={[8, 8, 0, 0]} maxBarSize={46} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel">
        <div className="panel-title">Dominios de correo</div>
        <div className="panel-sub">Distribución por institución</div>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={porDominio.length ? porDominio : [{ name: 'Sin datos', value: 1 }]}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
            >
              {(porDominio.length ? porDominio : [{ name: 'Sin datos', value: 1 }]).map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
