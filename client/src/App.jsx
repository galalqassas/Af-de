import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import '@mui/material';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ScrollToTop from './components/ScrollToTop';

// Lazy loading all the components
const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const Login = lazy(() => import('./pages/Register/Login/Login'));
const SignUp = lazy(() => import('./pages/Register/SignUp/SignUp'));
const ResetPassword = lazy(() => import('./pages/Register/ResetPassword/ResetPassword'));
const ForgotPassword = lazy(() => import('./pages/Register/ForgotPassword/ForgotPassword'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard/StudentDashboard'));
const StudentCoursePage = lazy(() => import('./pages/StudentCoursePage/StudentCoursePage'));
const CoursePage = lazy(() => import('./pages/CoursePage/CoursePage'));
const CheckOutPage = lazy(() => import('./pages/CheckOutPage/CheckOutPage.jsx'));
const ThankYouPage = lazy(() => import('./components/ThankYouPage/ThankYouPage.jsx'));
const FeedbackForm = lazy(() => import('./components/StudentDashboard/FeedbackForm/FeedbackForm'));
const Quiz = lazy(() => import('./components/StudentDashboard/Quiz/Quiz'));

// Teacher Dashboard
const Dashboard = lazy(() => import('./pages/TeacherDashboard/dashboard/Dashboard'));
const Calendar = lazy(() => import('./pages/TeacherDashboard/calendar/Calendar'));
const Course = lazy(() => import('./pages/TeacherDashboard/course/Course'));
const Student = lazy(() => import('./pages/TeacherDashboard/students/Student'));
const BarChart = lazy(() => import('./pages/TeacherDashboard/barChart/BarChart'));
const LineChart = lazy(() => import('./pages/TeacherDashboard/lineChart/LineChart'));
const DashApp = lazy(() => import('./pages/TeacherDashboard/DashApp'));
const BadgeAward = lazy(() => import('./pages/TeacherDashboard/badge/BadgeAward'));
const Fileupload = lazy(() => import('./pages/TeacherDashboard/fileupload/fileupload'));
const QuizCreation = lazy(() => import('./pages/TeacherDashboard/quizCreation/quizCreation'));

// Admin Dashboard
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'));
import pages from './pages/AdminDashboard/pages/pages';

// Parent Dashboard
const ParentDashboard = lazy(() => import('./pages/ParentDashboard/ParentDashboard'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<div className="loading-screen">Loading...</div>}>
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student Routes */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-dashboard/course/:courseId" element={<StudentCoursePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/checkout/:courseId" element={<CheckOutPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/feedback/:courseId" element={<FeedbackForm />} />
          <Route path="/assessments/:courseId" element={<Quiz />} />

          {/* Teacher Routes */}
          <Route path="/pages/dashboard/Dashboard" element={<Dashboard />} />
          <Route path="/teacher-dashboard/*" element={<DashApp />} />
          <Route path="/bar" element={<BarChart />} />
          <Route path="/line" element={<LineChart />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/students" element={<Student />} />
          <Route path="/fileupload" element={<Fileupload />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/badges" element={<BadgeAward />} />
          <Route path="/quizCreation" element={<QuizCreation />} /> 

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            {pages.map((page, index) => (
              <Route key={page.path || index} path={`/admin${page.path}`} element={page.page} />
            ))}
          </Route>

          {/* Parent Routes */}
          <Route path="/parent-dashboard" element={<ParentDashboard />} />

          {/* Fallback Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
