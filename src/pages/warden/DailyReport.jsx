import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function DailyReport() {
  const [report, setReport] = useState(null);
  useEffect(() => { api.get('/warden/daily-report').then(r => setReport(r.data)); }, []);
  if (!report) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-file-text me-2"></i>Daily Report - {report.date}</h4>
      <div className="row g-3">
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">Attendance Summary</div><div className="card-body">{report.attendance.map((a, i) => <div key={i} className="d-flex justify-content-between"><span>{a.status}</span><span className="fw-bold">{a.c}</span></div>)}</div></div></div>
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">Today's Complaints ({report.complaints.length})</div><div className="list-group list-group-flush">{report.complaints.map(c => <div key={c.id} className="list-group-item"><small>{c.title} - {c.status}</small></div>)}</div></div></div>
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">Today's Leaves ({report.leaves.length})</div><div className="list-group list-group-flush">{report.leaves.map(l => <div key={l.id} className="list-group-item"><small>{l.name} - {l.status}</small></div>)}</div></div></div>
      </div>
    </div>
  );
}
