import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import '../styles/LoginPage.css';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Validate register form
        if (!form.username.trim()) {
          throw new Error('Username is required');
        }
        if (!form.email.trim()) {
          throw new Error('Email is required');
        }
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const response = await register({
          username: form.username,
          email: form.email,
          password: form.password
        });

        if (response.user) {
          onLogin(response.token);
          navigate('/');
        }
      } else {
        // Login
        if (!form.email.trim() || !form.password.trim()) {
          throw new Error('Email and password are required');
        }

        const response = await login({
          email: form.email,
          password: form.password
        });

        if (response.user) {
          onLogin(response.token);
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">
            {isRegister ? '🎮 Create Account' : '🎮 Hero Archive'}
          </h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Choose username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--full-width"
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="login-toggle">
            <p>
              {isRegister
                ? 'Already have account? '
                : "Don't have account? "}
              <button
                type="button"
                className="toggle-link"
                onClick={toggleMode}
                disabled={loading}
              >
                {isRegister ? 'Login' : 'Register'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;