import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function MyRoom() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/my-room').then(r => setData(r.data)); }, []);
  if (!data) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  return (
    <div>
      <h4 className="fw-bold mb-4">My Room</h4>
      {data.allocation ? <div className="row g-4">
        <div className="col-md-6"><div className="card border-primary"><div className="card-body">
          <h5 className="fw-bold">Room {data.allocation.room_no}</h5>
          <p><strong>Type:</strong> {data.allocation.room_type}<br /><strong>Floor:</strong> {data.allocation.floor}<br /><strong>Fee:</strong> ₹{data.allocation.fee_per_month}/month</p>
          <p>{data.allocation.description}</p>
          <p><strong>Allocated:</strong> {data.allocation.allocation_date}</p>
        </div></div></div>
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">Roommates</div><div className="card-body">
          {data.roommates.length > 0 ? data.roommates.map((m, i) => <div key={i} className="border-bottom pb-2 mb-2"><strong>{m.name}</strong><br /><small>{m.roll_no} | {m.course} | {m.phone}</small></div>) : <p className="text-muted">No roommates</p>}
        </div></div></div>
      </div> : <div className="alert alert-warning">You have not been allocated a room yet.</div>}
    </div>
  );
}
