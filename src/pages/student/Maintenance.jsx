import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentMaintenance() {
  const [requests, setRequests] = useState([]); const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ category: 'Electrical', description: '', priority: 'Medium' });
  const load = () => { api.get('/student/maintenance').then(r => setRequests(r.data)); };
  useEffect(() => { load(); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/student/maintenance', form); setShowForm(false); setForm({ category: 'Electrical', description: '', priority: 'Medium' }); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Maintenance Requests</h4><button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>New Request</button></div>
      {showForm && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-4"><select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>Electrical</option><option>Plumbing</option><option>Furniture</option><option>Carpentry</option><option>Internet</option><option>Cleaning</option><option>Other</option></select></div>
          <div className="col-md-4"><select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option>Low</option><option>Medium</option><option>High</option><option>Emergency</option></select></div>
          <div className="col-md-4"><button className="btn btn-primary w-100">Submit</button></div>
          <div className="col-12"><textarea className="form-control" rows="2" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required></textarea></div>
        </div></form>
      </div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Category</th><th>Description</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{requests.map(r => <tr key={r.id}>
          <td>{r.category}</td><td>{r.description?.substring(0, 50)}</td>
          <td><span className={`badge bg-${r.priority === 'Emergency' ? 'danger' : r.priority === 'High' ? 'warning' : 'info'}`}>{r.priority}</span></td>
          <td><span className={`badge bg-${r.status === 'Resolved' ? 'success' : r.status === 'Pending' ? 'warning' : 'info'}`}>{r.status}</span></td>
          <td>{r.created_at?.split(' ')[0]}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
