import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HeroDetailPage from './pages/HeroDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import DraftHistoryPage from './pages/DraftHistoryPage';
import LoginPage from './pages/LoginPage';
import HeroGalleryPage from './pages/HeroGalleryPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { logout, getUsername, getUserRole } from './api/auth';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [role, setRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');
    if (storedToken) {
      setToken(storedToken);
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setUsername(localStorage.getItem('username'));
    setRole(localStorage.getItem('userRole'));
  };

  const handleLogout = () => {
    logout();
  };

  // ✅ COMMENTED OUT - BYPASS LOGIN FOR TESTING
  // if (!token) {
  //   return (
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
  //       </Routes>
  //     </BrowserRouter>
  //   );
  // }

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <h1>🎮 Hero Archive</h1>
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Heroes
              </NavLink>
            </li>
            <li>
              <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                ⭐ Favorites
              </NavLink>
            </li>
            <li>
              <NavLink to="/drafts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                📋 Drafts
              </NavLink>
            </li>
            {role === 'admin' && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  ⚙️ Admin
                </NavLink>
              </li>
            )}
            <li className="user-info">
              <span>👤 {username || 'User'}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HeroGalleryPage />} />
            <Route path="/hero/:id" element={<HeroDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/drafts" element={<DraftHistoryPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
