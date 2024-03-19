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

export { register };
