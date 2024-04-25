import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyUser = (req, res, next) => {

    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    jwt.verify(token, process.env.JWT_SECRET||'leo7', (err, user) => {
   
        if (err) {
            return next(errorHandler(401, 'Unauthorized'));
        }

        req.user = user;
        console.log('Decoded User:', user);
        next();
    });
};
