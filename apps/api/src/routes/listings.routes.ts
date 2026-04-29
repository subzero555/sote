import { Router, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

const listingSchema = z.object({
  mode: z.enum(['TRADE', 'BARTER', 'GIFT', 'DONATE', 'MEAL']),
  title: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  category: z.string().min(2).max(60),
  emoji: z.string().optional(),
  price: z.number().positive().optional(),
  wantedItem: z.string().max(120).optional(),
  myEstimatedValue: z.number().positive().optional(),
  theirEstimatedValue: z.number().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  portions: z.number().int().positive().optional(),
  neighbourhood: z.string().max(100).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  meetupHint: z.string().max(200).optional(),
})

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mode = req.query.mode as string | undefined
    const neighbourhood = req.query.neighbourhood as string | undefined
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50)
    const cursor = req.query.cursor as string | undefined

    const listings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        ...(mode && mode !== 'all' ? { mode: mode.toUpperCase() as any } : {}),
        ...(neighbourhood ? { neighbourhood: { contains: neighbourhood, mode: 'insensitive' } } : {}),
      },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, avatarInitials: true, neighbourhood: true, rating: true, totalDeals: true, verificationStatus: true },
        },
      },
    })

    const hasMore = listings.length > limit
    const items = hasMore ? listings.slice(0, limit) : listings
    res.json({ listings: items, nextCursor: hasMore ? items[items.length - 1].id : null, hasMore })
  } catch {
    res.status(500).json({ error: 'Failed to fetch listings' })
  }
})

router.get('/stats', async (_req, res: Response): Promise<void> => {
  try {
    const [trade, barter, gift, donate, meal] = await Promise.all([
      prisma.listing.count({ where: { mode: 'TRADE', status: 'ACTIVE' } }),
      prisma.listing.count({ where: { mode: 'BARTER', status: 'ACTIVE' } }),
      prisma.listing.count({ where: { mode: 'GIFT', status: 'ACTIVE' } }),
      prisma.listing.count({ where: { mode: 'DONATE', status: 'ACTIVE' } }),
      prisma.listing.count({ where: { mode: 'MEAL', status: 'ACTIVE', expiresAt: { gt: new Date() } } }),
    ])
    res.json({ trade, barter, gift, donate, meal })
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, avatarInitials: true, neighbourhood: true, rating: true, totalDeals: true, verificationStatus: true },
        },
      },
    })
    if (!listing) { res.status(404).json({ error: 'Listing not found' }); return }
    res.json({ listing })
  } catch {
    res.status(500).json({ error: 'Failed to fetch listing' })
  }
})

router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = listingSchema.parse(req.body)

    if (data.mode === 'TRADE' && !data.price) { res.status(400).json({ error: 'Trade requires a price' }); return }
    if (data.mode === 'BARTER' && !data.wantedItem) { res.status(400).json({ error: 'Barter requires wantedItem' }); return }
    if (data.mode === 'MEAL' && !data.expiresAt) { res.status(400).json({ error: 'Meal requires expiresAt' }); return }

    if (data.mode === 'BARTER') {
      const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { totalDeals: true } })
      if ((user?.totalDeals ?? 0) < 5) { res.status(403).json({ error: 'Barter requires 5+ completed deals' }); return }
    }

    const listing = await prisma.listing.create({
      data: { ...data, userId: req.userId!, expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined },
      include: { user: { select: { id: true, name: true, avatarInitials: true, neighbourhood: true, rating: true } } },
    })
    res.status(201).json({ listing })
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: 'Validation failed', details: err.errors }); return }
    res.status(500).json({ error: 'Failed to create listing' })
  }
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id }, select: { userId: true } })
    if (!listing) { res.status(404).json({ error: 'Not found' }); return }
    if (listing.userId !== req.userId) { res.status(403).json({ error: 'Not your listing' }); return }
    await prisma.listing.update({ where: { id: req.params.id }, data: { status: 'CANCELLED' } })
    res.json({ message: 'Listing cancelled' })
  } catch {
    res.status(500).json({ error: 'Failed to cancel listing' })
  }
})

export default router