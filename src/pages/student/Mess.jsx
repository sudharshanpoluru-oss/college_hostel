import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Mess() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/student/mess').then(r => setItems(r.data)); }, []);
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const grouped = {}; items.forEach(m => { if (!grouped[m.day]) grouped[m.day] = []; grouped[m.day].push(m); });
  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-cup-hot me-2"></i>Mess Menu</h4>
      <div className="row g-3">{days.map(day => grouped[day]?.length ? <div className="col-md-4" key={day}>
        <div className="card"><div className="card-header fw-bold">{day}</div><div className="card-body p-2">{grouped[day].map(m => <div key={m.id} className="mb-1 pb-1 border-bottom"><small className="fw-medium">{m.meal_type}</small><br /><small>{m.menu_items}</small></div>)}</div></div>
      </div> : null)}</div>
    </div>
  );
}
