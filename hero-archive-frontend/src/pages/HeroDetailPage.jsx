import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHeroById, getReviews, addReview, updateReview, deleteReview, addFavorite, deleteFavorite } from '../api/heroes';

function HeroDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hero, setHero] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [submitingReview, setSubmitingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [editReview, setEditReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    loadHeroData();
  }, [id]);

  const loadHeroData = async () => {
    try {
      setLoading(true);
      const heroRes = await getHeroById(id);
      setHero(heroRes);
      const reviewsRes = await getReviews(id);
      setReviews(Array.isArray(reviewsRes) ? reviewsRes : []);
    } catch (err) {
      setError('Failed to load hero data: ' + err.message);
      console.error('Error loading hero:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  };

  const handleAddFavorite = async () => {
    try {
      await addFavorite(parseInt(id));
      setIsFavorited(true);
      alert('✅ Added to favorites!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      // This is a simplified version - in real app you'd need favorite id
      await removeFavorite(parseInt(id));
      setIsFavorited(false);
      alert('✅ Removed from favorites!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      alert('Please write a comment');
      return;
    }
    try {
      setSubmitingReview(true);
      await addReview(parseInt(id), parseInt(newReview.rating), newReview.comment);
      setNewReview({ rating: 5, comment: '' });
      loadHeroData();
      alert('✅ Review submitted!');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditReview({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editReview.comment.trim()) {
      alert('Please write a comment');
      return;
    }
    try {
      await updateReview(reviewId, parseInt(editReview.rating), editReview.comment);
      alert('✅ Review updated!');
      setEditingReviewId(null);
      loadHeroData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReview({ rating: 5, comment: '' });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(reviewId);
      loadHeroData();
      alert('✅ Review deleted!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading hero data...</div>;

  if (error) return <div className="alert alert-danger">{error}</div>;

  if (!hero) return <div className="alert alert-warning">Hero not found</div>;

  const currentUserId = getCurrentUserId();

  return (
    <div className="hero-detail-page">
      <button onClick={() => navigate('/')} className="btn btn--secondary">
        ← Back to Heroes
      </button>

      <div className="hero-detail-container">
        {/* Hero Image & Basic Info */}
        <div className="hero-detail-header">
          {hero.image_url && (
            <img src={hero.image_url} alt={hero.name} className="hero-detail-image" />
          )}
          <div className="hero-detail-info">
            <h1>{hero.name}</h1>
            <p className="specialty">🎯 {hero.specialty}</p>
            <div className="role-badge">{hero.role}</div>
            <p className="description">{hero.description}</p>

            <div className="action-buttons">
              <button
                className={`btn ${isFavorited ? 'btn--secondary' : 'btn--primary'}`}
                onClick={isFavorited ? handleRemoveFavorite : handleAddFavorite}
              >
                {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat-card">
            <label>Difficulty</label>
            <div className="stat-value">{hero.difficulty}/10</div>
          </div>
          <div className="stat-card">
            <label>Durability</label>
            <div className="stat-bar-container">
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${hero.durability}%` }}
                ></div>
              </div>
              <span>{hero.durability}%</span>
            </div>
          </div>
          <div className="stat-card">
            <label>Offense</label>
            <div className="stat-bar-container">
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${hero.offense}%` }}
                ></div>
              </div>
              <span>{hero.offense}%</span>
            </div>
          </div>
          <div className="stat-card">
            <label>Control</label>
            <div className="stat-bar-container">
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${hero.control_stat}%` }}
                ></div>
              </div>
              <span>{hero.control_stat}%</span>
            </div>
          </div>
          <div className="stat-card">
            <label>Movement</label>
            <div className="stat-bar-container">
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${hero.movement}%` }}
                ></div>
              </div>
              <span>{hero.movement}%</span>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>💬 Reviews ({reviews.length})</h2>

          {/* Add Review Form */}
          <form onSubmit={handleSubmitReview} className="review-form card">
            <h3>Add Your Review</h3>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="form-control"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="form-control"
                placeholder="Share your thoughts about this hero..."
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitingReview}
            >
              {submitingReview ? '⏳ Submitting...' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card card">
                  {editingReviewId === review.id ? (
                    // Edit Mode
                    <div>
                      <div className="form-group">
                        <label className="form-label">Rating</label>
                        <select
                          value={editReview.rating}
                          onChange={(e) => setEditReview({ ...editReview, rating: parseInt(e.target.value) })}
                          className="form-control"
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} ⭐</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Comment</label>
                        <textarea
                          value={editReview.comment}
                          onChange={(e) => setEditReview({ ...editReview, comment: e.target.value })}
                          className="form-control"
                          rows="3"
                        />
                      </div>
                      <div className="button-group">
                        <button
                          onClick={() => handleUpdateReview(review.id)}
                          className="btn btn--primary btn--sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn--secondary btn--sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div>
                      <div className="review-header">
                        <strong>{review.username}</strong>
                        <span className="rating">{'⭐'.repeat(review.rating)}</span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      {currentUserId === review.user_id && (
                        <div className="review-actions">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="btn btn--secondary btn--sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="btn btn--danger btn--sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroDetailPage;