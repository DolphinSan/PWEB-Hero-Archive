const pool = require('../config/database');
exports.createReview = async (req, res) => {
  try {
    const { hero_id, rating, comment } = req.body;
    const user_id = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (user_id, hero_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, hero_id, rating, comment]
    );

    res.status(201).json({
      message: 'Review added successfully',
      review: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ - Get reviews for a hero (public)
exports.getReviewsByHero = async (req, res) => {
  try {
    const { hero_id } = req.params;

    const result = await pool.query(
      `SELECT r.*, u.username 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.hero_id = $1
       ORDER BY r.created_at DESC`,
      [hero_id]
    );

    res.json({
      count: result.rows.length,
      reviews: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE - Update review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'UPDATE reviews SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [rating, comment, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Review updated successfully',
      review: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE - Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};