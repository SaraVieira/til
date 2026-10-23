import { createHmac, timingSafeEqual } from 'node:crypto'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'

const COOKIE = 'til-session'
const MAX_AGE = 60 * 60 * 24 * 30

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters')
  }
  return value
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function startSession() {
  const expires = String(Date.now() + MAX_AGE * 1000)
  setCookie(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function endSession() {
  deleteCookie(COOKIE, { path: '/' })
}

export function isAdminRequest() {
  const [expires, signature] = getCookie(COOKIE)?.split('.') ?? []
  if (!expires || !signature) return false
  return safeEqual(signature, sign(expires)) && Number(expires) > Date.now()
}

export function assertAdmin() {
  if (!isAdminRequest()) throw new Error('Unauthorized')
}
