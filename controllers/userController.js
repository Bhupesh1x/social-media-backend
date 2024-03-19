import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../modals/userModal.js";

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(401).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const isExistingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (isExistingUser) {
      return res.status(403).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({ ...req.body, password: hashedPassword });

    await user.save();

    res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.log("register error", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExists.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign(
      { userId: isUserExists?._id },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("social-app-token", token, { expiresIn: "1d" }).json({
      message: `Welcome back ${isUserExists.name}`,
      success: true,
    });
  } catch (error) {
    console.log("login error", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export { login, register };
