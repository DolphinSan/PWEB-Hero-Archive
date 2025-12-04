import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHeroById, addFavorite, getFavorites, getReviews, addReview, updateReview, deleteReview } from '../api/heroes';
import './HeroDetailPage.css';

function HeroDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [adding, setAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetchHeroAndCheckFavorite();
  }, [id]);

  const fetchHeroAndCheckFavorite = async () => {
    try {
      setLoading(true);
      
      // Fetch hero details
      const heroData = await getHeroById(id);
      console.log('Hero data:', heroData);
      
      // Handle different response formats
      const hero = heroData.hero || heroData;
      setHero(hero);

      // Check if already in favorites
      try {
        const favoritesData = await getFavorites();
        const favorites = Array.isArray(favoritesData) 
          ? favoritesData 
          : (favoritesData.favorites || []);
        
        const isAlreadyFavorite = favorites.some(
          fav => fav.hero_id === parseInt(id) || fav.hero?.id === parseInt(id)
        );
        setIsFavorite(isAlreadyFavorite);
      } catch (favError) {
        console.warn('Could not check favorites:', favError);
        setIsFavorite(false);
      }

      // Fetch reviews
      try {
        const reviewsData = await getReviews(id);
        console.log('Reviews data:', reviewsData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || []);
      } catch (revError) {
        console.warn('Could not load reviews:', revError);
        setReviews([]);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching hero:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (adding || isFavorite) return;

    try {
      setAdding(true);
      console.log('Adding hero to favorites:', id);
      
      // Send request to add favorite
      await addFavorite(parseInt(id));
      
      setIsFavorite(true);
      alert('✅ Added to favorites!');
    } catch (err) {
      console.error('Error adding to favorites:', err);
      alert('❌ Failed to add to favorites: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) {
      alert('Please write a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await addReview(parseInt(id), reviewForm.rating, reviewForm.comment);
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      await fetchHeroAndCheckFavorite(); // Reload to get new review
      alert('✅ Review added!');
    } catch (err) {
      console.error('Error adding review:', err);
      alert('❌ Failed to add review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
      alert('✅ Review deleted!');
    } catch (err) {
      console.error('Error deleting review:', err);
      // Check if error message contains the custom message
      const errorMsg = err.message || 'Failed to delete review';
      alert('❌ ' + errorMsg);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setReviewForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (reviewId) => {
    if (!reviewForm.comment.trim()) {
      alert('Please write a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await updateReview(reviewId, reviewForm.rating, reviewForm.comment);
      setEditingReviewId(null);
      setReviewForm({ rating: 5, comment: '' });
      await fetchHeroAndCheckFavorite(); // Reload to get updated review
      alert('✅ Review updated!');
    } catch (err) {
      console.error('Error updating review:', err);
      alert('❌ Failed to update review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  if (loading) {
    return (
      <div className="hero-detail-container">
        <div className="page-status">Loading hero details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero-detail-container">
        <div className="error-msg">Error: {error}</div>
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Heroes
        </button>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="hero-detail-container">
        <div className="empty-msg">Hero not found</div>
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Heroes
        </button>
      </div>
    );
  }

  return (
    <div className="hero-detail-container">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Back to Heroes
      </button>

      <div className="hero-detail-card">
        <div className="hero-detail-image-section">
          <img 
            src={hero.hero_image_url || hero.image_url} 
            alt={hero.hero_name || hero.name}
            className="hero-detail-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
            }}
          />
        </div>

        <div className="hero-detail-info-section">
          <div className="hero-detail-header">
            <h1>{hero.hero_name || hero.name}</h1>
            <span className="hero-detail-role">{hero.role}</span>
          </div>

          <p className="hero-detail-specialty">
            <strong>Specialty:</strong> {hero.specialty}
          </p>

          <p className="hero-detail-description">{hero.description}</p>

          <button 
            className={`btn-favorite ${isFavorite ? 'is-favorite' : ''}`}
            onClick={handleAddToFavorites}
            disabled={adding || isFavorite}
          >
            {adding ? '⏳ Adding...' : isFavorite ? '⭐ Already in Favorites' : '💗 Add to Favorites'}
          </button>

          <div className="hero-detail-stats">
            <h3>Hero Statistics</h3>
            
            <div className="stat-item">
              <div className="stat-label">
                <span>Difficulty</span>
                <span>{hero.difficulty}/10</span>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-fill difficulty"
                  style={{ width: `${(hero.difficulty / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label">
                <span>Durability</span>
                <span>{hero.durability}%</span>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-fill durability"
                  style={{ width: `${hero.durability}%` }}
                ></div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label">
                <span>Offense</span>
                <span>{hero.offense}%</span>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-fill offense"
                  style={{ width: `${hero.offense}%` }}
                ></div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label">
                <span>Control</span>
                <span>{hero.control_stat}%</span>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-fill control"
                  style={{ width: `${hero.control_stat}%` }}
                ></div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label">
                <span>Movement</span>
                <span>{hero.movement}%</span>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-fill movement"
                  style={{ width: `${hero.movement}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="hero-reviews">
            <div className="reviews-header">
              <h3>💬 Reviews ({reviews.length})</h3>
              <button 
                className="btn-add-review"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? '✕ Cancel' : '+ Add Review'}
              </button>
            </div>

            {showReviewForm && (
              <div className="review-form">
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        className={`star ${reviewForm.rating >= star ? 'active' : ''}`}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rating-text">{reviewForm.rating}/5</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share your thoughts about this hero..."
                    rows="3"
                    className="form-control"
                  />
                </div>

                <button
                  className="btn-submit-review"
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                >
                  {submittingReview ? '⏳ Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}

            {reviews.length === 0 ? (
              <p className="reviews-placeholder">No reviews yet. Be the first to review this hero!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="review-card">
                    {editingReviewId === review.id ? (
                      // Edit Mode
                      <div className="review-edit-form">
                        <div className="form-group">
                          <label className="form-label">Rating</label>
                          <div className="rating-selector">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                className={`star ${reviewForm.rating >= star ? 'active' : ''}`}
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              >
                                ★
                              </button>
                            ))}
                            <span className="rating-text">{reviewForm.rating}/5</span>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Comment</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Update your review..."
                            rows="3"
                            className="form-control"
                          />
                        </div>

                        <div className="review-edit-actions">
                          <button
                            className="btn-save-review"
                            onClick={() => handleUpdateReview(review.id)}
                            disabled={submittingReview}
                          >
                            {submittingReview ? '⏳ Saving...' : '✓ Save'}
                          </button>
                          <button
                            className="btn-cancel-edit"
                            onClick={handleCancelEditReview}
                            disabled={submittingReview}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <>
                        <div className="review-header">
                          <div className="review-rating">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                          <span className="review-meta">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <div className="review-actions">
                          <button
                            className="btn-edit-review"
                            onClick={() => handleEditReview(review)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete-review"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroDetailPage;