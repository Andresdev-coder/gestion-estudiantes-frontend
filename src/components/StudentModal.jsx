import { useState, useEffect } from 'react'

export default function StudentModal({ initial, onClose, onSave, saving }) {
  const [form, setForm] = useState({ nombre: '', email: '', codigo: '' })

  useEffect(() => {
    setForm(initial ? { nombre: initial.nombre || '', email: initial.email || '', codigo: initial.codigo || '' } : { nombre: '', email: '', codigo: '' })
  }, [initial])

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{initial ? 'Editar estudiante' : 'Nuevo estudiante'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre completo</label>
            <input
              required
              value={form.nombre}
              onChange={e => update('nombre', e.target.value)}
              placeholder="Ej. Camila Rojas"
            />
          </div>
          <div className="field">
            <label>Correo</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="camila.rojas@universidad.edu"
            />
          </div>
          <div className="field">
            <label>Código de estudiante</label>
            <input
              required
              value={form.codigo}
              onChange={e => update('codigo', e.target.value)}
              placeholder="Ej. ING2026034"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
