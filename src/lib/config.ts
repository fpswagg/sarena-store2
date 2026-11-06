/** Site settings from the environment (see .env.example). Server-only. */

function clean(value: string | undefined): string {
  return (value ?? '').trim()
}

export const config = {
  /** The SSS business shown by this site. */
  storeSlug: clean(process.env.SSS_STORE_SLUG) || 'sarena',
  /** SSS API origin, without a trailing slash. */
  apiUrl: (clean(process.env.SSS_API_URL) || 'https://sss-api.fpswagg.site').replace(/\/+$/, ''),
  /** Seconds before SSS data is fetched again. */
  revalidate: Math.max(30, Number(process.env.SSS_REVALIDATE) || 300),
  revalidateSecret: clean(process.env.REVALIDATE_SECRET),
  /** Public address of the site: never hard-coded, the domain will change. */
  siteUrl: (clean(process.env.SITE_URL) || 'http://localhost:3000').replace(/\/+$/, ''),
  /** Sign in with SSS for /dashboard. Empty client id = no dashboard. */
  oauthClientId: clean(process.env.SSS_OAUTH_CLIENT_ID),
  oauthClientSecret: clean(process.env.SSS_OAUTH_CLIENT_SECRET),
  /** The dashboard needs `business`: read and write in the business picked at sign-in. */
  oauthScope: 'profile email business',
  /** Encrypts the dashboard session cookie. At least 32 random characters in production. */
  sessionSecret: clean(process.env.SESSION_SECRET),
  /** Overrides the assistant key published with the showcase. */
  botKey: clean(process.env.SSS_BOT_KEY),
}

/** Cache tag on every SSS fetch: POST /api/revalidate clears it. */
export const SSS_TAG = 'sss'
