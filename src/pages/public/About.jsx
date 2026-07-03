import { Link } from 'react-router-dom';
export default function About() {
  return (
    <>
      <section className="bg-primary text-white py-5"><div className="container text-center">
        <h1 className="display-4 fw-bold">About Hostel Management</h1>
        <p className="lead">Providing quality accommodation for students since 2010</p>
      </div></section>
      <section className="bg-white py-5"><div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2 className="fw-bold">Welcome to Our Hostel</h2>
            <p>Hostel Management is a premier student accommodation facility dedicated to providing a comfortable, safe, and supportive living environment for students. Located in the heart of the city, our hostel offers easy access to major educational institutions, libraries, and recreational areas.</p>
            <p>We understand the needs of students and strive to create a home-like atmosphere where academic excellence can flourish. With modern amenities, dedicated staff, and a vibrant community, we ensure that every student feels welcomed and supported throughout their academic journey.</p>
          </div>
          <div className="col-lg-6">
            <div className="bg-light p-4 rounded shadow-sm">
              <i className="bi bi-building text-primary" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-2">Our Legacy</h4>
              <p className="text-muted">Over 15 years of excellence in student accommodation, hosting thousands of students from diverse backgrounds and disciplines.</p>
            </div>
          </div>
        </div>
      </div></section>
      <section className="bg-light py-5"><div className="container"><div className="row g-4">
        <div className="col-md-6"><div className="card h-100 border-0 shadow-sm"><div className="card-body text-center p-4">
          <i className="bi bi-bullseye text-primary" style={{ fontSize: '3rem' }}></i><h3 className="fw-bold mt-3">Our Mission</h3>
          <p className="text-muted">To provide a safe, comfortable, and conducive living environment that supports students in their academic pursuits and personal growth. We are committed to fostering a community of respect, learning, and mutual support.</p>
        </div></div></div>
        <div className="col-md-6"><div className="card h-100 border-0 shadow-sm"><div className="card-body text-center p-4">
          <i className="bi bi-eye text-primary" style={{ fontSize: '3rem' }}></i><h3 className="fw-bold mt-3">Our Vision</h3>
          <p className="text-muted">To be the leading student accommodation provider recognized for excellence in service, safety, and student satisfaction. We aim to create a benchmark for quality hostel living across the region.</p>
        </div></div></div>
      </div></div></section>
      <section className="bg-white py-5"><div className="container">
        <h2 className="fw-bold text-center mb-4">Rules & Regulations</h2>
        <p className="text-center text-muted mb-4">Guidelines to ensure a harmonious living environment</p>
        <div className="row justify-content-center"><div className="col-lg-8">
          <ol className="list-group list-group-numbered">
            <li className="list-group-item">Students must maintain silence in the study hours (7:00 PM - 6:00 AM).</li>
            <li className="list-group-item">Visitors are not allowed inside the rooms without prior permission from the warden.</li>
            <li className="list-group-item">Consumption of alcohol, tobacco, or any intoxicating substances is strictly prohibited.</li>
            <li className="list-group-item">Students must return to the hostel before the designated curfew time (9:00 PM).</li>
            <li className="list-group-item">Damage to hostel property will result in fines and disciplinary action.</li>
            <li className="list-group-item">Room changes are allowed only with the warden's approval.</li>
            <li className="list-group-item">Electrical appliances are not permitted without authorization.</li>
            <li className="list-group-item">Students are responsible for keeping their rooms and common areas clean.</li>
            <li className="list-group-item">Mess fees must be paid before the 10th of every month.</li>
            <li className="list-group-item">Any grievances should be reported to the warden or through the complaint system.</li>
          </ol>
        </div></div>
      </div></section>
      <section className="bg-light py-5"><div className="container">
        <h2 className="fw-bold text-center mb-4">Why Choose Us</h2>
        <div className="row g-4">
          <div className="col-md-4"><div className="card h-100 border-0 shadow-sm text-center"><div className="card-body">
            <i className="bi bi-shield-check text-success" style={{ fontSize: '2.5rem' }}></i><h5 className="fw-bold mt-2">Safe & Secure</h5>
            <p className="text-muted small">24/7 security, CCTV surveillance, and restricted entry ensure your safety at all times.</p>
          </div></div></div>
          <div className="col-md-4"><div className="card h-100 border-0 shadow-sm text-center"><div className="card-body">
            <i className="bi bi-wifi text-primary" style={{ fontSize: '2.5rem' }}></i><h5 className="fw-bold mt-2">Modern Amenities</h5>
            <p className="text-muted small">High-speed WiFi, gym, library, and fully equipped common rooms for your convenience.</p>
          </div></div></div>
          <div className="col-md-4"><div className="card h-100 border-0 shadow-sm text-center"><div className="card-body">
            <i className="bi bi-people text-warning" style={{ fontSize: '2.5rem' }}></i><h5 className="fw-bold mt-2">Community Living</h5>
            <p className="text-muted small">A vibrant community of students from diverse backgrounds fostering friendships and collaboration.</p>
          </div></div></div>
          <div className="col-md-4"><div className="card h-100 border-0 shadow-sm text-center"><div className="card-body">
            <i className="bi bi-geo-alt text-danger" style={{ fontSize: '2.5rem' }}></i><h5 className="fw-bold mt-2">Prime Location</h5>
            <p className="text-muted small">Close to universities, colleges, libraries, and city center with easy transportation access.</p>
          </div></div></div>
          <div className="col-md-4"><div className="card h-100 border-0 shadow-sm text-center"><div className="card-body">
            <i className="bi bi-cup-hot text-info" style={{ fontSize: '2.5rem' }}></i><h5 className="fw-bold mt-2">Healthy Meals</h5>
            <p className="text-muted small">Nutritious and hygienic meals prepared under strict quality standards in our mess.</p>
          </div></div></div>
          <div className="col-md-4"><div className="card h-100 border-0 shadow-sm text-center"><div className="card-body">
            <i className="bi bi-headset text-primary" style={{ fontSize: '2.5rem' }}></i><h5 className="fw-bold mt-2">Dedicated Support</h5>
            <p className="text-muted small">24/7 staff support, online complaint system, and regular parent communication for peace of mind.</p>
          </div></div></div>
        </div>
      </div></section>
      <section className="bg-white py-5"><div className="container">
        <h2 className="fw-bold text-center mb-4">Our Staff</h2>
        <p className="text-center text-muted mb-4">Dedicated team ensuring your comfort and safety</p>
        <div className="row g-4">
          <div className="col-md-3"><div className="card text-center h-100 border-0 shadow-sm"><div className="card-body">
            <i className="bi bi-person-vcard text-primary" style={{ fontSize: '3rem' }}></i><h5 className="fw-bold mt-2">Dr. Suresh Kumar</h5>
            <span className="badge bg-primary">Chief Warden</span><p className="small text-muted mt-2">Oversees all hostel operations</p>
          </div></div></div>
          <div className="col-md-3"><div className="card text-center h-100 border-0 shadow-sm"><div className="card-body">
            <i className="bi bi-person-badge text-success" style={{ fontSize: '3rem' }}></i><h5 className="fw-bold mt-2">Mrs. Anita Sharma</h5>
            <span className="badge bg-success">Deputy Warden</span><p className="small text-muted mt-2">Student welfare and discipline</p>
          </div></div></div>
          <div className="col-md-3"><div className="card text-center h-100 border-0 shadow-sm"><div className="card-body">
            <i className="bi bi-tools text-warning" style={{ fontSize: '3rem' }}></i><h5 className="fw-bold mt-2">Mr. Rajesh Singh</h5>
            <span className="badge bg-warning text-dark">Caretaker</span><p className="small text-muted mt-2">Maintenance and facility management</p>
          </div></div></div>
          <div className="col-md-3"><div className="card text-center h-100 border-0 shadow-sm"><div className="card-body">
            <i className="bi bi-shield-check text-danger" style={{ fontSize: '3rem' }}></i><h5 className="fw-bold mt-2">Mr. Vijay Patel</h5>
            <span className="badge bg-danger">Security Head</span><p className="small text-muted mt-2">Security and access control</p>
          </div></div></div>
        </div>
      </div></section>
    </>
  );
}
