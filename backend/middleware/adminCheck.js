const adminCheck = (req, res, next) => {
  // req.user was already populated by your existing authMiddleware
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, let them through!
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = adminCheck;