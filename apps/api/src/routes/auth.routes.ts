import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { createOtp, verifyOtp, sendOtpSms } from '../lib/otp'
import { signToken } from '../lib/jwt'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.post('/request-otp', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = z.object({ phone: z.string().min(9).max(15) }).parse(req.body)
    const code = await createOtp(phone)
    await sendOtpSms(phone, code)
    res.json({ message: 'OTP sent', phone })
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: 'Invalid phone' }); return }
    res.status(500).json({ error: 'Failed to send OTP' })
  }
})

router.post('/verify-otp', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, code } = z.object({
      phone: z.string().min(9).max(15),
      code: z.string().length(6),
    }).parse(req.body)

    const valid = await verifyOtp(phone, code)
    if (!valid) { res.status(400).json({ error: 'Invalid or expired OTP' }); return }

    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone, avatarInitials: phone.slice(-2).toUpperCase() },
      select: { id: true, phone: true, name: true, avatarInitials: true, neighbourhood: true, verificationStatus: true, totalDeals: true, rating: true },
    })

    res.json({ token: signToken(user.id), user, isNewUser: !user.name })
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: 'Validation failed' }); return }
    res.status(500).json({ error: 'Verification failed' })
  }
})

router.patch('/profile', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = z.object({
      name: z.string().min(2).max(80),
      neighbourhood: z.string().min(2).max(100),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).parse(req.body)

    const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { ...data, avatarInitials: initials },
      select: { id: true, phone: true, name: true, avatarInitials: true, neighbourhood: true },
    })
    res.json({ user })
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: 'Validation failed' }); return }
    res.status(500).json({ error: 'Update failed' })
  }
})

router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, phone: true, name: true, avatarInitials: true, neighbourhood: true, verificationStatus: true, tradeScore: true, barterScore: true, giveScore: true, totalDeals: true, rating: true },
    })
    if (!user) { res.status(404).json({ error: 'User not found' }); return }
    res.json({ user })
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router