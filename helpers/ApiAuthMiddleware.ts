import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const AuthAPIMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const { JWT_SECRET_KEY, API_ID } = process.env

    if (!JWT_SECRET_KEY || !API_ID) {
        throw 'Undefined environment variables JWT_SECRET_KEY or API_ID'
    }

    const token = req.headers.authorization?.replace('Bearer', '').trim() ?? ''
    jwt.verify(token, JWT_SECRET_KEY as string, (error: any, decoded: any) => {
        if (error || (decoded != null && (decoded as any)['api_id'] != API_ID)) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid token'
            })
        }
        next()
    })

    return
}

export default AuthAPIMiddleware