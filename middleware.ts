import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase session handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data: { user } } = await supabase.auth.getUser();

  // Admin route protection
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check user role from the database
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !profile || profile.role !== 'admin') {
      console.warn(`Unauthorized admin access attempt by user ${user.id}`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // i18n logic
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

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

    response.cookies.set('NEXT_LOCALE', preferredLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Error pages: 404, 500 etc
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
