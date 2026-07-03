import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Notices() {
  const [data, setData] = useState({ notices: [], total: 0 }); const [page, setPage] = useState(1); const [showAdd, setShowAdd] = useState(false); const [editId, setEditId] = useState(null); const [form, setForm] = useState({ title: '', content: '', priority: 'Normal', publish_date: new Date().toISOString().split('T')[0], expiry_date: '' });
  const load = () => { api.get('/admin/notices', { params: { page } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page]);
  const handleSubmit = async (e) => { e.preventDefault();
    try { if (editId) { await api.put(`/admin/notices/${editId}`, { ...form, status: 1 }); } else { await api.post('/admin/notices', form); } setShowAdd(false); setEditId(null); load(); } catch (e) { alert('Error'); } };
  const handleEdit = (n) => { setForm(n); setEditId(n.id); setShowAdd(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/notices/${id}`); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Notices</h4><button className="btn btn-primary btn-sm" onClick={() => { setForm({ title: '', content: '', priority: 'Normal', publish_date: new Date().toISOString().split('T')[0], expiry_date: '' }); setEditId(null); setShowAdd(true); }}><i className="bi bi-plus"></i> Add</button></div>
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="col-md-3"><select className="form-select form-select-sm" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option>Normal</option><option>Urgent</option><option>Critical</option></select></div>
          <div className="col-md-3"><input className="form-control form-control-sm" type="date" value={form.publish_date} onChange={e => setForm({...form, publish_date: e.target.value})} /></div>
          <div className="col-12"><textarea className="form-control form-control-sm" rows="3" placeholder="Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required></textarea></div>
          <div className="col-12"><button className="btn btn-primary btn-sm">{editId ? 'Update' : 'Add'}</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button></div>
        </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Title</th><th>Priority</th><th>Published</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{data.notices.map(n => <tr key={n.id}>
          <td>{n.title}</td><td><span className={`badge bg-${n.priority === 'Critical' ? 'danger' : n.priority === 'Urgent' ? 'warning' : 'info'}`}>{n.priority}</span></td>
          <td>{n.publish_date}</td><td>{n.expiry_date || '-'}</td><td>{n.status ? <span className="badge bg-success">Active</span> : <span className="badge bg-secondary">Inactive</span>}</td>
          <td><button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(n)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(n.id)}><i className="bi bi-trash"></i></button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
