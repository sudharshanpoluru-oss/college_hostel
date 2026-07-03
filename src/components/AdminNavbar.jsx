import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/client';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/admin/notifications', { params: { type: 'unread', limit: 5 } }).then(r => {
      setNotifCount(r.data.total || 0);
      setNotifications(r.data.notifications || []);
    }).catch(() => {});
  }, []);

  const handleLogout = (e) => { e.preventDefault(); e.stopPropagation(); logout(); navigate('/'); };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid px-3">
        <Link className="navbar-brand fw-bold" to="/admin"><i className="bi bi-shield-lock me-2"></i>Admin Panel</Link>
        <div className="d-flex align-items-center gap-2">
          <div className="dropdown">
            <button className="btn btn-sm btn-outline-light border-0 position-relative" type="button" data-bs-toggle="dropdown">
              <i className="bi bi-bell fs-5"></i>
              {notifCount > 0 && <span className="notification-badge">{notifCount > 9 ? '9+' : notifCount}</span>}
            </button>
            <div className="dropdown-menu dropdown-menu-end notif-dropdown">
              <div className="dropdown-header d-flex justify-content-between align-items-center">
                <span>Notifications</span>
                {notifCount > 0 && <Link to="/admin/notifications" className="small text-decoration-none">Mark all read</Link>}
              </div>
              {notifications.length > 0 ? notifications.map(n => (
                <Link className={`dropdown-item notification-item ${n.is_read ? '' : 'unread'}`} to="/admin/notifications" key={n.id}>
                  <div className="d-flex align-items-start gap-2">
                    <span className={`notification-dot ${n.type || 'info'} mt-1`}></span>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold small">{n.title}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{n.message?.substring(0, 80)}</div>
                    </div>
                  </div>
                </Link>
              )) : <div className="text-center py-3 text-muted small">No notifications</div>}
              <div className="dropdown-footer"><Link to="/admin/notifications" className="small text-decoration-none">View all notifications</Link></div>
            </div>
          </div>
          <div className="dropdown">
            <a className="btn btn-sm btn-outline-light border-0 dropdown-toggle d-flex align-items-center gap-1" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-person-circle fs-5"></i>
              <span className="d-none d-sm-inline">{user?.username}</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><Link className="dropdown-item" to="/admin/profile"><i className="bi bi-person"></i> Profile</Link></li>
              <li><a className="dropdown-item" href="/" target="_blank"><i className="bi bi-globe"></i> View Site</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item text-danger fw-bold" href="#" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
