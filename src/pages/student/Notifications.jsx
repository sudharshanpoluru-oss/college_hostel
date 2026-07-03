import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { api.get('/student/notifications').then(r => setNotifications(r.data)); }, []);
  const markRead = async (id) => { await api.put(`/student/notifications/read/${id}`); api.get('/student/notifications').then(r => setNotifications(r.data)); };
  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-bell me-2"></i>Notifications</h4>
      <div className="list-group">{notifications.map(n => <div key={n.id} className={`list-group-item d-flex justify-content-between align-items-center ${!n.is_read ? 'fw-bold border-primary' : ''}`}>
        <div><span className={`badge bg-${n.type === 'danger' ? 'danger' : n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'info'} me-2`}>{n.type}</span>{n.title}<br /><small className="text-muted">{n.message}<br />{n.created_at}</small></div>
        {!n.is_read && <button className="btn btn-sm btn-outline-secondary" onClick={() => markRead(n.id)}>Mark Read</button>}
      </div>)}</div>
    </div>
  );
}
