/** Content source mapping + config round-trip + AI route wiring. */

import { describe, expect, it } from "vitest";
import { ContentItem } from "scolta";
import { createScoltaRouteHandlers, NextScoltaConfig } from "scolta-next";
import { GitMasterySource, toContentItem } from "../lib/source.js";
import { aboutPage, loadEnglishDocs } from "../lib/content.js";
import { getConfig, scoltaConfigInit } from "../lib/config.js";

describe("content source", () => {
  it("maps a page to a ContentItem with locale + facet filters", () => {
    const doc = loadEnglishDocs()[0]!;
    const item = toContentItem(doc);
    expect(item).toBeInstanceOf(ContentItem);
    expect(item.language).toBe("en");
    expect(item.siteName).toBe("GitMastery");
    expect(item.filters["section"]).toBe(doc.section);
    expect(item.filters["difficulty"]).toBe(doc.difficulty);
  });

  it("omits empty facet filters (e.g. the About page)", () => {
    const item = toContentItem(aboutPage());
    expect("section" in item.filters).toBe(false);
    expect("difficulty" in item.filters).toBe(false);
  });

  it("enumerate yields the full corpus", () => {
    const items = [...new GitMasterySource().enumerate()];
    expect(items.length).toBe(1426);
    expect(items.every((i) => i instanceof ContentItem)).toBe(true);
  });
});

describe("config round-trip", () => {
  it("reflects the reference preset + 5 languages + facet filters", () => {
    const config = getConfig();
    expect(config.scolta.preset).toBe("reference");
    expect(config.scolta.ai_languages).toEqual(["en", "es", "fr", "it", "de"]);
    expect(config.scolta.filter_fields).toEqual(["section", "difficulty", "language"]);
    expect(config.scolta.recency_strategy).toBe("none"); // from the reference preset
    expect(config.scolta.results_per_page).toBe(12);
  });

  it("browser config reflects the SAVED values (Release Gate family 4)", () => {
    const b = getConfig().toBrowserConfig();
    expect(b["siteName"]).toBe("GitMastery");
    expect((b["scoring"] as any)["RESULTS_PER_PAGE"]).toBe(12);
    expect((b["scoring"] as any)["AI_LANGUAGES"]).toEqual(["en", "es", "fr", "it", "de"]);
  });

  it("scoltaConfigInit is content mode", () => {
    expect(scoltaConfigInit.source).toBe("content");
  });
});

describe("AI route wiring", () => {
  it("expand-query degrades gracefully when AI is unconfigured", async () => {
    // With an explicit provider and no key (the Amazee auto-provisioning default
    // is bypassed here for determinism), expansion must degrade to the original
    // query (HTTP 200), never error — proving the route is correctly wired.
    const noAiConfig = NextScoltaConfig.fromObject({
      ...scoltaConfigInit,
      ai_provider: "anthropic",
      ai_api_key: "",
    });
    const h = createScoltaRouteHandlers(noAiConfig, { logger: { error() {} } });
    const res = await h.expandQuery(
      new Request("http://x/api/scolta/v1/expand-query", { method: "POST", body: JSON.stringify({ query: "rebase" }) }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    // The route sends the raw payload (no {ok,data} envelope), matching scolta.js.
    expect(json.terms).toEqual(["rebase"]);
  });

  it("health is status-only by default (no config disclosure)", async () => {
    const h = createScoltaRouteHandlers(getConfig(), { logger: { error() {} } });
    const json = await (await h.health(new Request("http://x/api/scolta/v1/health"))).json();
    expect(json.status).toBeTruthy();
    expect(json.scoring).toBeUndefined();
  });

  it("health reflects saved scoring when healthDetail is on", async () => {
    const detailed = NextScoltaConfig.fromObject({ ...scoltaConfigInit, healthDetail: true });
    const h = createScoltaRouteHandlers(detailed, { logger: { error() {} } });
    const json = await (await h.health(new Request("http://x/api/scolta/v1/health"))).json();
    expect(json.scoring.RESULTS_PER_PAGE).toBe(12);
  });
});
