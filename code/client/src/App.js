import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/DirNavBar/NavBar';
import Home from './pages/DirHome/Home';
import Login from './pages/DirHome/DirLogin/Login';
import AccCreate from './pages/DirHome/DirAccCreate/AccCreate';
import ProtectedRoute from './components/DirProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/account-create" element={<AccCreate />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes here */}
      </Routes>
    </Router>
  );
}

export default App;
