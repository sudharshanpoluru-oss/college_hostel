export default function Amenities() {
  const amenities = [
    { icon: 'bi-wifi', title: 'High-Speed WiFi', desc: 'High-speed internet connectivity available throughout the hostel premises. Stay connected with your studies and loved ones.', color: '#4f46e5' },
    { icon: 'bi-shield-lock', title: '24/7 Security', desc: 'Round-the-clock security with CCTV surveillance, security guards, and secure access control system.', color: '#10b981' },
    { icon: 'bi-droplet', title: 'Laundry Service', desc: 'On-site laundry facilities with modern washing machines and dryers for your convenience.', color: '#06b6d4' },
    { icon: 'bi-activity', title: 'Fitness Center', desc: 'Well-equipped gymnasium with modern fitness equipment to help you stay active and healthy.', color: '#f59e0b' },
    { icon: 'bi-book', title: 'Library', desc: 'Quiet study environment with a vast collection of reference books, journals, and digital resources.', color: '#ef4444' },
    { icon: 'bi-tv', title: 'Common Room', desc: 'Spacious common room with television, indoor games, and comfortable seating for relaxation.', color: '#8b5cf6' },
    { icon: 'bi-car-front', title: 'Parking', desc: 'Secure parking facility for students with two-wheelers and bicycles within the hostel campus.', color: '#ec4899' },
    { icon: 'bi-lightning', title: 'Power Backup', desc: 'Uninterrupted power supply with generator backup to ensure no disruption to your study routine.', color: '#f97316' },
  ];
  const additional = [
    { icon: 'bi-truck', title: 'Courier Handling', desc: 'Safe receipt and dispatch of your parcels and letters.' },
    { icon: 'bi-droplet', title: 'RO Water Purifier', desc: 'Clean and safe drinking water with RO purification systems on every floor.' },
    { icon: 'bi-bandaid', title: 'First Aid Kit', desc: 'Emergency first aid assistance available 24/7 at the reception.' },
    { icon: 'bi-house-add', title: 'Housekeeping', desc: 'Regular cleaning and maintenance of rooms and common areas.' },
  ];
  return (
    <>
      <section className="bg-primary text-white py-5"><div className="container text-center">
        <h1 className="display-4 fw-bold">Amenities</h1><p className="lead">Everything we offer for a comfortable living experience</p>
      </div></section>
      <section className="py-5"><div className="container">
        <h2 className="fw-bold text-center mb-2">Our Facilities</h2>
        <div className="section-divider"></div>
        <p className="text-center text-muted mb-5">We provide a wide range of facilities for our students</p>
        <div className="row g-4">
          {amenities.map((a, i) => (
            <div className="col-md-4 col-6" key={i}>
              <div className="card h-100 border-0 shadow-sm text-center"><div className="card-body">
                <i className={`bi ${a.icon}`} style={{ fontSize: '2.5rem', color: a.color }}></i>
                <h5 className="fw-bold mt-2">{a.title}</h5>
                <p className="text-muted small">{a.desc}</p>
                <span className="badge bg-success">Available</span>
              </div></div>
            </div>
          ))}
        </div>
      </div></section>
      <section className="bg-light py-5"><div className="container">
        <h2 className="fw-bold text-center mb-2">Additional Services</h2>
        <div className="section-divider"></div>
        <p className="text-center text-muted mb-5">Extra services for your convenience</p>
        <div className="row g-4">
          {additional.map((a, i) => (
            <div className="col-md-3 col-6" key={i}>
              <div className="card h-100 border-0 shadow-sm text-center"><div className="card-body">
                <i className={`bi ${a.icon} text-primary`} style={{ fontSize: '2.5rem' }}></i>
                <h5 className="fw-bold mt-2">{a.title}</h5>
                <p className="text-muted small">{a.desc}</p>
              </div></div>
            </div>
          ))}
        </div>
      </div></section>
    </>
  );
}
