import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [form, setForm] = useState({ username: '', email: '', password: '', remember: false });
  const [error, setError] = useState('');

  useEffect(() => {
    const r = searchParams.get('role');
    if (r) setRole(r);
  }, [searchParams]);

  const switchRole = (newRole) => {
    setRole(newRole);
    setError('');
    navigate(`/login?role=${newRole}`, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = role === 'admin' ? { username: form.username, password: form.password, email: form.email } : { username: form.username, password: form.password };
      const user = await login(payload.username, payload.password, payload.email);
      navigate(user.role === 'admin' ? '/admin' : user.role === 'warden' ? '/warden' : '/student');
    } catch (err) { setError(err.response?.data?.error || 'Invalid credentials'); }
  };

  const roleInfo = role === 'student' ? 'Sign in with your Roll Number and password' : role === 'admin' ? 'Sign in with your username, email and password' : 'Sign in with your credentials';

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-5">
          <div className="login-card">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-3 p-3 mb-3" style={{ width: 64, height: 64 }}>
                    <i className="bi bi-building fs-3"></i>
                  </div>
                  <h4 className="fw-bold">Hostel Management</h4>
                  <p className="text-muted small">Sign in to your account</p>
                </div>

                <ul className="nav nav-pills nav-justified mb-4 gap-2" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${role === 'student' ? 'active' : ''}`} onClick={() => switchRole('student')}>
                      <i className="bi bi-person"></i> Student
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${role === 'warden' ? 'active' : ''}`} onClick={() => switchRole('warden')}>
                      <i className="bi bi-shield-check"></i> Warden
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${role === 'admin' ? 'active' : ''}`} onClick={() => switchRole('admin')}>
                      <i className="bi bi-shield-lock"></i> Admin
                    </button>
                  </li>
                </ul>

                <p className="text-muted text-center mb-4 small">{roleInfo}</p>

                {error && <div className="alert alert-danger py-2 small"><i className="bi bi-exclamation-circle"></i> {error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-medium">{role === 'student' ? 'Roll Number / Username' : 'Username'}</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-person"></i></span>
                      <input type="text" className="form-control" placeholder={role === 'student' ? 'Enter your roll number' : 'Enter your username'} value={form.username} onChange={e => setForm({...form, username: e.target.value})} required autoFocus />
                    </div>
                  </div>
                  {role === 'admin' && (
                    <div className="mb-3">
                      <label className="form-label small fw-medium">Email</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                        <input type="email" className="form-control" placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                      </div>
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <label className="form-label small fw-medium">Password</label>
                      <Link to="/forgot-password" className="small text-decoration-none">Forgot?</Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock"></i></span>
                      <input type="password" className="form-control" placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember" checked={form.remember} onChange={e => setForm({...form, remember: e.target.checked})} />
                      <label className="form-check-label small" htmlFor="remember">Remember me</label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                    <i className="bi bi-box-arrow-in-right"></i> Sign In
                  </button>
                </form>

                {role === 'student' && (
                  <div className="text-center mt-3">
                    <p className="mb-0 small">Don't have an account? <Link to="/register">Register here</Link></p>
                  </div>
                )}
                <div className="text-center mt-2">
                  <Link to="/" className="text-decoration-none small"><i className="bi bi-arrow-left"></i> Back to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
