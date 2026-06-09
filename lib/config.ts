/**
 * Scolta configuration for the GitMastery demo — feature-parity with the Drupal
 * and Django demos: the `reference` preset, five AI languages, and section /
 * difficulty / language facet filters.
 */

import { NextScoltaConfig, type NextScoltaConfigInit } from "scolta-next";

export const scoltaConfigInit: NextScoltaConfigInit = {
  source: "content",
  site_name: "GitMastery",
  site_description: "Git documentation reference",
  preset: "reference",
  // Auto-enable Scolta AI with no key: provision a free Amazee.ai LiteLLM trial
  // on first use (parity with the Drupal/Django demos). Override with an
  // explicit provider/key via SCOLTA_AI_PROVIDER + SCOLTA_API_KEY (env wins).
  ai_provider: "amazee",
  ai_languages: ["en", "es", "fr", "it", "de"],
  filter_fields: ["section", "difficulty", "language"],
  filter_field_descriptions: {
    section: "Documentation section (Getting Started, Core Concepts, Advanced Workflows, Comparisons, Tips)",
    difficulty: "Difficulty level (Beginner, Intermediate, Advanced)",
    language: "Content language (en, es, fr, it, de)",
  },
  results_per_page: 12,
  stateDir: ".scolta",
  outputDir: "public",
  assetsPublicPath: "/scolta",
};

/** Resolve the demo config (env merged under the static config). */
export function getConfig(): NextScoltaConfig {
  return NextScoltaConfig.fromEnv(scoltaConfigInit);
}
