import { useEffect, useState } from 'react';
import { getDrafts, updateDraft, deleteDraft, getAllHeroes, createDraft } from '../api/heroes';
import { useNavigate } from 'react-router-dom';
import './DraftHistoryPage.css';

function DraftHistoryPage() {
  const [drafts, setDrafts] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
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
    // Parse hero_ids from backend - can be array or string
    let selectedHeroes = [];
    if (draft.hero_ids) {
      if (Array.isArray(draft.hero_ids)) {
        selectedHeroes = draft.hero_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      } else if (typeof draft.hero_ids === 'string') {
        selectedHeroes = draft.hero_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }
    }
    setEditForm({
      title: draft.team_name || draft.title || '',
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
        team_name: editForm.title,
        hero_ids: editForm.selected_heroes
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
    setIsCreating(false);
    setEditForm({ title: '', description: '', selected_heroes: [] });
  };

  const handleCreate = async () => {
    if (!editForm.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (editForm.selected_heroes.length === 0) {
      alert('Please select at least one hero');
      return;
    }
    try {
      await createDraft({
        team_name: editForm.title,
        hero_ids: editForm.selected_heroes
      });
      setIsCreating(false);
      loadData();
      alert('✅ Draft created!');
      setEditForm({ title: '', description: '', selected_heroes: [] });
    } catch (err) {
      alert('Error: ' + err.message);
    }
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
        <div className="header-content">
          <h1>📋 Draft History</h1>
          <p>Manage and refine your hero team drafts</p>
        </div>
        <button 
          className="btn btn--primary btn--lg"
          onClick={() => setIsCreating(true)}
        >
          + Create New Draft
        </button>
      </div>

      {isCreating && (
        <div className="create-draft-card card">
          <div className="edit-form">
            <h3>Create New Draft</h3>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="form-control"
                placeholder="Enter draft title"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="form-control"
                placeholder="Enter draft description (optional)"
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
                onClick={handleCreate}
                className="btn btn--primary btn--sm"
              >
                Create Draft
              </button>
              <button
                onClick={handleCancel}
                className="btn btn--secondary btn--sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="empty-state">
          <h3>😢 No drafts yet</h3>
          <p>Create your first draft to start planning hero teams</p>
          <button onClick={() => setIsCreating(true)} className="btn btn--primary">
            Create First Draft
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
                    <h3>{draft.team_name || draft.title}</h3>
                    <span className="hero-count">
                      {(() => {
                        if (draft.hero_ids && Array.isArray(draft.hero_ids)) {
                          return draft.hero_ids.length;
                        } else if (draft.hero_ids && typeof draft.hero_ids === 'string') {
                          return draft.hero_ids.split(',').length;
                        }
                        return 0;
                      })()} heroes
                    </span>
                  </div>

                  {draft.description && (
                    <p className="description">{draft.description}</p>
                  )}

                  <div className="selected-heroes">
                    <strong>Selected Heroes:</strong>
                    <div className="heroes-list">
                      {draft.hero_ids && (draft.hero_ids.length > 0 || (typeof draft.hero_ids === 'string' && draft.hero_ids.trim() !== '')) ? (
                        (() => {
                          const heroIdsList = Array.isArray(draft.hero_ids) 
                            ? draft.hero_ids 
                            : draft.hero_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                          return heroIdsList.map((heroId) => {
                            const hero = heroes.find(h => h.id === heroId);
                            return hero ? (
                              <span key={hero.id} className="hero-tag">
                                {hero.name}
                              </span>
                            ) : null;
                          });
                        })()
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