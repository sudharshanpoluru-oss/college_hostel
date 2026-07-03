const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db.cjs');
const crypto = require('crypto');
const { JWT_SECRET, authenticate } = require('../middleware/auth.cjs');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try { const { username, password } = req.body;
    const [users] = await pool.query('SELECT u.* FROM users u LEFT JOIN students s ON s.user_id = u.id WHERE u.username = ? OR u.email = ? OR s.roll_no = ?', [username, username, username]);
    if (!users.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = users[0];
    if (!user.status) return res.status(403).json({ error: 'Account disabled' });
    if (!user.approved) return res.status(403).json({ error: 'Account not approved' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password, name, roll_no, phone, gender, course, year, address } = req.body;
  if (!username || !email || !password || !name || !roll_no) return res.status(400).json({ error: 'Required fields missing' });
  const hash = await bcrypt.hash(password, 10);
  const conn = await pool.getConnection();
  try { await conn.beginTransaction();
    const [u] = await conn.query('INSERT INTO users (username, email, password, role, approved) VALUES (?,?,?,?,0)', [username, email, hash, 'student']);
    await conn.query('INSERT INTO students (user_id, name, roll_no, email, phone, gender, course, year, address) VALUES (?,?,?,?,?,?,?,?,?)',
      [u.insertId, name, roll_no, email, phone, gender || 'Male', course, year, address]);
    await conn.commit(); res.status(201).json({ message: 'Registration successful' });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try { const [users] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [req.user.id]);
    if (!users.length) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req, res) => {
  try { const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (!await bcrypt.compare(req.body.current_password, users[0].password)) return res.status(400).json({ error: 'Current password incorrect' });
    const hash = await bcrypt.hash(req.body.new_password, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Password changed' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try { const { email } = req.body;
    const [users] = await pool.query('SELECT id, username, role FROM users WHERE email=?', [email]);
    if (!users.length) return res.json({ message: 'If the email exists, a reset link has been sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour
    await pool.query('DELETE FROM password_resets WHERE user_id=?', [users[0].id]);
    await pool.query('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?,?,?)', [users[0].id, token, expires]);
    // In production, send email. For now just return token
    res.json({ message: 'Reset link sent. Check your email.', resetToken: token });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try { const { token, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM password_resets WHERE token=? AND expires_at > NOW() AND used=0', [token]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid or expired token' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password=? WHERE id=?', [hash, rows[0].user_id]);
    await pool.query('UPDATE password_resets SET used=1 WHERE id=?', [rows[0].id]);
    res.json({ message: 'Password reset successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
