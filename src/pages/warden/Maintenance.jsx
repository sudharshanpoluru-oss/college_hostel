import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenMaintenance() {
  const [requests, setRequests] = useState([]);
  useEffect(() => { api.get('/warden/maintenance').then(r => setRequests(r.data)); }, []);
  const updateStatus = async (id, status, extra = {}) => { await api.put(`/warden/maintenance/${id}/status`, { status, ...extra }); api.get('/warden/maintenance').then(r => setRequests(r.data)); };
  return (
    <div>
      <h4 className="fw-bold mb-3">Maintenance Requests</h4>
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Student</th><th>Category</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{requests.map(r => <tr key={r.id}>
          <td>{r.student_name}<br /><small>{r.roll_no}</small></td><td>{r.category}</td>
          <td><span className={`badge bg-${r.priority === 'Emergency' ? 'danger' : 'warning'}`}>{r.priority}</span></td>
          <td><span className={`badge bg-${r.status === 'Pending' ? 'warning' : r.status === 'Resolved' ? 'success' : 'info'}`}>{r.status}</span></td>
          <td>{r.status === 'Pending' && <><button className="btn btn-sm btn-info me-1" onClick={() => updateStatus(r.id, 'Assigned', { assigned_to: prompt('User ID:') })}>Assign</button><button className="btn btn-sm btn-success" onClick={() => updateStatus(r.id, 'Resolved', { completion_remarks: prompt('Remarks:') })}>Resolve</button></>}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
