import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function DigitalIds() {
  const [data, setData] = useState({ students: [], total: 0 }); const [search, setSearch] = useState(''); const [viewId, setViewId] = useState(null); const [card, setCard] = useState(null); const [form, setForm] = useState({ blood_group: '', emergency_contact: '', emergency_name: '' });
  const load = () => { api.get('/admin/digital-ids', { params: { search } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [search]);
  const viewCard = async (id) => { const r = await api.get(`/admin/digital-ids/${id}`); setCard(r.data); setViewId(id); setForm({ blood_group: r.data.digitalId?.blood_group || '', emergency_contact: r.data.digitalId?.emergency_contact || '', emergency_name: r.data.digitalId?.emergency_name || '' }); };
  const updateId = async () => { await api.put(`/admin/digital-ids/${viewId}`, form); alert('Updated!'); viewCard(viewId); };
  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-credit-card me-2"></i>Digital ID Cards</h4>
      <input className="form-control mb-3" style={{ width: 300 }} placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0"><tbody>
            {data.students.map(s => <tr key={s.id} className={viewId === s.id ? 'table-primary' : ''}>
              <td>{s.name}<br /><small className="text-muted">{s.roll_no}</small></td><td>{s.room_no || '-'}</td><td><button className="btn btn-sm btn-outline-primary" onClick={() => viewCard(s.id)}>View ID</button></td>
            </tr>)}</tbody></table></div></div>
        </div>
        <div className="col-md-6">
          {card && <div className="card border-primary"><div className="card-body text-center">
            <h5 className="fw-bold mb-1">{card.student.name}</h5>
            <p className="mb-1"><strong>Roll:</strong> {card.student.roll_no}<br /><strong>Room:</strong> {card.student.room_no} ({card.student.room_type})</p>
            <p className="mb-1"><strong>ID:</strong> {card.digitalId?.id_number}</p>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <div><strong>Blood:</strong> {card.digitalId?.blood_group || '-'}</div>
              <div><strong>Emergency:</strong> {card.digitalId?.emergency_contact || '-'}</div>
            </div>
            <hr />
            <div className="row g-2"><div className="col-4"><input className="form-control form-control-sm" placeholder="Blood Group" value={form.blood_group} onChange={e => setForm({...form, blood_group: e.target.value})} /></div>
              <div className="col-4"><input className="form-control form-control-sm" placeholder="Emergency Contact" value={form.emergency_contact} onChange={e => setForm({...form, emergency_contact: e.target.value})} /></div>
              <div className="col-4"><input className="form-control form-control-sm" placeholder="Contact Name" value={form.emergency_name} onChange={e => setForm({...form, emergency_name: e.target.value})} /></div>
              <div className="col-12"><button className="btn btn-primary btn-sm w-100" onClick={updateId}>Update ID Card</button></div>
            </div>
          </div></div>}
        </div>
      </div>
    </div>
  );
}
