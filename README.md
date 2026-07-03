<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
  <br/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway" />
</div>

<h1 align="center">🏠 Hostel Management System</h1>

<p align="center">
  A full-stack hostel management platform with three user roles — <strong>Admin</strong>, <strong>Warden</strong>, and <strong>Student</strong> — built with React, Express, and MySQL.
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
| **Backend** | Express 5, MySQL2, JWT, bcryptjs, Multer |
| **Database** | MySQL 9 |
| **Deploy** | Vercel (frontend) + Railway (backend & DB) |

---

## 📦 Installation

```bash
git clone https://github.com/sudharshanpoluru-oss/college_hostel.git
cd college_hostel
npm install
```

### Database Setup

1. Set your MySQL connection string in `.env`:
   ```
   MYSQL_PUBLIC_URL=mysql://user:password@host:port/database
   ```
2. Initialize tables:
   ```bash
   npm run db:init
   ```

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
│   └── db.cjs        # MySQL pool
├── src/              # React frontend
│   ├── pages/        # auth, admin, student, warden, public
│   ├── components/   # Layouts, Navbars, Sidebars
│   ├── context/      # AuthContext
│   └── api/          # Axios client
├── schema.sql        # 26 database tables
└── vercel.json       # Vercel deployment config
```

---

## 🌐 Deployment

- **Frontend** → Vercel (auto-deploys from `main` branch)
- **Backend** → Railway (Express server + MySQL)
- API calls from Vercel are proxied to the Railway backend via rewrites in `vercel.json`

---

<div align="center">
  <sub>Built with ❤️ using React, Express & MySQL</sub>
</div>
