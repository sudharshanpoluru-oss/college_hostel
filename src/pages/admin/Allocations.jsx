import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Allocations() {
  const [data, setData] = useState({ allocations: [], total: 0, unallocated: [], rooms: [] }); const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false); const [form, setForm] = useState({ student_id: '', room_id: '', bed_no: '' });
  const load = () => { api.get('/admin/allocations', { params: { page } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page]);
  const handleSubmit = async (e) => { e.preventDefault();
    try { await api.post('/admin/allocations', form); setShowAdd(false); load(); } catch (e) { alert(e.response?.data?.error || 'Error'); } };
  const handleVacate = async (id, room_id) => { if (!confirm('Vacate?')) return; await api.put(`/admin/allocations/vacate/${id}`, { room_id }); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Allocations</h4><button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><i className="bi bi-plus"></i> Allocate</button></div>
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-5"><select className="form-select form-select-sm" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required><option value="">Select Student</option>{data.unallocated?.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}</select></div>
          <div className="col-md-4"><select className="form-select form-select-sm" value={form.room_id} onChange={e => setForm({...form, room_id: e.target.value})} required><option value="">Select Room</option>{data.rooms?.map(r => <option key={r.id} value={r.id}>Room {r.room_no} ({r.room_type})</option>)}</select></div>
          <div className="col-md-2"><input className="form-control form-control-sm" placeholder="Bed No" value={form.bed_no} onChange={e => setForm({...form, bed_no: e.target.value})} /></div>
          <div className="col-12"><button className="btn btn-primary btn-sm">Allocate</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => setShowAdd(false)}>Cancel</button></div>
        </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>#</th><th>Student</th><th>Room</th><th>Bed No</th><th>Allocated</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{data.allocations.map((a, i) => <tr key={a.id}>
          <td>{i+1}</td><td>{a.student_name}<br /><small>{a.roll_no}</small></td><td>{a.room_no}</td><td>{a.bed_no || '-'}</td>
          <td>{a.allocation_date}</td><td><span className={`badge bg-${a.status === 'Active' ? 'success' : 'secondary'}`}>{a.status}</span></td>
          <td>{a.status === 'Active' && <button className="btn btn-sm btn-outline-danger" onClick={() => handleVacate(a.id, a.room_id)}>Vacate</button>}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
