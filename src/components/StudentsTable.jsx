import { Pencil, Trash2, Users } from 'lucide-react'

export default function StudentsTable({ estudiantes, onEdit, onDelete }) {
  if (estudiantes.length === 0) {
    return (
      <div className="panel">
        <div className="empty-state">
          <Users size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
          <div>Todavía no hay estudiantes registrados.</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Usa "Nuevo estudiante" para agregar el primero.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-title">Estudiantes registrados</div>
      <div className="panel-sub">{estudiantes.length} en total</div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Código</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map(e => (
            <tr key={e.id}>
              <td>{e.nombre}</td>
              <td>{e.email}</td>
              <td><span className="pill">{e.codigo}</span></td>
              <td>
                <div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                  <button className="icon-btn" onClick={() => onEdit(e)} aria-label="Editar">
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn danger" onClick={() => onDelete(e)} aria-label="Eliminar">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
