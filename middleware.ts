import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  
  // Generate simple nonce using timestamp and random number
  const nonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`

  // Define CSP header with nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.branch.io https://api2.branch.io 'nonce-${nonce}';
    connect-src 'self' https://api2.branch.io https://cdn.branch.io;
    img-src 'self' data: blob: https://cdn.branch.io;
    style-src 'self' 'unsafe-inline';
    frame-src 'self' https://cdn.branch.io;
  `.replace(/\s{2,}/g, ' ').trim()

  // Set security headers
  const headers = new Headers(response.headers)
  headers.set('Content-Security-Policy', cspHeader)
  
  // Add nonce to response headers so we can access it in components
  headers.set('x-nonce', nonce)

  // Create new response with updated headers
  const newResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })

  return newResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}