import { NextResponse, NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

export function middleware(request: NextRequest) {
  // Get the locale from cookies
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  // If no cookie, try to detect from headers or use default
  if (!cookieLocale) {
    const acceptLanguage = request.headers.get('accept-language');
    let preferredLocale = defaultLocale;

    if (acceptLanguage) {
      const detected = acceptLanguage
        .split(',')
        .map((lang) => lang.split(';')[0].split('-')[0])
        .find((lang) => locales.includes(lang as any));
      
      if (detected) {
        preferredLocale = detected as any;
      }
    }

    // Redirect to set the cookie if needed, or just proceed and set it in the response
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', preferredLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - images (public images)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
