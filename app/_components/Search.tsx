"use client";

/**
 * GitMastery header search box — mounts the shared Scolta widget via
 * scolta-next's <ScoltaSearch>. The browser config is passed from the server
 * (the SAVED config), so scoring/endpoints/filters reflect scolta.config
 * exactly. The active content language is derived from the current route (EN at
 * /<slug>/, translations at /<lang>/<slug>/) and injected as a top-level
 * `currentLanguage`, which buildWindowScolta spreads into window.scolta so
 * scolta.js locks results + AI to that page's language (auto_language_filter).
 */

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ScoltaSearch } from "scolta-next/component";
import { scoltaEndpoints } from "../../lib/endpoints";

const TRANSLATION_LANGS = new Set(["es", "fr", "it", "de"]);

/** First path segment if it is a translation language, else "en". */
function localeFromPath(pathname: string): string {
  const segments = pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  if (segments.length > 0 && TRANSLATION_LANGS.has(segments[0]!)) return segments[0]!;
  return "en";
}

export interface SearchProps {
  config: Record<string, unknown>;
}

export default function Search({ config }: SearchProps) {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPath(pathname);

  // Inject the per-page language as the authoritative signal for the widget,
  // and the AI endpoints this app actually serves. Without the latter the widget
  // posts to scolta.js's bare defaults, `trailingSlash: true` answers each with a
  // 308 to the slash-suffixed form, and every AI operation costs two round trips
  // and looks like two calls.
  const localizedConfig = useMemo(
    () => ({ ...config, currentLanguage: locale, endpoints: scoltaEndpoints() }),
    [config, locale],
  );

  // Keep <html lang> in sync for a11y/SEO; currentLanguage is what the widget reads.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <ScoltaSearch
      config={localizedConfig}
      assetsPath="/scolta"
      pagefindPath="/pagefind/pagefind.js"
    />
  );
}
