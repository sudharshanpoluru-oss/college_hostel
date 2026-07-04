import { useState, useEffect } from 'react'; import api from '../../api/client'; import { Link } from 'react-router-dom';
export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, recentFees: [], recentComplaints: [], recentStudents: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/admin/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const s = data.stats;
  if (loading) return <div className="text-center py-5"><div className="spinner-border" style={{ width: '3rem', height: '3rem' }}></div></div>;
  return (
    <div>
      <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2"></i>Admin Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6"><Link to="/admin/students" className="text-decoration-none"><div className="card text-bg-primary"><div className="card-body"><h5 className="fw-bold mb-0">{s.students || 0}</h5><small>Active Students</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/admin/rooms" className="text-decoration-none"><div className="card text-bg-success"><div className="card-body"><h5 className="fw-bold mb-0">{s.rooms || 0}</h5><small>Total Rooms</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/admin/fees" className="text-decoration-none"><div className="card text-bg-info"><div className="card-body"><h5 className="fw-bold mb-0">₹{(s.fees || 0).toLocaleString()}</h5><small>Fees Collected</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/admin/complaints" className="text-decoration-none"><div className="card text-bg-danger"><div className="card-body"><h5 className="fw-bold mb-0">{s.pending_complaints || 0}</h5><small>Pending Complaints</small></div></div></Link></div>
        <div className="col-md-3 col-6"><Link to="/admin/leaves" className="text-decoration-none"><div className="card text-bg-warning"><div className="card-body"><h5 className="fw-bold mb-0">{s.pending_leaves || 0}</h5><small>Pending Leaves</small></div></div></Link></div>
        <div className="col-md-3 col-6"><div className="card text-bg-success"><div className="card-body"><h5 className="fw-bold mb-0">{s.present || 0}</h5><small>Present Today</small></div></div></div>
        <div className="col-md-3 col-6"><div className="card text-bg-dark"><div className="card-body"><h5 className="fw-bold mb-0">{s.absent || 0}</h5><small>Absent Today</small></div></div></div>
      </div>
      <div className="row g-4">
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold d-flex justify-content-between"><span>Recent Payments</span><Link to="/admin/fees" className="small text-decoration-none">View all</Link></div><div className="card-body p-0"><table className="table table-sm mb-0">{data.recentFees.length > 0 ? data.recentFees.map(f => <tr key={f.id}><td className="fw-medium">{f.name}</td><td>{f.roll_no}</td><td><span className="badge bg-success">₹{f.paid_amount}</span></td><td><small className="text-muted">{f.payment_date}</small></td></tr>) : <tr><td colSpan="4" className="text-center text-muted py-3"><i className="bi bi-inbox me-1"></i>No recent payments</td></tr>}</table></div></div></div>
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold d-flex justify-content-between"><span>Recent Complaints</span><Link to="/admin/complaints" className="small text-decoration-none">View all</Link></div><div className="card-body p-0"><table className="table table-sm mb-0">{data.recentComplaints.length > 0 ? data.recentComplaints.map(c => <tr key={c.id}><td className="fw-medium">{c.name}</td><td>{c.title?.substring(0, 40)}</td><td><span className={`badge bg-${c.status === 'Pending' ? 'warning' : c.status === 'Resolved' ? 'success' : 'info'}`}>{c.status}</span></td><td><small className="text-muted">{c.created_at}</small></td></tr>) : <tr><td colSpan="4" className="text-center text-muted py-3"><i className="bi bi-inbox me-1"></i>No recent complaints</td></tr>}</table></div></div></div>
        <div className="col-md-6"><div className="card"><div className="card-header fw-bold d-flex justify-content-between"><span>Recent Admissions</span><Link to="/admin/students" className="small text-decoration-none">View all</Link></div><div className="card-body p-0"><table className="table table-sm mb-0">{data.recentStudents.length > 0 ? data.recentStudents.map(s => <tr key={s.id}><td className="fw-medium">{s.name}</td><td>{s.roll_no}</td><td>{s.course}</td><td><small className="text-muted">{s.admission_date}</small></td></tr>) : <tr><td colSpan="4" className="text-center text-muted py-3"><i className="bi bi-inbox me-1"></i>No recent admissions</td></tr>}</table></div></div></div>
      </div>
      <div className="row mt-4"><div className="col-12"><div className="card"><div className="card-header fw-bold">Quick Actions</div><div className="card-body"><div className="d-flex flex-wrap gap-2">
        <Link to="/admin/students" className="btn btn-primary btn-sm"><i className="bi bi-person-plus"></i> Add Student</Link>
        <Link to="/admin/attendance" className="btn btn-success btn-sm"><i className="bi bi-calendar-check"></i> Take Attendance</Link>
        <Link to="/admin/visitors" className="btn btn-info btn-sm"><i className="bi bi-people"></i> Add Visitor</Link>
        <Link to="/admin/notices" className="btn btn-warning btn-sm"><i className="bi bi-megaphone"></i> Create Notice</Link>
        <Link to="/admin/maintenance" className="btn btn-secondary btn-sm"><i className="bi bi-tools"></i> Maintenance</Link>
        <Link to="/admin/reports/students" className="btn btn-dark btn-sm"><i className="bi bi-file-text"></i> Generate Report</Link>
        <Link to="/admin/occupancy" className="btn btn-info btn-sm"><i className="bi bi-building"></i> Room Occupancy</Link>
      </div></div></div></div></div>
    </div>
  );
}
