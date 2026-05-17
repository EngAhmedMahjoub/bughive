/**
 * Returns the canonical site URL with no trailing slash.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL  – set explicitly per environment (production)
 *   2. VERCEL_URL            – auto-injected by Vercel on every deployment
 *                              (covers preview deploys without manual config)
 *   3. http://localhost:3000 – local dev fallback
 *
 * Used by metadata, JSON-LD, sitemap.ts, and robots.ts so every canonical
 * URL is consistent.
 */
export const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};
