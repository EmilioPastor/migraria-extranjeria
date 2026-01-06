import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr'; // OPCIONAL: para mejor integración

// Opción A: Cliente estándar (si funciona tu app actual)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,        // ← CRÍTICO: mantener sesión
      autoRefreshToken: true,      // ← CRÍTICO: refrescar tokens automáticamente
      detectSessionInUrl: true,    // ← Para flujos OAuth
      // storage: window.localStorage, // Por defecto ya usa localStorage
      // O si quieres forzar cookies:
      // storage: {
      //   getItem: (key) => document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop() || null,
      //   setItem: (key, value) => document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`,
      //   removeItem: (key) => document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      // }
    }
  }
);

// Opción B: Cliente SSR (recomendado para Next.js 14)
// export const supabase = createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   {
//     auth: {
//       persistSession: true,
//       autoRefreshToken: true,
//     }
//   }
// );