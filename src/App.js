import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import GuideDashboard from './components/GuideDashboard';
import ReviewPage from './components/ReviewPage'; // Import the review page component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/guide" element={<GuideDashboard />} />
        <Route path="/guide/review/:projectId" element={<ReviewPage />} /> {/* New route for review */}
      </Routes>
    </Router>
  );
}

export default App;
