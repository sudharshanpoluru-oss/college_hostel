import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentProfile() {
  const [data, setData] = useState(null); const [form, setForm] = useState({ phone: '', address: '', guardian_name: '', guardian_phone: '', course: '', year: '' }); const [msg, setMsg] = useState('');
  useEffect(() => { api.get('/student/profile').then(r => { setData(r.data); setForm({ phone: r.data.student.phone || '', address: r.data.student.address || '', guardian_name: r.data.student.guardian_name || '', guardian_phone: r.data.student.guardian_phone || '', course: r.data.student.course || '', year: r.data.student.year || '' }); }); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.put('/student/profile', form); setMsg('Updated!'); };
  return (
    <div style={{ maxWidth: 600 }}>
      <h4 className="fw-bold mb-4">My Profile</h4>
      {data && <div><div className="card mb-3"><div className="card-body">
        <p><strong>Name:</strong> {data.student.name}</p><p><strong>Roll No:</strong> {data.student.roll_no}</p>
        <p><strong>Email:</strong> {data.student.email}</p><p><strong>Room:</strong> {data.allocation ? `${data.allocation.room_no} (${data.allocation.room_type})` : 'Not allocated'}</p>
      </div></div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <form onSubmit={handleSubmit}><div className="row g-3">
        <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
        <div className="col-md-6"><label className="form-label">Course</label><input className="form-control" value={form.course} onChange={e => setForm({...form, course: e.target.value})} /></div>
        <div className="col-md-6"><label className="form-label">Year</label><input className="form-control" value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
        <div className="col-md-6"><label className="form-label">Guardian Name</label><input className="form-control" value={form.guardian_name} onChange={e => setForm({...form, guardian_name: e.target.value})} /></div>
        <div className="col-md-6"><label className="form-label">Guardian Phone</label><input className="form-control" value={form.guardian_phone} onChange={e => setForm({...form, guardian_phone: e.target.value})} /></div>
        <div className="col-12"><label className="form-label">Address</label><textarea className="form-control" rows="2" value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea></div>
        <div className="col-12"><button className="btn btn-primary">Update</button></div>
      </div></form></div>}
    </div>
  );
}
