import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenStudents() {
  const [students, setStudents] = useState([]);
  useEffect(() => { api.get('/warden/students').then(r => setStudents(r.data)); }, []);
  return (
    <div>
      <h4 className="fw-bold mb-3">Students</h4>
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Name</th><th>Roll No</th><th>Phone</th><th>Course</th><th>Room</th><th>Status</th></tr></thead>
        <tbody>{students.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.roll_no}</td><td>{s.phone}</td><td>{s.course}</td><td>{s.room_no || '-'}</td><td><span className={`badge bg-${s.status === 'Active' ? 'success' : 'secondary'}`}>{s.status}</span></td></tr>)}</tbody></table></div></div>
    </div>
  );
}
