import { useState } from 'react'; import api from '../../api/client';
export default function StudentEmergency() {
  const [form, setForm] = useState({ category: 'Medical', location: '', description: '' }); const [msg, setMsg] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); try { await api.post('/student/emergency', form); setMsg('Emergency reported! Authorities will be notified.'); setForm({ category: 'Medical', location: '', description: '' }); } catch (e) { setMsg('Error'); } };
  return (
    <div style={{ maxWidth: 600 }}>
      <h4 className="fw-bold mb-4 text-danger"><i className="bi bi-exclamation-circle me-2"></i>Report Emergency</h4>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <div className="card border-danger"><div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>Medical</option><option>Fire</option><option>Security</option><option>Harassment</option><option>Other</option></select></div>
          <div className="mb-3"><label className="form-label">Location</label><input className="form-control" placeholder="Where is this happening?" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required /></div>
          <div className="mb-3"><label className="form-label">Description</label><textarea className="form-control" rows="3" placeholder="Describe the emergency" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required></textarea></div>
          <button className="btn btn-danger w-100"><i className="bi bi-exclamation-triangle"></i> Report Emergency</button>
        </form>
      </div></div>
    </div>
  );
}
