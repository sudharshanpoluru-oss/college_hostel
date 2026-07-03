import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenComplaints() {
  const [complaints, setComplaints] = useState([]); const [viewId, setViewId] = useState(null); const [detail, setDetail] = useState(null);
  const load = () => { api.get('/warden/complaints').then(r => setComplaints(r.data)); };
  useEffect(() => { load(); }, []);
  const viewDetail = async (id) => { const [c] = complaints.filter(x => x.id === id); setDetail(c); setViewId(id); };
  const updateStatus = async (status) => { const remark = prompt('Response:'); await api.put(`/warden/complaints/${viewId}`, { status, admin_response: remark }); setViewId(null); load(); };
  return (
    <div>
      <h4 className="fw-bold mb-3">Complaints</h4>
      {viewId && detail && <div className="card mb-3"><div className="card-body">
        <h5>{detail.title}</h5><p><strong>By:</strong> {detail.student_name}</p><p>{detail.description}</p>
        <div className="d-flex gap-2"><button className="btn btn-success btn-sm" onClick={() => updateStatus('Resolved')}>Resolve</button><button className="btn btn-info btn-sm" onClick={() => updateStatus('Working')}>Working</button><button className="btn btn-secondary btn-sm" onClick={() => setViewId(null)}>Back</button></div>
      </div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Student</th><th>Title</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{complaints.map(c => <tr key={c.id}><td>{c.student_name}</td><td>{c.title}</td><td><span className={`badge bg-${c.status === 'Resolved' ? 'success' : 'warning'}`}>{c.status}</span></td><td><button className="btn btn-sm btn-outline-primary" onClick={() => viewDetail(c.id)}>View</button></td></tr>)}</tbody></table></div></div>
    </div>
  );
}
