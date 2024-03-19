import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies["social-app-token"];

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.TOKEN_SECRET);

    if (!decode) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    req.user = decode.userId;

    next();
  } catch (error) {
    console.log("isAuthenticated error", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
