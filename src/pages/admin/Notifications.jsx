import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Notifications() {
  const [data, setData] = useState({ notifications: [], total: 0 }); const [filter, setFilter] = useState('');
  const load = () => { api.get('/admin/notifications', { params: { type: filter || undefined } }).then(r => setData(r.data)); };
  useEffect(() => { load(); }, [filter]);
  const markRead = async (id) => { await api.put(`/admin/notifications/read/${id}`); load(); };
  const markAllRead = async () => { await api.put('/admin/notifications/read-all'); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Notifications</h4><button className="btn btn-sm btn-outline-primary" onClick={markAllRead}>Mark All Read</button></div>
      <div className="d-flex gap-2 mb-3">
        {['', 'unread', 'read'].map(f => <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter(f)}>{f || 'All'}</button>)}
      </div>
      <div className="list-group">{data.notifications.map(n => <div key={n.id} className={`list-group-item list-group-item-action d-flex justify-content-between ${!n.is_read ? 'fw-bold' : ''}`}>
        <div><small className="text-muted">{n.module && `[${n.module}] `}</small>{n.title}<br /><small className="text-muted">{n.message}</small></div>
        <div className="text-end"><small className="text-muted">{n.created_at?.split(' ')[0]}</small>{!n.is_read && <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => markRead(n.id)}>Read</button>}</div>
      </div>)}</div>
    </div>
  );
}
