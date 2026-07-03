import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Students() {
  const [data, setData] = useState({ students: [], pending: [], total: 0 }); const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [showAdd, setShowAdd] = useState(false); const [editId, setEditId] = useState(null);   const [form, setForm] = useState({ name: '', roll_no: '', email: '', phone: '', address: '', gender: 'Male', course: '', year: '', guardian_name: '', guardian_phone: '', admission_date: '', join_date: '', status: 'Active' });
  const [assignStudent, setAssignStudent] = useState(null); const [assignRoom, setAssignRoom] = useState(''); const [assignBed, setAssignBed] = useState(''); const [availableRooms, setAvailableRooms] = useState([]);
  const load = () => { api.get('/admin/students', { params: { page, search } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page, search]);
  const handleSubmit = async (e) => { e.preventDefault();
    if (editId) { await api.put(`/admin/students/${editId}`, form); } else { await api.post('/admin/students', form); }
    setShowAdd(false); setEditId(null); load(); };
  const handleEdit = (s) => { setForm({ ...s }); setEditId(s.id); setShowAdd(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/students/${id}`); load(); };
  const handleApprove = async (userId) => { await api.post(`/admin/students/approve/${userId}`); load(); };
  const handleReject = async (userId) => { await api.delete(`/admin/students/reject/${userId}`); load(); };
  const openAssign = async (s) => { setAssignStudent(s); setAssignRoom(''); setAssignBed(''); try { const r = await api.get(`/admin/students/${s.id}`); setAvailableRooms(r.data.availableRooms || []); } catch { setAvailableRooms([]); } };
  const handleAssign = async (e) => { e.preventDefault(); if (!assignStudent || !assignRoom) return; await api.post('/admin/allocations', { student_id: assignStudent.id, room_id: assignRoom, bed_no: assignBed }); setAssignStudent(null); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Students</h4>        <button className="btn btn-primary btn-sm" onClick={() => { setForm({ name: '', roll_no: '', email: '', phone: '', address: '', gender: 'Male', course: '', year: '', guardian_name: '', guardian_phone: '', admission_date: '', join_date: '', status: 'Active' }); setEditId(null); setShowAdd(true); }}><i className="bi bi-plus"></i> Add</button></div>
      <input className="form-control mb-3" placeholder="Search by name, roll or phone..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      {data.pending.length > 0 && <div className="card mb-3 border-warning"><div className="card-header bg-warning text-dark fw-bold">Pending Approvals ({data.pending.length})</div><div className="card-body p-0">{data.pending.map(p => <div key={p.id} className="d-flex justify-content-between align-items-center p-2 border-bottom"><span>{p.name} ({p.roll_no})</span><div><button className="btn btn-success btn-sm me-1" onClick={() => handleApprove(p.user_id)}>Approve</button><button className="btn btn-danger btn-sm" onClick={() => handleReject(p.user_id)}>Reject</button></div></div>)}</div></div>}
      {showAdd && <div className="card mb-3"><div className="card-body">
        <h5 className="fw-bold">{editId ? 'Edit' : 'Add'} Student</h5>
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Roll No" value={form.roll_no} onChange={e => setForm({...form, roll_no: e.target.value})} required /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div className="col-md-4"><select className="form-select form-select-sm" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Course" value={form.course} onChange={e => setForm({...form, course: e.target.value})} /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Year" value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Guardian Name" value={form.guardian_name} onChange={e => setForm({...form, guardian_name: e.target.value})} /></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Guardian Phone" value={form.guardian_phone} onChange={e => setForm({...form, guardian_phone: e.target.value})} /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" type="date" value={form.admission_date} onChange={e => setForm({...form, admission_date: e.target.value})} /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" type="date" value={form.join_date} onChange={e => setForm({...form, join_date: e.target.value})} /></div>
          <div className="col-md-6"><textarea className="form-control form-control-sm" rows="1" placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea></div>
          <div className="col-12"><button className="btn btn-primary btn-sm mt-2">{editId ? 'Update' : 'Add'} Student</button><button className="btn btn-secondary btn-sm mt-2 ms-2" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button></div>
        </div></form></div></div>}
      {assignStudent && <div className="card mb-3 border-success"><div className="card-body">
        <h5 className="fw-bold">Assign Room — {assignStudent.name} ({assignStudent.roll_no})</h5>
        <form onSubmit={handleAssign}><div className="row g-2">
          <div className="col-md-6"><select className="form-select form-select-sm" value={assignRoom} onChange={e => setAssignRoom(e.target.value)} required><option value="">Select Room</option>{availableRooms.map(r => <option key={r.id} value={r.id}>Room {r.room_no} ({r.room_type}) — {r.capacity - r.occupancy} free</option>)}</select></div>
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Bed No" value={assignBed} onChange={e => setAssignBed(e.target.value)} /></div>
          <div className="col-md-3"><button className="btn btn-success btn-sm">Assign</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => setAssignStudent(null)}>Cancel</button></div>
        </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>#</th><th>Name</th><th>Roll No</th><th>Phone</th><th>Course</th><th>Room</th><th>Approved By</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{data.students.map((s, i) => <tr key={s.id}>
          <td>{i+1}</td><td>{s.name}</td><td>{s.roll_no}</td><td>{s.phone}</td><td>{s.course}</td><td>{s.room_no || '-'}</td>
          <td><span className="text-muted small">{s.approved_by_name || '-'}</span></td>
          <td><span className={`badge bg-${s.status === 'Active' ? 'success' : 'secondary'}`}>{s.status}</span></td>
          <td>
            {!s.room_no && s.status === 'Active' && <button className="btn btn-sm btn-success me-1" onClick={() => openAssign(s)}><i className="bi bi-house-add"></i></button>}
            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(s)}><i className="bi bi-pencil"></i></button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}><i className="bi bi-trash"></i></button>
          </td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
