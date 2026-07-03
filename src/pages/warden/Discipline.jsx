import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Discipline() {
  const [records, setRecords] = useState([]); const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ student_id: '', misconduct_type: '', description: '', warning_type: 'Verbal', action_taken: '', fine_amount: 0 }); const [students, setStudents] = useState([]);
  const load = () => { api.get('/warden/discipline').then(r => setRecords(r.data)); api.get('/warden/students').then(r => setStudents(r.data)); };
  useEffect(() => { load(); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/warden/discipline', form); setShowForm(false); setForm({ student_id: '', misconduct_type: '', description: '', warning_type: 'Verbal', action_taken: '', fine_amount: 0 }); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0"><i className="bi bi-shield me-2"></i>Discipline Records</h4><button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Add Record</button></div>
      {showForm && <div className="card mb-3"><div className="card-body"><form onSubmit={handleSubmit}><div className="row g-2">
        <div className="col-md-4"><select className="form-select form-select-sm" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required><option value="">Select Student</option>{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}</select></div>
        <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Misconduct Type" value={form.misconduct_type} onChange={e => setForm({...form, misconduct_type: e.target.value})} /></div>
        <div className="col-md-4"><select className="form-select form-select-sm" value={form.warning_type} onChange={e => setForm({...form, warning_type: e.target.value})}><option>Verbal</option><option>Written</option><option>Final</option></select></div>
        <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Action Taken" value={form.action_taken} onChange={e => setForm({...form, action_taken: e.target.value})} /></div>
        <div className="col-md-3"><input className="form-control form-control-sm" type="number" placeholder="Fine Amount" value={form.fine_amount} onChange={e => setForm({...form, fine_amount: e.target.value})} /></div>
        <div className="col-md-3"><button className="btn btn-primary btn-sm w-100">Save</button></div>
        <div className="col-12"><textarea className="form-control form-control-sm" rows="1" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea></div>
      </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Student</th><th>Misconduct</th><th>Warning</th><th>Fine</th><th>Date</th></tr></thead>
        <tbody>{records.map(r => <tr key={r.id}><td>{r.name}<br /><small>{r.roll_no} | {r.room_no}</small></td><td>{r.misconduct_type}</td><td>{r.warning_type}</td><td>{r.fine_amount > 0 ? `₹${r.fine_amount}` : '-'}</td><td>{r.created_at?.split(' ')[0]}</td></tr>)}</tbody></table></div></div>
    </div>
  );
}
