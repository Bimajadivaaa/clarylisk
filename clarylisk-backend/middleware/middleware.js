
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const validateToken = (req, res, next) => {
    // console.log("Headers received:", req.headers);
    const authHeader = req.headers['authorization'] || `Bearer ${req.cookies.access_token}`;
    const token = authHeader && authHeader.split(' ')[1];
    console.log("middleware token", token)

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, String(process.env.TOKEN_SECRET), (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }

        req.user = user;
        next();
    });
};
