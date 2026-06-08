"use client";

/**
 * GitMastery search box — mounts the shared Scolta widget via scolta-next's
 * <ScoltaSearch>. The browser config is passed from the server (the SAVED
 * config), so scoring/endpoints/filters reflect scolta.config exactly.
 */

import { ScoltaSearch } from "scolta-next/component";

export interface SearchProps {
  config: Record<string, unknown>;
}

export default function Search({ config }: SearchProps) {
  return <ScoltaSearch config={config} assetsPath="/scolta" pagefindPath="/pagefind/pagefind.js" />;
}
