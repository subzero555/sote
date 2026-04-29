import 'dotenv/config'
import app from './app'

const PORT = parseInt(process.env.PORT || '4001', 10)

app.listen(PORT, () => {
  console.log(`Sote API running on port ${PORT}`)
})