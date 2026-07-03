import { NavLink } from 'react-router-dom';

const sections = [
  { heading: 'Main', links: [{ to: '/admin', icon: 'speedometer2', label: 'Dashboard', end: true }] },
  { heading: 'Accommodation', links: [
    { to: '/admin/students', icon: 'people', label: 'Students' },
    { to: '/admin/rooms', icon: 'door-open', label: 'Rooms' },
    { to: '/admin/allocations', icon: 'layout-split', label: 'Allocations' },
    { to: '/admin/room-changes', icon: 'arrow-left-right', label: 'Room Changes' },
  ]},
  { heading: 'Finance', links: [{ to: '/admin/fees', icon: 'currency-rupee', label: 'Fees' }] },
  { heading: 'Management', links: [
    { to: '/admin/wardens', icon: 'shield-check', label: 'Wardens' },
    { to: '/admin/attendance', icon: 'calendar-check', label: 'Attendance' },
    { to: '/admin/complaints', icon: 'exclamation-triangle', label: 'Complaints' },
    { to: '/admin/leaves', icon: 'calendar-event', label: 'Leaves' },
    { to: '/admin/maintenance', icon: 'tools', label: 'Maintenance' },
    { to: '/admin/emergency', icon: 'exclamation-circle', label: 'Emergency' },
    { to: '/admin/vacate-requests', icon: 'box-arrow-right', label: 'Vacate Requests' },
    { to: '/admin/vacated-students', icon: 'archive', label: 'Vacated' },
  ]},
  { heading: 'Operations', links: [
    { to: '/admin/staff', icon: 'person-badge', label: 'Staff' },
    { to: '/admin/notices', icon: 'megaphone', label: 'Notices' },
    { to: '/admin/mess-menu', icon: 'cup-hot', label: 'Mess Menu' },
    { to: '/admin/events', icon: 'calendar', label: 'Events' },
    { to: '/admin/visitors', icon: 'people', label: 'Visitors' },
  ]},
  { heading: 'Analytics', links: [
    { to: '/admin/occupancy', icon: 'building', label: 'Room Occupancy' },
  ]},
  { heading: 'Reports & More', links: [
    { to: '/admin/reports', icon: 'file-text', label: 'Reports' },
    { to: '/admin/notifications', icon: 'bell', label: 'Notifications' },
    { to: '/admin/digital-ids', icon: 'credit-card', label: 'Digital ID' },
    { to: '/admin/student-timeline', icon: 'clock-history', label: 'Student Timeline' },
    { to: '/admin/room-maintenance-history', icon: 'wrench', label: 'Maint. History' },
    { to: '/admin/backup', icon: 'cloud-download', label: 'Backup' },
    { to: '/admin/profile', icon: 'person-gear', label: 'Profile' },
  ]},
];

export default function AdminSidebar() {
  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-0" style={{ width: 250, position: 'fixed', top: 57, left: 0, bottom: 0, zIndex: 100, overflowY: 'auto', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}>
      <h6 className="sidebar-section text-muted" style={{ padding: '0.5rem 0.75rem', margin: '0.75rem 0.5rem 0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
        <i className="bi bi-shield-lock me-2"></i>Admin Panel
      </h6>
      <ul className="nav nav-pills flex-column mb-auto">
        {sections.map((section, si) => (
          <li key={si}>
            {section.heading !== 'Main' && <div className="sidebar-section" style={{ padding: '0.5rem 0.75rem', margin: '0.75rem 0.5rem 0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray-500)', fontWeight: 600 }}>{section.heading}</div>}
            {section.links.map(l => (
              <div className="nav-item" key={l.to} style={{ padding: '0 0.5rem' }}>
                <NavLink to={l.to} end={l.end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={({ isActive }) => ({
                  padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1px',
                  color: isActive ? 'white' : 'var(--gray-400)', fontSize: '0.875rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: isActive ? 'rgba(79,70,229,0.2)' : 'transparent', textDecoration: 'none'
                })}>
                  <i className={`bi bi-${l.icon}`} style={{ fontSize: '1.1rem', width: 20, textAlign: 'center', flexShrink: 0 }}></i>
                  {l.label}
                </NavLink>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
