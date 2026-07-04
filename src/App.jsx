import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';
import WardenLayout from './components/WardenLayout';

// Public pages
import Home from './pages/public/Home';
import Rooms from './pages/public/Rooms';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import About from './pages/public/About';
import Amenities from './pages/public/Amenities';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import RoomsPage from './pages/admin/Rooms';
import Allocations from './pages/admin/Allocations';
import Fees from './pages/admin/Fees';
import Attendance from './pages/admin/Attendance';
import Complaints from './pages/admin/Complaints';
import Leaves from './pages/admin/Leaves';
import Notices from './pages/admin/Notices';
import Events from './pages/admin/Events';
import MessMenu from './pages/admin/MessMenu';
import Maintenance from './pages/admin/Maintenance';
import Visitors from './pages/admin/Visitors';
import Emergency from './pages/admin/Emergency';
import Wardens from './pages/admin/Wardens';
import Staff from './pages/admin/Staff';
import RoomChanges from './pages/admin/RoomChanges';
import VacateRequests from './pages/admin/VacateRequests';
import VacatedStudents from './pages/admin/VacatedStudents';
import Profile from './pages/admin/Profile';
import Notifications from './pages/admin/Notifications';
import DigitalIds from './pages/admin/DigitalIds';
import Reports from './pages/admin/Reports';
import Occupancy from './pages/admin/Occupancy';
import Backup from './pages/admin/Backup';
import StudentTimeline from './pages/admin/StudentTimeline';
import RoomMaintenanceHistory from './pages/admin/RoomMaintenanceHistory';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import MyRoom from './pages/student/MyRoom';
import StudentAttendance from './pages/student/Attendance';
import StudentFees from './pages/student/Fees';
import StudentComplaints from './pages/student/Complaints';
import StudentLeave from './pages/student/Leave';
import StudentMaintenance from './pages/student/Maintenance';
import Mess from './pages/student/Mess';
import StudentNotices from './pages/student/Notices';
import StudentEvents from './pages/student/Events';
import RoomChange from './pages/student/RoomChange';
import StudentEmergency from './pages/student/Emergency';
import Vacate from './pages/student/Vacate';
import StudentNotificationsPage from './pages/student/Notifications';

// Warden pages
import WardenDashboard from './pages/warden/Dashboard';
import WardenAttendance from './pages/warden/Attendance';
import WardenStudents from './pages/warden/Students';
import WardenComplaints from './pages/warden/Complaints';
import WardenLeaves from './pages/warden/Leaves';
import WardenMaintenance from './pages/warden/Maintenance';
import WardenVisitors from './pages/warden/Visitors';
import WardenEmergency from './pages/warden/Emergency';
import WardenNotices from './pages/warden/Notices';
import DailyReport from './pages/warden/DailyReport';
import RoomInspection from './pages/warden/RoomInspection';
import Medical from './pages/warden/Medical';
import Discipline from './pages/warden/Discipline';
import WardenNotifications from './pages/warden/Notifications';

function AppLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/rooms" element={<AppLayout><Rooms /></AppLayout>} />
          <Route path="/gallery" element={<AppLayout><Gallery /></AppLayout>} />
          <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
          <Route path="/about" element={<AppLayout><About /></AppLayout>} />
          <Route path="/amenities" element={<AppLayout><Amenities /></AppLayout>} />

          {/* Auth routes */}
          <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
          <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
          <Route path="/change-password" element={<ProtectedRoute><AppLayout><ChangePassword /></AppLayout></ProtectedRoute>} />
          <Route path="/forgot-password" element={<AppLayout><ForgotPassword /></AppLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="allocations" element={<Allocations />} />
            <Route path="fees" element={<Fees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="notices" element={<Notices />} />
            <Route path="events" element={<Events />} />
            <Route path="mess-menu" element={<MessMenu />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="visitors" element={<Visitors />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="wardens" element={<Wardens />} />
            <Route path="staff" element={<Staff />} />
            <Route path="room-changes" element={<RoomChanges />} />
            <Route path="vacate-requests" element={<VacateRequests />} />
            <Route path="vacated-students" element={<VacatedStudents />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="digital-ids" element={<DigitalIds />} />
            <Route path="reports" element={<Reports />} />
            <Route path="occupancy" element={<Occupancy />} />
            <Route path="backup" element={<Backup />} />
            <Route path="student-timeline" element={<StudentTimeline />} />
            <Route path="room-maintenance-history" element={<RoomMaintenanceHistory />} />
          </Route>

          {/* Student routes */}
          <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="my-room" element={<MyRoom />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="complaints" element={<StudentComplaints />} />
            <Route path="leave" element={<StudentLeave />} />
            <Route path="maintenance" element={<StudentMaintenance />} />
            <Route path="mess" element={<Mess />} />
            <Route path="notices" element={<StudentNotices />} />
            <Route path="events" element={<StudentEvents />} />
            <Route path="room-change" element={<RoomChange />} />
            <Route path="emergency" element={<StudentEmergency />} />
            <Route path="vacate" element={<Vacate />} />
            <Route path="notifications" element={<StudentNotificationsPage />} />
          </Route>

          {/* Warden routes */}
          <Route path="/warden" element={<ProtectedRoute role="warden"><WardenLayout /></ProtectedRoute>}>
            <Route index element={<WardenDashboard />} />
            <Route path="attendance" element={<WardenAttendance />} />
            <Route path="students" element={<WardenStudents />} />
            <Route path="complaints" element={<WardenComplaints />} />
            <Route path="leaves" element={<WardenLeaves />} />
            <Route path="maintenance" element={<WardenMaintenance />} />
            <Route path="visitors" element={<WardenVisitors />} />
            <Route path="emergency" element={<WardenEmergency />} />
            <Route path="notices" element={<WardenNotices />} />
            <Route path="daily-report" element={<DailyReport />} />
            <Route path="room-inspection" element={<RoomInspection />} />
            <Route path="medical" element={<Medical />} />
            <Route path="discipline" element={<Discipline />} />
            <Route path="notifications" element={<WardenNotifications />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
