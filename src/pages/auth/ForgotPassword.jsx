import { useState } from 'react'; import api from '../../api/client'; import { Link } from 'react-router-dom';
export default function ForgotPassword() {
  const [email, setEmail] = useState(''); const [step, setStep] = useState('request'); const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const [token, setToken] = useState(''); const [form, setForm] = useState({ password: '', confirm_password: '' });

  const handleRequest = async (e) => { e.preventDefault(); setErr(''); setMsg('');
    try { const r = await api.post('/auth/forgot-password', { email }); setMsg(r.data.message || 'Check your email for reset link.'); setStep('done'); } catch (e) { setErr(e.response?.data?.error || 'Error'); } };

  const handleReset = async (e) => { e.preventDefault(); setErr('');
    if (form.password !== form.confirm_password) return setErr('Passwords do not match');
    try { await api.post('/auth/reset-password', { token, password: form.password }); setMsg('Password reset! You can now login.'); setStep('done'); } catch (e) { setErr(e.response?.data?.error || 'Error'); } };

  return (
    <div className="container py-5" style={{ maxWidth: 450 }}>
      <div className="card shadow"><div className="card-body p-4 text-center">
        <div className="bg-primary text-white d-inline-flex rounded-3 p-3 mb-3"><i className="bi bi-key fs-3"></i></div>
        <h4 className="fw-bold mb-1">{step === 'reset' ? 'Reset Password' : 'Forgot Password'}</h4>
        {err && <div className="alert alert-danger py-2 small">{err}</div>}
        {msg && <div className="alert alert-success py-2 small">{msg}{step === 'done' && <div className="mt-2"><Link to="/login" className="btn btn-primary btn-sm">Login</Link></div>}</div>}
        {!msg && step === 'request' && <form onSubmit={handleRequest}>
          <div className="mb-3 text-start"><label className="form-label small">Email Address</label><input className="form-control" type="email" placeholder="Enter registered email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus /></div>
          <button className="btn btn-primary w-100"><i className="bi bi-send me-2"></i>Send Reset Link</button>
        </form>}
        {!msg && step === 'reset' && <form onSubmit={handleReset}>
          <div className="mb-3 text-start"><label className="form-label small">New Password</label><input className="form-control" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={8} /></div>
          <div className="mb-3 text-start"><label className="form-label small">Confirm Password</label><input className="form-control" type="password" placeholder="Confirm" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} required /></div>
          <button className="btn btn-primary w-100"><i className="bi bi-check-circle me-2"></i>Reset Password</button>
        </form>}
        <div className="mt-3"><Link to="/login" className="text-decoration-none small"><i className="bi bi-arrow-left"></i> Back to Login</Link></div>
      </div></div>
    </div>
  );
}
