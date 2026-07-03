import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function RoomChange() {
  const [data, setData] = useState(null); const [form, setForm] = useState({ requested_room_id: '', reason: '' });
  useEffect(() => { api.get('/student/room-change').then(r => setData(r.data)); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/student/room-change', form); setForm({ requested_room_id: '', reason: '' }); api.get('/student/room-change').then(r => setData(r.data)); };
  const selectedRoom = data?.rooms?.find(r => r.id === +form.requested_room_id);
  return (
    <div>
      <h4 className="fw-bold mb-4">Room Change Request</h4>
      <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-5"><select className="form-select" value={form.requested_room_id} onChange={e => setForm({...form, requested_room_id: e.target.value})} required><option value="">Select Room</option>{data?.rooms?.map(r => <option key={r.id} value={r.id}>Room {r.room_no} - {r.room_type} ({r.occupants?.length || 0}/{r.capacity}) ₹{r.fee_per_month}</option>)}</select>
            {selectedRoom && selectedRoom.occupants?.length > 0 && <div className="mt-2 p-2 bg-light rounded small">{selectedRoom.occupants.map((o, i) => <div key={i} className="border-bottom pb-1 mb-1"><strong>{o.name}</strong> <span className="text-muted">({o.roll_no}) - {o.course || '—'}</span></div>)}</div>}
          </div>
          <div className="col-md-5"><input className="form-control" placeholder="Reason" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required /></div>
          <div className="col-md-2"><button className="btn btn-primary w-100">Request</button></div>
        </div></form>
      </div></div>
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Current Room</th><th>Requested Room</th><th>Reason</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{data?.requests?.map(r => <tr key={r.id}>
          <td>{r.current_room_id}</td><td>{r.requested_room_id}</td><td>{r.reason?.substring(0, 40)}</td>
          <td><span className={`badge bg-${r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}`}>{r.status}</span></td>
          <td>{r.applied_at?.split(' ')[0]}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
