"use client";

/**
 * Header language switcher (parity with the Django/Drupal `.language-switcher`).
 * Derives per-language URLs from the current path: EN at /<slug>/, translations
 * at /<lang>/<slug>/. Translation links are shown only for the translatable doc
 * pages (the About/home pages exist in English only). Collapses to a trigger
 * button on narrow viewports — the React port of theme/js/lang-switcher.js.
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LANGS = ["en", "de", "es", "fr", "it"] as const;
const TRANSLATION_LANGS = new Set(["es", "fr", "it", "de"]);

function parsePath(pathname: string): { lang: string; slug: string } {
  const segments = pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  if (segments.length > 0 && TRANSLATION_LANGS.has(segments[0]!)) {
    return { lang: segments[0]!, slug: segments.slice(1).join("/") };
  }
  return { lang: "en", slug: segments.join("/") };
}

export default function LanguageSwitcher({ translatable }: { translatable: string[] }) {
  const pathname = usePathname() ?? "/";
  const { lang: activeLang, slug } = parsePath(pathname);
  const hasTranslations = slug !== "" && translatable.includes(slug);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // On English-only pages, show just the active language.
  const langs = hasTranslations ? LANGS : (["en"] as readonly string[]);

  function urlFor(code: string): string {
    if (code === "en") return `/${slug}/`;
    return `/${code}/${slug}/`;
  }

  return (
    <nav
      ref={ref}
      className={`language-switcher${open ? " is-open" : ""}`}
      aria-label="Language"
    >
      <button
        type="button"
        className="lang-trigger"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {activeLang.toUpperCase()}
      </button>
      <ul className="language-switcher__list">
        {langs.map((code) => (
          <li key={code} className={code === activeLang ? "is-active" : ""}>
            <a
              href={urlFor(code)}
              hrefLang={code}
              {...(code === activeLang ? { "aria-current": "true" } : {})}
            >
              {code.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
