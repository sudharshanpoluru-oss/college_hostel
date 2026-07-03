import { useState } from 'react'; import api from '../../api/client';
export default function Vacate() {
  const [reason, setReason] = useState(''); const [msg, setMsg] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/student/vacate', { reason }); setMsg('Request submitted!'); setReason(''); };
  return (
    <div style={{ maxWidth: 500 }}>
      <h4 className="fw-bold mb-4 text-warning"><i className="bi bi-box-arrow-right me-2"></i>Request Vacate</h4>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="card"><div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3"><label className="form-label">Reason for vacating</label><textarea className="form-control" rows="3" placeholder="Tell us why you want to vacate..." value={reason} onChange={e => setReason(e.target.value)} required></textarea></div>
          <button className="btn btn-warning w-100">Submit Vacate Request</button>
        </form>
      </div></div>
    </div>
  );
}
