import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN')
  return `₹${formatter.format(amount)}`
}

export function formatCountdown(totalSeconds: number): {
  d: number
  h: number
  m: number
  s: number
} {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return { d, h, m, s }
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}
