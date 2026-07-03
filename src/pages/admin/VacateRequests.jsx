import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function VacateRequests() {
  const [data, setData] = useState({ requests: [], total: 0 }); const [page, setPage] = useState(1); const [viewId, setViewId] = useState(null); const [detail, setDetail] = useState(null);
  const load = () => { api.get('/admin/vacate-requests', { params: { page } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page]);
  const viewDetail = async (id) => { const r = await api.get(`/admin/vacate-requests/${id}`); setDetail(r.data); setViewId(id); };
  const updateStatus = async (status) => { const remark = prompt('Remark:'); await api.put(`/admin/vacate-requests/${viewId}`, { status, remark }); setViewId(null); load(); };
  return (
    <div>
      <h4 className="fw-bold mb-3">Vacate Requests</h4>
      {viewId && detail && <div className="card mb-3 border-warning"><div className="card-body">
        <h5>{detail.student_name} ({detail.roll_no})</h5>
        <p><strong>Room:</strong> {detail.room_no} | <strong>Status:</strong> <span className={`badge bg-${detail.status === 'Approved' ? 'success' : detail.status === 'Rejected' ? 'danger' : 'warning'}`}>{detail.status}</span></p>
        <p><strong>Reason:</strong> {detail.reason}</p>
        <p><strong>Email:</strong> {detail.email} | <strong>Phone:</strong> {detail.phone}</p>
        {detail.status === 'Pending' && <div className="d-flex gap-2"><button className="btn btn-success btn-sm" onClick={() => updateStatus('Approved')}>Approve & Archive</button><button className="btn btn-danger btn-sm" onClick={() => updateStatus('Rejected')}>Reject</button></div>}
        <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => setViewId(null)}>Back</button>
      </div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Student</th><th>Reason</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>{data.requests.map(r => <tr key={r.id}>
          <td>{r.student_name}<br /><small>{r.roll_no}</small></td><td>{r.reason?.substring(0, 50)}</td>
          <td><span className={`badge bg-${r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}`}>{r.status}</span></td>
          <td>{r.applied_at?.split(' ')[0]}</td>
          <td><button className="btn btn-sm btn-outline-primary" onClick={() => viewDetail(r.id)}>Review</button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
