import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { authAPI } from './api/auth';
import { User } from './types';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import QuestDetail from './pages/QuestDetail';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import './styles/global.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check for auth errors in URL params
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const message = params.get('message');
    const stack = params.get('stack');

    if (error) {
      setAuthError(`Auth Error: ${error}\nMessage: ${message}\nStack: ${stack}`);
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }

    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      {authError && (
        <div style={{
          background: '#ff4444',
          color: 'white',
          padding: '20px',
          margin: '20px',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <h3 style={{ marginTop: 0 }}>Authentication Error</h3>
          {authError}
          <button
            onClick={() => setAuthError(null)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: 'white',
              color: '#ff4444',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/quest/:id" element={<QuestDetail user={user} />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
