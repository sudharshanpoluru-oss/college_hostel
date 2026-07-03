import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Rooms() {
  const [data, setData] = useState({ rooms: [], total: 0 }); const [page, setPage] = useState(1); const [showAdd, setShowAdd] = useState(false); const [editId, setEditId] = useState(null); const [hostelFilter, setHostelFilter] = useState('');
  const [form, setForm] = useState({ room_no: '', floor: '', room_type: 'Double', hostel_type: 'boys', capacity: 2, fee_per_month: '', description: '', status: 'Available' });
  const load = () => { api.get('/admin/rooms', { params: { page, hostel_type: hostelFilter || undefined } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page, hostelFilter]);
  const handleSubmit = async (e) => { e.preventDefault();
    if (editId) { await api.put(`/admin/rooms/${editId}`, form); } else { await api.post('/admin/rooms', form); }
    setShowAdd(false); setEditId(null); load(); };
  const handleEdit = (r) => { setForm({ room_no: r.room_no, floor: r.floor, room_type: r.room_type, hostel_type: r.hostel_type, capacity: r.capacity, fee_per_month: r.fee_per_month, description: r.description, status: r.status }); setEditId(r.id); setShowAdd(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/rooms/${id}`); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Rooms</h4>
        <div>
          <div className="btn-group me-2">
            <button className={`btn btn-sm ${!hostelFilter ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setHostelFilter('')}>All</button>
            <button className={`btn btn-sm ${hostelFilter === 'boys' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setHostelFilter('boys')}><i className="bi bi-building me-1"></i>Boys Hostel</button>
            <button className={`btn btn-sm ${hostelFilter === 'girls' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setHostelFilter('girls')}><i className="bi bi-building me-1"></i>Girls Hostel</button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setForm({ room_no: '', floor: '', room_type: 'Double', hostel_type: hostelFilter || 'boys', capacity: 2, fee_per_month: '', description: '', status: 'Available' }); setEditId(null); setShowAdd(true); }}><i className="bi bi-plus"></i> Add</button>
        </div>
      </div>
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Room No" value={form.room_no} onChange={e => setForm({...form, room_no: e.target.value})} required /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Floor" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} /></div>
          <div className="col-md-3"><select className="form-select form-select-sm" value={form.room_type} onChange={e => setForm({...form, room_type: e.target.value})}><option>Single</option><option>Double</option><option>Triple</option><option>Dormitory</option></select></div>
          <div className="col-md-3"><select className="form-select form-select-sm" value={form.hostel_type} onChange={e => setForm({...form, hostel_type: e.target.value})}><option value="boys">Boys Hostel</option><option value="girls">Girls Hostel</option></select></div>
          <div className="col-md-3"><input className="form-control form-control-sm" type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" type="number" placeholder="Fee/Month" value={form.fee_per_month} onChange={e => setForm({...form, fee_per_month: e.target.value})} /></div>
          <div className="col-md-3"><select className="form-select form-select-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option>Available</option><option>Full</option><option>Maintenance</option></select></div>
          <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="col-12"><button className="btn btn-primary btn-sm">{editId ? 'Update' : 'Add'}</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button></div>
        </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>#</th><th>Room</th><th>Floor</th><th>Type</th><th>Hostel</th><th>Capacity</th><th>Occupancy</th><th>Available</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{data.rooms.map((r, i) => <tr key={r.id}>
          <td>{i+1}</td><td>{r.room_no}</td><td>{r.floor}</td><td>{r.room_type}</td>
          <td><span className={`badge bg-${r.hostel_type === 'boys' ? 'primary' : 'danger'}`}>{r.hostel_type === 'boys' ? 'Boys' : 'Girls'}</span></td>
          <td>{r.capacity}</td><td>{r.occupancy}</td><td>{r.available_beds}</td>
          <td>₹{r.fee_per_month}</td>
          <td><span className={`badge bg-${r.status === 'Available' ? 'success' : r.status === 'Full' ? 'danger' : 'warning'}`}>{r.status}</span></td>
          <td><button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(r)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}><i className="bi bi-trash"></i></button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
