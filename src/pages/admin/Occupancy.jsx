import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Occupancy() {
  const [rooms, setRooms] = useState([]);
  useEffect(() => { api.get('/admin/occupancy').then(r => setRooms(r.data)); }, []);
  const floors = [...new Set(rooms.map(r => r.floor))].sort();
  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-building me-2"></i>Room Occupancy</h4>
      {floors.map(floor => <div key={floor} className="mb-4">
        <h6 className="fw-bold text-muted">{floor || 'N/A'} Floor</h6>
        <div className="row g-2">{rooms.filter(r => r.floor === floor).map(r => <div className="col-md-3 col-6" key={r.id}>
          <div className={`card ${r.free_beds > 0 ? 'border-success' : r.occupancy === 0 ? 'border-secondary' : 'border-danger'}`}>
            <div className="card-body p-3 text-center">
              <h6 className="mb-1">Room {r.room_no}</h6>
              <small className="text-muted">{r.room_type}</small>
              <div className="mt-1"><span className="badge bg-success">{r.occupancy}</span><span className="mx-1">/</span><span className="badge bg-secondary">{r.capacity}</span></div>
              <small className={`fw-bold ${r.free_beds > 0 ? 'text-success' : 'text-danger'}`}>{r.free_beds} free</small>
            </div>
          </div>
        </div>)}</div>
      </div>)}
    </div>
  );
}
