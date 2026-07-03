const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('../server/routes/auth.cjs');
const publicRoutes = require('../server/routes/public.cjs');
const adminRoutes = require('../server/routes/admin.cjs');
const studentRoutes = require('../server/routes/student.cjs');
const wardenRoutes = require('../server/routes/warden.cjs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/warden', wardenRoutes);

module.exports = app;
