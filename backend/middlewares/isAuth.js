import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json("Token not found");
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: `is auth error ${error}` });
  }
};

export default isAuth;
