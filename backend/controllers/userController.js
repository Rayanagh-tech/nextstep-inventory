const userService = require('../services/userService');
const bcrypt = require('bcryptjs');


const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user; // Injected from JWT auth middleware

    // ⛔ Forbid access if not the same user and not an admin
    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
    }

    const updates = { ...req.body };

    // ✅ Only admin can change `role`
    if (currentUser.role !== 'admin') {
      delete updates.role; // 🚫 Regular user can't set role
    }

    // 🚫 Nobody can change ID directly
    delete updates.id;

    const updatedUser = await userService.update(userId, updates);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser); // return clean updated user
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userService.remove(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted', user });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new passwords are required' });
  }

  try {
    const user = await userService.getUserWithPassword(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await userService.updateUserPassword(userId, hashed);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err.message);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

const updateMfa = async (req, res) => {
  const userId = req.params.id;
  const { mfa_enabled } = req.body;

  try {
    const updatedUser = await userService.updateMfaSetting(userId, mfa_enabled);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating MFA:', err);
    res.status(500).json({ error: 'Failed to update MFA setting' });
  }
};




module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  updateMfa,
};
