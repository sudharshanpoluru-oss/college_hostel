import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Maintenance() {
  const [data, setData] = useState({ requests: [], total: 0, assignable: [] }); const [page, setPage] = useState(1); const [filter, setFilter] = useState('');
  const load = () => { api.get('/admin/maintenance', { params: { page, status: filter || undefined } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page, filter]);
  const updateStatus = async (id, status, extra = {}) => { await api.put(`/admin/maintenance/${id}/status`, { status, ...extra }); load(); };
  return (
    <div>
      <h4 className="fw-bold mb-3">Maintenance Requests</h4>
      <div className="d-flex gap-2 mb-3">
        <select className="form-select form-select-sm" style={{ width: 200 }} value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
          <option value="">All</option><option>Pending</option><option>Assigned</option><option>In Progress</option><option>Resolved</option><option>Closed</option><option>Rejected</option>
        </select>
      </div>
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>#</th><th>Student</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>{data.requests.map((r, i) => <tr key={r.id}>
          <td>{i+1}</td><td>{r.student_name}<br /><small>{r.roll_no}</small></td><td>{r.category}</td>
          <td><span className={`badge bg-${r.priority === 'Emergency' ? 'danger' : r.priority === 'High' ? 'warning' : 'info'}`}>{r.priority}</span></td>
          <td><span className={`badge bg-${r.status === 'Pending' ? 'warning' : r.status === 'Resolved' ? 'success' : r.status === 'In Progress' ? 'info' : 'secondary'}`}>{r.status}</span></td>
          <td>{r.created_at?.split(' ')[0]}</td>
          <td>
            {r.status === 'Pending' && <button className="btn btn-sm btn-info me-1" onClick={() => updateStatus(r.id, 'Assigned', { assigned_to: prompt('User ID:') })}>Assign</button>}
            {r.status === 'Assigned' && <button className="btn btn-sm btn-warning me-1" onClick={() => updateStatus(r.id, 'In Progress')}>Start</button>}
            {r.status !== 'Resolved' && r.status !== 'Closed' && r.status !== 'Rejected' && <button className="btn btn-sm btn-success me-1" onClick={() => updateStatus(r.id, 'Resolved', { completion_remarks: prompt('Remarks:') })}>Resolve</button>}
            {r.status !== 'Closed' && <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(r.id, 'Closed')}>Close</button>}
          </td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
