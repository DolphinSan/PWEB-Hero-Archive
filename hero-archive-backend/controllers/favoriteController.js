const pool = require('../config/database');
exports.addFavorite = async (req, res) => {
  try {
    const { hero_id, notes, priority } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO favorites (user_id, hero_id, notes, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, hero_id, notes || null, priority || 3]
    );

    res.status(201).json({
      message: 'Hero added to favorites',
      favorite: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Hero already in favorites' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ - Get user's favorites
exports.getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT f.*, h.name, h.role, h.image_url, h.specialty, h.description, 
              h.difficulty, h.durability, h.offense, h.control_stat, h.movement
       FROM favorites f
       JOIN heroes h ON f.hero_id = h.id
       WHERE f.user_id = $1
       ORDER BY f.priority DESC, f.created_at DESC`,
      [user_id]
    );

    res.json({
      count: result.rows.length,
      favorites: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE - Update favorite
exports.updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    let { notes, priority } = req.body;
    const user_id = req.user.id;

    // Convert priority string to number if needed
    if (typeof priority === 'string') {
      const priorityMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
      priority = priorityMap[priority] || 2;
    }

    const result = await pool.query(
      'UPDATE favorites SET notes = $1, priority = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [notes || null, priority || 2, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({
      message: 'Favorite updated successfully',
      favorite: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE - Remove from favorites
exports.deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};