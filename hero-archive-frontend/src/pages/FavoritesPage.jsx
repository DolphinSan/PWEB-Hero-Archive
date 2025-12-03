import { useEffect, useState } from 'react';
import { getFavorites, updateFavorite, deleteFavorite } from '../api/heroes';
import { useNavigate } from 'react-router-dom';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ notes: '', priority: 'Medium' });
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(Array.isArray(data) ? data : data.favorites || []);
      setError('');
    } catch (err) {
      setError('Failed to load favorites: ' + err.message);
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove from favorites?')) return;
    try {
      await deleteFavorite(id);
      loadFavorites();
      alert('✅ Removed from favorites!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (favorite) => {
    setEditingId(favorite.id);
    setEditForm({
      notes: favorite.notes || '',
      priority: favorite.priority || 'Medium'
    });
  };

  const handleUpdate = async (id) => {
    try {
      await updateFavorite(id, {
        notes: editForm.notes,
        priority: editForm.priority
      });
      setEditingId(null);
      loadFavorites();
      alert('✅ Favorite updated!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ notes: '', priority: 'Medium' });
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="loading">Loading favorites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-page">
        <div className="alert alert-danger">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1>⭐ My Favorite Heroes</h1>
        <p>Manage and track your favorite Mobile Legends heroes</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h3>😢 No favorites yet</h3>
          <p>Start adding heroes to your favorites to see them here</p>
          <button onClick={() => navigate('/')} className="btn btn--primary">
            Explore Heroes
          </button>
        </div>
      ) : (
        <>
          <div className="favorites-stats">
            <div className="stat-box">
              <span className="stat-label">Total Favorites</span>
              <span className="stat-value">{favorites.length}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">High Priority</span>
              <span className="stat-value">
                {favorites.filter(f => f.priority === 'High').length}
              </span>
            </div>
          </div>

          <div className="favorites-list">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card card">
                {editingId === favorite.id ? (
                  // Edit Mode
                  <div className="edit-form">
                    <h3>Edit Favorite</h3>
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                        className="form-control"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Notes</label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="form-control"
                        placeholder="Add notes about this hero..."
                        rows="3"
                      />
                    </div>
                    <div className="button-group">
                      <button
                        onClick={() => handleUpdate(favorite.id)}
                        className="btn btn--primary btn--sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn btn--secondary btn--sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="favorite-info">
                    <div className="favorite-header">
                      <h3>{favorite.hero_name}</h3>
                      <span className={`priority-badge priority-${String(favorite.priority || 'medium').toLowerCase()}`}>
                        {favorite.priority || 'Medium'}
                      </span>
                    </div>

                    <div className="favorite-details">
                      <p><strong>Role:</strong> {favorite.role}</p>
                      <p><strong>Specialty:</strong> {favorite.specialty}</p>
                      {favorite.notes && (
                        <div className="notes-section">
                          <strong>Notes:</strong>
                          <p>{favorite.notes}</p>
                        </div>
                      )}
                      <p className="added-date">
                        ➕ Added: {new Date(favorite.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="favorite-actions">
                      <button
                        onClick={() => navigate(`/hero/${favorite.hero_id}`)}
                        className="btn btn--secondary btn--sm"
                      >
                        View Hero
                      </button>
                      <button
                        onClick={() => handleEdit(favorite)}
                        className="btn btn--primary btn--sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(favorite.id)}
                        className="btn btn--danger btn--sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FavoritesPage;