import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
        },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
          });
          },
          remove(name, options) {
            response.cookies.delete({
              name,
              ...options,
            });
        },
      },
      }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

    // Allow access to API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return response;
    }

    // Allow access to auth routes
    if (request.nextUrl.pathname.startsWith('/auth/')) {
      return response;
    }

    
    // Allow access to test routes
    if (request.nextUrl.pathname.startsWith('/test/')) {
      return response;
    }

    // Redirect unauthenticated users to login page
    if (!user && request.nextUrl.pathname !== '/') {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}
