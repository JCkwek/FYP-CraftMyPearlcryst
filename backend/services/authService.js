const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// const JWT_SECRET = "jckw@k_fyp_secret_113#";
const JWT_SECRET = process.env.JWT_SECRET;

const register = async ({ name, email, phone_no ,password }) => {

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error("Email is already registered");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        phone_no,
        password: hashedPassword,
    });

    // return user;

    // Return user without the password field for security
    const { password: hashedPwd, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Wrong password");
    }

    const token = jwt.sign(
        { id: user.user_id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    // return { token, user };
    const { password: hashedPassword, ...userData } = user.toJSON();
    
    return {
        token,
        user: userData
    };
};

module.exports = {
    register,
    login,
};