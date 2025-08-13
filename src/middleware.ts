import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Skip middleware for API routes, _next, and static files
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/static') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if this is a custom domain (not your main app domain)
  const appDomain = process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace('http://', '') || 'localhost:3000'
  
  if (hostname !== appDomain && !hostname.includes('localhost') && !hostname.includes('vercel.app')) {
    // This is a custom domain request
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    try {
      // Look up the page associated with this custom domain
      const { data: page, error } = await supabase
        .from('pages')
        .select('slug')
        .eq('custom_domain', hostname)
        .eq('published', true)
        .single()

      if (error || !page) {
        // Custom domain not found, show 404
        return new NextResponse('Page not found', { status: 404 })
      }

      // Rewrite to the page route
      url.pathname = `/p/${page.slug}`
      return NextResponse.rewrite(url)

    } catch (error) {
      console.error('Custom domain lookup error:', error)
      return new NextResponse('Internal server error', { status: 500 })
    }
  }

  // For main domain, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
