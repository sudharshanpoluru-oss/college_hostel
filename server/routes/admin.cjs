const express = require('express');
const pool = require('../db.cjs');
const fs = require('fs');
const { authenticate, authorize } = require('../middleware/auth.cjs');
const router = express.Router();

router.use(authenticate, authorize('admin'));
const q = async (sql, params = []) => { const [r] = await pool.query(sql, params); return r; };

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [students] = await q('SELECT COUNT(*) c FROM students WHERE status=?', ['Active']);
    const [rooms] = await q('SELECT COUNT(*) c FROM rooms');
    const [occ] = await q('SELECT COALESCE(SUM(occupancy),0) c FROM rooms');
    const [cap] = await q('SELECT COALESCE(SUM(capacity),0) c FROM rooms');
    const [fees] = await q("SELECT COALESCE(SUM(paid_amount),0) c FROM fees WHERE status='Paid'");
    const [pending] = await q("SELECT COUNT(*) c FROM complaints WHERE status='Pending'");
    const [leaves] = await q("SELECT COUNT(*) c FROM leaves WHERE status='Pending'");
    const [present] = await q("SELECT COUNT(*) c FROM attendance WHERE date=CURDATE() AND status='Present'");
    const [absent] = await q("SELECT COUNT(*) c FROM attendance WHERE date=CURDATE() AND status='Absent'");
    const [escalated] = await q("SELECT COUNT(*) c FROM complaints WHERE status IN ('Escalated to Admin','Under Admin Review')");
    const [maint] = await q("SELECT COUNT(*) c FROM maintenance_requests WHERE status NOT IN ('Resolved','Closed')");
    const [pendingFees] = await q("SELECT COALESCE(SUM(due_amount),0) c FROM fees WHERE status!='Paid'");
    const recentFees = await q('SELECT f.*, s.name, s.roll_no FROM fees f JOIN students s ON s.id=f.student_id WHERE f.status=? ORDER BY f.payment_date DESC LIMIT 5', ['Paid']);
    const recentComplaints = await q('SELECT c.*, s.name, s.roll_no FROM complaints c JOIN students s ON s.id=c.student_id ORDER BY c.created_at DESC LIMIT 5');
    const recentStudents = await q("SELECT * FROM students WHERE status='Active' ORDER BY admission_date DESC LIMIT 5");
    res.json({ stats: { students: students.c, rooms: rooms.c, occupancy: occ.c, capacity: cap.c, fees: fees.c, pending_complaints: pending.c, pending_leaves: leaves.c, present: present.c, absent: absent.c, escalated: escalated.c, maintenance: maint.c, pending_fees: pendingFees.c }, recentFees, recentComplaints, recentStudents });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Students

router.get('/students', async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (search) { where = 'WHERE (s.name LIKE ? OR s.roll_no LIKE ? OR s.phone LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    const [count] = await q(`SELECT COUNT(*) c FROM students s JOIN users u ON u.id=s.user_id ${where}`, params);
    const students = await q(`SELECT s.*, r.room_no, a.username AS approved_by_name FROM students s JOIN users u ON u.id=s.user_id LEFT JOIN users a ON a.id=u.approved_by LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id ${where} ORDER BY s.id DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    const pending = await q("SELECT s.id, s.name, s.roll_no, s.email, s.phone, s.course, s.gender, u.id AS user_id FROM students s JOIN users u ON u.id=s.user_id WHERE u.approved=0 AND u.role='student' ORDER BY s.id DESC");
    res.json({ students, total: count.c, pending, page: +page });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/students/:id', async (req, res) => {
  try {
    const rows = await q(`SELECT s.*, r.room_no, r.room_type, r.id AS room_id, ra.bed_no, ra.allocation_date AS room_allocation_date, ra.id AS allocation_id FROM students s LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id WHERE s.id=?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const availableRooms = await q("SELECT * FROM rooms WHERE status!='Full' ORDER BY room_no");
    res.json({ student: rows[0], availableRooms });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/students', async (req, res) => {
  const { name, roll_no, email, phone, address, gender, course, year, guardian_name, guardian_phone, admission_date, join_date, status } = req.body;
  if (!name || !roll_no) return res.status(400).json({ error: 'Name and roll number are required' });
  const hostel_type = gender === 'Male' ? 'boys' : gender === 'Female' ? 'girls' : null;
  const conn = await pool.getConnection();
  try { await conn.beginTransaction();
    const username = roll_no;
    const password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password"
    const [u] = await conn.query('INSERT INTO users (username,email,password,role,status,approved) VALUES (?,?,?,?,?,?)', [username, email, password, 'student', 1, 1]);
    await conn.query('INSERT INTO students (user_id,name,roll_no,email,phone,address,gender,course,year,guardian_name,guardian_phone,admission_date,join_date,status,hostel_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [u.insertId, name, roll_no, email, phone, address, gender, course, year, guardian_name, guardian_phone, admission_date, join_date, status || 'Active', hostel_type]);
    await conn.commit(); res.status(201).json({ message: 'Student added' });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

router.put('/students/:id', async (req, res) => {
  try {
    const { name, roll_no, email, phone, address, gender, course, year, guardian_name, guardian_phone, admission_date, join_date, status } = req.body;
    const hostel_type = gender === 'Male' ? 'boys' : gender === 'Female' ? 'girls' : null;
    await q('UPDATE students SET name=?,roll_no=?,email=?,phone=?,address=?,gender=?,course=?,year=?,guardian_name=?,guardian_phone=?,admission_date=?,join_date=?,status=?,hostel_type=? WHERE id=?',
      [name, roll_no, email, phone, address, gender, course, year, guardian_name, guardian_phone, admission_date, join_date, status, hostel_type, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/students/:id', async (req, res) => {
  try {
    const [check] = await q('SELECT COUNT(*) c FROM room_allocations WHERE student_id=? AND status=?', [req.params.id, 'Active']);
    if (check.c > 0) return res.status(400).json({ error: 'Student has active room allocation' });
    await q('DELETE FROM users WHERE id=(SELECT user_id FROM students WHERE id=?)', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/students/approve/:userId', async (req, res) => {
  try { await q('UPDATE users SET approved=1, approved_by=?, approved_at=NOW() WHERE id=?', [req.user.id, req.params.userId]); res.json({ message: 'Approved' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/students/reject/:userId', async (req, res) => {
  try { await q('DELETE FROM users WHERE id=?', [req.params.userId]); res.json({ message: 'Rejected' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/students/assign-room', async (req, res) => {
  const { student_id, room_id, bed_no } = req.body;
  if (!student_id || !room_id) return res.status(400).json({ error: 'student_id and room_id are required' });
  const conn = await pool.getConnection();
  try { await conn.beginTransaction();
    await conn.query('INSERT INTO room_allocations (student_id,room_id,bed_no,allocation_date,status) VALUES (?,?,?,NOW(),?)', [student_id, room_id, bed_no, 'Active']);
    await conn.query('UPDATE rooms SET occupancy=occupancy+1 WHERE id=?', [room_id]);
    await conn.query("UPDATE rooms SET status='Full' WHERE id=? AND capacity<=occupancy", [room_id]);
    await conn.commit(); res.json({ message: 'Room assigned' });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

router.post('/students/vacate-room', async (req, res) => {
  const { allocation_id, room_id } = req.body;
  if (!allocation_id || !room_id) return res.status(400).json({ error: 'allocation_id and room_id are required' });
  const conn = await pool.getConnection();
  try { await conn.beginTransaction();
    await conn.query("UPDATE room_allocations SET checkout_date=NOW(), status='CheckedOut' WHERE id=?", [allocation_id]);
    await conn.query('UPDATE rooms SET occupancy=occupancy-1 WHERE id=?', [room_id]);
    await conn.query("UPDATE rooms SET status='Available' WHERE id=? AND capacity>occupancy", [room_id]);
    await conn.commit(); res.json({ message: 'Room vacated' });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

// Rooms
router.get('/rooms', async (req, res) => {
  try {
    const { page = 1, limit = 20, hostel_type } = req.query;
    const offset = (page - 1) * limit;
    const where = hostel_type ? 'WHERE hostel_type=?' : '';
    const params = hostel_type ? [hostel_type] : [];
    const [count] = await q(`SELECT COUNT(*) c FROM rooms ${where}`, params);
    const rooms = await q(`SELECT *, (capacity-occupancy) AS available_beds FROM rooms ${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    res.json({ rooms, total: count.c, page: +page });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/rooms/:id', async (req, res) => {
  try {
    const rows = await q('SELECT * FROM rooms WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const occupants = await q('SELECT s.name, s.roll_no, s.email, s.phone, s.course, s.year, ra.bed_no, ra.allocation_date FROM room_allocations ra JOIN students s ON s.id=ra.student_id WHERE ra.room_id=? AND ra.status=? ORDER BY s.name', [req.params.id, 'Active']);
    res.json({ room: rows[0], occupants });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/rooms', async (req, res) => {
  try { const { room_no, floor, room_type, hostel_type, capacity, fee_per_month, description, status } = req.body;
    await q('INSERT INTO rooms (room_no,floor,room_type,hostel_type,capacity,fee_per_month,description,status) VALUES (?,?,?,?,?,?,?,?)', [room_no, floor, room_type, hostel_type || 'boys', capacity, fee_per_month, description, status || 'Available']);
    res.status(201).json({ message: 'Room added' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/rooms/:id', async (req, res) => {
  try { const { room_no, floor, room_type, hostel_type, capacity, fee_per_month, description, status } = req.body;
    await q('UPDATE rooms SET room_no=?,floor=?,room_type=?,hostel_type=?,capacity=?,fee_per_month=?,description=?,status=? WHERE id=?', [room_no, floor, room_type, hostel_type || 'boys', capacity, fee_per_month, description, status, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/rooms/:id', async (req, res) => {
  try {     const [check] = await q('SELECT occupancy FROM rooms WHERE id=?', [req.params.id]);
    if (check?.occupancy > 0) return res.status(400).json({ error: 'Room has occupants' });
    await q('DELETE FROM rooms WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Allocations
router.get('/allocations', async (req, res) => {
  try { const { page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const [count] = await q('SELECT COUNT(*) c FROM room_allocations');
    const data = await q('SELECT ra.*, s.name AS student_name, s.roll_no, r.room_no FROM room_allocations ra JOIN students s ON s.id=ra.student_id JOIN rooms r ON r.id=ra.room_id ORDER BY ra.id DESC LIMIT ? OFFSET ?', [+limit, +offset]);
    const unallocated = await q("SELECT id,name,roll_no FROM students WHERE status='Active' AND id NOT IN (SELECT student_id FROM room_allocations WHERE status='Active')");
    const roomsAvail = await q("SELECT * FROM rooms WHERE status!='Full'");
    res.json({ allocations: data, total: count.c, unallocated, rooms: roomsAvail, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/allocations', async (req, res) => {
  const { student_id, room_id, bed_no } = req.body;
  if (!student_id || !room_id) return res.status(400).json({ error: 'student_id and room_id are required' });
  const conn = await pool.getConnection();
  try { await conn.beginTransaction();
    await conn.query('INSERT INTO room_allocations (student_id,room_id,bed_no,allocation_date,status) VALUES (?,?,?,NOW(),?)', [student_id, room_id, bed_no, 'Active']);
    await conn.query('UPDATE rooms SET occupancy=occupancy+1 WHERE id=?', [room_id]);
    await conn.query("UPDATE rooms SET status='Full' WHERE id=? AND capacity<=occupancy", [room_id]); await conn.commit(); res.json({ message: 'Allocated' });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

router.put('/allocations/transfer/:id', async (req, res) => {
  const { new_room_id, old_room_id } = req.body;
  if (!new_room_id || !old_room_id) return res.status(400).json({ error: 'new_room_id and old_room_id are required' });
  const conn = await pool.getConnection();
  try { await conn.beginTransaction();
    await conn.query('UPDATE room_allocations SET room_id=?, allocation_date=NOW() WHERE id=?', [new_room_id, req.params.id]);
    await conn.query('UPDATE rooms SET occupancy=occupancy-1 WHERE id=?', [old_room_id]);
    await conn.query("UPDATE rooms SET status='Available' WHERE id=? AND capacity>occupancy", [old_room_id]);
    await conn.query('UPDATE rooms SET occupancy=occupancy+1 WHERE id=?', [new_room_id]);
    await conn.query("UPDATE rooms SET status='Full' WHERE id=? AND capacity<=occupancy", [new_room_id]); await conn.commit(); res.json({ message: 'Transferred' });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

router.put('/allocations/vacate/:id', async (req, res) => {
  const { room_id } = req.body;
  if (!room_id) return res.status(400).json({ error: 'room_id is required' });
  const conn = await pool.getConnection();
  try { await conn.beginTransaction();
    await conn.query("UPDATE room_allocations SET checkout_date=NOW(), status='CheckedOut' WHERE id=?", [req.params.id]);
    await conn.query('UPDATE rooms SET occupancy=occupancy-1 WHERE id=?', [room_id]);
    await conn.query("UPDATE rooms SET status='Available' WHERE id=? AND capacity>occupancy", [room_id]); await conn.commit(); res.json({ message: 'Vacated' });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

// Fees
router.get('/fees', async (req, res) => {
  try { const { page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const [count] = await q('SELECT COUNT(*) c FROM fees');
    const data = await q('SELECT f.*, s.name AS student_name, s.roll_no FROM fees f JOIN students s ON s.id=f.student_id ORDER BY f.id DESC LIMIT ? OFFSET ?', [+limit, +offset]);
    const [totalPaid] = await q('SELECT COALESCE(SUM(paid_amount),0) c FROM fees');
    const [totalDue] = await q("SELECT COALESCE(SUM(total_fee-paid_amount),0) c FROM fees WHERE status!='Paid'");
    const students = await q("SELECT id,name,roll_no FROM students WHERE status='Active'");
    res.json({ fees: data, total: count.c, totalPaid: totalPaid.c, totalDue: totalDue.c, students, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/fees/bulk', async (req, res) => {
  try { const { total_fee, hostel_type } = req.body;
    const where = hostel_type ? 'WHERE hostel_type=?' : '';
    const params = hostel_type ? [hostel_type] : [];
    const students = await q(`SELECT id FROM students WHERE status='Active' ${where}`, params);
    if (!students.length) return res.status(400).json({ error: 'No active students found' });
    const conn = await pool.getConnection();
    try { await conn.beginTransaction();
      for (const s of students) { await conn.query('INSERT INTO fees (student_id,total_fee,paid_amount,status) VALUES (?,?,0,\'Pending\')', [s.id, total_fee]); }
      await conn.commit();
      res.status(201).json({ message: `Fee applied to ${students.length} students` });
    } catch (e) { await conn.rollback(); throw e; } finally { conn.release(); }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/fees', async (req, res) => {
  try { const { student_id, total_fee, paid_amount, payment_mode, receipt_no, payment_date } = req.body;
    const status = +paid_amount >= +total_fee ? 'Paid' : (+paid_amount > 0 ? 'Partial' : 'Pending');
    await q('INSERT INTO fees (student_id,total_fee,paid_amount,payment_mode,receipt_no,payment_date,status) VALUES (?,?,?,?,?,?,?)', [student_id, total_fee, paid_amount, payment_mode, receipt_no, payment_date, status]);
    res.status(201).json({ message: 'Fee added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/fees/:id', async (req, res) => {
  try { const { student_id, total_fee, paid_amount, payment_mode, receipt_no, payment_date } = req.body;
    const status = +paid_amount >= +total_fee ? 'Paid' : (+paid_amount > 0 ? 'Partial' : 'Pending');
    await q('UPDATE fees SET student_id=?,total_fee=?,paid_amount=?,payment_mode=?,receipt_no=?,payment_date=?,status=? WHERE id=?', [student_id, total_fee, paid_amount, payment_mode, receipt_no, payment_date, status, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/fees/:id', async (req, res) => {
  try { await q('DELETE FROM fees WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Complaints
router.get('/complaints', async (req, res) => {
  try { const { status, page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    let where = '', params = [];
    if (status) { where = 'WHERE c.status=?'; params.push(status); }
    const [count] = await q(`SELECT COUNT(*) c FROM complaints c ${where}`, params);
    const data = await q(`SELECT c.*, s.name AS student_name, s.roll_no FROM complaints c JOIN students s ON s.id=c.student_id ${where} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    res.json({ complaints: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/complaints/:id', async (req, res) => {
  try { const rows = await q('SELECT c.*, s.name AS student_name, s.roll_no FROM complaints c JOIN students s ON s.id=c.student_id WHERE c.id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const logs = await q('SELECT cl.*, u.username FROM complaint_logs cl LEFT JOIN users u ON u.id=cl.performed_by WHERE cl.complaint_id=? ORDER BY cl.created_at DESC', [req.params.id]);
    const assignable = await q("SELECT id, username FROM users WHERE role IN ('admin','warden') ORDER BY username");
    res.json({ complaint: rows[0], logs, assignable }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/complaints/:id/status', async (req, res) => {
  try { const { status, remark } = req.body;
    const updates = { status };
    if (status === 'Resolved' || status === 'Resolved by Admin') { updates.resolved_by = req.user.id; updates.resolved_at = new Date(); updates.resolution_date = new Date(); }
    if (remark) updates.admin_response = remark;
    if (status === 'Resolved by Admin') updates.resolution_notes = remark;
    await q('UPDATE complaints SET ? WHERE id=?', [updates, req.params.id]);
    await q('INSERT INTO complaint_logs (complaint_id, action, performed_by, role, remarks) VALUES (?,?,?,?,?)', [req.params.id, status, req.user.id, 'admin', remark]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Leaves
router.get('/leaves', async (req, res) => {
  try { const { page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const [count] = await q('SELECT COUNT(*) c FROM leaves');
    const data = await q('SELECT l.*, s.name AS student_name, s.roll_no, w.username AS warden_name, a.username AS approved_by_name FROM leaves l JOIN students s ON s.id=l.student_id LEFT JOIN users w ON w.id=l.warden_id LEFT JOIN users a ON a.id=l.approved_by ORDER BY l.applied_at DESC LIMIT ? OFFSET ?', [+limit, +offset]);
    res.json({ leaves: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/leaves/:id', async (req, res) => {
  try { const rows = await q('SELECT l.*, s.name AS student_name, s.roll_no, s.email, s.phone, w.username AS warden_name, a.username AS approved_by_name FROM leaves l JOIN students s ON s.id=l.student_id LEFT JOIN users w ON w.id=l.warden_id LEFT JOIN users a ON a.id=l.approved_by WHERE l.id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' }); res.json(rows[0]); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/leaves/:id', async (req, res) => {
  try { const { status, remark } = req.body;
    await q('UPDATE leaves SET status=?, admin_remark=?, approved_by=? WHERE id=?', [status, remark, req.user.id, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Attendance
router.get('/attendance', async (req, res) => {
  try { const { date, page = 1, limit = 20, student_id } = req.query; const offset = (page - 1) * limit;
    let where = '', params = [];
    if (date) { where = 'WHERE a.date=?'; params.push(date); }
    if (student_id) { where = where ? `${where} AND a.student_id=?` : 'WHERE a.student_id=?'; params.push(student_id); }
    const [count] = await q(`SELECT COUNT(*) c FROM attendance a ${where}`, params);
    const data = await q(`SELECT a.*, s.name AS student_name, s.roll_no, COALESCE(r.room_no,'-') AS room_no, u.username AS taken_by_name FROM attendance a JOIN students s ON s.id=a.student_id LEFT JOIN room_allocations al ON al.student_id=s.id AND al.status='Active' LEFT JOIN rooms r ON r.id=al.room_id LEFT JOIN users u ON u.id=a.taken_by ${where} ORDER BY a.date DESC, a.time DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    res.json({ attendance: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/attendance/mark', async (req, res) => {
  try { const { date, records } = req.body;
    if (!records || !Array.isArray(records)) return res.status(400).json({ error: 'records array is required' });
    const conn = await pool.getConnection();
    try {
      for (const r of records) {
        await conn.query("INSERT INTO attendance (student_id,date,status,remarks,taken_by,taken_role,is_locked,time) VALUES (?,?,?,?,?,'admin',0,NOW()) ON DUPLICATE KEY UPDATE status=VALUES(status),remarks=VALUES(remarks),taken_by=VALUES(taken_by),taken_role='admin',time=NOW()",
          [r.student_id, date, r.status, r.remarks || null, req.user.id]);
      }
      res.json({ message: 'Attendance saved' });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { conn.release(); }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/attendance/students', async (req, res) => {
  try { const data = await q("SELECT s.id, s.name, s.roll_no, COALESCE(r.room_no,'-') AS room_no FROM students s LEFT JOIN room_allocations al ON al.student_id=s.id AND al.status='Active' LEFT JOIN rooms r ON r.id=al.room_id WHERE s.status='Active' ORDER BY s.name");
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/attendance/lock', async (req, res) => {
  try { const { date, locked } = req.body;
    await q(`UPDATE attendance SET is_locked=? WHERE date=?`, [locked ? 1 : 0, date]);
    res.json({ message: locked ? 'Locked' : 'Unlocked' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Notices
router.get('/notices', async (req, res) => {
  try { const { page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const [count] = await q('SELECT COUNT(*) c FROM notices');
    const data = await q('SELECT * FROM notices ORDER BY id DESC LIMIT ? OFFSET ?', [+limit, +offset]);
    res.json({ notices: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/notices', async (req, res) => {
  try { const { title, content, priority, publish_date, expiry_date } = req.body;
    await q('INSERT INTO notices (title,content,priority,publish_date,expiry_date,status,created_by) VALUES (?,?,?,?,?,1,?)', [title, content, priority || 'Normal', publish_date, expiry_date || null, req.user.id]);
    res.status(201).json({ message: 'Notice added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/notices/:id', async (req, res) => {
  try { const { title, content, priority, publish_date, expiry_date, status } = req.body;
    await q('UPDATE notices SET title=?,content=?,priority=?,publish_date=?,expiry_date=?,status=? WHERE id=?', [title, content, priority, publish_date, expiry_date, status, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/notices/:id', async (req, res) => {
  try { await q('DELETE FROM notices WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Mess Menu
router.get('/mess-menu', async (req, res) => {
  try { const data = await q("SELECT * FROM mess_menu ORDER BY FIELD(day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'), FIELD(meal_type,'Breakfast','Lunch','Evening Snacks','Dinner')");
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/mess-menu', async (req, res) => {
  try { const { day, meal_type, menu_items, date } = req.body;
    await q('INSERT INTO mess_menu (day,meal_type,menu_items,date,status) VALUES (?,?,?,?,1)', [day, meal_type, menu_items, date]);
    res.status(201).json({ message: 'Added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/mess-menu/:id', async (req, res) => {
  try { const { day, meal_type, menu_items, date, status } = req.body;
    await q('UPDATE mess_menu SET day=?,meal_type=?,menu_items=?,date=?,status=? WHERE id=?', [day, meal_type, menu_items, date, status, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/mess-menu/:id', async (req, res) => {
  try { await q('DELETE FROM mess_menu WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Events
router.get('/events', async (req, res) => {
  try { const { page = 1, limit = 20, search } = req.query; const offset = (page - 1) * limit;
    let where = '', params = [];
    if (search) { where = 'WHERE title LIKE ? OR description LIKE ? OR location LIKE ?'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    const [count] = await q(`SELECT COUNT(*) c FROM hostel_events ${where}`, params);
    const data = await q(`SELECT * FROM hostel_events ${where} ORDER BY event_date DESC, event_time ASC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    res.json({ events: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/events', async (req, res) => {
  try { const { title, description, event_date, event_time, location } = req.body;
    await q('INSERT INTO hostel_events (title,description,event_date,event_time,location,status,created_by) VALUES (?,?,?,?,?,1,?)', [title, description, event_date, event_time, location, req.user.id]);
    res.status(201).json({ message: 'Added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/events/:id', async (req, res) => {
  try { const { title, description, event_date, event_time, location, status } = req.body;
    await q('UPDATE hostel_events SET title=?,description=?,event_date=?,event_time=?,location=?,status=? WHERE id=?', [title, description, event_date, event_time, location, status, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/events/:id', async (req, res) => {
  try { await q('DELETE FROM hostel_events WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Emergency
router.get('/emergency', async (req, res) => {
  try { const { status, page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    let where = '', params = [];
    if (status) { where = 'WHERE status=?'; params.push(status); }
    const [count] = await q(`SELECT COUNT(*) c FROM emergency_reports ${where}`, params);
    const data = await q(`SELECT * FROM emergency_reports ${where} ORDER BY CASE priority WHEN 'Critical' THEN 0 WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END, created_at DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    const assignable = await q("SELECT id, username FROM users WHERE role IN ('admin','warden') ORDER BY username");
    res.json({ emergencies: data, total: count.c, assignable, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/emergency/:id', async (req, res) => {
  try { const rows = await q('SELECT * FROM emergency_reports WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const logs = await q('SELECT el.*, u.username FROM emergency_logs el LEFT JOIN users u ON u.id=el.performed_by WHERE el.emergency_id=? ORDER BY el.created_at ASC', [req.params.id]);
    res.json({ emergency: rows[0], logs }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/emergency/:id/status', async (req, res) => {
  try { const { status, assigned_to, resolution } = req.body;
    const updates = { status };
    if (assigned_to) updates.assigned_to = assigned_to;
    if (resolution) { updates.resolution = resolution; updates.resolved_at = new Date(); }
    await q('UPDATE emergency_reports SET ? WHERE id=?', [updates, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Visitors
router.get('/visitors', async (req, res) => {
  try { const { search, page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    let where = '', params = [];
    if (search) { where = 'WHERE v.visitor_name LIKE ? OR v.contact LIKE ?'; params.push(`%${search}%`, `%${search}%`); }
    const [count] = await q(`SELECT COUNT(*) c FROM visitor_logs v ${where}`, params);
    const data = await q(`SELECT v.*, s.name AS student_name, s.roll_no FROM visitor_logs v LEFT JOIN students s ON s.id=v.student_id ${where} ORDER BY v.check_in DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    const students = await q("SELECT id,name,roll_no FROM students WHERE status='Active' ORDER BY name");
    res.json({ visitors: data, total: count.c, students, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/visitors', async (req, res) => {
  try { const { visitor_name, contact, purpose, student_id, remarks } = req.body;
    await q('INSERT INTO visitor_logs (visitor_name,contact,purpose,student_id,check_in,remarks,created_by) VALUES (?,?,?,?,NOW(),?,?)', [visitor_name, contact, purpose, student_id || null, remarks, req.user.id]);
    res.status(201).json({ message: 'Visitor logged' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/visitors/checkout/:id', async (req, res) => {
  try { await q("UPDATE visitor_logs SET check_out=NOW() WHERE id=? AND check_out IS NULL", [req.params.id]); res.json({ message: 'Checked out' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Wardens
router.get('/wardens', async (req, res) => {
  try { fs.appendFileSync('C:\\Users\\HP\\AppData\\Local\\Temp\\admin_err.log', `${new Date().toISOString()} wardens start\n`); const { page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const [count] = await q('SELECT COUNT(*) c FROM wardens');
    const data = await q('SELECT w.*, u.username FROM wardens w JOIN users u ON u.id=w.user_id ORDER BY w.id DESC LIMIT ? OFFSET ?', [+limit, +offset]);
    res.json({ wardens: data, total: count.c, page: +page }); } catch (e) { fs.appendFileSync('C:\\Users\\HP\\AppData\\Local\\Temp\\admin_err.log', `${new Date().toISOString()} wardens catch: ${e.stack || e.message}\n`); res.status(500).json({ error: e.message }); }
});

router.post('/wardens', async (req, res) => {
  const { name, phone, email, shift, hostel_type, username, password } = req.body;
  if (!username || !name) return res.status(400).json({ error: 'Username and name are required' });
  const conn = await pool.getConnection();
  try { await conn.beginTransaction();
    const hash = require('bcryptjs').hashSync(password || 'warden123', 10);
    const [u] = await conn.query('INSERT INTO users (username,email,password,role,status,approved) VALUES (?,?,?,?,1,1)', [username, email, hash, 'warden']);
    await conn.query('INSERT INTO wardens (user_id,name,phone,email,shift,hostel_type,status) VALUES (?,?,?,?,?,?,1)', [u.insertId, name, phone, email, shift, hostel_type]);
    await conn.commit(); res.status(201).json({ message: 'Warden added' });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

router.put('/wardens/:id', async (req, res) => {
  try { const { name, phone, email, shift, hostel_type, username, password } = req.body;
    const [w] = await q('SELECT user_id FROM wardens WHERE id=?', [req.params.id]);
    if (username || password) {
      if (password) { const hash = require('bcryptjs').hashSync(password, 10); await q('UPDATE users SET password=? WHERE id=?', [hash, w.user_id]); }
      if (username) await q('UPDATE users SET username=?, email=? WHERE id=?', [username, email, w.user_id]);
    } else { await q('UPDATE users SET email=? WHERE id=?', [email, w.user_id]); }
    await q('UPDATE wardens SET name=?,phone=?,email=?,shift=?,hostel_type=? WHERE id=?', [name, phone, email, shift, hostel_type, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/wardens/:id', async (req, res) => {
  try { const [w] = await q('SELECT user_id FROM wardens WHERE id=?', [req.params.id]); await q('DELETE FROM users WHERE id=?', [w.user_id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/wardens/:id/toggle-status', async (req, res) => {
  try { const [w] = await q('SELECT w.*, u.status AS user_status FROM wardens w JOIN users u ON u.id=w.user_id WHERE w.id=?', [req.params.id]);
    const newStatus = w.user_status ? 0 : 1;
    await q('UPDATE wardens SET status=? WHERE id=?', [newStatus, req.params.id]);
    await q('UPDATE users SET status=? WHERE id=?', [newStatus, w.user_id]);
    res.json({ message: 'Toggled' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Manage Staff
router.get('/staff', async (req, res) => {
  try { const data = await q('SELECT * FROM management_staff ORDER BY sort_order, id'); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/staff', async (req, res) => {
  try { const { name, designation, description, icon, sort_order } = req.body;
    await q('INSERT INTO management_staff (name,designation,description,icon,sort_order) VALUES (?,?,?,?,?)', [name, designation, description, icon, sort_order]);
    res.status(201).json({ message: 'Added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/staff/:id', async (req, res) => {
  try { const { name, designation, description, icon, sort_order } = req.body;
    await q('UPDATE management_staff SET name=?,designation=?,description=?,icon=?,sort_order=? WHERE id=?', [name, designation, description, icon, sort_order, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/staff/:id', async (req, res) => {
  try { await q('DELETE FROM management_staff WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Vacate Requests
router.get('/vacate-requests', async (req, res) => {
  try { const { page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const [count] = await q('SELECT COUNT(*) c FROM vacate_requests');
    const data = await q('SELECT vr.*, s.name AS student_name, s.roll_no FROM vacate_requests vr JOIN students s ON s.id=vr.student_id ORDER BY vr.applied_at DESC LIMIT ? OFFSET ?', [+limit, +offset]);
    res.json({ requests: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/vacate-requests/:id', async (req, res) => {
  try { const rows = await q('SELECT vr.*, s.name AS student_name, s.roll_no, s.email, s.phone, r.room_no, r.room_type FROM vacate_requests vr JOIN students s ON s.id=vr.student_id LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status=? LEFT JOIN rooms r ON r.id=ra.room_id WHERE vr.id=?', ['Active', req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' }); res.json(rows[0]); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/vacate-requests/:id', async (req, res) => {
  try { const { status, remark } = req.body;
    if (status === 'Approved') {
      const [vr] = await q('SELECT * FROM vacate_requests WHERE id=?', [req.params.id]);
      if (!vr) return res.status(404).json({ error: 'Request not found' });
      const [student] = await q('SELECT * FROM students WHERE id=?', [vr.student_id]);
      const [alloc] = await q('SELECT ra.*, r.room_no FROM room_allocations ra JOIN rooms r ON r.id=ra.room_id WHERE ra.student_id=? AND ra.status=?', [vr.student_id, 'Active']);
      const conn = await pool.getConnection();
      try { await conn.beginTransaction();
        const related = JSON.stringify({ fees: await conn.query('SELECT * FROM fees WHERE student_id=?', [vr.student_id]), complaints: await conn.query('SELECT * FROM complaints WHERE student_id=?', [vr.student_id]), leaves: await conn.query('SELECT * FROM leaves WHERE student_id=?', [vr.student_id]) });
        await conn.query('INSERT INTO vacated_students (original_id,original_user_id,name,roll_no,email,phone,address,gender,course,year,guardian_name,guardian_phone,admission_date,join_date,photo,last_room_no,vacate_reason,admin_remark,related_data) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [student.id, student.user_id, student.name, student.roll_no, student.email, student.phone, student.address, student.gender, student.course, student.year, student.guardian_name, student.guardian_phone, student.admission_date, student.join_date, student.photo, alloc.length ? alloc.room_no : null, vr.reason, remark, related]);
        if (alloc.length) { await conn.query("UPDATE room_allocations SET checkout_date=NOW(), status='CheckedOut' WHERE id=?", [alloc[0].id]); await conn.query('UPDATE rooms SET occupancy=occupancy-1 WHERE id=?', [alloc[0].room_id]); }
        await conn.query('DELETE FROM fees WHERE student_id=?', [vr.student_id]); await conn.query('DELETE FROM attendance WHERE student_id=?', [vr.student_id]); await conn.query('DELETE FROM complaints WHERE student_id=?', [vr.student_id]); await conn.query('DELETE FROM leaves WHERE student_id=?', [vr.student_id]); await conn.query('DELETE FROM room_change_requests WHERE student_id=?', [vr.student_id]); await conn.query('DELETE FROM students WHERE id=?', [vr.student_id]); await conn.query('DELETE FROM vacate_requests WHERE id=?', [req.params.id]); await conn.query('DELETE FROM users WHERE id=?', [student.user_id]);
        await conn.commit(); res.json({ message: 'Updated' });
      } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
      finally { conn.release(); }
    } else {
      await q('UPDATE vacate_requests SET status=?, admin_remark=? WHERE id=?', [status, remark, req.params.id]);
      res.json({ message: 'Updated' });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Room Changes
router.get('/room-changes', async (req, res) => {
  try { const { page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const [count] = await q('SELECT COUNT(*) c FROM room_change_requests');
    const data = await q('SELECT rcr.*, s.name AS student_name, s.roll_no, cur.room_no AS current_room, req.room_no AS requested_room FROM room_change_requests rcr JOIN students s ON s.id=rcr.student_id JOIN rooms cur ON cur.id=rcr.current_room_id JOIN rooms req ON req.id=rcr.requested_room_id ORDER BY rcr.applied_at DESC LIMIT ? OFFSET ?', [+limit, +offset]);
    res.json({ requests: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/room-changes/:id', async (req, res) => {
  try { const rows = await q('SELECT rcr.*, s.name AS student_name, s.roll_no, s.email, s.phone, cur.room_no AS current_room, req.room_no AS requested_room FROM room_change_requests rcr JOIN students s ON s.id=rcr.student_id JOIN rooms cur ON cur.id=rcr.current_room_id JOIN rooms req ON req.id=rcr.requested_room_id WHERE rcr.id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' }); res.json(rows[0]); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/room-changes/:id', async (req, res) => {
  try { const { status, remark } = req.body;
    if (status === 'Approved') {
      const [rcr] = await q('SELECT * FROM room_change_requests WHERE id=?', [req.params.id]);
      if (!rcr) return res.status(404).json({ error: 'Request not found' });
      const conn = await pool.getConnection();
      try { await conn.beginTransaction();
        await conn.query('UPDATE room_allocations SET room_id=?, allocation_date=CURDATE() WHERE student_id=? AND status=?', [rcr.requested_room_id, rcr.student_id, 'Active']);
        await conn.query('UPDATE rooms SET occupancy=occupancy-1 WHERE id=?', [rcr.current_room_id]);
        await conn.query('UPDATE rooms SET occupancy=occupancy+1 WHERE id=?', [rcr.requested_room_id]);
        await conn.query("UPDATE rooms SET status='Available' WHERE id=? AND capacity>occupancy", [rcr.current_room_id]);
        await conn.query("UPDATE rooms SET status='Full' WHERE id=? AND capacity<=occupancy", [rcr.requested_room_id]);
        await conn.query('UPDATE room_change_requests SET status=?, admin_remark=? WHERE id=?', ['Approved', remark, req.params.id]);
        await conn.commit(); res.json({ message: 'Updated' });
      } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
      finally { conn.release(); }
    } else {
      await q('UPDATE room_change_requests SET status=?, admin_remark=? WHERE id=?', [status, remark, req.params.id]);
      res.json({ message: 'Updated' });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Maintenance
router.get('/maintenance', async (req, res) => {
  try { const { status, page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    let where = '', params = [];
    if (status) { where = 'WHERE mr.status=?'; params.push(status); }
    const [count] = await q(`SELECT COUNT(*) c FROM maintenance_requests mr ${where}`, params);
    const data = await q(`SELECT mr.*, s.name AS student_name, s.roll_no, r.room_no, a.username AS assigned_name FROM maintenance_requests mr LEFT JOIN students s ON s.id=mr.student_id LEFT JOIN rooms r ON r.id=mr.room_id LEFT JOIN users a ON a.id=mr.assigned_to ${where} ORDER BY FIELD(mr.priority,'Emergency','High','Medium','Low'), mr.created_at DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    const assignable = await q("SELECT id, username, role FROM users WHERE role IN ('admin','warden') AND status=1 ORDER BY username");
    res.json({ requests: data, total: count.c, assignable, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/maintenance/:id/status', async (req, res) => {
  try { const { status, assigned_to, completion_remarks } = req.body;
    const updates = { status };
    if (assigned_to) { updates.assigned_to = assigned_to; updates.assigned_date = new Date(); }
    if (completion_remarks) { updates.completed_date = new Date(); updates.completion_remarks = completion_remarks; }
    await q('UPDATE maintenance_requests SET ? WHERE id=?', [updates, req.params.id]); res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Maintenance History
router.get('/maintenance-history', async (req, res) => {
  try { const { page = 1, limit = 20, room_id } = req.query;
    let data, [count] = await q('SELECT COUNT(*) c FROM room_maintenance_history');
    if (room_id) { data = await q('SELECT * FROM room_maintenance_history WHERE room_id=? ORDER BY repair_date DESC, id DESC LIMIT ? OFFSET ?', [+room_id, +limit, +((+page - 1) * +limit)]); } else {
      data = await q('SELECT r.*, (SELECT COUNT(*) FROM room_maintenance_history WHERE room_id=r.id) AS repair_count, (SELECT MAX(repair_date) FROM room_maintenance_history WHERE room_id=r.id) AS last_repair FROM rooms r ORDER BY r.room_no LIMIT ? OFFSET ?', [+limit, +((+page - 1) * +limit)]); }
    res.json({ records: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/maintenance-history', async (req, res) => {
  try { const { room_id, problem, solution, category, completed_by, remarks, cost, repair_date } = req.body;
    await q('INSERT INTO room_maintenance_history (room_id,problem,solution,category,completed_by,remarks,cost,repair_date,created_by) VALUES (?,?,?,?,?,?,?,?,?)', [room_id, problem, solution, category, completed_by, remarks, cost, repair_date, req.user.id]);
    res.status(201).json({ message: 'Added' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/maintenance-history/:id', async (req, res) => {
  try { const { problem, solution, category, completed_by, remarks, cost, repair_date } = req.body;
    await q('UPDATE room_maintenance_history SET problem=?,solution=?,category=?,completed_by=?,remarks=?,cost=?,repair_date=? WHERE id=?', [problem, solution, category, completed_by, remarks, cost, repair_date, req.params.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/maintenance-history/:id', async (req, res) => {
  try { await q('DELETE FROM room_maintenance_history WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Vacated students
router.get('/vacated-students', async (req, res) => {
  try { const { search, page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    let where = '', params = [];
    if (search) { where = 'WHERE name LIKE ? OR roll_no LIKE ? OR course LIKE ? OR last_room_no LIKE ?'; params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`); }
    const [count] = await q(`SELECT COUNT(*) c FROM vacated_students ${where}`, params);
    const data = await q(`SELECT * FROM vacated_students ${where} ORDER BY vacated_at DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    res.json({ students: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Profile
router.get('/profile', async (req, res) => {
  try { const rows = await q('SELECT * FROM users WHERE id=?', [req.user.id]); res.json(rows[0]); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/profile', async (req, res) => {
  try { const { username, email } = req.body; await q('UPDATE users SET username=?, email=? WHERE id=?', [username, email, req.user.id]); res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Notifications
router.get('/notifications', async (req, res) => {
  try { const { type, page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    let where = 'WHERE user_id=?', params = [req.user.id];
    if (type === 'read') { where += ' AND is_read=1'; } else if (type === 'unread') { where += ' AND is_read=0'; }
    const [count] = await q(`SELECT COUNT(*) c FROM notifications ${where}`, params);
    const data = await q(`SELECT * FROM notifications ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, +limit, +offset]);
    res.json({ notifications: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/notifications/read/:id', async (req, res) => {
  try { await q('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?', [req.params.id, req.user.id]); res.json({ message: 'Read' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/notifications/read-all', async (req, res) => {
  try { await q('UPDATE notifications SET is_read=1 WHERE user_id=? AND is_read=0', [req.user.id]); res.json({ message: 'All read' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Digital ID
router.get('/digital-ids', async (req, res) => {
  try { const { search, page = 1, limit = 20 } = req.query; const offset = (page - 1) * limit;
    const [count] = await q("SELECT COUNT(*) c FROM students WHERE status='Active'");
    const data = await q(`SELECT s.*, r.room_no, d.id_number FROM students s LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status='Active' LEFT JOIN rooms r ON r.id=ra.room_id LEFT JOIN student_digital_ids d ON d.student_id=s.id WHERE s.status='Active' AND (s.name LIKE ? OR s.roll_no LIKE ?) ORDER BY s.name ASC LIMIT ? OFFSET ?`, [`%${search || ''}%`, `%${search || ''}%`, +limit, +offset]);
    res.json({ students: data, total: count.c, page: +page }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/digital-ids/:studentId', async (req, res) => {
  try { const rows = await q('SELECT s.*, r.room_no, r.room_type, ra.bed_no FROM students s LEFT JOIN room_allocations ra ON ra.student_id=s.id AND ra.status=? LEFT JOIN rooms r ON r.id=ra.room_id WHERE s.id=?', ['Active', req.params.studentId]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    let [did] = await q('SELECT * FROM student_digital_ids WHERE student_id=?', [req.params.studentId]);
    if (!did.length) { const idNum = `HSTL${String(req.params.studentId).padStart(5, '0')}`; await q('INSERT INTO student_digital_ids (student_id,id_number) VALUES (?,?)', [req.params.studentId, idNum]); [did] = await q('SELECT * FROM student_digital_ids WHERE student_id=?', [req.params.studentId]); }
    const qrData = `${rows[0].name}|${rows[0].roll_no}|${rows[0].room_no}`;
    res.json({ student: rows[0], digitalId: did[0], qrData }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/digital-ids/:studentId', async (req, res) => {
  try { const { blood_group, emergency_contact, emergency_name } = req.body;
    await q('UPDATE student_digital_ids SET blood_group=?, emergency_contact=?, emergency_name=? WHERE student_id=?', [blood_group, emergency_contact, emergency_name, req.params.studentId]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Backup
router.get('/backups', async (req, res) => {
  try { const data = await q('SELECT h.*, u.username FROM backup_history h LEFT JOIN users u ON u.id=h.created_by ORDER BY h.created_at DESC'); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/backups/create', async (req, res) => {
  try {
    const fs = require('fs'); const path = require('path');
    const [tables] = await q('SHOW TABLES');
    let sql = `-- Backup created ${new Date().toISOString()}\n\n`;
    for (const t of tables) { const tn = Object.values(t)[0]; const [create] = await q(`SHOW CREATE TABLE \`${tn}\``); sql += `${create[0]['Create Table']};\n\n`; const [rows] = await q(`SELECT * FROM \`${tn}\``); for (const row of rows) { const cols = Object.keys(row).map(c => `\`${c}\``).join(','); const vals = Object.values(row).map(v => v === null ? 'NULL' : `'${String(v).replace(/'/g, "\\'")}'`).join(','); sql += `INSERT INTO \`${tn}\` (${cols}) VALUES (${vals});\n`; } sql += '\n'; }
    const filename = `backup_${Date.now()}.sql`; const filepath = path.join(__dirname, '..', '..', 'backups', filename);
    if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, sql);
    await q('INSERT INTO backup_history (filename,filepath,filesize,type,created_by) VALUES (?,?,?,?,?)', [filename, filepath, Buffer.byteLength(sql), 'manual', req.user.id]);
    res.json({ message: 'Backup created', filename }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Analytics
router.get('/analytics', async (req, res) => {
  try {
    const [activeStudents] = await q("SELECT COUNT(*) c FROM students WHERE status='Active'");
    const [totalCapacity] = await q('SELECT COALESCE(SUM(capacity),0) c FROM rooms');
    const [totalOccupancy] = await q('SELECT COALESCE(SUM(occupancy),0) c FROM rooms');
    const [totalFees] = await q("SELECT COALESCE(SUM(paid_amount),0) c FROM fees WHERE status='Paid'");
    // Attendance trend 30 days
    const attTrend = []; for (let i = 29; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const ds = d.toISOString().split('T')[0]; const [p] = await q("SELECT COUNT(*) c FROM attendance WHERE date=? AND status='Present'", [ds]); const [a] = await q("SELECT COUNT(*) c FROM attendance WHERE date=? AND status='Absent'", [ds]); attTrend.push({ date: ds, present: p.c, absent: a.c }); }
    // Fee collection 12 months
    const feeTrend = []; for (let i = 11; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; const [f] = await q("SELECT COALESCE(SUM(paid_amount),0) c FROM fees WHERE DATE_FORMAT(payment_date,'%Y-%m')=? AND status='Paid'", [ym]); feeTrend.push({ month: ym, amount: f.c }); }
    const roomTypes = await q('SELECT room_type, COUNT(*) c FROM rooms GROUP BY room_type ORDER BY c DESC');
    res.json({ stats: { activeStudents: activeStudents.c, totalCapacity: totalCapacity.c, totalOccupancy: totalOccupancy.c, totalFees: totalFees.c }, attTrend, feeTrend, roomTypes }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Reports
router.get('/reports/:type', async (req, res) => {
  try {
    const { type } = req.params; const { status, date_from, date_to } = req.query;
    let data; let where = '1=1'; const params = [];
    if (date_from) { where += ' AND f.payment_date >= ?'; params.push(date_from); } if (date_to) { where += ' AND f.payment_date <= ?'; params.push(date_to); }
    switch (type) {
      case 'students': data = await q('SELECT * FROM students ORDER BY name'); break;
      case 'rooms': data = await q('SELECT *, (capacity-occupancy) AS available FROM rooms ORDER BY room_no'); break;
      case 'fees': data = await q(`SELECT f.*, s.name AS sname, s.roll_no FROM fees f JOIN students s ON s.id=f.student_id WHERE ${where} ORDER BY f.payment_date DESC`, params); break;
      case 'attendance': data = await q('SELECT a.*, s.name AS sname, s.roll_no FROM attendance a JOIN students s ON s.id=a.student_id ORDER BY a.date DESC, s.name'); break;
      case 'complaints': data = await q('SELECT c.*, s.name AS sname, s.roll_no FROM complaints c JOIN students s ON s.id=c.student_id ORDER BY c.id DESC'); break;
      default: return res.status(400).json({ error: 'Invalid type' });
    }
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Occupancy
router.get('/occupancy', async (req, res) => {
  try { const data = await q('SELECT *, (capacity-occupancy) AS free_beds FROM rooms ORDER BY floor, room_no'); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Search
router.get('/search', async (req, res) => {
  try { const qs = req.query.q || '';
    const students = await q("SELECT id, name, roll_no, email, phone, course, status, photo FROM students WHERE name LIKE ? OR roll_no LIKE ? OR email LIKE ? OR phone LIKE ? LIMIT 5", [`%${qs}%`, `%${qs}%`, `%${qs}%`, `%${qs}%`]);
    const rooms = await q("SELECT id, room_no, floor, room_type, capacity, occupancy, fee_per_month, status FROM rooms WHERE room_no LIKE ? LIMIT 5", [`%${qs}%`]);
    const complaints = await q("SELECT c.id, c.title, c.description, c.status, c.priority, c.created_at, s.name AS student_name FROM complaints c JOIN students s ON s.id=c.student_id WHERE c.title LIKE ? OR c.description LIKE ? LIMIT 5", [`%${qs}%`, `%${qs}%`]);
    res.json({ students, rooms, complaints }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Occupancy (room view)
router.get('/room-occupancy', async (req, res) => {
  try { const data = await q('SELECT *, (capacity-occupancy) AS free_beds FROM rooms ORDER BY floor, room_no'); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Student Timeline
router.get('/student-timeline/:studentId', async (req, res) => {
  try { const sid = req.params.studentId;
    const events = [];
    // Admission
    const [st] = await q('SELECT admission_date, name FROM students WHERE id=?', [sid]);
    if (st.length) { events.push({ type: 'admission', date: st[0].admission_date, title: 'Admission', description: `Student ${st[0].name} was admitted`, status: 'Active', month: new Date(st[0].admission_date).toLocaleString('en', { month: 'long', year: 'numeric' }) }); }
    // Room allocations
    const ra = await q('SELECT allocation_date, checkout_date, room_id, r.room_no FROM room_allocations ra JOIN rooms r ON r.id=ra.room_id WHERE ra.student_id=? ORDER BY allocation_date', [sid]);
    ra.forEach(a => { events.push({ type: 'room_allocation', date: a.allocation_date, title: 'Room Allocated', description: `Room ${a.room_no}`, status: 'Active', month: new Date(a.allocation_date).toLocaleString('en', { month: 'long', year: 'numeric' }) }); if (a.checkout_date) { events.push({ type: 'room_change', date: a.checkout_date, title: 'Room Vacated', description: `Left Room ${a.room_no}`, month: new Date(a.checkout_date).toLocaleString('en', { month: 'long', year: 'numeric' }) }); } });
    // Attendance
    const att = await q("SELECT date, status FROM attendance WHERE student_id=? ORDER BY date DESC LIMIT 100", [sid]);
    att.forEach(a => { events.push({ type: 'attendance', date: a.date, title: `Attendance: ${a.status}`, description: `Marked ${a.status}`, status: a.status, month: new Date(a.date).toLocaleString('en', { month: 'long', year: 'numeric' }) }); });
    // Leaves
    const lv = await q('SELECT applied_at, from_date, to_date, status, reason FROM leaves WHERE student_id=? ORDER BY applied_at', [sid]);
    lv.forEach(l => { events.push({ type: 'leave', date: l.applied_at, title: 'Leave Application', description: `${l.reason} (${l.from_date} to ${l.to_date})`, status: l.status, month: new Date(l.applied_at).toLocaleString('en', { month: 'long', year: 'numeric' }) }); });
    // Complaints
    const comp = await q('SELECT created_at, title, description, status, priority FROM complaints WHERE student_id=? ORDER BY created_at', [sid]);
    comp.forEach(c => { events.push({ type: 'complaint', date: c.created_at, title: `Complaint: ${c.title}`, description: c.description, status: c.status, month: new Date(c.created_at).toLocaleString('en', { month: 'long', year: 'numeric' }) }); });
    // Visitors
    const vis = await q('SELECT v.check_in AS entry_time, v.visitor_name AS vname, v.purpose FROM visitor_logs v WHERE v.student_id=? ORDER BY v.check_in', [sid]);
    vis.forEach(v => { events.push({ type: 'visitor', date: v.entry_time, title: `Visitor: ${v.vname}`, description: v.purpose, month: new Date(v.entry_time).toLocaleString('en', { month: 'long', year: 'numeric' }) }); });
    // Fees
    const fee = await q("SELECT payment_date, paid_amount, total_fee, status FROM fees WHERE student_id=? ORDER BY payment_date", [sid]);
    fee.forEach(f => { events.push({ type: 'fee', date: f.payment_date, title: `Fee Payment: ₹${f.paid_amount}`, description: `Total: ₹${f.total_fee}`, status: f.status, month: new Date(f.payment_date).toLocaleString('en', { month: 'long', year: 'numeric' }) }); });
    // Maintenance
    const mnt = await q('SELECT created_at, description, priority, status FROM maintenance_requests WHERE student_id=? ORDER BY created_at', [sid]);
    mnt.forEach(m => { events.push({ type: 'maintenance', date: m.created_at, title: 'Maintenance Request', description: `${m.description.substring(0, 100)}`, status: m.status, month: new Date(m.created_at).toLocaleString('en', { month: 'long', year: 'numeric' }) }); });
    // Vacate
    const vc = await q('SELECT applied_at, reason, status FROM vacate_requests WHERE student_id=? ORDER BY applied_at', [sid]);
    vc.forEach(v => { events.push({ type: 'vacate', date: v.applied_at, title: 'Vacate Request', description: v.reason, status: v.status, month: new Date(v.applied_at).toLocaleString('en', { month: 'long', year: 'numeric' }) }); });
    // Room changes
    const rc = await q('SELECT rcr.applied_at, cur.room_no AS cur_room, req.room_no AS req_room, rcr.status FROM room_change_requests rcr JOIN rooms cur ON cur.id=rcr.current_room_id JOIN rooms req ON req.id=rcr.requested_room_id WHERE rcr.student_id=? ORDER BY rcr.applied_at', [sid]);
    rc.forEach(r => { events.push({ type: 'room_change', date: r.applied_at, title: 'Room Change Request', description: `From ${r.cur_room} to ${r.req_room}`, status: r.status, month: new Date(r.applied_at).toLocaleString('en', { month: 'long', year: 'numeric' }) }); });
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(events);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;

