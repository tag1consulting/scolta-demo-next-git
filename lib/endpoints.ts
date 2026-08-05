/**
 * The AI endpoint URLs the browser widget posts to.
 *
 * scolta.js defaults to the bare paths (`/api/scolta/v1/expand-query` and so
 * on), which is right for every port whose server treats that as the canonical
 * URL. This app sets `trailingSlash: true`, so Next canonicalises those paths to
 * their slash-suffixed form and answers the bare one with a 308. The widget's
 * fetch follows the redirect, which works, but it means every AI operation costs
 * two HTTP round trips instead of one and shows up in devtools as
 *
 *     POST /api/scolta/v1/expand-query      308
 *     POST /api/scolta/v1/expand-query/     200
 *
 * a pair that reads convincingly like two complete AI calls. It is not: a 308 is
 * answered by the router before any handler runs, so exactly one generation
 * happens. The cost is the extra round trip, and the cost of the appearance was
 * a bug report.
 *
 * The fix is to hand the widget the URLs this app actually serves. scolta.js
 * already supports `window.scolta.endpoints`, so this is configuration, not a
 * change to shared browser code: the other ports keep the bare defaults, which
 * are correct for them.
 */

import nextConfig from "../next.config.mjs";

/**
 * The AI routes, exactly as `app/api/scolta/v1/<name>/route.ts` mounts them.
 *
 * Keys are the names scolta.js reads off `window.scolta.endpoints`; they are
 * deliberately not the directory names, because the widget's key for
 * `expand-query` is `expand`.
 */
export const AI_ROUTES = {
  expand: "/api/scolta/v1/expand-query",
  summarize: "/api/scolta/v1/summarize",
  followup: "/api/scolta/v1/followup",
} as const;

export type AiEndpointKey = keyof typeof AI_ROUTES;

/**
 * The canonical URL of each AI route under a given trailing-slash setting.
 *
 * Derived from the setting rather than hardcoded with slashes, so that flipping
 * `trailingSlash` in next.config.mjs moves these with it instead of silently
 * reintroducing the redirect in the other direction.
 */
export function aiEndpoints(trailingSlash: boolean): Record<AiEndpointKey, string> {
  const suffix = trailingSlash ? "/" : "";
  return {
    expand: `${AI_ROUTES.expand}${suffix}`,
    summarize: `${AI_ROUTES.summarize}${suffix}`,
    followup: `${AI_ROUTES.followup}${suffix}`,
  };
}

/** Whether this app canonicalises URLs with a trailing slash. */
export const TRAILING_SLASH: boolean = nextConfig.trailingSlash === true;

/** The endpoints for this app, as handed to the widget. */
export function scoltaEndpoints(): Record<AiEndpointKey, string> {
  return aiEndpoints(TRAILING_SLASH);
}
