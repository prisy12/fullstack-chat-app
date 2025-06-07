import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("Token:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET); 

    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing token or secret" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};



// import User from "../models/User.js";
// import jwt from "jsonwebtoken";



// //Middleware to protect routes
// export const protectRoute = async (req, res, next) => {
//     try {
//         const token = req.headers.token;

//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findById(decoded.userId).select("-password");
 
//         if(!user) return res.json({success: false, message: "User not found"});

//         req.user = user;
//         next();
//     } catch (error) {
//         console.log(error.message)
//         res.json({success: false, message: error.message});
//     }
// }