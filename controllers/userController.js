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

const logout = (req, res) => {
  return res
    .cookie("social-app-token", "", { expiresIn: new Date(Date.now()) })
    .json({
      message: "User logged out successfully",
      success: true,
    });
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    user.password = undefined;
    return res.json(user);
  } catch (error) {
    console.log("getUserProfile error", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

const getOtherUsers = async (req, res) => {
  try {
    const userId = req.user;

    const otherUsers = await User.find({ _id: { $ne: userId } })
      .limit(5)
      .select("-password");

    if (!otherUsers) {
      return res.status(400).json({
        message: "No users found",
        success: false,
      });
    }

    return res.json(otherUsers);
  } catch (error) {
    console.log("first", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const followOrUnfollow = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(500).json({
        message: "Something went wrong",
        success: false,
      });
    }

    if (user.following.includes(id)) {
      await User.findByIdAndUpdate(id, { $pull: { followers: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { following: id } });
      return res.json({
        message: "User Unfollowed successfully",
      });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: userId } });
      await User.findByIdAndUpdate(userId, { $push: { following: id } });
      return res.json({
        message: "User followed successfully",
      });
    }
  } catch (error) {
    console.log("followOrUnfollow error", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export {
  login,
  logout,
  register,
  getUserProfile,
  getOtherUsers,
  followOrUnfollow,
};
