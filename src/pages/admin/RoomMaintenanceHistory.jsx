import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function RoomMaintenanceHistory() {
  const [rooms, setRooms] = useState([]); const [roomId, setRoomId] = useState(null); const [records, setRecords] = useState([]); const [roomInfo, setRoomInfo] = useState(null); const [totalCost, setTotalCost] = useState(0); const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState(null); const [form, setForm] = useState({ room_id: '', problem: '', solution: '', category: '', completed_by: '', remarks: '', cost: '', repair_date: new Date().toISOString().split('T')[0] });

  const loadRooms = async () => { const r = await api.get('/admin/rooms', { params: { limit: 50 } }); setRooms(r.data.rooms); };
  const loadRecords = async (id) => {
    setRoomId(id); const r = await api.get('/admin/maintenance-history', { params: { room_id: id } }); setRecords(r.data.records);
    const [room] = r.data.records?.length ? [r.data.records[0]] : [null];
    const rr = await api.get(`/admin/rooms/${id}`); setRoomInfo(rr.data.room); const [cr] = await api.get('/admin/maintenance-history', { params: { room_id: id } }); setTotalCost(cr.data.totalCost || 0);
  };

  useEffect(() => { loadRooms(); }, [search]);
  const handleSubmit = async (e) => { e.preventDefault();
    try { if (editId) { await api.put(`/admin/maintenance-history/${editId}`, form); } else { await api.post('/admin/maintenance-history', { ...form, room_id: roomId }); } setShowForm(false); setEditId(null); loadRecords(roomId); } catch (e) { alert('Error'); } };
  const handleEdit = (r) => { setForm({ problem: r.problem, solution: r.solution || '', category: r.category || '', completed_by: r.completed_by || '', remarks: r.remarks || '', cost: r.cost || '', repair_date: r.repair_date }); setEditId(r.id); setShowForm(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/maintenance-history/${id}`); loadRecords(roomId); };

  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-tools me-2"></i>Room Maintenance History</h4>
      {!roomId ? (
        <div>
          <input className="form-control mb-3" style={{ width: 300 }} placeholder="Search room..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
            <thead><tr><th>Room No</th><th>Floor</th><th>Type</th><th>Status</th><th>Repairs</th><th>Last Repair</th><th>Actions</th></tr></thead>
            <tbody>{rooms.map(r => <tr key={r.id}>
              <td>{r.room_no}</td><td>{r.floor}</td><td>{r.room_type}</td><td><span className={`badge bg-${r.status === 'Available' ? 'success' : r.status === 'Full' ? 'warning' : 'secondary'}`}>{r.status}</span></td>
              <td><span className="badge bg-info">{r.repair_count || 0}</span></td><td>{r.last_repair || 'N/A'}</td>
              <td><button className="btn btn-sm btn-outline-primary" onClick={() => loadRecords(r.id)}><i className="bi bi-clock-history"></i> History</button></td>
            </tr>)}</tbody></table></div></div>
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div><button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setRoomId(null); setRecords([]); setRoomInfo(null); }}><i className="bi bi-arrow-left"></i> All Rooms</button><strong>Room {roomInfo?.room_no}</strong> &middot; {roomInfo?.floor} &middot; {roomInfo?.room_type}</div>
            <div><span className="badge bg-dark me-2">Total Cost: ₹{Number(totalCost).toFixed(2)}</span><button className="btn btn-primary btn-sm" onClick={() => { setForm({ problem: '', solution: '', category: '', completed_by: '', remarks: '', cost: '', repair_date: new Date().toISOString().split('T')[0] }); setEditId(null); setShowForm(true); }}><i className="bi bi-plus"></i> Add Record</button></div>
          </div>
          {showForm && <div className="card mb-3"><div className="card-body">
            <form onSubmit={handleSubmit}><div className="row g-2">
              <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Problem" value={form.problem} onChange={e => setForm({...form, problem: e.target.value})} required /></div>
              <div className="col-md-2"><select className="form-select form-select-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="">Category</option><option>Electrical</option><option>Plumbing</option><option>Furniture</option><option>Internet</option><option>Cleaning</option><option>Painting</option><option>Water Supply</option><option>Carpentry</option><option>Other</option></select></div>
              <div className="col-md-2"><input className="form-control form-control-sm" type="date" value={form.repair_date} onChange={e => setForm({...form, repair_date: e.target.value})} required /></div>
              <div className="col-md-2"><input className="form-control form-control-sm" placeholder="Completed by" value={form.completed_by} onChange={e => setForm({...form, completed_by: e.target.value})} /></div>
              <div className="col-md-2"><input className="form-control form-control-sm" type="number" step="0.01" placeholder="Cost (₹)" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} /></div>
              <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Solution" value={form.solution} onChange={e => setForm({...form, solution: e.target.value})} /></div>
              <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Remarks" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} /></div>
              <div className="col-12"><button className="btn btn-primary btn-sm">{editId ? 'Update' : 'Add'} Record</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button></div>
            </div></form>
          </div></div>}
          <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
            <thead><tr><th>Date</th><th>Problem</th><th>Category</th><th>Completed By</th><th>Cost</th><th>Actions</th></tr></thead>
            <tbody>{records.map(r => <tr key={r.id}>
              <td>{r.repair_date}</td><td>{r.problem}</td><td><span className="badge bg-secondary">{r.category || '-'}</span></td><td>{r.completed_by || '-'}</td><td>₹{Number(r.cost || 0).toFixed(2)}</td>
              <td><button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(r)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}><i className="bi bi-trash"></i></button></td>
            </tr>)}</tbody></table></div></div>
        </div>
      )}
    </div>
  );
}
