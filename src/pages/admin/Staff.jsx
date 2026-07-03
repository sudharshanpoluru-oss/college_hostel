import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Staff() {
  const [items, setItems] = useState([]); const [showAdd, setShowAdd] = useState(false); const [editId, setEditId] = useState(null); const [form, setForm] = useState({ name: '', designation: '', description: '', icon: 'bi bi-person-badge', sort_order: 0 });
  const load = () => { api.get('/admin/staff').then(r => setItems(r.data)); };
  useEffect(() => { load(); }, []);
  const handleSubmit = async (e) => { e.preventDefault();
    if (editId) { await api.put(`/admin/staff/${editId}`, form); } else { await api.post('/admin/staff', form); } setShowAdd(false); setEditId(null); load(); };
  const handleEdit = (s) => { setForm(s); setEditId(s.id); setShowAdd(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/staff/${id}`); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Management Staff</h4><button className="btn btn-primary btn-sm" onClick={() => { setForm({ name: '', designation: '', description: '', icon: 'bi bi-person-badge', sort_order: 0 }); setEditId(null); setShowAdd(true); }}><i className="bi bi-plus"></i> Add</button></div>
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Designation" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} required /></div>
          <div className="col-md-2"><input className="form-control form-control-sm" placeholder="Icon class" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} /></div>
          <div className="col-md-2"><input className="form-control form-control-sm" type="number" placeholder="Sort order" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} /></div>
          <div className="col-12"><input className="form-control form-control-sm" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="col-12"><button className="btn btn-primary btn-sm">{editId ? 'Update' : 'Add'}</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button></div>
        </div></form></div></div>}
      <div className="row g-3">{items.map((s, i) => <div className="col-md-4" key={s.id}>
        <div className="card text-center h-100"><div className="card-body">
          <i className={`${s.icon} text-primary`} style={{ fontSize: '2rem' }}></i>
          <h6 className="mt-2 fw-bold">{s.name}</h6>
          <small className="text-muted d-block">{s.designation}</small>
          <small className="text-muted">{s.description}</small>
          <div className="mt-2"><button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(s)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}><i className="bi bi-trash"></i></button></div>
        </div></div>
      </div>)}</div>
    </div>
  );
}
