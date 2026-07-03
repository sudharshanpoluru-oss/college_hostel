import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3"><i className="bi bi-building text-primary"></i> Hostel Management</h5>
            <p className="small text-secondary mb-3">Providing safe, comfortable, and affordable accommodation for students since 2010. We are committed to creating a home-like environment that fosters academic excellence.</p>
            <div className="d-flex gap-2">
              <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-link"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="social-link"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-link"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <h6>Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/about">About Us</Link></li>
              <li className="mb-2"><Link to="/rooms">Our Rooms</Link></li>
              <li className="mb-2"><Link to="/amenities">Amenities</Link></li>
              <li className="mb-2"><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-4">
            <h6>For Students</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/login?role=student">Student Login</Link></li>
              <li className="mb-2"><Link to="/register">Register Now</Link></li>
              <li className="mb-2"><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-4">
            <h6>Contact</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><i className="bi bi-geo-alt text-primary me-1"></i> YSR Engineering College, Korrapadu Road, Proddatur - 516360</li>
              <li className="mb-2"><i className="bi bi-telephone text-primary me-1"></i> +91 8564 254770</li>
              <li className="mb-2"><i className="bi bi-envelope text-primary me-1"></i> principal.yvuce@gmail.com</li>
            </ul>
          </div>
        </div>
        <hr className="my-4 opacity-25" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="small mb-0 text-secondary">&copy; {new Date().getFullYear()} Hostel Management. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="#" className="small text-decoration-none me-3">Privacy Policy</a>
            <a href="#" className="small text-decoration-none me-3">Terms of Service</a>
            <Link to="/contact" className="small text-decoration-none">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
