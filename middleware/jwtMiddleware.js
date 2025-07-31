//jwtMiddleware.js
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

//jwt configuration
const secretKey = process.env.JWT_SECRET_KEY;
const tokenDuration = process.env.JWT_EXPIRES_IN;
const tokenAlgorithm = process.env.JWT_ALGORITHM;

//generating jsonwebtoken
export const generateToken = (req, res, next) => {
    const payload = {
        userId: res.locals.userId,
        timestamp: new Date()
    };

    const options = {
        algorithm: tokenAlgorithm,
        expiresIn: tokenDuration,
    };

    const callback = (err, token) => {
        if (err) {
            console.error("Error jwt:", err);
            res.status(500).json(err);
        } else {
            res.locals.token = token;
            next();
        }
    };
console.log("payload", payload);
    const token = jwt.sign(payload, secretKey, options, callback);
};

//sending jwtoken
export const sendToken = (req, res, next) => {
    res.status(200).json({
        user_id : res.locals.userId,
        message: res.locals.message,
        token: res.locals.token,
    });
    // Don't call next() after sending response
};

//verifying jwt
export const verifyToken = (req, res, next) => {
    console.log('Verifying token for route:', req.path);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided for route:', req.path);
        
        // Check if this is a request for an HTML page
        const acceptHeader = req.headers.accept || '';
        if (acceptHeader.includes('text/html') || req.path.includes('.html')) {
            return res.redirect('/login');
        }
        
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    const callback = (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }

        res.locals.userId = decoded.userId;
        res.locals.tokenTimestamp = decoded.timestamp;
        console.log('res.locals.userId in line 77 jwt', res.locals.userId);
        next();
    };

    jwt.verify(token, secretKey, callback);
};
