import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Events() {
  const [data, setData] = useState({ events: [], total: 0 }); const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [showAdd, setShowAdd] = useState(false); const [editId, setEditId] = useState(null); const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '', location: '' });
  const load = () => { api.get('/admin/events', { params: { page, search } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page, search]);
  const handleSubmit = async (e) => { e.preventDefault();
    try { if (editId) { await api.put(`/admin/events/${editId}`, { ...form, status: 1 }); } else { await api.post('/admin/events', form); } setShowAdd(false); setEditId(null); load(); } catch (e) { alert('Error'); } };
  const handleEdit = (ev) => { setForm({ title: ev.title, description: ev.description, event_date: ev.event_date, event_time: ev.event_time, location: ev.location }); setEditId(ev.id); setShowAdd(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/events/${id}`); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Events</h4><button className="btn btn-primary btn-sm" onClick={() => { setForm({ title: '', description: '', event_date: '', event_time: '', location: '' }); setEditId(null); setShowAdd(true); }}><i className="bi bi-plus"></i> Add</button></div>
      <input className="form-control mb-3" style={{ width: 300 }} placeholder="Search events..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" type="date" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} /></div>
          <div className="col-md-2"><input className="form-control form-control-sm" type="time" value={form.event_time} onChange={e => setForm({...form, event_time: e.target.value})} /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
          <div className="col-12"><textarea className="form-control form-control-sm" rows="2" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea></div>
          <div className="col-12"><button className="btn btn-primary btn-sm">{editId ? 'Update' : 'Add'}</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button></div>
        </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Title</th><th>Date</th><th>Time</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{data.events.map(ev => <tr key={ev.id}>
          <td>{ev.title}</td><td>{ev.event_date}</td><td>{ev.event_time || '-'}</td><td>{ev.location || '-'}</td>
          <td><span className={`badge bg-${ev.status ? 'success' : 'secondary'}`}>{ev.status ? 'Active' : 'Inactive'}</span></td>
          <td><button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(ev)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ev.id)}><i className="bi bi-trash"></i></button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
