import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Rooms() {
  const [rooms, setRooms] = useState([]); const [filterType, setFilterType] = useState(''); const [filterStatus, setFilterStatus] = useState(''); const [search, setSearch] = useState('');
  useEffect(() => {
    api.get('/public/rooms').then(r => setRooms(r.data)).catch(() => {});
  }, []);
  const filtered = rooms.filter(r => (!filterType || r.room_type === filterType) && (!filterStatus || r.status === filterStatus) && (!search || r.room_no.includes(search)));
  const types = [...new Set(rooms.map(r => r.room_type))];
  return (
    <>
      <section className="bg-primary text-white py-5"><div className="container text-center">
        <h1 className="display-4 fw-bold">Our Rooms</h1><p className="lead">Find the perfect room for your stay</p>
      </div></section>
      <section className="py-4"><div className="container">
        <div className="card shadow-sm"><div className="card-body"><div className="row g-2">
          <div className="col-md-4"><select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types</option>{types.map(t => <option key={t}>{t}</option>)}</select></div>
          <div className="col-md-4"><select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="">All Status</option><option>Available</option><option>Full</option><option>Maintenance</option></select></div>
          <div className="col-md-4"><input className="form-control" placeholder="Search room no. e.g. 101, 201..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div></div></div>
        <div className="row g-4 mt-2">
          {filtered.length > 0 ? filtered.map(r => (
            <div className="col-md-3 col-6" key={r.id}>
              <div className="card room-card h-100"><div className="card-body">
                <span className="badge bg-dark mb-2">Room {r.room_no}</span>
                <h5>{r.room_type}</h5>
                <p className="card-text small text-muted">
                  <i className="bi bi-people"></i> Capacity: {r.capacity}<br />
                  <i className="bi bi-person-plus"></i> Available Beds: {r.capacity - r.occupancy}<br />
                  <i className="bi bi-currency-rupee"></i> Rs.{Number(r.fee_per_month).toLocaleString('en', {minimumFractionDigits:2})}/month
                </p>
                <span className={`badge ${r.status === 'Available' ? 'bg-success' : r.status === 'Full' ? 'bg-danger' : r.status === 'Maintenance' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{r.status}</span>
              </div></div>
            </div>
          )) : <div className="col-12"><div className="alert alert-info text-center"><i className="bi bi-info-circle me-2"></i>No rooms found matching your criteria.</div></div>}
        </div>
      </div></section>
    </>
  );
}
