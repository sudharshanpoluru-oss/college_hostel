import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '', name: '', roll_no: '', phone: '', gender: 'Male', course: '', year: '', address: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm_password) return setError('Passwords do not match');
    try { await register(form); navigate('/login?registered=1'); } catch (err) { setError(err.response?.data?.error || 'Registration failed'); }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="register-card">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-3 p-3 mb-3" style={{ width: 64, height: 64 }}>
                    <i className="bi bi-person-plus fs-3"></i>
                  </div>
                  <h4 className="fw-bold">Student Registration</h4>
                  <p className="text-muted small">Create your account to get started</p>
                </div>
                {error && <div className="alert alert-danger py-2 small"><i className="bi bi-exclamation-circle"></i> {error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label small fw-medium">Username</label><div className="input-group"><span className="input-group-text"><i className="bi bi-person"></i></span><input className="form-control" placeholder="Choose a username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Email</label><div className="input-group"><span className="input-group-text"><i className="bi bi-envelope"></i></span><input className="form-control" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Password</label><div className="input-group"><span className="input-group-text"><i className="bi bi-lock"></i></span><input className="form-control" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={8} /></div></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Confirm Password</label><div className="input-group"><span className="input-group-text"><i className="bi bi-lock"></i></span><input className="form-control" type="password" placeholder="Confirm" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} required /></div></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Full Name</label><div className="input-group"><span className="input-group-text"><i className="bi bi-card-text"></i></span><input className="form-control" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Roll Number</label><div className="input-group"><span className="input-group-text"><i className="bi bi-credit-card"></i></span><input className="form-control" placeholder="e.g. 22A91A05xx" value={form.roll_no} onChange={e => setForm({...form, roll_no: e.target.value})} required /></div></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Phone</label><div className="input-group"><span className="input-group-text"><i className="bi bi-telephone"></i></span><input className="form-control" type="tel" placeholder="10-digit phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required /></div></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Gender</label><div className="input-group"><span className="input-group-text"><i className="bi bi-gender-ambiguous"></i></span><select className="form-control" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Course</label><input className="form-control" placeholder="e.g. B.Tech CSE" value={form.course} onChange={e => setForm({...form, course: e.target.value})} /></div>
                    <div className="col-md-6"><label className="form-label small fw-medium">Year</label><input className="form-control" placeholder="e.g. 2nd Year" value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
                    <div className="col-12"><label className="form-label small fw-medium">Address</label><textarea className="form-control" placeholder="Your address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows="2"></textarea></div>
                    <div className="col-12"><button className="btn btn-primary w-100 py-2 fw-semibold"><i className="bi bi-person-plus me-2"></i>Register</button></div>
                    <p className="text-center mb-0 mt-2 small">Already have an account? <Link to="/login">Login here</Link></p>
                    <div className="text-center"><Link to="/" className="text-decoration-none small"><i className="bi bi-arrow-left"></i> Back to Home</Link></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
