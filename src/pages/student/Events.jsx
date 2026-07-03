import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  useEffect(() => { api.get('/student/events').then(r => setEvents(r.data)); }, []);
  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-calendar me-2"></i>Upcoming Events</h4>
      <div className="row g-3">{events.map(e => <div className="col-md-4" key={e.id}>
        <div className="card h-100"><div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="text-center bg-primary text-white rounded px-3 py-2"><div className="fw-bold fs-5">{e.event_date?.split('-')[2]}</div><small>{new Date(e.event_date).toLocaleString('default', {month: 'short'})}</small></div>
            <div><h6 className="mb-1">{e.title}</h6>{e.location && <small className="text-muted"><i className="bi bi-geo-alt"></i> {e.location}</small>}</div>
          </div>
          <p className="small text-muted mb-0">{e.description}</p>
        </div></div>
      </div>)}</div>
    </div>
  );
}
