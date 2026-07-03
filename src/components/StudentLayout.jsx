import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';

const links = [
  { to: '/student', icon: 'speedometer2', label: 'Dashboard', end: true },
  { to: '/student/profile', icon: 'person', label: 'Profile' },
  { to: '/student/my-room', icon: 'door-open', label: 'My Room' },
  { to: '/student/attendance', icon: 'calendar-check', label: 'Attendance' },
  { to: '/student/fees', icon: 'currency-rupee', label: 'Fees' },
  { to: '/student/complaints', icon: 'exclamation-triangle', label: 'Complaints' },
  { to: '/student/leave', icon: 'calendar-event', label: 'Leave' },
  { to: '/student/maintenance', icon: 'tools', label: 'Maintenance' },
  { to: '/student/mess', icon: 'cup-hot', label: 'Mess Menu' },
  { to: '/student/notices', icon: 'megaphone', label: 'Notices' },
  { to: '/student/events', icon: 'calendar', label: 'Events' },
  { to: '/student/room-change', icon: 'arrow-left-right', label: 'Change Room' },
  { to: '/student/emergency', icon: 'exclamation-circle', label: 'Emergency' },
  { to: '/student/vacate', icon: 'box-arrow-right', label: 'Vacate' },
  { to: '/student/notifications', icon: 'bell', label: 'Notifications' },
  { to: '/student/pay', icon: 'credit-card', label: 'Pay Fees' },
  { to: '/student/upi-pay', icon: 'phone', label: 'UPI Pay' },
];

export default function StudentLayout() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathParts[1] ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1).replace(/-/g, ' ') : 'Dashboard';

  return (
    <div>
      <StudentNavbar />
      <div className="d-flex">
        <div className="sidebar d-flex flex-column flex-shrink-0 p-0" style={{ width: 250, position: 'fixed', top: 57, left: 0, bottom: 0, zIndex: 100, overflowY: 'auto', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}>
          <h6 className="sidebar-section text-muted"><i className="bi bi-person me-2"></i>Student Panel</h6>
          <ul className="nav nav-pills flex-column mb-auto">
            {links.map(l => (
              <li className="nav-item" key={l.to} style={{ padding: '0 0.5rem' }}>
                <NavLink to={l.to} end={l.end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={({ isActive }) => ({
                  padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1px',
                  color: isActive ? 'white' : 'var(--gray-400)', fontSize: '0.875rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: isActive ? 'rgba(79,70,229,0.2)' : 'transparent'
                })}>
                  <i className={`bi bi-${l.icon}`} style={{ fontSize: '1.1rem', width: 20, textAlign: 'center', flexShrink: 0 }}></i>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-grow-1 bg-light" style={{ marginLeft: 250, minHeight: '100vh' }}>
          <div className="px-4 pb-4" style={{ paddingTop: 'calc(1.5rem + 57px)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h4 className="mb-0 fw-bold">{pageTitle}</h4>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/student">Dashboard</Link></li>
                    {pathParts.slice(1).map((part, i) => {
                      const to = '/' + pathParts.slice(0, i + 2).join('/');
                      const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
                      return i === pathParts.length - 2
                        ? <li className="breadcrumb-item active" key={i}>{label}</li>
                        : <li className="breadcrumb-item" key={i}><Link to={to}>{label}</Link></li>;
                    })}
                  </ol>
                </nav>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
