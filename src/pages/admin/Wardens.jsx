import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Wardens() {
  const [data, setData] = useState({ wardens: [], total: 0 }); const [page, setPage] = useState(1); const [showAdd, setShowAdd] = useState(false); const [editId, setEditId] = useState(null); const [form, setForm] = useState({ name: '', phone: '', email: '', shift: 'Day', hostel_type: 'boys', username: '', password: '' });
  const load = () => { api.get('/admin/wardens', { params: { page } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page]);
  const handleSubmit = async (e) => { e.preventDefault();
    try { if (editId) { await api.put(`/admin/wardens/${editId}`, form); } else { await api.post('/admin/wardens', form); } setShowAdd(false); setEditId(null); load(); } catch (e) { alert(e.response?.data?.error || 'Error'); } };
  const handleEdit = (w) => { setForm({ name: w.name, phone: w.phone, email: w.email, shift: w.shift, hostel_type: w.hostel_type || 'boys', username: w.username, password: '' }); setEditId(w.id); setShowAdd(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/wardens/${id}`); load(); };
  const toggleStatus = async (id) => { await api.put(`/admin/wardens/${id}/toggle-status`); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Wardens</h4><button className="btn btn-primary btn-sm" onClick={() => { setForm({ name: '', phone: '', email: '', shift: 'Day', hostel_type: 'boys', username: '', password: '' }); setEditId(null); setShowAdd(true); }}><i className="bi bi-plus"></i> Add</button></div>
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editId} /></div>
          <div className="col-md-3"><select className="form-select form-select-sm" value={form.shift} onChange={e => setForm({...form, shift: e.target.value})}><option>Day</option><option>Night</option></select></div>
          <div className="col-md-3"><select className="form-select form-select-sm" value={form.hostel_type} onChange={e => setForm({...form, hostel_type: e.target.value})}><option value="boys">Boys</option><option value="girls">Girls</option></select></div>
          <div className="col-12"><button className="btn btn-primary btn-sm">{editId ? 'Update' : 'Add'}</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button></div>
        </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Name</th><th>Username</th><th>Phone</th><th>Shift</th><th>Hostel</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{data.wardens.map(w => <tr key={w.id}>
          <td>{w.name}</td><td>{w.username}</td><td>{w.phone}</td><td>{w.shift}</td><td>{w.hostel_type}</td>
          <td><span className={`badge bg-${w.status ? 'success' : 'secondary'}`}>{w.status ? 'Active' : 'Inactive'}</span></td>
          <td><button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(w)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-warning me-1" onClick={() => toggleStatus(w.id)}><i className="bi bi-toggle-on"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(w.id)}><i className="bi bi-trash"></i></button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
