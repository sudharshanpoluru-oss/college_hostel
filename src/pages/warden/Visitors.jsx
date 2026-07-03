import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenVisitors() {
  const [visitors, setVisitors] = useState([]);
  useEffect(() => { api.get('/warden/visitors').then(r => setVisitors(r.data)); }, []);
  const handleApprove = async (id) => { await api.put(`/warden/visitors/${id}/approve`); api.get('/warden/visitors').then(r => setVisitors(r.data)); };
  return (
    <div>
      <h4 className="fw-bold mb-3">Visitors</h4>
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Visitor</th><th>Contact</th><th>Student</th><th>Check In</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{visitors.map(v => <tr key={v.id}>
          <td>{v.visitor_name}</td><td>{v.contact}</td><td>{v.student_name || '-'}</td><td>{v.check_in}</td>
          <td><span className={`badge bg-${v.status === 'Approved' ? 'success' : 'warning'}`}>{v.status || 'Pending'}</span></td>
          <td>{v.status !== 'Approved' && <button className="btn btn-sm btn-success" onClick={() => handleApprove(v.id)}>Approve</button>}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
