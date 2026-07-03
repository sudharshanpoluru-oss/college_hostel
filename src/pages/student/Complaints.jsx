import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentComplaints() {
  const [complaints, setComplaints] = useState([]); const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ title: '', category: '', description: '' });
  const load = () => { api.get('/student/complaints').then(r => setComplaints(r.data)); };
  useEffect(() => { load(); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/student/complaints', form); setShowForm(false); setForm({ title: '', category: '', description: '' }); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">My Complaints</h4><button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>New Complaint</button></div>
      {showForm && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="mb-2"><input className="form-control" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="mb-2"><input className="form-control" placeholder="Category (optional)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div className="mb-2"><textarea className="form-control" rows="3" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required></textarea></div>
          <button className="btn btn-primary btn-sm">Submit</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      </div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Response</th><th>Date</th></tr></thead>
        <tbody>{complaints.map(c => <tr key={c.id}>
          <td>{c.title}</td><td>{c.category || '-'}</td>
          <td><span className={`badge bg-${c.status === 'Resolved' ? 'success' : c.status === 'Pending' ? 'warning' : 'info'}`}>{c.status}</span></td>
          <td>{c.admin_response || '-'}</td>
          <td>{c.created_at?.split(' ')[0]}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
