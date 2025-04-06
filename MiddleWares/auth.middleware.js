import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

const auth = async (req, res, next) => {
  try {
    const headerToken = req.header("authorization");
    if (!headerToken || !headerToken.startsWith(process.env.BEARER_SECRET)) {
      return res
        .status(401)
        .json({ status: "Failed", message: "In-valid Header Token" });
    }
    const token = headerToken.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ status: "Failed", message: "In-valid Header Token" });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_AUTH);
    if (!decoded)
      return res
        .status(400)
        .json({ status: "Failed", message: "Invalid Token" });

    const user = await User.findById(decoded.id);
    if (!user)
      return res
        .status(404)
        .json({ status: "Failed", message: "Invalid User ID" });

    if (!user.confirmed)
      return res.status(400).json({
        status: "Failed",
        message: "Please Confirm Your Email First.",
      });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(400).json({
        status: "Failed",
        message: "Your token has expired",
      });
    } else if (err.name === "JsonWebTokenError") {
      res.status(400).json({
        status: "Failed",
        message: "Invalid token signature",
      });
    } else {
      res
        .status(500)
        .json({ status: "Failed", message: "Something went wrong" });
    }
  }
};

export { auth };
