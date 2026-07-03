import { useState, useEffect } from 'react'; import api from '../../api/client'; import { Link } from 'react-router-dom';
export default function StudentFees() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/student/fees').then(r => setData(r.data)); }, []);
  if (!data) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  return (
    <div>
      <h4 className="fw-bold mb-4">Fees</h4>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="card bg-primary text-white"><div className="card-body"><h5>₹{Number(data.summary.total).toLocaleString()}</h5><small>Total Fee</small></div></div></div>
        <div className="col-md-4"><div className="card bg-success text-white"><div className="card-body"><h5>₹{Number(data.summary.paid).toLocaleString()}</h5><small>Paid</small></div></div></div>
        <div className="col-md-4"><div className="card bg-danger text-white"><div className="card-body"><h5>₹{Number(data.summary.due).toLocaleString()}</h5><small>Due</small></div></div></div>
      </div>
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>Total Fee</th><th>Paid</th><th>Due</th><th>Mode</th><th>Receipt</th><th>Date</th><th>Status</th><th></th></tr></thead>
        <tbody>{data.fees.map(f => <tr key={f.id}>
          <td>₹{f.total_fee}</td><td>₹{f.paid_amount}</td><td>₹{Number(f.total_fee - f.paid_amount).toFixed(2)}</td><td>{f.payment_mode || '-'}</td><td>{f.receipt_no || '-'}</td><td>{f.payment_date || '-'}</td>
          <td><span className={`badge bg-${f.status === 'Paid' ? 'success' : f.status === 'Partial' ? 'warning' : 'secondary'}`}>{f.status}</span></td>
          <td></td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
