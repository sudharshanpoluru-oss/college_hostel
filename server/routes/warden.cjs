const express = require('express');
const pool = require('../db.cjs');
const { authenticate, authorize } = require('../middleware/auth.cjs');
const router = express.Router();

router.use(authenticate, authorize('warden'));
const q = async (sql, params = []) => { const [r] = await pool.query(sql, params); return r; };

const getHostelType = async (req) => {
  const rows = await q('SELECT hostel_type FROM wardens WHERE user_id=?', [req.user.id]);
  return rows.length ? rows[0].hostel_type : null;
};

const isSameHostel = async (studentId, hostelType) => {
  if (!hostelType) return true;
  const rows = await q('SELECT id FROM students WHERE id=? AND hostel_type=?', [studentId, hostelType]);
  return rows.length > 0;
};

// mysql2 allowed `SET ?` with a JS object; Postgres needs an explicit column list.
const buildSet = (obj) => {
  const keys = Object.keys(obj);
  return { clause: keys.map(k => `${k}=?`).join(', '), params: keys.map(k => obj[k]) };
};

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const wardenRows = await q('SELECT * FROM wardens WHERE user_id=?', [req.user.id]);
    if (!wardenRows.length) return res.status(404).json({ error: 'Warden not found' });
    const warden = wardenRows[0];
    const hostelType = warden.hostel_type;
    const hostelFilter = hostelType ? 'AND s.hostel_type=?' : ''; const params = hostelType ? [hostelType] : [];
    const [students] = await q(`SELECT COUNT(*) c FROM students s WHERE s.status='Active' ${hostelFilter}`, params);
    const [complaints] = await q(`SELECT COUNT(*) c FROM complaints c JOIN students s ON s.id=c.student_id WHERE c.status='Pending' ${hostelFilter}`, params);
    const [leaves] = await q(`SELECT COUNT(*) c FROM leaves l JOIN students s ON s.id=l.student_id WHERE l.status='Pending' ${hostelFilter}`, params);
    const [present] = await q(`SELECT COUNT(*) c FROM attendance a JOIN students s ON s.id=a.student_id WHERE a.date=CURRENT_DATE AND a.status='Present' ${hostelFilter}`, params);
    res.json({ warden, stats: { students: students.c, pendingComplaints: complaints.c, pendingLeaves: leaves.c, presentToday: present.c } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Attendance
router.get('/attendance', async (req, res) => {
  try { const { date, page = 1, limit = 50 } = req.query; const offset = (page - 1) * limit;
    const wardenRows = await q('SELECT hostel_type FROM wardens WHERE user_id=?', [req.user.id]);
    const hostelType = wardenRows.length ? wardenRows[0].hostel_type : null;
    const filter = hostelType ? 'AND s.hostel_type=?' : ''; const p = hostelType ? [hostelType] : [];
    const [count] = await q(`SELECT COUNT(*) c FROM attendance a JOIN students s ON s.id=a.student_id WHERE a.date=? ${filter}`, [date || new Date().toISOString().split('T')[0], ...p]);
    const data = await q(`SELECT a.*, s.name, s.roll_no, s.hostel_type FROM attendance a JOIN students s ON s.id=a.student_id WHERE a.date=? ${filter} ORDER BY s.name LIMIT ? OFFSET ?`, [date || new Date().toISOString().split('T')[0], ...p, +limit, +offset]);
    res.json({ attendance: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/attendance/students', async (req, res) => {
  try { const wardenRows = await q('SELECT hostel_type FROM wardens WHERE user_id=?', [req.user.id]);
    const hostelType = wardenRows.length ? wardenRows[0].hostel_type : null;
    const sql = hostelType ? "SELECT s.id, s.name, s.roll_no, r.room_no FROM students s LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id WHERE s.hostel_type=? AND s.status='Active' ORDER BY s.name" : "SELECT s.id, s.name, s.roll_no, r.room_no FROM students s LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id WHERE s.status='Active' ORDER BY s.name";
    const params = hostelType ? [hostelType] : [];
    const students = await q(sql, params);
    res.json(students); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/attendance/mark', async (req, res) => {
  try { const { date, records } = req.body;
    if (!records || !Array.isArray(records)) return res.status(400).json({ error: 'records array is required' });
    for (const r of records) { await q("INSERT INTO attendance (student_id,date,status,remarks,taken_by,taken_role,is_locked,time) VALUES (?,?,?,?,?,'warden',0,NOW()) ON CONFLICT (student_id, date) DO UPDATE SET status=EXCLUDED.status, remarks=EXCLUDED.remarks, taken_by=EXCLUDED.taken_by, taken_role='warden', time=NOW()", [r.student_id, date, r.status, r.remarks || null, req.user.id]); }
    res.json({ message: 'Attendance saved' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Students
router.get('/students', async (req, res) => {
  try { const wardenRows = await q('SELECT hostel_type FROM wardens WHERE user_id=?', [req.user.id]);
    const hostelType = wardenRows.length ? wardenRows[0].hostel_type : null;
    const filter = hostelType ? 'WHERE s.hostel_type=?' : ''; const p = hostelType ? [hostelType] : [];
    const data = await q(`SELECT s.*, r.room_no FROM students s LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id ${filter} ORDER BY s.name`, p);
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Complaints
router.get('/complaints', async (req, res) => {
  try { const wardenRows = await q('SELECT hostel_type FROM wardens WHERE user_id=?', [req.user.id]);
    const hostelType = wardenRows.length ? wardenRows[0].hostel_type : null;
    const filter = hostelType ? 'AND s.hostel_type=?' : ''; const p = hostelType ? [hostelType] : [];
    const data = await q(`SELECT c.*, s.name AS student_name, s.roll_no FROM complaints c JOIN students s ON s.id=c.student_id WHERE 1=1 ${filter} ORDER BY c.created_at DESC`, p);
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/complaints/:id', async (req, res) => {
  try { const { status, admin_response } = req.body;
    await q('UPDATE complaints SET status=?, admin_response=? WHERE id=?', [status, admin_response, req.params.id]);
    await q('INSERT INTO complaint_logs (complaint_id,action,performed_by,role,remarks) VALUES (?,?,?,?,?)', [req.params.id, status, req.user.id, 'warden', admin_response]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Leaves
router.get('/leaves', async (req, res) => {
  try { const wardenRows = await q('SELECT hostel_type FROM wardens WHERE user_id=?', [req.user.id]);
    const hostelType = wardenRows.length ? wardenRows[0].hostel_type : null;
    const filter = hostelType ? 'AND s.hostel_type=?' : ''; const p = hostelType ? [hostelType] : [];
    const data = await q(`SELECT l.*, s.name AS student_name, s.roll_no FROM leaves l JOIN students s ON s.id=l.student_id WHERE 1=1 ${filter} ORDER BY l.applied_at DESC`, p);
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/leaves/:id', async (req, res) => {
  try { const { status, remark } = req.body;
    await q('UPDATE leaves SET status=?, admin_remark=?, warden_id=? WHERE id=?', [status, remark, req.user.id, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Maintenance
router.get('/maintenance', async (req, res) => {
  try { const wardenRows = await q('SELECT hostel_type FROM wardens WHERE user_id=?', [req.user.id]);
    const hostelType = wardenRows.length ? wardenRows[0].hostel_type : null;
    const filter = hostelType ? 'AND s.hostel_type=?' : ''; const p = hostelType ? [hostelType] : [];
    const data = await q(`SELECT mr.*, s.name AS student_name, s.roll_no, r.room_no FROM maintenance_requests mr LEFT JOIN students s ON s.id=mr.student_id LEFT JOIN rooms r ON r.id=mr.room_id WHERE 1=1 ${filter} ORDER BY COALESCE(array_position(ARRAY['Emergency','High','Medium','Low'], mr.priority), 99), mr.created_at DESC`, p);
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/maintenance/:id/status', async (req, res) => {
  try { const { status, assigned_to, completion_remarks } = req.body;
    const updates = { status };
    if (assigned_to) { updates.assigned_to = assigned_to; updates.assigned_date = new Date(); }
    if (completion_remarks) { updates.completed_date = new Date(); updates.completion_remarks = completion_remarks; }
    const set = buildSet(updates);
    await q(`UPDATE maintenance_requests SET ${set.clause} WHERE id=?`, [...set.params, req.params.id]); res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Visitors
router.get('/visitors', async (req, res) => {
  try { const { search, page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const hostelType = await getHostelType(req);
    const filter = hostelType ? 'AND (v.student_id IS NULL OR s.hostel_type=?)' : '';
    const filterParams = hostelType ? [hostelType] : [];
    let where = '', params = [];
    if (search) { where = 'WHERE v.visitor_name LIKE ? OR v.contact LIKE ?'; params.push(`%${search}%`, `%${search}%`); }
    const [count] = await q(`SELECT COUNT(*) c FROM visitor_logs v LEFT JOIN students s ON s.id=v.student_id ${where} ${filter}`, [...params, ...filterParams]);
    const data = await q(`SELECT v.*, s.name AS student_name, s.roll_no FROM visitor_logs v LEFT JOIN students s ON s.id=v.student_id ${where} ${filter} ORDER BY v.check_in DESC LIMIT ? OFFSET ?`, [...params, ...filterParams, +limit, +offset]);
    const students = await q(hostelType ? "SELECT id,name,roll_no FROM students WHERE status='Active' AND hostel_type=? ORDER BY name" : "SELECT id,name,roll_no FROM students WHERE status='Active' ORDER BY name", hostelType ? [hostelType] : []);
    res.json({ visitors: data, total: count.c, students, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/visitors', async (req, res) => {
  try { const { visitor_name, contact, purpose, student_id, remarks } = req.body;
    const hostelType = await getHostelType(req);
    if (student_id && !(await isSameHostel(student_id, hostelType))) return res.status(403).json({ error: 'Student belongs to another hostel' });
    await q('INSERT INTO visitor_logs (visitor_name,contact,purpose,student_id,check_in,remarks,created_by) VALUES (?,?,?,?,NOW(),?,?)', [visitor_name, contact, purpose, student_id || null, remarks, req.user.id]);
    res.status(201).json({ message: 'Visitor logged' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/visitors/:id/approve', async (req, res) => {
  try { await q("UPDATE visitor_logs SET status='Approved', warden_approved=1 WHERE id=?", [req.params.id]); res.json({ message: 'Approved' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/visitors/:id/checkout', async (req, res) => {
  try { await q("UPDATE visitor_logs SET check_out=NOW() WHERE id=? AND check_out IS NULL", [req.params.id]); res.json({ message: 'Checked out' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Emergency
router.get('/emergency', async (req, res) => {
  try { const hostelType = await getHostelType(req);
    const filter = hostelType ? 'AND (e.student_id IS NULL OR s.hostel_type=?)' : '';
    const params = hostelType ? [hostelType] : [];
    const data = await q(`SELECT e.*, s.name AS student_name, s.roll_no, r.room_no FROM emergency_logs e LEFT JOIN students s ON s.id=e.student_id LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id WHERE 1=1 ${filter} ORDER BY COALESCE(array_position(ARRAY['Critical','High','Medium','Low'], e.severity), 99), e.reported_at DESC LIMIT 50`, params); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/emergency/:id', async (req, res) => {
  try { const { status, response_notes } = req.body;
    await q("UPDATE emergency_logs SET status=?, response_notes=CONCAT(COALESCE(response_notes,''), CHR(10)||'['||NOW()||'] '||COALESCE(?,'')), responded_by=?, responded_at=NOW() WHERE id=?", [status, response_notes, req.user.id, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Notices
router.get('/notices', async (req, res) => {
  try { const data = await q("SELECT * FROM notices WHERE target_role IN ('all','warden') OR created_by=? ORDER BY created_at DESC", [req.user.id]); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/notices', async (req, res) => {
  try { const { title, content, target_role, priority } = req.body;
    await q('INSERT INTO notices (title,content,target_role,priority,created_by,created_at,expires_at) VALUES (?,?,?,?,?,NOW(),NOW() + INTERVAL \'30 days\')', [title, content, target_role || 'all', priority || 'Normal', req.user.id]);
    res.status(201).json({ message: 'Notice added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/notices/:id', async (req, res) => {
  try { await q('DELETE FROM notices WHERE id=? AND created_by=?', [req.params.id, req.user.id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Daily Report
router.get('/daily-report', async (req, res) => {
  try { const { date } = req.query; const d = date || new Date().toISOString().split('T')[0];
    const wardenRows = await q('SELECT hostel_type FROM wardens WHERE user_id=?', [req.user.id]);
    const hostelType = wardenRows.length ? wardenRows[0].hostel_type : null;
    const filter = hostelType ? 'AND s.hostel_type=?' : ''; const p = hostelType ? [hostelType] : [];
    const [totalStudents] = await q(`SELECT COUNT(*) c FROM students s WHERE s.status='Active' ${filter}`, p);
    const [present] = await q(`SELECT COUNT(*) c FROM attendance a JOIN students s ON s.id=a.student_id WHERE a.date=? AND a.status='Present' ${filter}`, [d, ...p]);
    const [absent] = await q(`SELECT COUNT(*) c FROM attendance a JOIN students s ON s.id=a.student_id WHERE a.date=? AND a.status='Absent' ${filter}`, [d, ...p]);
    const pendingLeaves = await q(`SELECT l.*, s.name, s.roll_no FROM leaves l JOIN students s ON s.id=l.student_id WHERE l.status='Pending' ${filter}`, p);
    const pendingComplaints = await q(`SELECT c.*, s.name, s.roll_no FROM complaints c JOIN students s ON s.id=c.student_id WHERE c.status IN ('Pending','In Progress') ${filter}`, p);
    const visitors = await q(`SELECT v.*, s.name, s.roll_no FROM visitor_logs v LEFT JOIN students s ON s.id=v.student_id WHERE CAST(v.check_in AS DATE)=? ${filter} ORDER BY v.check_in`, [d, ...p]);
    res.json({ date: d, totalStudents: totalStudents.c, present: present.c, absent: absent.c, pendingLeaves, pendingComplaints, visitors });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Room Inspection
router.get('/room-inspection', async (req, res) => {
  try { const hostelType = await getHostelType(req);
    const filter = hostelType ? 'WHERE r.hostel_type=?' : '';
    const params = hostelType ? [hostelType] : [];
    const data = await q(`SELECT r.*, ri.cleanliness_rating, ri.maintenance_notes, ri.action_taken, ri.inspection_date FROM rooms r LEFT JOIN room_inspections ri ON ri.room_id=r.id ${filter} ORDER BY r.floor, r.room_no`, params); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/room-inspection', async (req, res) => {
  try { const { room_id, inspection_date, cleanliness_rating, maintenance_notes, action_taken } = req.body;
    await q('INSERT INTO room_inspections (room_id,inspector_id,inspection_date,cleanliness_rating,maintenance_notes,action_taken) VALUES (?,?,?,?,?,?)', [room_id, req.user.id, inspection_date, cleanliness_rating, maintenance_notes, action_taken]);
    res.status(201).json({ message: 'Inspection logged' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Medical
router.get('/medical', async (req, res) => {
  try { const hostelType = await getHostelType(req);
    const filter = hostelType ? 'AND (mr.student_id IS NULL OR s.hostel_type=?)' : '';
    const params = hostelType ? [hostelType] : [];
    const data = await q(`SELECT mr.*, s.name AS student_name, s.roll_no, r.room_no FROM medical_records mr LEFT JOIN students s ON s.id=mr.student_id LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id WHERE 1=1 ${filter} ORDER BY mr.created_at DESC`, params); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/medical', async (req, res) => {
  try { const { student_id, symptoms, diagnosis, treatment, medication, follow_up_date, notes } = req.body;
    const hostelType = await getHostelType(req);
    if (student_id && !(await isSameHostel(student_id, hostelType))) return res.status(403).json({ error: 'Student belongs to another hostel' });
    await q('INSERT INTO medical_records (student_id,reported_by,symptoms,diagnosis,treatment,medication,follow_up_date,notes) VALUES (?,?,?,?,?,?,?,?)', [student_id, req.user.id, symptoms, diagnosis, treatment, medication, follow_up_date, notes]);
    res.status(201).json({ message: 'Record added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Discipline
router.get('/discipline', async (req, res) => {
  try { const hostelType = await getHostelType(req);
    const filter = hostelType ? 'AND (dr.student_id IS NULL OR s.hostel_type=?)' : '';
    const params = hostelType ? [hostelType] : [];
    const data = await q(`SELECT dr.*, s.name AS student_name, s.roll_no, r.room_no FROM discipline_records dr LEFT JOIN students s ON s.id=dr.student_id LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id WHERE 1=1 ${filter} ORDER BY dr.created_at DESC`, params); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/discipline', async (req, res) => {
  try { const { student_id, incident_type, description, severity, action_taken, remarks } = req.body;
    const hostelType = await getHostelType(req);
    if (student_id && !(await isSameHostel(student_id, hostelType))) return res.status(403).json({ error: 'Student belongs to another hostel' });
    await q('INSERT INTO discipline_records (student_id,reported_by,incident_type,description,severity,action_taken,remarks) VALUES (?,?,?,?,?,?,?)', [student_id, req.user.id, incident_type, description, severity, action_taken, remarks]);
    res.status(201).json({ message: 'Record added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Notifications
router.get('/notifications', async (req, res) => {
  try { const data = await q('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50', [req.user.id]); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/notifications/read/:id', async (req, res) => {
  try { await q('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?', [req.params.id, req.user.id]); res.json({ message: 'Read' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/notifications/read-all', async (req, res) => {
  try { await q('UPDATE notifications SET is_read=1 WHERE user_id=?', [req.user.id]); res.json({ message: 'All marked read' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
