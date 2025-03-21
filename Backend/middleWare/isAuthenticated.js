import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "You are not authenticated",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "invalid token",
      });
    }
    req.id = decoded.userId;
    next();
   
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to authenticate user",
    });
  }
};
export default isAuthenticated;
