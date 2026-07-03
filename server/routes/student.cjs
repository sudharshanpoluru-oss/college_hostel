const express = require('express');
const pool = require('../db.cjs');
const { authenticate, authorize } = require('../middleware/auth.cjs');
const router = express.Router();

router.use(authenticate, authorize('student'));
const q = async (sql, params = []) => { const [r] = await pool.query(sql, params); return r; };

// Get student profile from user_id
async function getStudent(userId) {
  const rows = await q('SELECT * FROM students WHERE user_id=?', [userId]);
  return rows.length ? rows[0] : null;
}

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const student = await getStudent(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const [alloc] = await q('SELECT ra.*, r.room_no, r.room_type, r.fee_per_month FROM room_allocations ra JOIN rooms r ON r.id=ra.room_id WHERE ra.student_id=? AND ra.status=?', [student.id, 'Active']);
    const [fee] = await q('SELECT COALESCE(SUM(paid_amount),0) AS paid, COALESCE(SUM(total_fee),0) AS total FROM fees WHERE student_id=?', [student.id]);
    const [att] = await q("SELECT COUNT(*) c FROM attendance WHERE student_id=? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND status='Present'", [student.id]);
    const [totalAtt] = await q('SELECT COUNT(*) c FROM attendance WHERE student_id=? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)', [student.id]);
    const [pendingComplaints] = await q("SELECT COUNT(*) c FROM complaints WHERE student_id=? AND status NOT IN ('Resolved','Closed','Rejected')", [student.id]);
    const [pendingLeaves] = await q("SELECT COUNT(*) c FROM leaves WHERE student_id=? AND status='Pending'", [student.id]);
    const [unreadNotifs] = await q('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND is_read=0', [req.user.id]);
    res.json({ student, allocation: alloc || null, fees: fee, attendance: { present: att.c, total: totalAtt.c }, pendingComplaints: pendingComplaints.c, pendingLeaves: pendingLeaves.c, unreadNotifications: unreadNotifs.c });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Profile
router.get('/profile', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const [alloc] = await q('SELECT ra.*, r.room_no, r.room_type, r.fee_per_month FROM room_allocations ra JOIN rooms r ON r.id=ra.room_id WHERE ra.student_id=? AND ra.status=?', [student.id, 'Active']);
    res.json({ student, allocation: alloc || null }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/profile', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { phone, address, guardian_name, guardian_phone, course, year } = req.body;
    await q('UPDATE students SET phone=?,address=?,guardian_name=?,guardian_phone=?,course=?,year=? WHERE id=?', [phone, address, guardian_name, guardian_phone, course, year, student.id]);
    res.json({ message: 'Updated' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Attendance
router.get('/attendance', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { month, year } = req.query;
    let where = 'WHERE student_id=?', params = [student.id];
    if (month && year) { where += ' AND MONTH(date)=? AND YEAR(date)=?'; params.push(month, year); }
    const data = await q(`SELECT * FROM attendance ${where} ORDER BY date DESC`, params);
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Fees
router.get('/fees', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const data = await q('SELECT * FROM fees WHERE student_id=? ORDER BY id DESC', [student.id]);
    const [summary] = await q('SELECT COALESCE(SUM(total_fee),0) AS total, COALESCE(SUM(paid_amount),0) AS paid, COALESCE(SUM(total_fee-paid_amount),0) AS due FROM fees WHERE student_id=?', [student.id]);
    res.json({ fees: data, summary }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Complaints
router.get('/complaints', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const data = await q('SELECT * FROM complaints WHERE student_id=? ORDER BY id DESC', [student.id]);
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/complaints', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { title, category, description } = req.body;
    await q('INSERT INTO complaints (student_id,title,category,description,status) VALUES (?,?,?,?,?)', [student.id, title, category, description, 'Pending']);
    res.status(201).json({ message: 'Complaint submitted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Leaves
router.get('/leaves', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const data = await q('SELECT * FROM leaves WHERE student_id=? ORDER BY id DESC', [student.id]);
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/leaves', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { from_date, to_date, reason } = req.body;
    await q('INSERT INTO leaves (student_id,from_date,to_date,reason) VALUES (?,?,?,?)', [student.id, from_date, to_date, reason]);
    res.status(201).json({ message: 'Leave applied' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Maintenance
router.get('/maintenance', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const data = await q('SELECT * FROM maintenance_requests WHERE student_id=? ORDER BY id DESC', [student.id]);
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/maintenance', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { category, description, priority } = req.body;
    const [alloc] = await q("SELECT room_id FROM room_allocations WHERE student_id=? AND status='Active'", [student.id]);
    await q('INSERT INTO maintenance_requests (student_id,room_id,category,description,priority) VALUES (?,?,?,?,?)', [student.id, alloc?.room_id || null, category, description, priority || 'Medium']);
    res.status(201).json({ message: 'Request submitted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Room
router.get('/my-room', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const [alloc] = await q('SELECT ra.*, r.room_no, r.room_type, r.floor, r.fee_per_month, r.description FROM room_allocations ra JOIN rooms r ON r.id=ra.room_id WHERE ra.student_id=? AND ra.status=?', [student.id, 'Active']);
    const mates = alloc ? await q('SELECT s.name, s.roll_no, s.course, s.phone, ra.bed_no FROM room_allocations ra JOIN students s ON s.id=ra.student_id WHERE ra.room_id=? AND ra.status=? AND s.id!=?', [alloc.room_id, 'Active', student.id]) : [];
    res.json({ allocation: alloc || null, roommates: mates }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Room Change Request
router.get('/room-change', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const requests = await q('SELECT * FROM room_change_requests WHERE student_id=? ORDER BY id DESC', [student.id]);
    const rooms = await q("SELECT * FROM rooms WHERE status!='Full' AND hostel_type=? ORDER BY room_no", [student.hostel_type]);
    const roomIds = rooms.map(r => r.id);
    let occupants = [];
    if (roomIds.length) {
      occupants = await q(`SELECT ra.room_id, s.name, s.roll_no, s.course, ra.bed_no FROM room_allocations ra JOIN students s ON s.id=ra.student_id WHERE ra.room_id IN (${roomIds.map(() => '?').join(',')}) AND ra.status='Active' ORDER BY s.name`, roomIds);
    }
    const roomsWithOccupants = rooms.map(r => ({ ...r, occupants: occupants.filter(o => o.room_id === r.id) }));
    res.json({ requests, rooms: roomsWithOccupants }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/room-change', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { requested_room_id, reason } = req.body;
    const [alloc] = await q("SELECT id, room_id FROM room_allocations WHERE student_id=? AND status='Active'", [student.id]);
    if (!alloc) return res.status(400).json({ error: 'No active allocation' });
    await q('INSERT INTO room_change_requests (student_id,current_room_id,requested_room_id,reason) VALUES (?,?,?,?)', [student.id, alloc.room_id, requested_room_id, reason]);
    res.status(201).json({ message: 'Request submitted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Mess
router.get('/mess', async (req, res) => {
  try { const data = await q("SELECT * FROM mess_menu WHERE status=1 ORDER BY FIELD(day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'), FIELD(meal_type,'Breakfast','Lunch','Evening Snacks','Dinner')");
    res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Notices
router.get('/notices', async (req, res) => {
  try { const data = await q("SELECT * FROM notices WHERE status=1 AND (expiry_date IS NULL OR expiry_date >= CURDATE()) ORDER BY publish_date DESC"); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Events
router.get('/events', async (req, res) => {
  try { const data = await q("SELECT * FROM hostel_events WHERE status=1 AND event_date >= CURDATE() ORDER BY event_date ASC"); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Notifications
router.get('/notifications', async (req, res) => {
  try { const data = await q('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 20', [req.user.id]); res.json(data); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/notifications/read/:id', async (req, res) => {
  try { await q('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?', [req.params.id, req.user.id]); res.json({ message: 'Read' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Emergency
router.post('/emergency', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { category, location, description } = req.body;
    await q('INSERT INTO emergency_reports (student_id,category,location,description,status,priority) VALUES (?,?,?,?,?,?)', [student.id, category, location, description, 'Open', 'High']);
    res.status(201).json({ message: 'Emergency reported' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Vacate
router.post('/vacate', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { reason } = req.body;
    await q('INSERT INTO vacate_requests (student_id,reason) VALUES (?,?)', [student.id, reason]);
    res.status(201).json({ message: 'Request submitted' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// Pay (initiate payment)
router.post('/pay', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { amount } = req.body;
    // ponytail: returns payment stub; integrate PhonePe/Razorpay when live
    res.json({ message: 'Payment initiated', amount, student_id: student.id }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// UPI Pay (confirm UPI payment)
router.post('/pay/upi', async (req, res) => {
  try { const student = await getStudent(req.user.id);
    const { fee_id, utr } = req.body;
    const rows = await q('SELECT * FROM fees WHERE id=? AND student_id=?', [fee_id, student.id]);
    if (!rows.length) return res.status(404).json({ error: 'Fee record not found' });
    const fee = rows[0];
    if (fee.status === 'Paid') return res.status(400).json({ error: 'Already paid' });
    const amount = Number(fee.total_fee) - Number(fee.paid_amount);
    await q('UPDATE fees SET paid_amount=paid_amount+?, utr=?, payment_date=NOW(), status=? WHERE id=?', [amount, utr, 'Paid', fee_id]);
    res.json({ message: 'Payment confirmed' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
