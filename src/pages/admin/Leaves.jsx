import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Leaves() {
  const [data, setData] = useState({ leaves: [], total: 0 }); const [page, setPage] = useState(1); const [viewId, setViewId] = useState(null); const [detail, setDetail] = useState(null);
  const load = () => { api.get('/admin/leaves', { params: { page } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page]);
  const viewDetail = async (id) => { const r = await api.get(`/admin/leaves/${id}`); setDetail(r.data); setViewId(id); };
  const updateStatus = async (status) => { const remark = prompt('Remark:'); await api.put(`/admin/leaves/${viewId}`, { status, remark }); viewDetail(viewId); load(); };
  return (
    <div>
      <h4 className="fw-bold mb-3">Leaves</h4>
      {viewId && detail && <div className="card mb-3"><div className="card-body">
        <h5>{detail.student_name} ({detail.roll_no})</h5>
        <p><strong>From:</strong> {detail.from_date?.split('T')[0] || detail.from_date} <strong>To:</strong> {detail.to_date?.split('T')[0] || detail.to_date}</p>
        <p><strong>Reason:</strong> {detail.reason}</p>
        <p><strong>Status:</strong> <span className={`badge bg-${detail.status === 'Approved' ? 'success' : detail.status === 'Rejected' ? 'danger' : 'warning'}`}>{detail.status}</span></p>
        {detail.status !== 'Pending' && detail.approved_by_name && <p className="mb-1"><strong>Approved by:</strong> {detail.approved_by_name}</p>}
        {detail.admin_remark && <div className="alert alert-info">{detail.admin_remark}</div>}
        {detail.status === 'Pending' && <div className="d-flex gap-2"><button className="btn btn-success btn-sm" onClick={() => updateStatus('Approved')}>Approve</button><button className="btn btn-danger btn-sm" onClick={() => updateStatus('Rejected')}>Reject</button></div>}
        <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => setViewId(null)}>Back</button>
      </div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Student</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Approved By</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>{data.leaves.map(l => <tr key={l.id}>
          <td>{l.student_name}<br /><small>{l.roll_no}</small></td><td>{l.from_date?.split('T')[0] || l.from_date}</td><td>{l.to_date?.split('T')[0] || l.to_date}</td><td>{l.reason?.substring(0, 50)}</td>
          <td><span className={`badge bg-${l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}`}>{l.status}</span></td>
          <td><span className="text-muted small">{l.approved_by_name || '-'}</span></td>
          <td>{l.applied_at?.split(' ')[0]}</td>
          <td><button className="btn btn-sm btn-outline-primary" onClick={() => viewDetail(l.id)}>Review</button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
