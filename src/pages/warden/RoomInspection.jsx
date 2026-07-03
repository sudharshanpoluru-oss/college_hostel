import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function RoomInspection() {
  const [rooms, setRooms] = useState([]);
  useEffect(() => { api.get('/warden/room-inspection').then(r => setRooms(r.data)); }, []);
  const floors = [...new Set(rooms.map(r => r.floor))].sort();
  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-building me-2"></i>Room Inspection</h4>
      {floors.map(floor => <div key={floor} className="mb-4"><h6 className="text-muted">{floor || 'N/A'} Floor</h6>
        <div className="row g-2">{rooms.filter(r => r.floor === floor).map(r => <div className="col-md-3 col-6" key={r.id}>
          <div className="card text-center"><div className="card-body"><h6>Room {r.room_no}</h6><small className="text-muted">{r.room_type}</small><div><small>Occupancy: {r.occupancy}/{r.capacity}</small></div></div></div>
        </div>)}</div></div>
      )}
    </div>
  );
}
