import { useState, useEffect } from 'react'; import api from '../../api/client';
export default function Backup() {
  const [backups, setBackups] = useState([]); const [msg, setMsg] = useState('');
  const load = () => { api.get('/admin/backups').then(r => setBackups(r.data)).catch(() => {}); };
  useEffect(() => { load(); }, []);
  const createBackup = async () => { setMsg('Creating...'); await api.post('/admin/backups/create'); setMsg('Backup created!'); load(); };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0"><i className="bi bi-cloud-download me-2"></i>Backup</h4><button className="btn btn-primary btn-sm" onClick={createBackup}><i className="bi bi-plus-circle"></i> Create Backup</button></div>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="card"><div className="card-body p-0"><table className="table table-sm mb-0">
        <thead><tr><th>File</th><th>Size</th><th>Date</th><th>Created By</th></tr></thead>
        <tbody>{backups.map(b => <tr key={b.id}>
          <td>{b.filename}</td><td>{(b.filesize / 1024).toFixed(1)} KB</td><td>{b.created_at}</td><td>{b.username || 'system'}</td>
        </tr>)}</tbody></table></div></div>
    </div>
  );
}
