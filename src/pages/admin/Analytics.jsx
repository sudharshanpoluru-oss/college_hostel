import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/analytics').then(r => setData(r.data)); }, []);
  if (!data) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-graph-up me-2"></i>Analytics</h4>
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6"><div className="card text-center"><div className="card-body"><h3 className="text-primary">{data.stats.activeStudents}</h3><small>Active Students</small></div></div></div>
        <div className="col-md-3 col-6"><div className="card text-center"><div className="card-body"><h3 className="text-success">{data.stats.totalCapacity}</h3><small>Total Capacity</small></div></div></div>
        <div className="col-md-3 col-6"><div className="card text-center"><div className="card-body"><h3 className="text-info">{data.stats.totalOccupancy}</h3><small>Occupied</small></div></div></div>
        <div className="col-md-3 col-6"><div className="card text-center"><div className="card-body"><h3 className="text-warning">₹{Number(data.stats.totalFees).toLocaleString()}</h3><small>Total Fees</small></div></div></div>
      </div>
      <div className="row g-4">
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">Attendance Trend (30 days)</div><div className="card-body" style={{ maxHeight: 300, overflowY: 'auto' }}>
          {data.attTrend.map((d, i) => <div key={i} className="d-flex justify-content-between align-items-center mb-1">
            <small>{d.date}</small>
            <div><span className="text-success me-2">P:{d.present}</span><span className="text-danger">A:{d.absent}</span></div>
          </div>)}
        </div></div></div>
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">Fee Collection (12 months)</div><div className="card-body" style={{ maxHeight: 300, overflowY: 'auto' }}>
          {data.feeTrend.map((m, i) => <div key={i} className="d-flex justify-content-between align-items-center mb-1">
            <small>{m.month}</small><span>₹{Number(m.amount).toLocaleString()}</span>
          </div>)}
        </div></div></div>
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">Room Types</div><div className="card-body">{data.roomTypes.map((r, i) => <div key={i} className="d-flex justify-content-between"><span>{r.room_type}</span><span className="badge bg-primary">{r.c}</span></div>)}</div></div></div>
      </div>
    </div>
  );
}
