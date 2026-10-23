import { createServerFn } from '@tanstack/react-start'
import { endSession, isAdminRequest, safeEqual, startSession } from './session'

export const getIsAdmin = createServerFn({ method: 'GET' }).handler(() => isAdminRequest())

export const login = createServerFn({ method: 'POST' })
  .validator((data: { password: string }) => data)
  .handler(({ data }) => {
    const expected = process.env.ADMIN_PASSWORD
    if (!expected || !safeEqual(data.password, expected)) {
      throw new Error('Wrong password')
    }
    startSession()
  })

export const logout = createServerFn({ method: 'POST' }).handler(() => {
  endSession()
})
