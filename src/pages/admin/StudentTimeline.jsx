import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentTimeline() {
  const [students, setStudents] = useState([]); const [search, setSearch] = useState(''); const [studentId, setStudentId] = useState(null); const [student, setStudent] = useState(null); const [events, setEvents] = useState([]); const [filter, setFilter] = useState(''); const [dateFrom, setDateFrom] = useState(''); const [dateTo, setDateTo] = useState('');

  const loadStudents = async () => {
    if (!search) { const r = await api.get('/admin/students', { params: { limit: 20 } }); setStudents(r.data.students); return; }
    const r = await api.get('/admin/search', { params: { q: search } }); setStudents(r.data.students);
  };
  useEffect(() => { loadStudents(); }, [search]);

  const loadTimeline = async (id) => { setStudentId(id);
    const [s] = (await api.get(`/admin/students/${id}`)).data.student ? [await api.get(`/admin/students/${id}`)] : [];
    if (s) { setStudent(s.data.student); }
    const r = await api.get(`/admin/student-timeline/${id}`, { params: { event_type: filter, date_from: dateFrom, date_to: dateTo } }); setEvents(r.data);
  };
  useEffect(() => { if (studentId) { loadTimeline(studentId); } }, [filter, dateFrom, dateTo]);

  const typeIcons = { admission: 'bi-person-plus-fill', room_allocation: 'bi-key-fill', attendance: 'bi-calendar-check-fill', leave: 'bi-box-arrow-right', complaint: 'bi-exclamation-triangle-fill', visitor: 'bi-person-badge-fill', medical: 'bi-heart-pulse-fill', discipline: 'bi-shield-exclamation-fill', fee: 'bi-cash-coin', room_change: 'bi-arrow-left-right', vacate: 'bi-house-x-fill', maintenance: 'bi-tools' };
  const typeColors = { admission: '#0d6efd', room_allocation: '#6610f2', attendance: '#198754', leave: '#fd7e14', complaint: '#dc3545', visitor: '#0dcaf0', medical: '#d63384', discipline: '#ffc107', fee: '#20c997', room_change: '#6f42c1', vacate: '#212529', maintenance: '#6c757d' };

  const statusBadge = (s) => {
    const m = { Active: 'success', Inactive: 'secondary', Pending: 'warning', Approved: 'success', Rejected: 'danger', Resolved: 'success', Present: 'success', Absent: 'danger', Paid: 'success', Closed: 'secondary' };
    return <span className={`badge bg-${m[s] || 'primary'}`}>{s}</span>;
  };

  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-clock-history me-2"></i>Student Timeline</h4>
      {!studentId ? (
        <div className="card"><div className="card-body">
          <div className="input-group mb-3"><input className="form-control" placeholder="Search by name, roll, phone..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div className="list-group">{students.map(s => <button key={s.id} className="list-group-item list-group-item-action d-flex align-items-center gap-3" onClick={() => loadTimeline(s.id)}>
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 44, height: 44, fontSize: 18 }}>{s.name?.[0]?.toUpperCase()}</div>
            <div className="flex-grow-1"><strong>{s.name}</strong><br /><small className="text-muted">{s.roll_no} | {s.course}</small></div>
            <span className={`badge bg-${s.status === 'Active' ? 'success' : 'secondary'}`}>{s.status}</span>
            {s.room_no && <span className="badge bg-info">{s.room_no}</span>}
          </button>)}</div>
        </div></div>
      ) : (
        <div>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => { setStudentId(null); setStudent(null); setEvents([]); }}><i className="bi bi-arrow-left"></i> Back</button>
            <button className="btn btn-sm btn-outline-primary" onClick={() => loadTimeline(studentId)}><i className="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          {student && <div className="card mb-3" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', borderRadius: 12 }}><div className="card-body d-flex align-items-center gap-3">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 60, height: 60, fontSize: 24, color: '#667eea' }}><i className="bi bi-person"></i></div>
            <div><h5 className="fw-bold mb-0">{student.name}</h5><small>{student.roll_no} &bull; {student.course} {student.year && `- ${student.year}`} &bull; Room: {student.room_no || 'N/A'}</small></div>
          </div></div>}
          <div className="card mb-3"><div className="card-body"><div className="row g-2 align-items-end">
            <div className="col-auto"><label className="form-label small mb-0">Event Type</label><select className="form-select form-select-sm" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Events</option><option value="admission">Admission</option><option value="room_allocation">Room</option><option value="attendance">Attendance</option><option value="leave">Leaves</option><option value="complaint">Complaints</option><option value="visitor">Visitors</option><option value="medical">Medical</option><option value="discipline">Discipline</option><option value="fee">Fees</option><option value="room_change">Room Changes</option><option value="vacate">Vacate</option><option value="maintenance">Maintenance</option>
            </select></div>
            <div className="col-auto"><label className="form-label small mb-0">From</label><input className="form-control form-control-sm" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
            <div className="col-auto"><label className="form-label small mb-0">To</label><input className="form-control form-control-sm" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
            <div className="col-auto"><span className="text-muted small">{events.length} events</span></div>
          </div></div></div>
          {events.length === 0 ? <div className="alert alert-info">No timeline events found.</div> : 
            <div style={{ position: 'relative', paddingLeft: 40 }}>{[...new Set(events.map(e => e.month))].map(month => <div key={month}>
              <div style={{ position: 'relative', marginBottom: 8, marginTop: 16 }}><span className="bg-light px-3 py-1 rounded-pill small fw-bold">{month}</span></div>
              {events.filter(e => e.month === month).map((ev, i) => <div key={i} style={{ position: 'relative', paddingLeft: 30, marginBottom: 16 }}>
                <div style={{ position: 'absolute', left: 8, top: 0, width: 12, height: 12, borderRadius: '50%', backgroundColor: typeColors[ev.type] || '#0d6efd', border: '2px solid #fff', zIndex: 1 }}></div>
                <div className="card"><div className="card-body py-2 px-3"><small className="text-muted"><i className="bi bi-clock"></i> {ev.date}</small>
                  <div className="fw-semibold small"><i className={`bi ${typeIcons[ev.type] || 'bi-circle'} me-1`} style={{ color: typeColors[ev.type] }}></i>{ev.title}</div>
                  {ev.description && <small className="text-muted">{ev.description}</small>}
                  {ev.status && <div className="mt-1">{statusBadge(ev.status)}</div>}
                </div></div>
              </div>)}</div>)}</div>}
        </div>
      )}
    </div>
  );
}
