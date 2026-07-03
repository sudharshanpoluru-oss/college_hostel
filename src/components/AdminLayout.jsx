import { Outlet, useLocation, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathParts[1] ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1).replace(/-/g, ' ') : 'Dashboard';

  return (
    <div>
      <AdminNavbar />
      <AdminSidebar />
      <main className="main-content" style={{ marginLeft: 250, paddingTop: '57px', minHeight: '100vh' }}>
        <div className="p-4 bg-light" style={{ minHeight: 'calc(100vh - 57px)' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 className="mb-0 fw-bold">{pageTitle}</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
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
      </main>
    </div>
  );
}
