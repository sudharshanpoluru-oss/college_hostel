<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
  <br/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</div>

<h1 align="center">🏠 Hostel Management System</h1>

<p align="center">
  A full-stack hostel management platform with three user roles — <strong>Admin</strong>, <strong>Warden</strong>, and <strong>Student</strong> — built with React, Express, and PostgreSQL (Supabase).
</p>

---

## ✨ Features

### 👑 Admin
Full system control: manage students, rooms, allocations, fees, attendance, complaints, leaves, notices, events, mess menu, maintenance, visitors, emergency reports, wardens, staff, room changes, vacate requests, digital IDs, analytics, reports, backup, and more.

### 🛡️ Warden
Hostel-level operations: attendance, night roll call, room inspections, student management, complaints, leaves, maintenance, visitors, emergency, notices, daily reports, medical records, discipline records.

### 🎓 Student
Self-service portal: view room, attendance, fees (with UPI payment), submit complaints/leaves/maintenance requests, view notices/events, request room changes, emergency reporting, vacate requests, mess menu.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7, Bootstrap 5, Axios |
| **Backend** | Express 5, pg, JWT, bcryptjs, Multer |
| **Database** | PostgreSQL (Supabase) |
| **Deploy** | Vercel (frontend) + Railway (backend) |

---

## 📦 Installation

```bash
git clone https://github.com/sudharshanpoluru-oss/college_hostel.git
cd college_hostel
npm install
```

### Database Setup (Supabase)

1. Create the tables. Open the **SQL Editor** in your Supabase dashboard
   (`https://supabase.com/dashboard/project/kmyewmtcqlbxgfymnahi/sql`), paste the
   entire contents of `schema.pg.sql`, and click **Run**.
   (Alternative: `npm run db:init`, which does the same thing via your
   `DATABASE_URL`.) The default admin user `admin / admin123` is created
   automatically the first time the server starts.

2. Set your Supabase connection string in `.env`:
   ```
   DATABASE_URL=postgresql://postgres.kmyewmtcqbxgfymnahi:YOUR_DB_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
   SUPABASE_URL=https://kmyewmcqxgfymnahi.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
   Find it under **Project Settings → Database → Connection strings**.

### Run Locally

```bash
# Start backend (Express on :5000)
npm run server

# Start frontend (Vite dev server)
npm run dev
```

---

## 📁 Project Structure

```
college_hostel/
├── api/              # Vercel serverless entry
├── server/           # Express backend
│   ├── routes/       # auth, admin, student, warden, public
│   ├── middleware/    # JWT auth
│   └── db.cjs        # PostgreSQL (pg) pool
├── src/              # React frontend
│   ├── pages/        # auth, admin, student, warden, public
│   ├── components/   # Layouts, Navbars, Sidebars
│   ├── context/      # AuthContext
│   └── api/          # Axios client
├── schema.pg.sql     # 26 database tables (Postgres, for Supabase SQL editor)
└── vercel.json       # Vercel deployment config
```

---

## 🌐 Deployment

- **Frontend** → Vercel (auto-deploys from `main` branch)
- **Backend** → Railway (Express server + Supabase as the database)
- API calls from Vercel are proxied to the Railway backend via rewrites in `vercel.json`

---

<div align="center">
  <sub>Built with ❤️ using React, Express & PostgreSQL (Supabase)</sub>
</div>
