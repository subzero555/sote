import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'
import { prisma } from '../lib/prisma'

export interface AuthRequest extends Request {
  userId?: string
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    const token = header.split(' ')[1]
    const payload = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, isActive: true },
    })

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'User not found' })
      return
    }

    req.userId = user.id
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}