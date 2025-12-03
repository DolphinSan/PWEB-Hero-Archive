import { useEffect, useState } from 'react';
import { getAllHeroes } from '../api/heroes';
import { useNavigate } from 'react-router-dom';

const HERO_DESCRIPTIONS = {
  'Alucard': 'Dark Alchemist dengan kemampuan burst damage tinggi dan chase yang mengerikan. Master pengguna senjata gelap yang memanfaatkan shadows untuk menyerang.',
  'Fanny': 'Marksman agile dengan mobilitas ekstrem menggunakan rope swinging yang unik. Pemain profesional pilihan untuk serangan cepat dari udara.',
  'Gusion': 'Assassin dengan burst damage dan skill yang dapat digunakan berkali-kali dalam satu combo. Pemburu bayangan yang sangat sulit ditebak gerakannya.',
  'Kagura': 'Mage controller dengan umbrella yang dapat digunakan untuk offensive dan defensive gameplay yang seimbang.',
  'Layla': 'Marksman dengan range terjauh di game, perfect untuk ADC role dengan damage yang stabil dan konsisten.',
  'Tigreal': 'Tank support yang tangguh dengan crowd control dan initiation power tinggi. Perisai tim yang dapat menahan serangan dahsyat musuh.'
};

const ROLE_COLORS = {
  'Fighter': '#ef4444',
  'Marksman': '#f97316',
  'Assassin': '#8b5cf6',
  'Mage': '#a855f7',
  'Tank': '#3b82f6',
  'Support': '#10b981'
};

function HeroGalleryPage() {
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    filterHeroes();
  }, [heroes, searchTerm, selectedRole]);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      const data = await getAllHeroes();
      setHeroes(Array.isArray(data) ? data : data.heroes || []);
      setError(null);
    } catch (err) {
      console.error('Error loading heroes:', err);
      setError('Failed to load heroes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterHeroes = () => {
    let filtered = heroes;

    if (searchTerm) {
      filtered = filtered.filter(hero =>
        hero.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole) {
      filtered = filtered.filter(hero => hero.role === selectedRole);
    }

    setFilteredHeroes(filtered);
  };

  const renderDifficultyStars = (difficulty) => {
    const maxStars = 5;
    return '★'.repeat(difficulty) + '☆'.repeat(maxStars - difficulty);
  };

  const renderStatBar = (value, max = 5) => {
    const percentage = (value / max) * 100;
    return (
      <div className="stat-bar">
        <div className="stat-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="hero-gallery">
        <div className="loading">Loading heroes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-gallery">
        <div className="alert alert-danger">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="hero-gallery">
      <div className="page-header">
        <h1>🎮 Discover Mobile Legends Heroes</h1>
        <p>Find your perfect hero and master their abilities</p>
      </div>

      {/* Search & Filter */}
      <div className="hero-filters">
        <input
          type="text"
          placeholder="Search hero name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control search-input"
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="form-control role-select"
        >
          <option value="">All Roles</option>
          <option value="Fighter">Fighter</option>
          <option value="Marksman">Marksman</option>
          <option value="Assassin">Assassin</option>
          <option value="Mage">Mage</option>
          <option value="Tank">Tank</option>
          <option value="Support">Support</option>
        </select>

        <button onClick={() => { setSearchTerm(''); setSelectedRole(''); }} className="btn btn--secondary">
          Reset Filters
        </button>
      </div>

      {/* Heroes Grid */}
      {filteredHeroes.length === 0 ? (
        <div className="empty-state">
          <h3>😢 No heroes found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="hero-grid">
          {filteredHeroes.map((hero) => (
            <div
              key={hero.id}
              className="hero-card"
              onClick={() => navigate(`/hero/${hero.id}`)}
            >
              {hero.image_url && (
                <img src={hero.image_url} alt={hero.name} className="hero-image" />
              )}
              <div className="hero-info">
                <h3>{hero.name}</h3>
                <div className="role-badge" style={{ backgroundColor: ROLE_COLORS[hero.role] || '#666' }}>
                  {hero.role}
                </div>
                <p className="specialty">{hero.specialty}</p>
                <div className="difficulty">
                  Difficulty: {renderDifficultyStars(hero.difficulty)}
                </div>

                {/* Stats Chart */}
                <div className="stats-container">
                  <div className="stat">
                    <label>Durability</label>
                    {renderStatBar(hero.durability, 100)}
                    <span className="stat-value">{hero.durability}%</span>
                  </div>
                  <div className="stat">
                    <label>Offense</label>
                    {renderStatBar(hero.offense, 100)}
                    <span className="stat-value">{hero.offense}%</span>
                  </div>
                  <div className="stat">
                    <label>Control</label>
                    {renderStatBar(hero.control_stat, 100)}
                    <span className="stat-value">{hero.control_stat}%</span>
                  </div>
                  <div className="stat">
                    <label>Movement</label>
                    {renderStatBar(hero.movement, 100)}
                    <span className="stat-value">{hero.movement}%</span>
                  </div>
                </div>

                <p className="description">
                  {HERO_DESCRIPTIONS[hero.name] || hero.description}
                </p>

                <button className="btn btn--primary btn--full-width">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroGalleryPage;