import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenAttendance() {
  const [students, setStudents] = useState([]); const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState({}); const [history, setHistory] = useState([]); const [mode, setMode] = useState('mark');
  const loadStudents = async () => { const r = await api.get('/warden/attendance/students'); setStudents(r.data); const init = {}; r.data.forEach(s => init[s.id] = 'Present'); setRecords(init); };
  const loadHistory = async () => { const r = await api.get('/warden/attendance', { params: { date } }); setHistory(r.data.attendance); };
  useEffect(() => { if (mode === 'mark') loadStudents(); else loadHistory(); }, [mode, date]);
  const handleMark = async () => {
    const data = Object.entries(records).map(([student_id, status]) => ({ student_id: +student_id, status }));
    await api.post('/warden/attendance/mark', { date, records: data }); alert('Attendance saved!');
  };
  return (
    <div>
      <h4 className="fw-bold mb-3">Attendance</h4>
      <div className="d-flex gap-2 mb-3"><button className={`btn btn-sm ${mode === 'mark' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('mark')}>Mark</button><button className={`btn btn-sm ${mode === 'history' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('history')}>History</button></div>
      {mode === 'mark' ? <div>
        <div className="d-flex gap-2 mb-3"><input className="form-control form-control-sm" style={{ width: 200 }} type="date" value={date} onChange={e => setDate(e.target.value)} /><button className="btn btn-primary btn-sm" onClick={handleMark}>Save All</button></div>
        <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
          <thead><tr><th>#</th><th>Name</th><th>Roll No</th><th>Room</th><th>Status</th></tr></thead><tbody>
          {students.map((s, i) => <tr key={s.id}>
            <td>{i+1}</td><td>{s.name}</td><td>{s.roll_no}</td><td>{s.room_no}</td>
            <td><select className="form-select form-select-sm" style={{ width: 150 }} value={records[s.id] || 'Present'} onChange={e => setRecords({...records, [s.id]: e.target.value})}>
              <option>Present</option><option>Absent</option><option>Late</option><option>On Leave</option><option>Medical Leave</option>
            </select></td>
          </tr>)}</tbody></table></div></div>
      </div> : <div>
        <div className="mb-3"><input className="form-control form-control-sm" style={{ width: 200 }} type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
          <thead><tr><th>Student</th><th>Roll No</th><th>Status</th></tr></thead>
          <tbody>{history.map(a => <tr key={a.id || a.student_id}><td>{a.name}</td><td>{a.roll_no}</td><td><span className={`badge bg-${a.status === 'Present' ? 'success' : 'danger'}`}>{a.status}</span></td></tr>)}</tbody></table></div></div>
      </div>}
    </div>
  );
}
