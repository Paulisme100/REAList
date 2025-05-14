import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const verifyToken = async (req, res, next) => {

    const token = req.cookies?.token

    if(!token) {

        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()

    } catch (err) {
        return res.status(400).json({message: 'Invalid token!'})
    }

}

export default verifyToken
 