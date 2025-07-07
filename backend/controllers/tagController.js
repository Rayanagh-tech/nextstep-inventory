const tagService = require('../services/tagService');

// 🔍 GET all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await tagService.getAll();
    res.status(200).json(tags);
  } catch (err) {
    console.error('Error loading tags:', err.message);
    res.status(500).json({ error: 'Failed to load tags' });
  }
};

// ➕ CREATE a tag
exports.createTag = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Tag name is required' });
  }

  try {
    const tag = await tagService.create({ name, description });
    res.status(201).json(tag);
  } catch (err) {
    console.error('Error creating tag:', err.message);
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

// 🖊️ UPDATE a tag
exports.updateTag = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updated = await tagService.update(id, { name, description });

    if (!updated) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating tag:', err.message);
    res.status(500).json({ error: 'Failed to update tag' });
  }
};

// ❌ DELETE a tag
exports.deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await tagService.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error('Error deleting tag:', err.message);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
};

exports.getTagWithCount = async (req, res) => {
  try {
    const tags = await tagService.getTagWithCount();
    res.status(200).json(tags);
  } catch (err) {
    console.error('Error loading tags:', err.message);
    res.status(500).json({ error: 'Failed to load tags' });
  }
};

exports.assignTagToEntity = async (req, res) => {
  const { tag_id, entity_type, entity_id } = req.body;

  try {
    await tagService.assignTagToEntity({ tag_id, entity_type, entity_id });
    res.status(200).json({ message: 'Tag assigned successfully' });
  } catch (err) {
    console.error('Error assigning tag:', err.message);
    res.status(500).json({ error: 'Failed to assign tag' });
  }
};

