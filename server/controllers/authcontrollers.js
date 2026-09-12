const User = require('../model/UserModel');
const { createSecretToken } = require('../util/SecretToken');
const bcrypt = require('bcryptjs');

const Signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    // in Signup:
      const token = createSecretToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day, matches your JWT expiry
    });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" }); 
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" }); 
    }
    // in Login:
    const token = createSecretToken(user._id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const Logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { Signup, Login, getMe,Logout };

// module.exports = {Signup,Login};