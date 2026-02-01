import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PostJob from './pages/PostJob';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import JobApplicants from './pages/JobApplicants';

// Smart Dashboard Component
const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'employer') return <EmployerDashboard />;
  return <CandidateDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/job/:id/applicants" element={<JobApplicants />} />
            </Route>

            <Route path="/jobs" element={<JobListing />} />
            <Route path="/job/:id" element={<JobDetails />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

