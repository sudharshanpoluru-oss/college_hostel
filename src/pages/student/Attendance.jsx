import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentAttendance() {
  const [records, setRecords] = useState([]); const [month, setMonth] = useState(new Date().getMonth() + 1); const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => { api.get('/student/attendance', { params: { month, year } }).then(r => setRecords(r.data)); }, [month, year]);
  const present = records.filter(r => r.status === 'Present').length; const total = records.length;
  return (
    <div>
      <h4 className="fw-bold mb-4">My Attendance</h4>
      <div className="d-flex gap-2 mb-3">
        <select className="form-select form-select-sm" style={{ width: 120 }} value={month} onChange={e => setMonth(e.target.value)}>{Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{new Date(2024, i).toLocaleString('default', {month: 'long'})}</option>)}</select>
        <select className="form-select form-select-sm" style={{ width: 100 }} value={year} onChange={e => setYear(e.target.value)}>{Array.from({length: 5}, (_, i) => <option key={i} value={2024 + i}>{2024 + i}</option>)}</select>
      </div>
      {total > 0 && <div className="mb-3"><div className="progress" style={{ height: 25 }}><div className="progress-bar bg-success" style={{ width: `${(present/total)*100}%` }}>{((present/total)*100).toFixed(1)}%</div></div><small className="text-muted">{present}/{total} days present</small></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Date</th><th>Status</th><th>Remarks</th></tr></thead>
        <tbody>{records.map(a => <tr key={a.id}><td>{a.date}</td>
          <td><span className={`badge bg-${a.status === 'Present' ? 'success' : 'danger'}`}>{a.status}</span></td>
          <td>{a.remarks || '-'}</td></tr>)}</tbody></table></div></div>
    </div>
  );
}
