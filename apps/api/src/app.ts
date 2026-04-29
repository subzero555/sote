import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes'
import listingsRoutes from './routes/listings.routes'

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://sote.kenyaproductindex.co.ke']
    : ['http://localhost:3001'],
  credentials: true,
}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'sote-api', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/listings', listingsRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

export default app