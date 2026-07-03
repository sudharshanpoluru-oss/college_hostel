import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Profile() {
  const [profile, setProfile] = useState(null); const [form, setForm] = useState({ username: '', email: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => { api.get('/admin/profile').then(r => { setProfile(r.data); setForm({ username: r.data.username, email: r.data.email }); }); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.put('/admin/profile', form); setMsg('Updated!'); };
  return (
    <div style={{ maxWidth: 500 }}>
      <h4 className="fw-bold mb-4">My Profile</h4>
      {msg && <div className="alert alert-success">{msg}</div>}
      {profile && <form onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label">Username</label><input className="form-control" value={form.username} onChange={e => setForm({...form, username: e.target.value})} /></div>
        <div className="mb-3"><label className="form-label">Email</label><input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <button className="btn btn-primary">Update</button>
      </form>}
    </div>
  );
}
