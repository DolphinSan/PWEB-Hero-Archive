const pool = require('../config/database');
exports.createDraft = async (req, res) => {
  try {
    const { team_name, hero_ids } = req.body;
    const user_id = req.user.id;

    if (!Array.isArray(hero_ids) || hero_ids.length !== 5) {
      return res.status(400).json({ error: 'hero_ids must be an array of 5 hero IDs' });
    }

    const result = await pool.query(
      'INSERT INTO drafts (user_id, team_name, hero_ids) VALUES ($1, $2, $3) RETURNING *',
      [user_id, team_name, JSON.stringify(hero_ids)]
    );

    res.status(201).json({
      message: 'Draft saved successfully',
      draft: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ - Get user's drafts
exports.getDrafts = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      'SELECT * FROM drafts WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.json({
      count: result.rows.length,
      drafts: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE - Update draft
exports.updateDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { team_name, hero_ids } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'UPDATE drafts SET team_name = $1, hero_ids = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [team_name, JSON.stringify(hero_ids), id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    res.json({
      message: 'Draft updated successfully',
      draft: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE - Delete draft
exports.deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'DELETE FROM drafts WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};