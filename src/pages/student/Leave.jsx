import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentLeave() {
  const [leaves, setLeaves] = useState([]); const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ from_date: '', to_date: '', reason: '' });
  const load = () => { api.get('/student/leaves').then(r => setLeaves(r.data)); };
  useEffect(() => { load(); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/student/leaves', form); setShowForm(false); setForm({ from_date: '', to_date: '', reason: '' }); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">My Leaves</h4><button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Apply Leave</button></div>
      {showForm && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-4"><label className="form-label">From</label><input className="form-control" type="date" value={form.from_date} onChange={e => setForm({...form, from_date: e.target.value})} required /></div>
          <div className="col-md-4"><label className="form-label">To</label><input className="form-control" type="date" value={form.to_date} onChange={e => setForm({...form, to_date: e.target.value})} required /></div>
          <div className="col-md-4"><label className="form-label">&nbsp;</label><button className="btn btn-primary w-100">Apply</button></div>
          <div className="col-12"><textarea className="form-control" rows="2" placeholder="Reason" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required></textarea></div>
        </div></form>
      </div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Remark</th></tr></thead>
        <tbody>{leaves.map(l => <tr key={l.id}>
          <td>{l.from_date?.split('T')[0] || l.from_date}</td><td>{l.to_date?.split('T')[0] || l.to_date}</td><td>{l.reason}</td>
          <td><span className={`badge bg-${l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}`}>{l.status}</span></td>
          <td>{l.admin_remark || '-'}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
