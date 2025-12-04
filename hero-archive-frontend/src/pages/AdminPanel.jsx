import { useEffect, useState } from 'react';
import { getAllHeroes, createHero, updateHero, deleteHero } from '../api/heroes';
import './AdminPanel.css'; // ← TAMBAHKAN INI

const ROLES = ['Fighter', 'Marksman', 'Assassin', 'Mage', 'Tank', 'Support'];

function AdminPanel() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('list'); // list, create, edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    role: 'Fighter',
    specialty: '',
    description: '',
    difficulty: 1,
    durability: 50,
    offense: 50,
    control_stat: 50,
    movement: 50,
    image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      const data = await getAllHeroes();
      setHeroes(Array.isArray(data) ? data : data.heroes || []);
      setError('');
    } catch (err) {
      setError('Failed to load heroes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['difficulty', 'durability', 'offense', 'control_stat', 'movement'].includes(name)
        ? Math.max(1, Math.min(100, parseInt(value) || 0))
        : value
    }));
  };

  const handleEditClick = (hero) => {
    setEditingId(hero.id);
    setForm({
      name: hero.name,
      role: hero.role,
      specialty: hero.specialty,
      description: hero.description,
      difficulty: hero.difficulty,
      durability: hero.durability,
      offense: hero.offense,
      control_stat: hero.control_stat,
      movement: hero.movement,
      image_url: hero.image_url || ''
    });
    setMode('edit');
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setForm({
      name: '',
      role: 'Fighter',
      specialty: '',
      description: '',
      difficulty: 1,
      durability: 50,
      offense: 50,
      control_stat: 50,
      movement: 50,
      image_url: ''
    });
    setMode('create');
  };

  const validateForm = () => {
    if (!form.name.trim()) throw new Error('Hero name is required');
    if (!form.specialty.trim()) throw new Error('Specialty is required');
    if (!form.description.trim()) throw new Error('Description is required');
    if (form.difficulty < 1 || form.difficulty > 10) throw new Error('Difficulty must be 1-10');
    if (form.durability < 0 || form.durability > 100) throw new Error('Stats must be 0-100');
    if (form.offense < 0 || form.offense > 100) throw new Error('Stats must be 0-100');
    if (form.control_stat < 0 || form.control_stat > 100) throw new Error('Stats must be 0-100');
    if (form.movement < 0 || form.movement > 100) throw new Error('Stats must be 0-100');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateForm();
      setSubmitting(true);
      
      if (mode === 'create') {
        await createHero(form);
        alert('✅ Hero created!');
      } else {
        await updateHero(editingId, form);
        alert('✅ Hero updated!');
      }
      
      setMode('list');
      loadHeroes();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hero? This action cannot be undone.')) return;
    try {
      await deleteHero(id);
      loadHeroes();
      alert('✅ Hero deleted!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-panel">
      <div className="page-header">
        <h1>⚙️ Admin Panel - Hero Management</h1>
        <p>Create, update, and manage heroes</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {mode === 'list' ? (
        <>
          <button onClick={handleCreateClick} className="btn btn--primary mb-2">
            ➕ Create New Hero
          </button>

          {heroes.length === 0 ? (
            <div className="empty-state">
              <h3>No heroes yet</h3>
              <p>Click the button above to create your first hero</p>
            </div>
          ) : (
            <div className="heroes-table-container">
              <table className="heroes-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Specialty</th>
                    <th>Difficulty</th>
                    <th>Stats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {heroes.map((hero) => (
                    <tr key={hero.id}>
                      <td><strong>{hero.name}</strong></td>
                      <td>
                        <span className="role-badge">{hero.role}</span>
                      </td>
                      <td>{hero.specialty}</td>
                      <td>{'⭐'.repeat(hero.difficulty)}</td>
                      <td>
                        <span className="stats-badge">
                          D:{hero.durability} O:{hero.offense} C:{hero.control_stat} M:{hero.movement}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEditClick(hero)}
                            className="btn btn--secondary btn--sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(hero.id)}
                            className="btn btn--danger btn--sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="form-container card">
          <h2>{mode === 'create' ? 'Create New Hero' : 'Edit Hero'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hero Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="form-control"
                  placeholder="Hero name"
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role *</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  className="form-control"
                  disabled={submitting}
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Specialty *</label>
              <input
                type="text"
                name="specialty"
                value={form.specialty}
                onChange={handleFormChange}
                className="form-control"
                placeholder="e.g., Burst Damage, CC, Escape"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                className="form-control"
                rows="3"
                placeholder="Hero description"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleFormChange}
                className="form-control"
                placeholder="https://example.com/hero.jpg"
                disabled={submitting}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Difficulty (1-10): {form.difficulty}
                </label>
                <input
                  type="range"
                  name="difficulty"
                  min="1"
                  max="10"
                  value={form.difficulty}
                  onChange={handleFormChange}
                  className="form-control"
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Durability: {form.durability}%
                </label>
                <input
                  type="range"
                  name="durability"
                  min="0"
                  max="100"
                  value={form.durability}
                  onChange={handleFormChange}
                  className="form-control"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Offense: {form.offense}%
                </label>
                <input
                  type="range"
                  name="offense"
                  min="0"
                  max="100"
                  value={form.offense}
                  onChange={handleFormChange}
                  className="form-control"
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Control: {form.control_stat}%
                </label>
                <input
                  type="range"
                  name="control_stat"
                  min="0"
                  max="100"
                  value={form.control_stat}
                  onChange={handleFormChange}
                  className="form-control"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Movement: {form.movement}%
              </label>
              <input
                type="range"
                name="movement"
                min="0"
                max="100"
                value={form.movement}
                onChange={handleFormChange}
                className="form-control"
                disabled={submitting}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting ? '⏳ Saving...' : (mode === 'create' ? 'Create Hero' : 'Update Hero')}
              </button>
              <button
                type="button"
                onClick={() => setMode('list')}
                className="btn btn--secondary"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;