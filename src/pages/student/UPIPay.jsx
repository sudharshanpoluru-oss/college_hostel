import { useState, useEffect } from 'react'; import api from '../../api/client'; import { useSearchParams, Link } from 'react-router-dom';
export default function UPIPay() {
  const [searchParams] = useSearchParams(); const feeId = searchParams.get('fee_id');
  const [fee, setFee] = useState(null); const [fees, setFees] = useState([]); const [selectedId, setSelectedId] = useState(feeId ? +feeId : ''); const [utr, setUtr] = useState(''); const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const upiId = '9381869092-2@axl';

  useEffect(() => {
    api.get('/student/fees').then(r => { setFees(r.data.fees); if (feeId) { const f = r.data.fees.find(x => x.id === +feeId); setFee(f); } }).catch(() => {});
  }, [feeId]);

  const selectFee = (id) => { setSelectedId(id); const f = fees.find(x => x.id === id); setFee(f); setUtr(''); setMsg(''); setErr(''); };

  const handleConfirm = async (e) => { e.preventDefault(); setErr('');
    if (!selectedId) return setErr('Select a fee record');
    if (!utr) return setErr('Enter UTR number');
    try { await api.post('/student/pay/upi', { fee_id: +selectedId, utr }); setMsg('Payment confirmed!'); setFee({ ...fee, status: 'Paid', paid_amount: fee.total_fee }); } catch (e) { setErr(e.response?.data?.error || 'Error'); }
  };

  if (!fees.length) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

  if (!fee) return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h4 className="fw-bold mb-4"><i className="bi bi-phone me-2"></i>Pay via UPI</h4>
      <div className="card"><div className="card-body">
        <p className="text-muted">Select a fee record to pay:</p>
        {fees.filter(f => f.status !== 'Paid').map(f => (
          <div key={f.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
            <div><strong>₹{Number(f.total_fee - f.paid_amount).toFixed(2)}</strong><br /><small className="text-muted">{f.payment_mode || 'Pending'} — Due: {f.payment_date || 'N/A'}</small></div>
            <button className="btn btn-sm btn-primary" onClick={() => selectFee(f.id)}>Pay</button>
          </div>
        ))}
        {fees.filter(f => f.status !== 'Paid').length === 0 && <p className="text-success mb-0">All fees are paid.</p>}
      </div></div>
    </div>
  );

  const amount = Number(fee.total_fee - fee.paid_amount);
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=HOSTEL&am=${amount}&tn=FEE${selectedId}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h4 className="fw-bold mb-4"><i className="bi bi-phone me-2"></i>Pay via UPI</h4>
      {msg && <div className="alert alert-success">{msg} <Link to="/student/fees">View Fees</Link></div>}
      {err && <div className="alert alert-danger">{err}</div>}
      {!msg && <div className="card text-center"><div className="card-body">
        <button className="btn btn-sm btn-outline-secondary float-end" onClick={() => setFee(null)}>Change</button>
        <h2 className="text-primary fw-bold">₹{amount.toFixed(2)}</h2>
        <div className="p-3 bg-light rounded mb-3"><small className="text-muted d-block">Send payment to UPI ID</small><strong className="fs-5">{upiId}</strong></div>
        <div className="mb-3"><img src={qrUrl} alt="QR" className="img-fluid border rounded p-2" style={{ maxWidth: 220 }} /></div>
        <a href={upiLink} className="btn btn-primary btn-lg w-100 mb-3" target="_blank" rel="noopener noreferrer"><i className="bi bi-phone"></i> Pay with UPI App</a>
        <hr />
        <form onSubmit={handleConfirm}><label className="form-label fw-semibold">Already paid? Enter UTR:</label><input className="form-control form-control-lg mb-2" placeholder="e.g. HDFC123456789" value={utr} onChange={e => setUtr(e.target.value)} /><button className="btn btn-success w-100">Confirm Payment</button></form>
        <p className="text-muted small mt-2"><i className="bi bi-info-circle"></i> Pay in UPI app, then return and enter UTR to confirm.</p>
      </div></div>}
    </div>
  );
}
