const pool = require('../config/db');

// Get all tags
const getAll = async () => {
  const result = await pool.query('SELECT * FROM tag ORDER BY name');
  return result.rows;
};

// Create a tag
const create = async ({ name, description }) => {
  const result = await pool.query(
    'INSERT INTO tag (name, description) VALUES ($1, $2) RETURNING *',
    [name, description || null]
  );
  return result.rows[0];
};

// Update a tag
const update = async (id, { name, description }) => {
  const result = await pool.query(
    'UPDATE tag SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  return result.rows[0];
};

// Delete a tag
const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM tag WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

// tagService.js
const getTagWithCount = async () => {
  const result = await pool.query(`
    SELECT t.*, COUNT(et.id) AS count
    FROM tag t
    LEFT JOIN entity_tag et ON et.tag_id = t.id
    GROUP BY t.id
    ORDER BY t.name
  `);
  return result.rows;
};

const assignTagToEntity = async ({ tag_id, entity_type, entity_id }) => {
  await pool.query(
    `INSERT INTO entity_tag (tag_id, entity_type, entity_id)
     VALUES ($1, $2, $3)`,
    [tag_id, entity_type, entity_id]
  );
};

module.exports = { getAll, create, update, remove, getTagWithCount, assignTagToEntity };
