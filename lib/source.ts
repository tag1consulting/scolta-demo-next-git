/**
 * GitMastery content source for Scolta (content mode).
 *
 * Maps every loaded page to a `ContentItem`: the per-page locale drives the
 * language facet, and section/difficulty become filter facets. The binding adds
 * the `language` and `site` filters automatically from `language`/`siteName`.
 */

import { ContentItem } from "scolta";
import type { NextContentSource } from "scolta-next";
import { loadAllPages, type GitMasteryPage } from "./content.js";

export function toContentItem(page: GitMasteryPage): ContentItem {
  const filters: Record<string, string> = {};
  if (page.section) filters["section"] = page.section;
  if (page.difficulty) filters["difficulty"] = page.difficulty;
  return new ContentItem({
    id: page.id,
    title: page.title,
    bodyHtml: page.body,
    url: page.url,
    date: "",
    siteName: "GitMastery",
    language: page.language,
    filters,
  });
}

export class GitMasterySource implements NextContentSource {
  *enumerate(): Generator<ContentItem> {
    for (const page of loadAllPages()) {
      yield toContentItem(page);
    }
  }
}
