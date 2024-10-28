import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = ['/', '/transaction_history/', '/game', '/terms_services',
  '/profile', '/fight_schedule', '/cashin', '/cashout']
const publicRoutes = ['/login', '/register', '/payment/success', '/payment/failed']


const middleware = async(req)=> {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookieStore = await cookies();
  var session = cookieStore.get("session")?.value;

  try {
      session = JSON.parse(session)
  } catch (error) {
    
  }
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  return NextResponse.next();
}

const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/((?!.*\\.).*)',
  ]

}

export {
  middleware,
  config
}