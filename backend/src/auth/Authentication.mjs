import jwt from 'jsonwebtoken'
import { secret_key } from '../../config.mjs'
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Autherhead is not present' });
        }
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
const decoded = jwt.verify(token, secret_key);
        req.user = decoded
        next()

    } catch (error) {
        res.status(500).json({ message: 'Internal server errorrrrr' })
    }
}

const authorization = (req, res, next) => {
    const userId = req.params.userId
    const userName = req.params.userName
    const user = req.user
    if (userId && user.id !== userId) {
        return res.status(403).json({ message: 'Forbidden' })
    }
    next()
}

export { authenticate, authorization }
