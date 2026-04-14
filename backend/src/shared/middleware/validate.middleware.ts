import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)

    if (!parsed.success) {
      const fields = parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))

      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        fields,
      })
    }

    req.body = parsed.data
    next()
  }
}
