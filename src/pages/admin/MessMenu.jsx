import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function MessMenu() {
  const [items, setItems] = useState([]); const [showAdd, setShowAdd] = useState(false); const [editId, setEditId] = useState(null); const [form, setForm] = useState({ day: 'Monday', meal_type: 'Breakfast', menu_items: '', date: '' });
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']; const meals = ['Breakfast','Lunch','Evening Snacks','Dinner'];
  const load = () => { api.get('/admin/mess-menu').then(r => setItems(r.data)); };
  useEffect(() => { load(); }, []);
  const handleSubmit = async (e) => { e.preventDefault();
    if (editId) { await api.put(`/admin/mess-menu/${editId}`, form); } else { await api.post('/admin/mess-menu', form); } setShowAdd(false); setEditId(null); load(); };
  const handleEdit = (m) => { setForm(m); setEditId(m.id); setShowAdd(true); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/admin/mess-menu/${id}`); load(); };
  const grouped = {}; items.forEach(m => { if (!grouped[m.day]) grouped[m.day] = []; grouped[m.day].push(m); });
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Mess Menu</h4><button className="btn btn-primary btn-sm" onClick={() => { setForm({ day: 'Monday', meal_type: 'Breakfast', menu_items: '', date: '' }); setEditId(null); setShowAdd(true); }}><i className="bi bi-plus"></i> Add</button></div>
      {showAdd && <div className="card mb-3"><div className="card-body">
        <form onSubmit={handleSubmit}><div className="row g-2">
          <div className="col-md-3"><select className="form-select form-select-sm" value={form.day} onChange={e => setForm({...form, day: e.target.value})}>{days.map(d => <option key={d}>{d}</option>)}</select></div>
          <div className="col-md-3"><select className="form-select form-select-sm" value={form.meal_type} onChange={e => setForm({...form, meal_type: e.target.value})}>{meals.map(m => <option key={m}>{m}</option>)}</select></div>
          <div className="col-md-4"><input className="form-control form-control-sm" placeholder="Menu items" value={form.menu_items} onChange={e => setForm({...form, menu_items: e.target.value})} required /></div>
          <div className="col-md-2"><input className="form-control form-control-sm" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
          <div className="col-12"><button className="btn btn-primary btn-sm">{editId ? 'Update' : 'Add'}</button><button className="btn btn-secondary btn-sm ms-2" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button></div>
        </div></form></div></div>}
      <div className="row g-3">{days.map(day => items.filter(m => m.day === day).length > 0 && <div className="col-md-4" key={day}>
        <div className="card"><div className="card-header fw-bold">{day}</div><div className="card-body p-2">
          {grouped[day]?.map(m => <div key={m.id} className="d-flex justify-content-between align-items-center mb-1 p-1 border-bottom">
            <div><small className="fw-medium">{m.meal_type}</small><br /><small className="text-muted">{m.menu_items}</small></div>
            <div><button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(m)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}><i className="bi bi-trash"></i></button></div>
          </div>)}</div></div></div>)}</div>
    </div>
  );
}
