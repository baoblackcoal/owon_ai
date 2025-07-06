import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
        },
        set(name, value, options) {
          document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}`;
        },
        remove(name) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
    }
  );
}
