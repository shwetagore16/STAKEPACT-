import type { NextFunction, Request, Response } from 'express'

type AppError = Error & {
  statusCode?: number
  code?: string
}

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const appError = err as AppError
  const statusCode = appError.statusCode ?? 500
  const code = appError.code ?? (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR')
  const message = appError.message || 'Internal server error'

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error('[errorMiddleware]', appError.stack || appError)
  }

  return res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal server error' : message,
    code,
  })
}
