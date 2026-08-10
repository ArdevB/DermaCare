import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const authToken = req.cookies?.accessToken;

  if (!authToken) return res.status(401).send("User not authenticated.");

  try {
    const decoded = verifyAccessToken(authToken);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).send("User no longer exists or is inactive.");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

export default auth;
