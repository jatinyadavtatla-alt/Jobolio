import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Pages/landing';
import SignupEmployer from './Pages/SignupEmployer';
import SignupCandidate from './Pages/SignupCandidate';
import Login from './Pages/Login';

import JobListing from './Pages/JobListing';
import JobDetail from './Pages/JobDetail';
import EmployerDashboard from './Pages/EmployerDashboard';
import CandidateDashboard from './Pages/CandidateDashboard';
import ProtectedRoute from './Components/Context/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup/employer" element={<SignupEmployer />} />
        <Route path="/signup/candidate" element={<SignupCandidate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs/listing" element={
          <ProtectedRoute requiredRole="candidate">
          <JobListing />
          </ProtectedRoute>
          } />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute requiredRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute requiredRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;