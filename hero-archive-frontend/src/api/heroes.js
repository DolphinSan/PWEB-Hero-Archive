const API_BASE = 'http://localhost:5000/api';

// Helper function untuk fetch dengan auth
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

// HEROES CRUD
export async function getAllHeroes() {
  return fetchWithAuth(`${API_BASE}/heroes`);
}

export async function getHeroById(id) {
  return fetchWithAuth(`${API_BASE}/heroes/${id}`);
}

export async function createHero(heroData) {
  return fetchWithAuth(`${API_BASE}/heroes`, {
    method: 'POST',
    body: JSON.stringify(heroData)
  });
}

export async function updateHero(id, heroData) {
  return fetchWithAuth(`${API_BASE}/heroes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(heroData)
  });
}

export async function deleteHero(id) {
  return fetchWithAuth(`${API_BASE}/heroes/${id}`, {
    method: 'DELETE'
  });
}

// FAVORITES
export async function getFavorites() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  
  return fetchWithAuth(`${API_BASE}/favorites`);
}

export async function addFavorite(heroId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/favorites`, {
    method: 'POST',
    body: JSON.stringify({ hero_id: heroId })
  });
}

export async function updateFavorite(favoriteId, data) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/favorites/${favoriteId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteFavorite(favoriteId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/favorites/${favoriteId}`, {
    method: 'DELETE'
  });
}

// REVIEWS
export async function getReviews(heroId) {
  return fetchWithAuth(`${API_BASE}/reviews/hero/${heroId}`);  // ✅ Ubah jadi path parameter
}

export async function addReview(heroId, rating, comment) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ hero_id: heroId, rating, comment })
  });
}

export async function updateReview(reviewId, rating, comment) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify({ rating, comment })
  });
}

export async function deleteReview(reviewId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/reviews/${reviewId}`, {
    method: 'DELETE'
  });
}

// DRAFTS
export async function getDrafts() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/drafts`);
}

export async function createDraft(draftData) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/drafts`, {
    method: 'POST',
    body: JSON.stringify(draftData)
  });
}

export async function updateDraft(draftId, draftData) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/drafts/${draftId}`, {
    method: 'PUT',
    body: JSON.stringify(draftData)
  });
}

export async function deleteDraft(draftId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return fetchWithAuth(`${API_BASE}/drafts/${draftId}`, {
    method: 'DELETE'
  });
}

// REMOVEFAVORITE - Alternative (in case backend uses hero_id instead of favoriteId)
export async function removeFavorite(heroId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  
  // Try to delete by hero_id first
  try {
    const favorites = await getFavorites();
    const favorite = Array.isArray(favorites) 
      ? favorites.find(f => f.hero_id === heroId)
      : favorites.favorites?.find(f => f.hero_id === heroId);
    
    if (favorite) {
      return deleteFavorite(favorite.id);
    }
    throw new Error('Favorite not found');
  } catch (err) {
    console.error('Error removing favorite:', err);
    throw err;
  }
}