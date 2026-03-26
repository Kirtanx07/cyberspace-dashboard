# Fix: Supabase Inactivity Pause

### Issue
Supabase Free Tier pauses projects after 7 days of inactivity. This causes the frontend to display empty dashboards and the backend to throw connection errors.

### Solution (Layered Implementation)
1. **Infrastructure (Cron)**: A Vercel Cron Job triggers every 3 days (`0 0 */3 * *`).
2. **Logic (Ping)**: `GET /api/keep-alive` executes a `SELECT id` query on the `resources` table via `@supabase/supabase-js`.
3. **Security**: The endpoint is protected by a `CRON_SECRET` environment variable (sent as a Bearer token by Vercel).
4. **UI Resilience**: A Zustand `useHealthStore` tracks if the DB is "down" (e.g., during a cold start) to show a "System Warming Up" banner.

### Environment Variables Required (Vercel)
- `CRON_SECRET`: Generate a random string in Vercel Project Settings.
- `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key.
- `DATABASE_URL`: (Optional) Transaction-mode URL if using Prisma in the future.
