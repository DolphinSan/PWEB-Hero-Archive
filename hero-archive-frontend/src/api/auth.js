import client from './client';

const API_BASE = 'http://localhost:5000';

export async function register(userData) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Store auth data
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userRole', data.user.role || 'user');
      localStorage.setItem('userId', data.user.id);
    }

    return data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

export async function login(credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();

    // Store auth data
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userRole', data.user.role || 'user');
      localStorage.setItem('userId', data.user.id);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  window.location.href = '/login';
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUsername() {
  return localStorage.getItem('username');
}

export function getUserRole() {
  return localStorage.getItem('userRole');
}

export function getUserId() {
  return localStorage.getItem('userId');
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function isAdmin() {
  return localStorage.getItem('userRole') === 'admin';
}