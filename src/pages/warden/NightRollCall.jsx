import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function NightRollCall() {
  const [students, setStudents] = useState([]);
  useEffect(() => { api.get('/warden/night-roll-call').then(r => setStudents(r.data)); }, []);
  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-moon me-2"></i>Night Roll Call</h4>
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>#</th><th>Name</th><th>Roll No</th><th>Room</th></tr></thead>
        <tbody>{students.map((s, i) => <tr key={s.id}><td>{i+1}</td><td>{s.name}</td><td>{s.roll_no}</td><td>{s.room_no || '-'}</td></tr>)}</tbody></table></div></div>
    </div>
  );
}
