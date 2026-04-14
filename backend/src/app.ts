import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'express-async-errors'
import educationRouter from './domains/education/education.routes'
import corporateRouter from './domains/corporate/corporate.routes'
import legalRouter from './domains/legal/legal.routes'
import governmentRouter from './domains/government/government.routes'
import personalRouter from './domains/personal/personal.routes'
import pactsRouter from './shared/routes/pacts.routes'
import usersRouter from './shared/routes/users.routes'
import proofRouter from './shared/routes/proof.routes'
import { errorMiddleware } from './shared/middleware/error.middleware'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))

app.use('/api/education', educationRouter)
app.use('/api/corporate', corporateRouter)
app.use('/api/legal', legalRouter)
app.use('/api/government', governmentRouter)
app.use('/api/personal', personalRouter)
app.use('/api/pacts', pactsRouter)
app.use('/api/users', usersRouter)
app.use('/api/proof', proofRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

app.use(errorMiddleware)

export default app
