import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Profile() {
  const [profile, setProfile] = useState(null); const [form, setForm] = useState({ username: '', email: '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [msg, setMsg] = useState(''); const [pwMsg, setPwMsg] = useState(''); const [pwErr, setPwErr] = useState('');
  useEffect(() => { api.get('/admin/profile').then(r => { setProfile(r.data); setForm({ username: r.data.username, email: r.data.email }); }); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.put('/admin/profile', form); setMsg('Updated!'); };
  const handlePw = async (e) => { e.preventDefault(); setPwMsg(''); setPwErr('');
    if (pwForm.new_password !== pwForm.confirm) return setPwErr('Passwords do not match');
    try { await api.post('/auth/change-password', { current_password: pwForm.current_password, new_password: pwForm.new_password }); setPwMsg('Password changed!'); setPwForm({ current_password: '', new_password: '', confirm: '' }); }
    catch (err) { setPwErr(err.response?.data?.error || 'Error'); }
  };
  return (
    <div style={{ maxWidth: 500 }}>
      <h4 className="fw-bold mb-4">My Profile</h4>
      {msg && <div className="alert alert-success">{msg}</div>}
      {profile && <form onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label">Username</label><input className="form-control" value={form.username} onChange={e => setForm({...form, username: e.target.value})} /></div>
        <div className="mb-3"><label className="form-label">Email</label><input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <button className="btn btn-primary">Update</button>
      </form>}
      <hr className="my-4" />
      <h5 className="fw-bold mb-3">Change Password</h5>
      {pwMsg && <div className="alert alert-success">{pwMsg}</div>}
      {pwErr && <div className="alert alert-danger">{pwErr}</div>}
      <form onSubmit={handlePw}>
        <div className="mb-3"><label className="form-label">Current Password</label><input className="form-control" type="password" value={pwForm.current_password} onChange={e => setPwForm({...pwForm, current_password: e.target.value})} required /></div>
        <div className="mb-3"><label className="form-label">New Password</label><input className="form-control" type="password" value={pwForm.new_password} onChange={e => setPwForm({...pwForm, new_password: e.target.value})} required /></div>
        <div className="mb-3"><label className="form-label">Confirm New Password</label><input className="form-control" type="password" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} required /></div>
        <button className="btn btn-warning">Change Password</button>
      </form>
    </div>
  );
}
