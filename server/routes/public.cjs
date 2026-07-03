const express = require('express');
const pool = require('../db.cjs');
const router = express.Router();

const q = async (sql, params = []) => { const [r] = await pool.query(sql, params); return r; };

router.get('/stats', async (req, res) => {
  try { const rooms = await q('SELECT COUNT(*) c FROM rooms'); const students = await q("SELECT COUNT(*) c FROM students WHERE status='Active'");
    res.json({ rooms: rooms[0].c, students: students[0].c }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/rooms', async (req, res) => {
  try { const rooms = await q('SELECT * FROM rooms ORDER BY id DESC LIMIT 4'); res.json(rooms); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/gallery', async (req, res) => {
  try { const items = await q('SELECT * FROM gallery WHERE status=1 ORDER BY id DESC LIMIT 6'); res.json(items); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/events', async (req, res) => {
  try { const events = await q("SELECT * FROM hostel_events WHERE status=1 AND event_date >= CURDATE() ORDER BY event_date ASC LIMIT 3"); res.json(events); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/notices', async (req, res) => {
  try { const notices = await q("SELECT * FROM notices WHERE status=1 AND (expiry_date IS NULL OR expiry_date >= CURDATE()) ORDER BY publish_date DESC LIMIT 3"); res.json(notices); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/staff', async (req, res) => {
  try { const staff = await q('SELECT * FROM management_staff ORDER BY sort_order, id'); res.json(staff); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/testimonials', async (req, res) => {
  try { const t = await q('SELECT * FROM testimonials WHERE status=1 ORDER BY id DESC LIMIT 3'); res.json(t); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/faqs', async (req, res) => {
  try { const f = await q('SELECT * FROM faq WHERE status=1 ORDER BY sort_order, id LIMIT 6'); res.json(f); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/contact', async (req, res) => {
  try { const { name, email, phone, subject, message } = req.body;
    await q('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?,?,?,?,?)', [name, email, phone, subject, message]);
    res.json({ message: 'Message sent' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/mess-menu', async (req, res) => {
  try { const menu = await q('SELECT * FROM mess_menu WHERE status=1 ORDER BY FIELD(day,"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"), meal_type');
    res.json(menu); } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
