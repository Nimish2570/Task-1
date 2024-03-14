const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'YourJWTSecretKey';

const authorize = (roles) => {
    return async (req, res, next) => {
        try {
            
            const {token} = req.cookies;
            if (!token) {
                return res.status(401).json({ error: 'Not Authorized' });
            }
            const decoded = jwt.verify(token, "HWIAFJKSSADASDASDASASDASDASDASDASDDBFASJKBAIU");
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ error: 'Not Authorized' });
            }
            if (!roles.includes(user.role)) {
                return res.status(401).json({ error: 'Not Authorized' });
            }
            req.user = user;
            next();

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server Error' });
        }
    };
};


module.exports = authorize;


