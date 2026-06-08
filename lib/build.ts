/**
 * Build the GitMastery Pagefind index from the content source using the
 * in-process TS indexer (via scolta-next). Used by `scripts/build-index.ts`
 * (the `scolta:build` script) and by the test suite (with temp dirs).
 */

import { buildIndex, NextScoltaConfig, type NextScoltaConfigInit } from "scolta-next";
import { getConfig, scoltaConfigInit } from "./config.js";
import { GitMasterySource } from "./source.js";

export interface BuildOpts {
  mode?: "fresh" | "resume" | "restart";
  force?: boolean;
  configOverrides?: Partial<NextScoltaConfigInit>;
  logger?: { info(m: string, ...a: unknown[]): void; warn(m: string, ...a: unknown[]): void; error(m: string, ...a: unknown[]): void };
}

export async function buildGitMasteryIndex(opts: BuildOpts = {}) {
  const config = opts.configOverrides
    ? NextScoltaConfig.fromEnv({ ...scoltaConfigInit, ...opts.configOverrides })
    : getConfig();
  return buildIndex(config, {
    source: new GitMasterySource(),
    mode: opts.mode,
    force: opts.force,
    logger: opts.logger,
  });
}
