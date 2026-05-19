import jwt from 'jsonwebtoken'
import { secret_key } from '../../config.mjs'
const authenticate = (req, res, next) => {
    try {
        const token = req.header.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const decoded = jwt.verify(token, secret_key)
        req.user = decoded
        next()

    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' })
    }
}

export { authenticate }