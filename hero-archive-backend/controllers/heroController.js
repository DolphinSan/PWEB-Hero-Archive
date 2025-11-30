exports.createHero = async (req, res) => {
  try {
    const { name, role, specialty, difficulty, durability, offense, control_stat, movement, image_url, description } = req.body;

    const result = await pool.query(
      `INSERT INTO heroes (name, role, specialty, difficulty, durability, offense, control_stat, movement, image_url, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [name, role, specialty, difficulty, durability, offense, control_stat, movement, image_url, description]
    );

    res.status(201).json({
      message: 'Hero created successfully',
      hero: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ - Get all heroes (with filter & search)
exports.getAllHeroes = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = 'SELECT * FROM heroes WHERE 1=1';
    const params = [];

    if (role) {
      params.push(role);
      query += ` AND role = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);

    res.json({
      count: result.rows.length,
      heroes: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ - Get hero by ID
exports.getHeroById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM heroes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    res.json({ hero: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE - Update hero (Admin only)
exports.updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, specialty, difficulty, durability, offense, control_stat, movement, image_url, description } = req.body;

    const result = await pool.query(
      `UPDATE heroes 
       SET name = $1, role = $2, specialty = $3, difficulty = $4, 
           durability = $5, offense = $6, control_stat = $7, movement = $8, 
           image_url = $9, description = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [name, role, specialty, difficulty, durability, offense, control_stat, movement, image_url, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    res.json({
      message: 'Hero updated successfully',
      hero: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE - Delete hero (Admin only)
exports.deleteHero = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM heroes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    res.json({
      message: 'Hero deleted successfully',
      hero: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};