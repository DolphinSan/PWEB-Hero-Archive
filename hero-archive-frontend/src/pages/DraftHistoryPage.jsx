import { useEffect, useState } from 'react';
import { getDrafts, updateDraft, deleteDraft, getAllHeroes } from '../api/heroes';
import { useNavigate } from 'react-router-dom';

function DraftHistoryPage() {
  const [drafts, setDrafts] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', selected_heroes: [] });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [draftsRes, heroesRes] = await Promise.all([
        getDrafts(),
        getAllHeroes()
      ]);
      setDrafts(Array.isArray(draftsRes) ? draftsRes : draftsRes.drafts || []);
      setHeroes(Array.isArray(heroesRes) ? heroesRes : heroesRes.heroes || []);
      setError('');
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft?')) return;
    try {
      await deleteDraft(id);
      loadData();
      alert('✅ Draft deleted!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (draft) => {
    setEditingId(draft.id);
    const selectedHeroes = draft.selected_heroes
      ? draft.selected_heroes.split(',').map(id => parseInt(id.trim()))
      : [];
    setEditForm({
      title: draft.title,
      description: draft.description || '',
      selected_heroes: selectedHeroes
    });
  };

  const handleHeroToggle = (heroId) => {
    setEditForm(prev => {
      const current = prev.selected_heroes;
      if (current.includes(heroId)) {
        return {
          ...prev,
          selected_heroes: current.filter(id => id !== heroId)
        };
      } else {
        return {
          ...prev,
          selected_heroes: [...current, heroId]
        };
      }
    });
  };

  const handleUpdate = async (id) => {
    if (!editForm.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (editForm.selected_heroes.length === 0) {
      alert('Please select at least one hero');
      return;
    }
    try {
      await updateDraft(id, {
        title: editForm.title,
        description: editForm.description,
        selected_heroes: editForm.selected_heroes.join(',')
      });
      setEditingId(null);
      loadData();
      alert('✅ Draft updated!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', selected_heroes: [] });
  };

  if (loading) {
    return (
      <div className="draft-page">
        <div className="loading">Loading drafts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="draft-page">
        <div className="alert alert-danger">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="draft-page">
      <div className="page-header">
        <h1>📋 Draft History</h1>
        <p>Manage and refine your hero team drafts</p>
      </div>

      {drafts.length === 0 ? (
        <div className="empty-state">
          <h3>😢 No drafts yet</h3>
          <p>Create your first draft to start planning hero teams</p>
          <button onClick={() => navigate('/')} className="btn btn--primary">
            Explore Heroes
          </button>
        </div>
      ) : (
        <div className="drafts-list">
          {drafts.map((draft) => (
            <div key={draft.id} className="draft-card card">
              {editingId === draft.id ? (
                // Edit Mode
                <div className="edit-form">
                  <h3>Edit Draft</h3>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="form-control"
                      placeholder="Draft title"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="form-control"
                      placeholder="Draft description..."
                      rows="2"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Select Heroes ({editForm.selected_heroes.length} selected)
                    </label>
                    <div className="heroes-grid">
                      {heroes.map((hero) => (
                        <label key={hero.id} className="hero-checkbox">
                          <input
                            type="checkbox"
                            checked={editForm.selected_heroes.includes(hero.id)}
                            onChange={() => handleHeroToggle(hero.id)}
                          />
                          <span>{hero.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="button-group">
                    <button
                      onClick={() => handleUpdate(draft.id)}
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
                <div className="draft-info">
                  <div className="draft-header">
                    <h3>{draft.title}</h3>
                    <span className="hero-count">
                      {editForm.selected_heroes.length || draft.selected_heroes?.split(',').length || 0} heroes
                    </span>
                  </div>

                  {draft.description && (
                    <p className="description">{draft.description}</p>
                  )}

                  <div className="selected-heroes">
                    <strong>Selected Heroes:</strong>
                    <div className="heroes-list">
                      {draft.selected_heroes && draft.selected_heroes.length > 0 ? (
                        draft.selected_heroes.split(',').map((heroId) => {
                          const hero = heroes.find(h => h.id === parseInt(heroId.trim()));
                          return hero ? (
                            <span key={hero.id} className="hero-tag">
                              {hero.name}
                            </span>
                          ) : null;
                        })
                      ) : (
                        <span className="empty-heroes">No heroes selected</span>
                      )}
                    </div>
                  </div>

                  <p className="created-date">
                    📅 Created: {new Date(draft.created_at).toLocaleDateString()}
                  </p>

                  <div className="draft-actions">
                    <button
                      onClick={() => handleEdit(draft)}
                      className="btn btn--primary btn--sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="btn btn--danger btn--sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DraftHistoryPage;