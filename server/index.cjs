require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const initDB = require('./init-db.cjs');
const authRoutes = require('./routes/auth.cjs');
const publicRoutes = require('./routes/public.cjs');
const adminRoutes = require('./routes/admin.cjs');
const studentRoutes = require('./routes/student.cjs');
const wardenRoutes = require('./routes/warden.cjs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/warden', wardenRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
initDB().then(() => {
  console.log('DB initialized');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(e => {
  console.error('DB init error:', e.message);
  process.exit(1);
});
