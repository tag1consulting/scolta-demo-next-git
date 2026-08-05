/**
 * The widget must post to the URL this app serves, not to one it redirects.
 *
 * The defect these guard against is a request count, not a broken feature. With
 * `trailingSlash: true` and scolta.js's bare defaults, every AI operation became
 *
 *     POST /api/scolta/v1/expand-query      308
 *     POST /api/scolta/v1/expand-query/     200
 *
 * Two HTTP requests where one would do, and a pair that reads like two complete
 * AI calls. Asserting only that a summary eventually arrives would pass in both
 * the fixed and the broken state, so these assert the URL is the canonical one,
 * which is exactly the property that makes the count one instead of two.
 */

import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import nextConfig from "../next.config.mjs";
import { AI_ROUTES, TRAILING_SLASH, aiEndpoints, scoltaEndpoints } from "../lib/endpoints.js";

const ROOT = join(__dirname, "..");

/** The directory each endpoint key is mounted from. */
const ROUTE_DIRS: Record<keyof typeof AI_ROUTES, string> = {
  expand: "expand-query",
  summarize: "summarize",
  followup: "followup",
};

describe("the endpoints handed to the browser widget", () => {
  it("issues one request per endpoint by naming the canonical URL", () => {
    // Under trailingSlash the canonical URL is the slash-suffixed one. Naming it
    // is what removes the 308, and therefore the second request.
    expect(TRAILING_SLASH).toBe(true);
    for (const [key, url] of Object.entries(scoltaEndpoints())) {
      expect(url, `${key} must not be the bare form, which costs a 308`).toMatch(/\/$/);
    }
  });

  it("never hands over a URL that this app would redirect", () => {
    const endpoints = scoltaEndpoints();
    for (const [key, url] of Object.entries(endpoints)) {
      const bare = AI_ROUTES[key as keyof typeof AI_ROUTES];
      const canonical = TRAILING_SLASH ? `${bare}/` : bare;
      expect(url).toBe(canonical);
    }
  });

  it("follows next.config rather than hardcoding the slash", () => {
    // A future change to trailingSlash has to move these with it, or the same
    // redirect reappears in the other direction.
    expect(aiEndpoints(true).expand).toBe("/api/scolta/v1/expand-query/");
    expect(aiEndpoints(false).expand).toBe("/api/scolta/v1/expand-query");
    expect(TRAILING_SLASH).toBe(nextConfig.trailingSlash === true);
  });

  it("names every key scolta.js reads, under the names it reads them by", () => {
    // The widget's key for expand-query is `expand`; a mismatch here would
    // silently fall back to the bare default and restore the redirect.
    expect(Object.keys(scoltaEndpoints()).sort()).toEqual(["expand", "followup", "summarize"]);
  });

  it("points at route handlers that exist", () => {
    for (const [key, dir] of Object.entries(ROUTE_DIRS)) {
      const route = join(ROOT, "app", "api", "scolta", "v1", dir, "route.ts");
      expect(existsSync(route), `${key} names ${dir}, which has no route.ts`).toBe(true);
      expect(AI_ROUTES[key as keyof typeof AI_ROUTES]).toBe(`/api/scolta/v1/${dir}`);
    }
  });
});
