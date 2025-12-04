import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHeroes } from '../api/client';
import './HeroGalleryPage.css';

function HeroGalleryPage() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const data = await getHeroes();
      
      console.log('API Response:', data); // Debug log
      
      // Backend mengembalikan { count: ..., heroes: [...] }
      if (data.heroes && Array.isArray(data.heroes)) {
        setHeroes(data.heroes);
      } 
      // Jika response berbentuk { data: [...] }
      else if (data.data && Array.isArray(data.data)) {
        setHeroes(data.data);
      }
      // Jika response langsung array
      else if (Array.isArray(data)) {
        setHeroes(data);
      }
      // Fallback ke array kosong
      else {
        console.warn('Unexpected data format:', data);
        setHeroes([]);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching heroes:', err);
      setHeroes([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter heroes berdasarkan search dan role
  const filteredHeroes = Array.isArray(heroes) ? heroes.filter(hero => {
    const matchesSearch = hero.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || hero.role === roleFilter;
    return matchesSearch && matchesRole;
  }) : [];

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
  };

  // Get unique roles untuk dropdown
  const roles = Array.isArray(heroes) 
    ? [...new Set(heroes.map(hero => hero.role).filter(Boolean))]
    : [];

  if (loading) {
    return (
      <div className="hero-gallery-container">
        <div className="page-status">Loading heroes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-gallery-container">
        <div className="error-msg">Error: {error}</div>
        <button className="reset-btn" onClick={fetchHeroes}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="hero-gallery-container">
      <div className="gallery-header">
        <h2>🎮 Discover Mobile Legends Heroes</h2>
        <p>Find your perfect hero and master their abilities</p>
      </div>
      
      <div className="gallery-filters">
        <input 
          className="search-input"
          type="text"
          placeholder="Search hero name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="role-filter"
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button className="reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      {filteredHeroes.length === 0 ? (
        <div className="empty-msg">
          {heroes.length === 0 ? 'No heroes available' : 'No heroes match your filters'}
        </div>
      ) : (
        <div className="hero-grid">
          {filteredHeroes.map(hero => (
            <Link key={hero.id} to={`/hero/${hero.id}`} className="hero-card">
              <img 
                src={hero.image_url} 
                alt={hero.name}
                className="hero-card-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x350?text=No+Image';
                }}
              />
              <div className="hero-card-content">
                <h3 className="hero-card-title">{hero.name}</h3>
                <span className="hero-card-role">{hero.role}</span>
                <p className="hero-card-specialty">{hero.specialty || 'No specialty'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroGalleryPage;