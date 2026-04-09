const userService = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserProfile = async (req, res) => {
    try {
        // req.user.id comes from your authMiddleware
        const user = await userService.getUserById(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateProfile(req.user.id, req.body);
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getUsers,getUserProfile,updateProfile };