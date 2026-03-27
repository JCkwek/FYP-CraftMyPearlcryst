const { User } = require('../models');

const getUsers = async () => {
  return await User.findAll();
};

const createUser = async (name) => {
  return await User.create({ name });
};

module.exports = { getUsers, createUser };
