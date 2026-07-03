import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [data, setData] = useState({ stats: { rooms: 0, students: 0 }, rooms: [], gallery: [], events: [], notices: [], staff: [], testimonials: [], faqs: [] });

  useEffect(() => {
    Promise.all([
      api.get('/public/stats'), api.get('/public/rooms'), api.get('/public/gallery'),
      api.get('/public/events'), api.get('/public/notices'), api.get('/public/staff'),
      api.get('/public/testimonials'), api.get('/public/faqs')
    ]).then(([s, r, g, e, n, st, t, f]) => setData({
      stats: s.data, rooms: r.data, gallery: g.data, events: e.data,
      notices: n.data, staff: st.data, testimonials: t.data, faqs: f.data
    })).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
        <div className="hero-shape hero-shape-4"></div>
        <div className="container text-center">
          <div className="hero-badge">
            <i className="bi bi-star-fill" style={{ color: '#f59e0b' }}></i>
            Premier Student Accommodation
          </div>
          <h1 className="mb-3">Your Home Away<br />From Home</h1>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: 600 }}>Safe, comfortable, and affordable accommodation for students pursuing their academic goals. Experience a home-like environment with modern amenities.</p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/rooms" className="btn btn-light btn-lg fw-bold px-4"><i className="bi bi-door-open"></i> View Rooms</Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg fw-bold px-4"><i className="bi bi-envelope"></i> Contact Us</Link>
            {!user && <Link to="/register" className="btn btn-success btn-lg fw-bold px-4"><i className="bi bi-person-plus"></i> Register Now</Link>}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats">
        <div className="container">
          <div className="row g-3 justify-content-center">
            <div className="col-md-3 col-6">
              <div className="card stat-card border-primary text-center">
                <div className="card-body">
                  <i className="bi bi-door-open text-primary stat-icon"></i>
                  <h3 className="mt-2 text-primary fw-bold">{data.stats.rooms}</h3>
                  <p className="stat-label">Total Rooms</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card stat-card border-success text-center">
                <div className="card-body">
                  <i className="bi bi-people text-success stat-icon"></i>
                  <h3 className="mt-2 text-success fw-bold">{data.stats.students}</h3>
                  <p className="stat-label">Happy Students</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card stat-card border-info text-center">
                <div className="card-body">
                  <i className="bi bi-shield-check text-info stat-icon"></i>
                  <h3 className="mt-2 text-info fw-bold">24/7</h3>
                  <p className="stat-label">Security</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card stat-card border-warning text-center">
                <div className="card-body">
                  <i className="bi bi-cup-hot text-warning stat-icon"></i>
                  <h3 className="mt-2 text-warning fw-bold">3</h3>
                  <p className="stat-label">Meals Daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Why Choose Our Hostel</h2>
          <div className="section-divider"></div>
          <p className="text-center text-muted mb-5">We provide the best living experience for students</p>
          <div className="row g-4 stagger-children">
            <div className="col-md-4">
              <div className="facility-card">
                <i className="bi bi-shield-lock text-primary"></i>
                <h5>24/7 Security</h5>
                <p className="text-muted mb-0 small">CCTV surveillance, security guards, and secure access control for your safety.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="facility-card">
                <i className="bi bi-wifi text-primary"></i>
                <h5>High-Speed WiFi</h5>
                <p className="text-muted mb-0 small">Stay connected with reliable high-speed internet throughout the hostel.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="facility-card">
                <i className="bi bi-cup-hot text-primary"></i>
                <h5>Healthy Meals</h5>
                <p className="text-muted mb-0 small">Nutritious and hygienic meals prepared fresh daily in our mess.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="facility-card">
                <i className="bi bi-book text-primary"></i>
                <h5>Study Area</h5>
                <p className="text-muted mb-0 small">Dedicated quiet study areas and a well-stocked library for academic success.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="facility-card">
                <i className="bi bi-bandaid text-primary"></i>
                <h5>Medical Support</h5>
                <p className="text-muted mb-0 small">Emergency medical assistance and tie-ups with nearby hospitals.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="facility-card">
                <i className="bi bi-activity text-primary"></i>
                <h5>Recreation</h5>
                <p className="text-muted mb-0 small">Indoor games, TV room, and outdoor sports facilities for relaxation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Our Rooms</h2>
          <div className="section-divider"></div>
          <p className="text-center text-muted mb-5">Choose from our range of comfortable rooms</p>
          <div className="row g-4">
            {data.rooms.length > 0 ? data.rooms.map(r => (
              <div className="col-md-3 col-6" key={r.id}>
                <div className="card room-card h-100">
                  <div className="card-body">
                    <span className="badge bg-primary mb-2">Room {r.room_no}</span>
                    <h5>{r.room_type}</h5>
                    <p className="card-text small text-muted">
                      <i className="bi bi-people"></i> Capacity: {r.capacity}<br />
                      <i className="bi bi-currency-rupee"></i> Rs.{Number(r.fee_per_month).toLocaleString()}/month
                    </p>
                    <span className={`badge ${r.status === 'Available' ? 'bg-success' : r.status === 'Full' ? 'bg-danger' : r.status === 'Maintenance' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{r.status}</span>
                  </div>
                </div>
              </div>
            )) : <div className="col-12"><div className="alert alert-info text-center">No rooms available.</div></div>}
          </div>
          <div className="text-center mt-4">
            <Link to="/rooms" className="btn btn-primary btn-lg px-4">View All Rooms <i className="bi bi-arrow-right"></i></Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Gallery</h2>
          <div className="section-divider"></div>
          <p className="text-center text-muted mb-5">A glimpse of our hostel life</p>
          <div className="row g-3">
            {data.gallery.length > 0 ? data.gallery.map(img => (
              <div className="col-md-4 col-6" key={img.id}>
                <div className="gallery-item">
                  <img src={`/uploads/${img.image}`} className="w-100" style={{ height: 200, objectFit: 'cover' }} alt={img.title} />
                  <div className="p-2"><small className="fw-medium">{img.title}</small></div>
                </div>
              </div>
            )) : <>
              <div className="col-md-4 col-6"><div className="gallery-item"><div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}><i className="bi bi-image text-muted fs-1"></i></div><div className="p-2"><small className="fw-medium">Hostel Building</small></div></div></div>
              <div className="col-md-4 col-6"><div className="gallery-item"><div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}><i className="bi bi-image text-muted fs-1"></i></div><div className="p-2"><small className="fw-medium">Common Room</small></div></div></div>
              <div className="col-md-4 col-6"><div className="gallery-item"><div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}><i className="bi bi-image text-muted fs-1"></i></div><div className="p-2"><small className="fw-medium">Dining Hall</small></div></div></div>
            </>}
          </div>
          <div className="text-center mt-4">
            <Link to="/gallery" className="btn btn-outline-primary">View Full Gallery <i className="bi bi-arrow-right"></i></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="bg-light py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-2">Student Testimonials</h2>
            <div className="section-divider"></div>
            <p className="text-center text-muted mb-5">What our students say about us</p>
            <div className="row g-4">
              {data.testimonials.map((t, i) => (
                <div className="col-md-4" key={i}>
                  <div className="testimonial-card">
                    <p className="mb-3">{t.content}</p>
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-warning small">{'★'.repeat(t.rating)}</div>
                      <div className="fw-medium small">- {t.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events */}
      {data.events.length > 0 && (
        <section className="py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-2">Hostel Events</h2>
            <div className="section-divider"></div>
            <p className="text-center text-muted mb-5">Upcoming events at our hostel</p>
            <div className="row g-4">
              {data.events.map(e => (
                <div className="col-md-4" key={e.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="text-center flex-shrink-0 bg-primary text-white rounded-3 px-3 py-2">
                          <div className="fw-bold fs-5">{new Date(e.event_date).getDate()}</div>
                          <div className="small">{new Date(e.event_date).toLocaleString('en', { month: 'short' })}</div>
                        </div>
                        <div>
                          <h5 className="mb-1">{e.title}</h5>
                          {e.location && <small className="text-muted"><i className="bi bi-geo-alt"></i> {e.location}</small>}
                        </div>
                      </div>
                      <p className="small text-muted mb-0">{e.description?.substring(0, 150)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Notices */}
      {data.notices.length > 0 && (
        <section className="bg-light py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-2">Latest Notices</h2>
            <div className="section-divider"></div>
            <div className="row g-3">
              {data.notices.map(n => (
                <div className="col-md-4" key={n.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <span className={`badge bg-${n.priority === 'Critical' ? 'danger' : n.priority === 'Urgent' ? 'warning' : 'info'} mb-2`}>{n.priority}</span>
                      <h6>{n.title}</h6>
                      <p className="card-text small text-muted">{n.content?.substring(0, 120)}</p>
                      <small className="text-muted">{new Date(n.publish_date).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faqs.length > 0 && (
        <section className="py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-2">Frequently Asked Questions</h2>
            <div className="section-divider"></div>
            <p className="text-center text-muted mb-5">Find answers to common questions</p>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="accordion" id="faqAccordion">
                  {data.faqs.map((faq, i) => (
                    <div className="accordion-item border-0 mb-2" key={faq.id}>
                      <h2 className="accordion-header">
                        <button className={`accordion-button ${i > 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#faq${faq.id}`}>
                          {faq.question}
                        </button>
                      </h2>
                      <div id={`faq${faq.id}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-muted">{faq.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Management Team */}
      {data.staff.length > 0 && (
        <section className="bg-light py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-2">Our Management</h2>
            <div className="section-divider"></div>
            <p className="text-center text-muted mb-5">Dedicated team ensuring the best experience</p>
            <div className="row g-4 justify-content-center">
              {data.staff.map(s => (
                <div className="col-md-4 col-6" key={s.id}>
                  <div className="card text-center h-100 border-0">
                    <div className="card-body">
                      <i className={`${s.icon} text-primary`} style={{ fontSize: '2.5rem' }}></i>
                      <h5 className="mt-3 fw-bold">{s.name}</h5>
                      <p className="text-muted mb-1 small">{s.designation}</p>
                      {s.description && <small className="text-muted">{s.description}</small>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Get In Touch</h2>
          <div className="section-divider"></div>
          <div className="row g-4 mt-3">
            <div className="col-md-5">
              <ul className="feature-list">
                <li><i className="bi bi-geo-alt"></i> YSR Engineering College, Korrapadu Road, Proddatur - 516360</li>
                <li><i className="bi bi-telephone"></i> +91 8564 254770</li>
                <li><i className="bi bi-envelope"></i> principal.yvuce@gmail.com</li>
                <li><i className="bi bi-clock"></i> Office Hours: 9:00 AM - 5:00 PM (Mon-Sat)</li>
              </ul>
              <div className="d-flex gap-2 mt-3">
                <a href="#" className="btn btn-outline-primary btn-sm rounded-circle p-2" style={{ width: 38, height: 38 }}><i className="bi bi-facebook"></i></a>
                <a href="#" className="btn btn-outline-primary btn-sm rounded-circle p-2" style={{ width: 38, height: 38 }}><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="btn btn-outline-primary btn-sm rounded-circle p-2" style={{ width: 38, height: 38 }}><i className="bi bi-instagram"></i></a>
                <a href="#" className="btn btn-outline-primary btn-sm rounded-circle p-2" style={{ width: 38, height: 38 }}><i className="bi bi-youtube"></i></a>
              </div>
            </div>
            <div className="col-md-7">
              <iframe src="https://www.google.com/maps?q=YSR+Engineering+College+Proddatur&output=embed" width="100%" height="280" style={{ border: 0, borderRadius: 12 }} allowFullScreen loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
