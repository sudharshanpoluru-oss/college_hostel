import { useState } from 'react'; import api from '../../api/client';
export default function Search() {
  const [q, setQ] = useState(''); const [results, setResults] = useState(null);
  const handleSearch = async () => { if (!q) return; const r = await api.get('/admin/search', { params: { q } }); setResults(r.data); };
  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-search me-2"></i>Search</h4>
      <div className="input-group mb-3" style={{ maxWidth: 500 }}>
        <input className="form-control" placeholder="Search students, rooms, complaints..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button className="btn btn-primary" onClick={handleSearch}><i className="bi bi-search"></i></button>
      </div>
      {results && <div className="row g-3">
        {results.students?.length > 0 && <div className="col-md-4"><div className="card"><div className="card-header fw-bold">Students</div><div className="list-group list-group-flush">{results.students.map(s => <div key={s.id} className="list-group-item">{s.name} ({s.roll_no})</div>)}</div></div></div>}
        {results.rooms?.length > 0 && <div className="col-md-4"><div className="card"><div className="card-header fw-bold">Rooms</div><div className="list-group list-group-flush">{results.rooms.map(r => <div key={r.id} className="list-group-item">Room {r.room_no} - {r.status}</div>)}</div></div></div>}
        {results.complaints?.length > 0 && <div className="col-md-4"><div className="card"><div className="card-header fw-bold">Complaints</div><div className="list-group list-group-flush">{results.complaints.map(c => <div key={c.id} className="list-group-item">{c.title} - {c.status}</div>)}</div></div></div>}
      </div>}
    </div>
  );
}
