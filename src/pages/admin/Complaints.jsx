import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Complaints() {
  const [data, setData] = useState({ complaints: [], total: 0 }); const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState(null); const [detail, setDetail] = useState(null);
  const load = () => { api.get('/admin/complaints', { params: { page } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page]);
  const viewDetail = async (id) => { const r = await api.get(`/admin/complaints/${id}`); setDetail(r.data); setViewId(id); };
  const updateStatus = async (status, remark) => { await api.put(`/admin/complaints/${viewId}/status`, { status, remark }); viewDetail(viewId); load(); };
  const statusBadge = (s) => `badge bg-${s === 'Pending' ? 'warning' : s === 'Resolved' || s === 'Closed' ? 'success' : s === 'Rejected' ? 'danger' : 'info'}`;
  return (
    <div>
      <h4 className="fw-bold mb-3">Complaints</h4>
      {viewId && detail && <div className="card mb-3"><div className="card-body">
        <div className="d-flex justify-content-between"><h5>{detail.complaint.title}</h5><span className={statusBadge(detail.complaint.status)}>{detail.complaint.status}</span></div>
        <p><strong>By:</strong> {detail.complaint.student_name} ({detail.complaint.roll_no})</p>
        <p><strong>Category:</strong> {detail.complaint.category || 'General'}</p>
        <p>{detail.complaint.description}</p>
        {detail.complaint.admin_response && <div className="alert alert-info">{detail.complaint.admin_response}</div>}
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-success btn-sm" onClick={() => updateStatus('Resolved by Admin', prompt('Resolution notes:'))}>Resolve</button>
          <button className="btn btn-info btn-sm" onClick={() => updateStatus('Under Admin Review', '')}>Under Review</button>
          <button className="btn btn-danger btn-sm" onClick={() => updateStatus('Rejected', prompt('Rejection reason:'))}>Reject</button>
          <button className="btn btn-secondary btn-sm" onClick={() => updateStatus('Closed', '')}>Close</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setViewId(null)}>Back</button>
        </div>
        {detail.logs.length > 0 && <div className="mt-3"><h6>Activity Log</h6>{detail.logs.map(l => <small key={l.id} className="d-block text-muted">{l.created_at} - {l.action} by {l.username || 'system'}{l.remarks ? ': ' + l.remarks : ''}</small>)}</div>}
      </div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>#</th><th>Student</th><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>{data.complaints.map((c, i) => <tr key={c.id}>
          <td>{i+1}</td><td>{c.student_name}<br /><small>{c.roll_no}</small></td><td>{c.title}</td><td>{c.category || '-'}</td>
          <td><span className={statusBadge(c.status)}>{c.status}</span></td><td>{c.created_at?.split(' ')[0]}</td>
          <td><button className="btn btn-sm btn-outline-primary" onClick={() => viewDetail(c.id)}>View</button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
