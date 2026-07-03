import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenNotices() {
  const [notices, setNotices] = useState([]); const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ title: '', content: '', priority: 'Normal' });
  const load = () => { api.get('/warden/notices').then(r => setNotices(r.data)); };
  useEffect(() => { load(); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/warden/notices', form); setShowForm(false); setForm({ title: '', content: '', priority: 'Normal' }); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Notices</h4><button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Add Notice</button></div>
      {showForm && <div className="card mb-3"><div className="card-body"><form onSubmit={handleSubmit}><div className="row g-2"><div className="col-md-6"><input className="form-control form-control-sm" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div><div className="col-md-3"><select className="form-select form-select-sm" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option>Normal</option><option>Urgent</option></select></div><div className="col-md-3"><button className="btn btn-primary btn-sm w-100">Post</button></div><div className="col-12"><textarea className="form-control form-control-sm" rows="2" placeholder="Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required></textarea></div></div></form></div></div>}
      <div className="list-group">{notices.map(n => <div key={n.id} className="list-group-item"><h6 className="fw-bold mb-1">{n.title}</h6><p className="mb-1 small">{n.content}</p><small className="text-muted">{n.publish_date}</small></div>)}</div>
    </div>
  );
}
