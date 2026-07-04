import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenVisitors() {
  const [data, setData] = useState({ visitors: [], total: 0, students: [] }); const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [showAdd, setShowAdd] = useState(false); const [form, setForm] = useState({ visitor_name: '', contact: '', purpose: '', student_id: '', remarks: '' });
  const load = () => { api.get('/warden/visitors', { params: { page, search } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page, search]);
  const handleSubmit = async (e) => { e.preventDefault(); await api.post('/warden/visitors', form); setShowAdd(false); load(); };
  const handleApprove = async (id) => { await api.put(`/warden/visitors/${id}/approve`); load(); };
  const handleCheckout = async (id) => { await api.put(`/warden/visitors/${id}/checkout`); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Visitors</h4><button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><i className="bi bi-plus"></i> Log</button></div>
      <input className="form-control mb-3" style={{ width: 300 }} placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Visitor Name" value={form.visitor_name} onChange={e => setForm({...form, visitor_name: e.target.value})} required /></div>
          <div className="col-md-2"><input className="form-control form-control-sm" placeholder="Contact" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} /></div>
          <div className="col-md-3"><input className="form-control form-control-sm" placeholder="Purpose" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} /></div>
          <div className="col-md-2"><select className="form-select form-select-sm" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})}><option value="">Student (optional)</option>{data.students?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div className="col-md-2"><button className="btn btn-primary btn-sm w-100">Log</button></div>
        </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Visitor</th><th>Contact</th><th>Purpose</th><th>Student</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{data.visitors.map(v => <tr key={v.id}>
          <td>{v.visitor_name}</td><td>{v.contact}</td><td>{v.purpose}</td><td>{v.student_name || '-'}</td><td>{v.check_in?.split(' ')[0]}</td><td>{v.check_out?.split(' ')[0] || '-'}</td>
          <td><span className={`badge bg-${v.status === 'Approved' ? 'success' : 'warning'}`}>{v.status || 'Pending'}</span></td>
          <td>{v.status !== 'Approved' && <button className="btn btn-sm btn-success me-1" onClick={() => handleApprove(v.id)}>Approve</button>}{!v.check_out && <button className="btn btn-sm btn-outline-warning" onClick={() => handleCheckout(v.id)}>Check Out</button>}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
