import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function calculateEndDate(startDate: Date, duration: number): Date {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + duration)
  return endDate
}

export function getDurationText(days: number): string {
  if (days === 1) return '1 Day'
  if (days < 7) return `${days} Days`
  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7
  if (remainingDays === 0) return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`
  return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'} ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone: string): boolean {
  const re = /^[\d\s\-\+\(\)]+$/
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10
}
