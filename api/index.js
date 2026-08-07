import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from '../server/routes/auth.cjs';
import publicRoutes from '../server/routes/public.cjs';
import adminRoutes from '../server/routes/admin.cjs';
import studentRoutes from '../server/routes/student.cjs';
import wardenRoutes from '../server/routes/warden.cjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/warden', wardenRoutes);

export default app;
