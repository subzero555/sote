import { Router, Response } from 'express'
import multer from 'multer'
import { requireAuth, AuthRequest } from '../middleware/auth'
import cloudinary from '../lib/cloudinary'

const router = Router()

// Use memory storage — file stays in buffer, we send to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG and WebP images are allowed'))
    }
  },
})

// POST /api/upload/listing — upload listing image
router.post(
  '/listing',
  requireAuth,
  upload.single('image'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image provided' })
        return
      }

      // Upload buffer to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'sote/listings',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' },
            ],
          },
          (error: any, result: any) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        stream.end(req.file!.buffer)
      })

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      })
    } catch (err: any) {
      console.error('[upload/listing]', err)
      res.status(500).json({ error: err.message || 'Upload failed' })
    }
  }
)

// POST /api/upload/avatar — upload profile picture
router.post(
  '/avatar',
  requireAuth,
  upload.single('image'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image provided' })
        return
      }

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'sote/avatars',
            public_id: `avatar_${req.userId}`,
            overwrite: true,
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'face' },
              { quality: 'auto', fetch_format: 'auto' },
            ],
          },
          (error: any, result: any) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        stream.end(req.file!.buffer)
      })

      // Update user avatar in DB
      const { prisma } = await import('../lib/prisma')
      await prisma.user.update({
        where: { id: req.userId },
        data: { avatarInitials: result.secure_url },
      })

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      })
    } catch (err: any) {
      console.error('[upload/avatar]', err)
      res.status(500).json({ error: err.message || 'Upload failed' })
    }
  }
)

export default router