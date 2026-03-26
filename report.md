# Issue Report: Supabase Free Tier Inactivity Pause

## Description
Supabase Free Tier pauses projects after 7 days of inactivity. When paused, the database becomes unreachable, causing the dashboard to appear empty and providing a poor user experience.

## Impact
- All database-dependent features (Resources, Todos, Notes) fail.
- Users may perceive data loss (though data is safe, just inaccessible).
- First request after a pause suffers a ~30s "cold start" delay.

## Solution Implemented
We have implemented a dual-layer "Keep-Alive" strategy:

### Layer 1: Vercel Cron Job (Option A)
- **Schedule**: Every 3 days (`0 0 */3 * *`).
- **Endpoint**: `api/keep-alive.js`.
- **Action**: Performs a lightweight `SELECT 1` query on the `resources` table to simulate activity.
- **Security**: Protected by a `CRON_SECRET` Bearer token.

### Layer 2: External Monitoring (Option B)
- **Endpoint**: `api/health.js`.
- **Action**: A lightweight JSON response to provide a target for external monitors like UptimeRobot or Pulsetic.
- **Recommendation**: Set up a free monitor at [UptimeRobot](https://uptimerobot.com/) pointing to `/api/health` every 5 minutes for maximum reliability.

## Deployment Requirements
The following Environment Variables MUST be set in Vercel:
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON`
- `VITE_CLERK_KEY` (Used in `main.jsx`)
- `DATABASE_URL` (Pooling) & `DIRECT_URL` (Direct)
- `CRON_SECRET`

**Status**: Fixed & Ready for Push.
