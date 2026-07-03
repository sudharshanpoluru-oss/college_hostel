import { useState } from 'react'; import api from '../../api/client';
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' }); const [success, setSuccess] = useState(''); const [error, setError] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); setError(''); setSuccess('');
    if (!form.name || !form.email || !form.message) return setError('Please fill all required fields');
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Please enter a valid email');
    try { await api.post('/public/contact', form); setSuccess('Thank you! Your message has been sent.'); setForm({ name: '', email: '', phone: '', message: '' }); } catch (e) { setError('Failed to send message. Please try again.'); }
  };
  return (
    <>
      <section className="bg-primary text-white py-5"><div className="container text-center">
        <h1 className="display-4 fw-bold">Contact Us</h1><p className="lead">We'd love to hear from you</p>
      </div></section>
      <section className="py-5"><div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100"><div className="card-body p-4">
              <h4 className="fw-bold mb-4">Contact Information</h4>
              <div className="mb-3"><div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded-3" style={{ width: 48, height: 48 }}><i className="bi bi-geo-alt fs-5"></i></div>
                <div><h6 className="mb-0">Address</h6><small className="text-muted">YSR Engineering College,<br />Korrapadu Road, Proddatur - 516360</small></div>
              </div></div>
              <div className="mb-3"><div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-success text-white d-flex align-items-center justify-content-center rounded-3" style={{ width: 48, height: 48 }}><i className="bi bi-telephone fs-5"></i></div>
                <div><h6 className="mb-0">Phone</h6><small className="text-muted">+91 8564 254770</small></div>
              </div></div>
              <div className="mb-3"><div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-info text-white d-flex align-items-center justify-content-center rounded-3" style={{ width: 48, height: 48 }}><i className="bi bi-envelope fs-5"></i></div>
                <div><h6 className="mb-0">Email</h6><small className="text-muted">principal.yvuce@gmail.com</small></div>
              </div></div>
              <div className="mb-3"><div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-warning text-white d-flex align-items-center justify-content-center rounded-3" style={{ width: 48, height: 48 }}><i className="bi bi-clock fs-5"></i></div>
                <div><h6 className="mb-0">Office Hours</h6><small className="text-muted">9:00 AM - 5:00 PM (Mon-Sat)</small></div>
              </div></div>
            </div></div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm"><div className="card-body p-4">
              <h4 className="fw-bold mb-4">Send Us a Message</h4>
              {error && <div className="alert alert-danger py-2 small alert-dismissible fade show"><i className="bi bi-exclamation-triangle me-1"></i>{error}<button className="btn-close" onClick={() => setError('')}></button></div>}
              {success && <div className="alert alert-success py-2 small alert-dismissible fade show"><i className="bi bi-check-circle me-1"></i>{success}<button className="btn-close" onClick={() => setSuccess('')}></button></div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3"><label className="form-label fw-semibold small">Name <span className="text-danger">*</span></label><input className="form-control" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="mb-3"><label className="form-label fw-semibold small">Email <span className="text-danger">*</span></label><input className="form-control" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                <div className="mb-3"><label className="form-label fw-semibold small">Phone</label><input className="form-control" type="text" placeholder="Optional" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div className="mb-3"><label className="form-label fw-semibold small">Message <span className="text-danger">*</span></label><textarea className="form-control" rows="4" placeholder="Write your message..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required></textarea></div>
                <button className="btn btn-primary w-100"><i className="bi bi-send me-2"></i>Send Message</button>
              </form>
            </div></div>
          </div>
        </div>
        <div className="mt-4">
          <iframe src="https://www.google.com/maps?q=YSR+Engineering+College+Proddatur&output=embed" width="100%" height="300" style={{ border: 0, borderRadius: 12 }} allowFullScreen loading="lazy"></iframe>
        </div>
      </div></section>
    </>
  );
}
