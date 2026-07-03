import { useState, useEffect } from 'react'; import api from '../../api/client'; import { Link } from 'react-router-dom';
export default function StudentDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/dashboard').then(r => setData(r.data)).catch(() => {}); }, []);
  if (!data) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2"></i>Welcome, {data.student.name}</h4>
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6"><Link to="/student/my-room" className="text-decoration-none"><div className="card bg-primary text-white"><div className="card-body"><h5>{data.allocation ? data.allocation.room_no : '-'}</h5><small>Room No</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/student/fees" className="text-decoration-none"><div className="card bg-success text-white"><div className="card-body"><h5>₹{Number(data.fees.paid).toLocaleString()}</h5><small>Fees Paid</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/student/attendance" className="text-decoration-none"><div className="card bg-info text-white"><div className="card-body"><h5>{data.attendance.present}/{data.attendance.total}</h5><small>Attendance (30d)</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/student/notifications" className="text-decoration-none"><div className="card bg-warning text-white"><div className="card-body"><h5>{data.unreadNotifications}</h5><small>Notifications</small></div></div></Link></div>
      </div>
      <div className="row g-3">
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">Quick Links</div><div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            <Link to="/student/profile" className="btn btn-outline-primary btn-sm"><i className="bi bi-person"></i> Profile</Link>
            <Link to="/student/attendance" className="btn btn-outline-primary btn-sm"><i className="bi bi-calendar-check"></i> Attendance</Link>
            <Link to="/student/fees" className="btn btn-outline-primary btn-sm"><i className="bi bi-currency-rupee"></i> Fees</Link>
            <Link to="/student/complaints" className="btn btn-outline-primary btn-sm"><i className="bi bi-exclamation-triangle"></i> Complaints</Link>
            <Link to="/student/leave" className="btn btn-outline-primary btn-sm"><i className="bi bi-calendar-event"></i> Apply Leave</Link>
            <Link to="/student/notices" className="btn btn-outline-primary btn-sm"><i className="bi bi-megaphone"></i> Notices</Link>
          </div>
        </div></div></div>
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold">My Room</div><div className="card-body">
          {data.allocation ? <div><p className="mb-1"><strong>Room:</strong> {data.allocation.room_no} ({data.allocation.room_type})</p><p><strong>Fee:</strong> ₹{data.allocation.fee_per_month}/month</p></div> : <p className="text-muted">No room allocated yet.</p>}
        </div></div></div>
      </div>
    </div>
  );
}
