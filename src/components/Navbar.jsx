import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = (e) => { e.preventDefault(); e.stopPropagation(); logout(); navigate('/'); };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/"><i className="bi bi-building"></i> Hostel Management System</Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item"><Link className="nav-link text-dark" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/rooms">Rooms</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/amenities">Amenities</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/gallery">Gallery</Link></li>
            <li className="nav-item"><Link className="nav-link text-dark" to="/contact">Contact</Link></li>
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link text-dark dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle text-primary me-1"></i>{user.username}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to={user.role === 'admin' ? '/admin' : user.role === 'warden' ? '/warden' : '/student'}><i className="bi bi-speedometer2"></i> Dashboard</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item text-danger fw-bold" href="#" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Logout</a></li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-success text-white fw-semibold px-3" to="/login?role=student"><i className="bi bi-person"></i> Student Login</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-outline-warning fw-semibold px-3" to="/login?role=warden"><i className="bi bi-shield-check"></i> Warden</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-outline-primary fw-semibold px-3" to="/login?role=admin"><i className="bi bi-shield-lock"></i> Admin</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
