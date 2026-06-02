'use server'
import { cookies } from 'next/headers'

export async function getServerCookies(key: string) {
  return (await cookies()).get(key)?.value || ''
}

export async function storeServerCookies(key: string, plaintext: string) {
  (await cookies()).set({
    name: key,
    value: plaintext,
    maxAge: 60 * 60 * 24, // 1 day
  })
}

export async function removeServerCookies(key: string) {
  (await cookies()).delete(key)
}