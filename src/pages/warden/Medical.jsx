import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Medical() {
  const [records, setRecords] = useState([]); const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ student_id: '', disease: '', doctor: '', hospital: '', medicines: '', remarks: '' }); const [students, setStudents] = useState([]);
  const load = () => { api.get('/warden/medical').then(r => setRecords(r.data)); api.get('/warden/students').then(r => setStudents(r.data)); };
  useEffect(() => { load(); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/warden/medical', form); setShowForm(false); setForm({ student_id: '', disease: '', doctor: '', hospital: '', medicines: '', remarks: '' }); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0"><i className="bi bi-heart-pulse me-2"></i>Medical Records</h4><button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Add Record</button></div>
      {showForm && <div className="card mb-3"><div className="card-body"><form onSubmit={handleSubmit}><div className="row g-2">
        <div className="col-md-4"><select className="form-select form-select-sm" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required><option value="">Select Student</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}</select></div>
        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Disease/Issue" value={form.disease} onChange={e => setForm({...form, disease: e.target.value})} /></div>
        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Doctor" value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} /></div>
        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Hospital" value={form.hospital} onChange={e => setForm({...form, hospital: e.target.value})} /></div>
        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Medicines" value={form.medicines} onChange={e => setForm({...form, medicines: e.target.value})} /></div>
        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Remarks" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} /></div>
        <div className="col-12"><button className="btn btn-primary btn-sm">Save</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => setShowForm(false)}>Cancel</button></div>
      </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Student</th><th>Disease</th><th>Doctor</th><th>Hospital</th><th>Date</th></tr></thead>
        <tbody>{records.map(r => <tr key={r.id}><td>{r.name}<br /><small>{r.roll_no} | {r.room_no}</small></td><td>{r.disease}</td><td>{r.doctor || '-'}</td><td>{r.hospital || '-'}</td><td>{r.visit_date}</td></tr>)}</tbody></table></div></div>
    </div>
  );
}
