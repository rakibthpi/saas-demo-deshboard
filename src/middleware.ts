import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('saas_auth_token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                   request.nextUrl.pathname.startsWith('/register')

  if (!authToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
