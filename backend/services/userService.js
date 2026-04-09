const { User } = require('../models');
const bcrypt = require('bcrypt');

const getUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
    // Returns user without the password for safety
    return await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
};

const updateProfile = async (id, data) => {
    const { name, phone_no, password } = data;
    const user = await User.findByPk(id);

    if (!user) throw new Error('User not found');

    // Update fields if they are provided
    if (name) user.name = name;
    if (phone_no) user.phone_no = phone_no;

    // Hash password if user is changing it
    if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    
    // Return updated user without password
    const updatedUser = user.toJSON();
    delete updatedUser.password;
    return updatedUser;
};
module.exports = { getUsers, getUserById, updateProfile };
