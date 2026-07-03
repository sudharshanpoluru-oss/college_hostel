import { useState } from 'react'; import api from '../../api/client';
export default function ChangePassword() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); setMsg(''); setErr('');
    if (form.new_password !== form.confirm_password) return setErr('Passwords do not match');
    try { await api.post('/auth/change-password', form); setMsg('Password changed!'); setForm({ current_password: '', new_password: '', confirm_password: '' }); } catch (e) { setErr(e.response?.data?.error || 'Failed'); } };
  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h4 className="fw-bold mb-4">Change Password</h4>
      {msg && <div className="alert alert-success">{msg}</div>}{err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"><input className="form-control" type="password" placeholder="Current Password" value={form.current_password} onChange={e => setForm({...form, current_password: e.target.value})} required /></div>
        <div className="mb-3"><input className="form-control" type="password" placeholder="New Password" value={form.new_password} onChange={e => setForm({...form, new_password: e.target.value})} required /></div>
        <div className="mb-3"><input className="form-control" type="password" placeholder="Confirm New Password" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} required /></div>
        <button className="btn btn-primary">Change Password</button>
      </form>
    </div>
  );
}
