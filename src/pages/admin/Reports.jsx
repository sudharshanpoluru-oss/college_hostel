import { useState } from 'react'; import api from '../../api/client';
export default function Reports() {
  const [type, setType] = useState('students'); const [data, setData] = useState([]); const [loaded, setLoaded] = useState(false);
  const load = async () => { const r = await api.get(`/admin/reports/${type}`); setData(r.data); setLoaded(true); };
  return (
    <div>
      <h4 className="fw-bold mb-3"><i className="bi bi-file-text me-2"></i>Reports</h4>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {['students', 'rooms', 'fees', 'attendance', 'complaints'].map(t => <button key={t} className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setType(t); setLoaded(false); }}>{t}</button>)}
        <button className="btn btn-sm btn-success" onClick={load}>Generate</button>
      </div>
      {loaded && <div className="card"><div className="card-body p-0" style={{ maxHeight: 500, overflow: 'auto' }}>
        <table className="table table-sm mb-0"><thead><tr>{data.length > 0 && Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}</tr></thead>
          <tbody>{data.map((row, i) => <tr key={i}>{Object.values(row).map((v, j) => <td key={j}>{String(v || '')}</td>)}</tr>)}</tbody></table>
      </div></div>}
    </div>
  );
}
