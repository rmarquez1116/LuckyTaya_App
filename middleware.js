import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { base64UrlDecode } from "./app/helpers/Common";


const protectedRoutes = ['/', '/transaction_history/', '/game', '/terms_services',
  '/profile', '/fight_schedule', '/cashin', '/cashout']
const publicRoutes = ['/login', '/register', '/payment/success', '/payment/failed']


const middleware = async (req) => {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookieStore = await cookies();
  var session = cookieStore.get("session")?.value;

  try {
    session = JSON.parse(session)


  } catch (error) {

  }

  if (session) {
    const token = session.token.split('.')
    console.log(token,'-------------------========')
    if (token.length ==2 &&token[1] != "" && isTokenExpire(token[1])) {
      await cookieStore.delete("session");
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }
  if (isProtectedRoute && !session) {


    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
}

const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/((?!.*\\.).*)',
  ]

}

function isTokenExpire(token) {
  const details = base64UrlDecode(token)
  const currentDate = new Date();
  const tokenDetails = JSON.parse(details)
  const expiryDate = new Date(tokenDetails.exp * 1000)
  if (expiryDate < currentDate) {
    return true
  }
  return false;
}

export {
  middleware,
  config
}