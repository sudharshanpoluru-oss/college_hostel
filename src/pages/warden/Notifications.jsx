import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function WardenNotifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { api.get('/warden/notifications').then(r => setNotifications(r.data)); }, []);
  const markRead = async (id) => { await api.put(`/warden/notifications/read/${id}`); api.get('/warden/notifications').then(r => setNotifications(r.data)); };
  return (
    <div>
      <h4 className="fw-bold mb-3">Notifications</h4>
      <div className="list-group">{notifications.map(n => <div key={n.id} className={`list-group-item d-flex justify-content-between ${!n.is_read ? 'fw-bold' : ''}`}>
        <div><small className="text-muted">{n.module && `[${n.module}] `}</small>{n.title}<br /><small>{n.message}</small></div>
        <div className="text-end"><small className="text-muted">{n.created_at?.split(' ')[0]}</small>{!n.is_read && <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => markRead(n.id)}>Read</button>}</div>
      </div>)}</div>
    </div>
  );
}
