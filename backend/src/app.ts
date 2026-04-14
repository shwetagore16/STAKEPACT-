import cors from 'cors'
import express from 'express'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? '*' }))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'stakepact-backend',
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

/*
import educationRouter from './domains/education/router'
import corporateRouter from './domains/corporate/router'
import legalRouter from './domains/legal/router'
import governmentRouter from './domains/government/router'
import personalRouter from './domains/personal/router'

app.use('/api/v1/education', educationRouter)
app.use('/api/v1/corporate', corporateRouter)
app.use('/api/v1/legal', legalRouter)
app.use('/api/v1/government', governmentRouter)
app.use('/api/v1/personal', personalRouter)
*/

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

export default app
