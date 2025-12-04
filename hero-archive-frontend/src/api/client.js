// API Client dengan auto token injection
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // ← PERBAIKI: ganti : jadi /

const client = {
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  },

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  },

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  },

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  },

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    const response = await fetch(url, config);

    // Handle 401 - Token expired
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
};

// ✅ TAMBAHKAN NAMED EXPORTS untuk fungsi-fungsi spesifik
export const getHeroes = () => client.get('/heroes');
export const getHeroById = (id) => client.get(`/heroes/${id}`);
export const getFavorites = () => client.get('/favorites');
export const addToFavorites = (heroId) => client.post('/favorites', { hero_id: heroId });
export const removeFromFavorites = (heroId) => client.delete(`/favorites/${heroId}`);
export const getDrafts = () => client.get('/drafts');
export const createDraft = (draftData) => client.post('/drafts', draftData);
export const deleteDraft = (draftId) => client.delete(`/drafts/${draftId}`);

export default client;