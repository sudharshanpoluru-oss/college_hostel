import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Fees() {
  const [data, setData] = useState({ fees: [], total: 0, totalPaid: 0, totalDue: 0, students: [] }); const [page, setPage] = useState(1); const [showAdd, setShowAdd] = useState(false); const [showBulk, setShowBulk] = useState(false); const [editId, setEditId] = useState(null); const [form, setForm] = useState({ student_id: '', total_fee: '', paid_amount: '', payment_mode: 'Cash', receipt_no: '', payment_date: new Date().toISOString().split('T')[0] }); const [bulkForm, setBulkForm] = useState({ total_fee: '', hostel_type: '' });
  const load = () => { api.get('/admin/fees', { params: { page } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [page]);
  const handleSubmit = async (e) => { e.preventDefault();
    try { if (editId) { await api.put(`/admin/fees/${editId}`, form); } else { await api.post('/admin/fees', form); } setShowAdd(false); setEditId(null); load(); } catch (e) { alert(e.response?.data?.error || 'Error'); } };
  const handleEdit = (f) => { setForm({ student_id: f.student_id, total_fee: f.total_fee, paid_amount: f.paid_amount, payment_mode: f.payment_mode, receipt_no: f.receipt_no, payment_date: f.payment_date ? f.payment_date.split(' ')[0] : '' }); setEditId(f.id); setShowAdd(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/fees/${id}`); load(); };
  const handleBulkApply = async (e) => { e.preventDefault();
    try { await api.post('/admin/fees/bulk', bulkForm); setShowBulk(false); setBulkForm({ total_fee: '', hostel_type: '' }); load(); } catch (e) { alert(e.response?.data?.error || 'Error'); } };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Fees</h4><div><button className="btn btn-outline-primary btn-sm me-2" onClick={() => setShowBulk(true)}><i className="bi bi-people"></i> Bulk Fee</button><button className="btn btn-primary btn-sm" onClick={() => { setForm({ student_id: '', total_fee: '', paid_amount: '', payment_mode: 'Cash', receipt_no: '', payment_date: new Date().toISOString().split('T')[0] }); setEditId(null); setShowAdd(true); }}><i className="bi bi-plus"></i> Add</button></div></div>
      <div className="row g-2 mb-3"><div className="col-md-4"><div className="card bg-success text-white"><div className="card-body"><h5>₹{Number(data.totalPaid).toLocaleString()}</h5><small>Total Collected</small></div></div></div><div className="col-md-4"><div className="card bg-danger text-white"><div className="card-body"><h5>₹{Number(data.totalDue).toLocaleString()}</h5><small>Total Due</small></div></div></div></div>
      {showBulk && <div className="card mb-3 border-info"><div className="card-body">
        <h5 className="fw-bold">Bulk Fee Apply</h5>
        <form onSubmit={handleBulkApply}><div className="row g-2">
          <div className="col-md-4"><input className="form-control form-control-sm" type="number" placeholder="Total Fee Amount" value={bulkForm.total_fee} onChange={e => setBulkForm({...bulkForm, total_fee: e.target.value})} required /></div>
          <div className="col-md-3"><select className="form-select form-select-sm" value={bulkForm.hostel_type} onChange={e => setBulkForm({...bulkForm, hostel_type: e.target.value})}><option value="">All Hostels</option><option value="boys">Boys Hostel</option><option value="girls">Girls Hostel</option></select></div>
          <div className="col-md-5"><button className="btn btn-info btn-sm">Apply to All Active Students</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowBulk(false); setBulkForm({ total_fee: '', hostel_type: '' }); }}>Cancel</button></div>
        </div></form></div></div>}
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-4"><select className="form-select form-select-sm" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} required><option value="">Select Student</option>{data.students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}</select></div>
          <div className="col-md-2"><input className="form-control form-control-sm" type="number" placeholder="Total Fee" value={form.total_fee} onChange={e => setForm({...form, total_fee: e.target.value})} required /></div>
          <div className="col-md-2"><input className="form-control form-control-sm" type="number" placeholder="Paid Amount" value={form.paid_amount} onChange={e => setForm({...form, paid_amount: e.target.value})} required /></div>
          <div className="col-md-2"><select className="form-select form-select-sm" value={form.payment_mode} onChange={e => setForm({...form, payment_mode: e.target.value})}><option>Cash</option><option>Online</option><option>Cheque</option><option>DD</option></select></div>
          <div className="col-md-1"><input className="form-control form-control-sm" placeholder="Receipt" value={form.receipt_no} onChange={e => setForm({...form, receipt_no: e.target.value})} /></div>
          <div className="col-md-1"><input className="form-control form-control-sm" type="date" value={form.payment_date} onChange={e => setForm({...form, payment_date: e.target.value})} /></div>
          <div className="col-12"><button className="btn btn-primary btn-sm">{editId ? 'Update' : 'Add'}</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button></div>
        </div></form></div></div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>#</th><th>Student</th><th>Total</th><th>Paid</th><th>Due</th><th>Mode</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{data.fees.map((f, i) => <tr key={f.id}>
          <td>{i+1}</td><td>{f.student_name}<br /><small>{f.roll_no}</small></td><td>₹{f.total_fee}</td><td>₹{f.paid_amount}</td><td>₹{Number(f.total_fee - f.paid_amount).toFixed(2)}</td><td>{f.payment_mode}</td><td>{f.payment_date}</td>
          <td><span className={`badge bg-${f.status === 'Paid' ? 'success' : f.status === 'Partial' ? 'warning' : 'secondary'}`}>{f.status}</span></td>
          <td><button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(f)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}><i className="bi bi-trash"></i></button></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
