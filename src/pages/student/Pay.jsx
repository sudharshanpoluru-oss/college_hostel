import { useState } from 'react'; import api from '../../api/client';
export default function Pay() {
  const [amount, setAmount] = useState(''); const [msg, setMsg] = useState('');
  const handleSubmit = async (e) => { e.preventDefault(); try { const r = await api.post('/student/pay', { amount }); setMsg(`Payment of ₹${amount} initiated.`); } catch (e) { setMsg('Error'); } };
  return (
    <div style={{ maxWidth: 450 }}>
      <h4 className="fw-bold mb-4"><i className="bi bi-credit-card me-2"></i>Pay Fees</h4>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="card"><div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3"><label className="form-label">Amount (₹)</label><input className="form-control form-control-lg" type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} required /></div>
          <button className="btn btn-primary w-100 btn-lg">Pay Now</button>
        </form>
      </div></div>
    </div>
  );
}
