import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenEmergency() {
  const [emergencies, setEmergencies] = useState([]);
  useEffect(() => { api.get('/warden/emergency').then(r => setEmergencies(r.data)); }, []);
  const updateStatus = async (id, status) => { const resolution = status === 'Resolved' ? prompt('Resolution:') : null; await api.put(`/warden/emergency/${id}/status`, { status, resolution }); api.get('/warden/emergency').then(r => setEmergencies(r.data)); };
  return (
    <div>
      <h4 className="fw-bold mb-3 text-danger"><i className="bi bi-exclamation-circle me-2"></i>Emergency</h4>
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Category</th><th>Location</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{emergencies.map(e => <tr key={e.id}>
          <td>{e.category}</td><td>{e.location}</td>
          <td><span className={`badge bg-${e.priority === 'Critical' ? 'danger' : 'warning'}`}>{e.priority}</span></td>
          <td><span className={`badge bg-${e.status === 'Open' ? 'danger' : e.status === 'Resolved' ? 'success' : 'info'}`}>{e.status}</span></td>
          <td>{e.status !== 'Resolved' && e.status !== 'Closed' && <><button className="btn btn-sm btn-warning me-1" onClick={() => updateStatus(e.id, 'In Progress')}>Start</button><button className="btn btn-sm btn-success" onClick={() => updateStatus(e.id, 'Resolved')}>Resolve</button></>}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
