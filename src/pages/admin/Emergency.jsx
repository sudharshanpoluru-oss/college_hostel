import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Emergency() {
  const [data, setData] = useState({ emergencies: [], total: 0, assignable: [] }); const [page, setPage] = useState(1); const [viewId, setViewId] = useState(null); const [detail, setDetail] = useState(null);
  const load = () => { api.get('/admin/emergency', { params: { page } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page]);
  const viewDetail = async (id) => { const r = await api.get(`/admin/emergency/${id}`); setDetail(r.data); setViewId(id); };
  const updateStatus = async (status, extra = {}) => { await api.put(`/admin/emergency/${viewId}/status`, { status, ...extra }); viewDetail(viewId); load(); };
  return (
    <div>
      <h4 className="fw-bold mb-3 text-danger"><i className="bi bi-exclamation-circle me-2"></i>Emergency Reports</h4>
      {viewId && detail && <div className="card mb-3 border-danger"><div className="card-body">
        <h5>Emergency #{detail.emergency.id}</h5>
        <p><strong>Category:</strong> {detail.emergency.category} | <strong>Status:</strong> <span className={`badge bg-${detail.emergency.status === 'Open' ? 'danger' : detail.emergency.status === 'Resolved' ? 'success' : 'info'}`}>{detail.emergency.status}</span></p>
        <p><strong>Location:</strong> {detail.emergency.location}</p>
        <p>{detail.emergency.description}</p>
        {detail.emergency.status === 'Open' && <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-info btn-sm" onClick={() => updateStatus('Assigned', { assigned_to: prompt('Assign to user ID:') || '' })}>Assign</button>
          <button className="btn btn-warning btn-sm" onClick={() => updateStatus('In Progress')}>Mark In Progress</button>
          <button className="btn btn-success btn-sm" onClick={() => updateStatus('Resolved', { resolution: prompt('Resolution:') })}>Resolve</button>
          <button className="btn btn-secondary btn-sm" onClick={() => updateStatus('Closed')}>Close</button>
        </div>}
        {detail.logs?.length > 0 && <div className="mt-3"><h6>Timeline</h6>{detail.logs.map(l => <small key={l.id} className="d-block text-muted">{l.created_at} - {l.action} by {l.username}</small>)}</div>}
        <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => setViewId(null)}>Back</button>
      </div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>#</th><th>Category</th><th>Location</th><th>Status</th><th>Priority</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>{data.emergencies.map((e, i) => <tr key={e.id}>
          <td>{i+1}</td><td>{e.category}</td><td>{e.location}</td>
          <td><span className={`badge bg-${e.status === 'Open' ? 'danger' : e.status === 'Resolved' ? 'success' : 'info'}`}>{e.status}</span></td>
          <td><span className={`badge bg-${e.priority === 'Critical' ? 'danger' : 'warning'}`}>{e.priority}</span></td>
          <td>{e.created_at?.split(' ')[0]}</td>
          <td><button className="btn btn-sm btn-outline-primary" onClick={() => viewDetail(e.id)}>View</button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
