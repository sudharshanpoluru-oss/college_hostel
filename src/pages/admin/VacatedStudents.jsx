import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function VacatedStudents() {
  const [data, setData] = useState({ students: [], total: 0 }); const [search, setSearch] = useState(''); const [page, setPage] = useState(1);
  useEffect(() => { api.get('/admin/vacated-students', { params: { search, page } }).then(r => setData(r.data)); }, [search, page]);
  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-archive me-2"></i>Vacated Students Archive</h4>
      <input className="form-control mb-3" style={{ width: 300 }} placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Name</th><th>Roll No</th><th>Course</th><th>Last Room</th><th>Reason</th><th>Vacated</th></tr></thead>
        <tbody>{data.students.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.roll_no}</td><td>{s.course}</td><td>{s.last_room_no || '-'}</td><td>{s.vacate_reason?.substring(0, 50)}</td><td>{s.vacated_at?.split(' ')[0]}</td></tr>)}</tbody></table></div></div>
    </div>
  );
}
