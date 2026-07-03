import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenLeaves() {
  const [leaves, setLeaves] = useState([]); const [viewId, setViewId] = useState(null); const [detail, setDetail] = useState(null);
  const load = () => { api.get('/warden/leaves').then(r => setLeaves(r.data)); };
  useEffect(() => { load(); }, []);
  const viewDetail = (id) => { setDetail(leaves.find(l => l.id === id)); setViewId(id); };
  const updateStatus = async (status) => { const remark = prompt('Remark:'); await api.put(`/warden/leaves/${viewId}`, { status, remark }); setViewId(null); load(); };
  return (
    <div>
      <h4 className="fw-bold mb-3">Leave Requests</h4>
      {viewId && detail && <div className="card mb-3"><div className="card-body"><h5>{detail.student_name}</h5><p>{detail.from_date?.split('T')[0] || detail.from_date} to {detail.to_date?.split('T')[0] || detail.to_date}<br />{detail.reason}</p><div className="d-flex gap-2"><button className="btn btn-success btn-sm" onClick={() => updateStatus('Approved')}>Approve</button><button className="btn btn-danger btn-sm" onClick={() => updateStatus('Rejected')}>Reject</button><button className="btn btn-secondary btn-sm" onClick={() => setViewId(null)}>Back</button></div></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0"><thead><tr><th>Student</th><th>From</th><th>To</th><th>Status</th><th>Action</th></tr></thead><tbody>{leaves.map(l => <tr key={l.id}><td>{l.student_name}</td><td>{l.from_date?.split('T')[0] || l.from_date}</td><td>{l.to_date?.split('T')[0] || l.to_date}</td><td><span className={`badge bg-${l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}`}>{l.status}</span></td><td><button className="btn btn-sm btn-outline-primary" onClick={() => viewDetail(l.id)}>Review</button></td></tr>)}</tbody></table></div></div>
    </div>
  );
}
