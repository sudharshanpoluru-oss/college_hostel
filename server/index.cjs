const express = require('express');
const cors = require('cors');
const path = require('path');
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
