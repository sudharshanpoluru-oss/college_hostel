import { useState, useEffect } from 'react'; import { Link } from 'react-router-dom'; import api from '../../api/client';
export default function WardenDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/warden/dashboard').then(r => setData(r.data)); }, []);
  if (!data) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-shield me-2"></i>Warden Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6"><Link to="/warden/students" className="text-decoration-none"><div className="card bg-primary text-white"><div className="card-body"><h5>{data.stats.students}</h5><small>Active Students</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/warden/complaints" className="text-decoration-none"><div className="card bg-warning text-white"><div className="card-body"><h5>{data.stats.pendingComplaints}</h5><small>Pending Complaints</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/warden/leaves" className="text-decoration-none"><div className="card bg-info text-white"><div className="card-body"><h5>{data.stats.pendingLeaves}</h5><small>Pending Leaves</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/warden/attendance" className="text-decoration-none"><div className="card bg-success text-white"><div className="card-body"><h5>{data.stats.presentToday}</h5><small>Present Today</small></div></div></Link></div>
      </div>
      {data.warden?.hostel_type && <div className="alert alert-info"><i className="bi bi-info-circle"></i> Managing <strong>{data.warden.hostel_type}</strong> hostel</div>}
    </div>
  );
}
