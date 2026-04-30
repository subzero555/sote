import { Router, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// POST /api/exchanges — create exchange request
router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      listingId: z.string(),
      message: z.string().max(500).optional(),
      counterItem: z.string().max(120).optional(),
      counterEstimate: z.number().positive().optional(),
    })

    const data = schema.parse(req.body)

    // Get listing
    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      select: { id: true, userId: true, status: true, mode: true },
    })

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' })
      return
    }

    if (listing.status !== 'ACTIVE') {
      res.status(400).json({ error: 'Listing is no longer available' })
      return
    }

    if (listing.userId === req.userId) {
      res.status(400).json({ error: 'You cannot request your own listing' })
      return
    }

    // Check for duplicate pending exchange
    const existing = await prisma.exchange.findFirst({
      where: {
        listingId: data.listingId,
        initiatorId: req.userId,
        status: { in: ['PROPOSED', 'ACCEPTED'] },
      },
    })

    if (existing) {
      res.status(400).json({ error: 'You already have a pending request for this listing' })
      return
    }

    // Barter: require counter item
    if (listing.mode === 'BARTER' && !data.counterItem) {
      res.status(400).json({ error: 'Barter exchanges require a counter item' })
      return
    }

    const exchange = await prisma.exchange.create({
      data: {
        listingId: data.listingId,
        initiatorId: req.userId!,
        receiverId: listing.userId,
        message: data.message,
        counterItem: data.counterItem,
        counterEstimate: data.counterEstimate,
        status: 'PROPOSED',
      },
      include: {
        listing: { select: { title: true, mode: true } },
        initiator: { select: { name: true, avatarInitials: true, neighbourhood: true } },
      },
    })

    res.status(201).json({ exchange })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors })
      return
    }
    console.error('[POST /exchanges]', err)
    res.status(500).json({ error: 'Failed to create exchange' })
  }
})

// GET /api/exchanges/mine — all my exchanges (sent + received)
router.get('/mine', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [sent, received] = await Promise.all([
      prisma.exchange.findMany({
        where: { initiatorId: req.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            select: { title: true, mode: true, neighbourhood: true },
          },
          receiver: {
            select: { name: true, avatarInitials: true, neighbourhood: true, rating: true },
          },
        },
      }),
      prisma.exchange.findMany({
        where: { receiverId: req.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          listing: {
            select: { title: true, mode: true, neighbourhood: true },
          },
          initiator: {
            select: { name: true, avatarInitials: true, neighbourhood: true, rating: true },
          },
        },
      }),
    ])

    res.json({ sent, received })
  } catch (err) {
    console.error('[GET /exchanges/mine]', err)
    res.status(500).json({ error: 'Failed to fetch exchanges' })
  }
})

// PATCH /api/exchanges/:id/status — accept, confirm, complete, cancel
router.patch('/:id/status', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      status: z.enum(['ACCEPTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'DISPUTED']),
    })

    const { status } = schema.parse(req.body)

    const exchange = await prisma.exchange.findUnique({
      where: { id: req.params.id },
      include: { listing: { select: { userId: true, mode: true } } },
    })

    if (!exchange) {
      res.status(404).json({ error: 'Exchange not found' })
      return
    }

    // Only parties involved can update
    if (exchange.initiatorId !== req.userId && exchange.receiverId !== req.userId) {
      res.status(403).json({ error: 'Not your exchange' })
      return
    }

    // Receiver accepts/rejects, initiator confirms
    if (status === 'ACCEPTED' && exchange.receiverId !== req.userId) {
      res.status(403).json({ error: 'Only the listing owner can accept' })
      return
    }

    const updated = await prisma.exchange.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'ACCEPTED' ? { agreedAt: new Date() } : {}),
        ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
    })

    // On completion — update listing status + reputation scores
    if (status === 'COMPLETED') {
      await prisma.listing.update({
        where: { id: exchange.listingId },
        data: { status: 'COMPLETED' },
      })

      const mode = exchange.listing.mode

      // Increment deal counts and mode scores for both parties
      const scoreField = mode === 'TRADE' ? 'tradeScore'
        : mode === 'BARTER' ? 'barterScore'
        : 'giveScore'

      await Promise.all([
        prisma.user.update({
          where: { id: exchange.initiatorId },
          data: {
            totalDeals: { increment: 1 },
            [scoreField]: { increment: 10 },
          },
        }),
        prisma.user.update({
          where: { id: exchange.receiverId },
          data: {
            totalDeals: { increment: 1 },
            [scoreField]: { increment: 10 },
          },
        }),
      ])
    }

    res.json({ exchange: updated })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    console.error('[PATCH /exchanges/:id/status]', err)
    res.status(500).json({ error: 'Failed to update exchange' })
  }
})

export default router