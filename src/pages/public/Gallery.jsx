import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Gallery() {
  const [images, setImages] = useState([]); const [modal, setModal] = useState(null);
  useEffect(() => { api.get('/public/gallery').then(r => setImages(r.data)).catch(() => {}); }, []);
  const fallbacks = [
    { title: 'Main Building', category: 'Exterior', color: '#4e73df', icon: 'bi-building' },
    { title: 'Reception Area', category: 'Interior', color: '#1cc88a', icon: 'bi-person-badge' },
    { title: 'Common Room', category: 'Common Areas', color: '#36b9cc', icon: 'bi-tv' },
    { title: 'Library', category: 'Facilities', color: '#f6c23e', icon: 'bi-book' },
    { title: 'Dining Hall', category: 'Facilities', color: '#e74a3b', icon: 'bi-cup-hot' },
    { title: 'Gym', category: 'Facilities', color: '#858796', icon: 'bi-activity' },
    { title: 'Garden Area', category: 'Exterior', color: '#5a5c69', icon: 'bi-flower1' },
    { title: 'Study Room', category: 'Common Areas', color: '#2c9faf', icon: 'bi-lamp' },
  ];
  const display = images.length > 0 ? images : fallbacks;
  return (
    <>
      <section className="bg-primary text-white py-5"><div className="container text-center">
        <h1 className="display-4 fw-bold">Gallery</h1><p className="lead">A glimpse into hostel life</p>
      </div></section>
      <section className="py-5"><div className="container">
        <h2 className="fw-bold text-center mb-2">Our Gallery</h2>
        <div className="section-divider"></div>
        {images.length === 0 && <p className="text-center text-muted mb-5">Gallery images coming soon...</p>}
        <div className="row g-3">
          {display.map((item, i) => (
            <div className="col-md-3 col-6" key={i}>
              <div className="gallery-item" role="button" onClick={() => setModal(item)}>
                {images.length > 0 ? (
                  <img src={`/uploads/${item.image}`} className="w-100" style={{ height: 200, objectFit: 'cover' }} alt={item.title} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200, backgroundColor: fallbacks[i]?.color || '#ddd', display: images.length > 0 ? 'none' : 'flex' }}>
                  <div className="text-center text-white"><i className={`bi ${fallbacks[i]?.icon || 'bi-image'}`} style={{ fontSize: '3rem' }}></i></div>
                </div>
                <div className="p-2 d-flex justify-content-between align-items-center">
                  <small className="fw-medium">{item.title}</small>
                  {item.category && <span className="badge bg-secondary">{item.category}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div></section>
      {modal && <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setModal(null)}>
        <div className="modal-dialog modal-lg modal-dialog-centered"><div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header"><h5 className="modal-title">{modal.title}</h5><button className="btn-close" onClick={() => setModal(null)}></button></div>
          <div className="modal-body text-center p-0">
            {images.length > 0 ? (
              <img src={`/uploads/${modal.image}`} className="w-100" alt={modal.title} style={{ maxHeight: 500, objectFit: 'cover' }} />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 400 }}>
                <i className={`bi ${modal.icon || 'bi-image'} text-muted`} style={{ fontSize: '5rem' }}></i>
              </div>
            )}
          </div>
        </div></div>
      </div>}
    </>
  );
}
