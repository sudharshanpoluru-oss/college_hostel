import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  useEffect(() => { api.get('/student/notices').then(r => setNotices(r.data)); }, []);
  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-megaphone me-2"></i>Notices</h4>
      <div className="list-group">{notices.map(n => <div key={n.id} className="list-group-item">
        <div className="d-flex justify-content-between"><h6 className="fw-bold mb-1">{n.title}</h6><span className={`badge bg-${n.priority === 'Critical' ? 'danger' : n.priority === 'Urgent' ? 'warning' : 'info'}`}>{n.priority}</span></div>
        <p className="mb-1 small">{n.content}</p>
        <small className="text-muted">{n.publish_date} {n.expiry_date && `| Expires: ${n.expiry_date}`}</small>
      </div>)}</div>
    </div>
  );
}
