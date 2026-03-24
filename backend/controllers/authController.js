const authService = require("../services/authService");

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    register,
    login,
};