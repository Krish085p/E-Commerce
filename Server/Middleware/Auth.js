const auth = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    console.log("Hell0", token)
    
    if (!token)
      return res
        .status(401)
        .json({ errors: "Please authenticate using a valid token" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      res.status(401).json({ errors: "Invalid token" });
    }
};

module.exports = auth;