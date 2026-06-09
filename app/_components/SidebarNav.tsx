"use client";

/**
 * Documentation section nav (parity with the Django `.sidebar` / `section_nav`).
 * Collapsible <details> per section; the section containing the active page (and
 * the first section) start open, and the active page link is highlighted.
 */

import { usePathname } from "next/navigation";

export interface NavLink {
  title: string;
  url: string;
}
export interface NavSection {
  section: string;
  pages: NavLink[];
}

function norm(p: string): string {
  return ("/" + p.replace(/^\/|\/$/g, "") + "/").replace(/\/+/g, "/");
}

export default function SidebarNav({ sections }: { sections: NavSection[] }) {
  const pathname = norm(usePathname() ?? "/");

  return (
    <aside className="sidebar" aria-label="Documentation sections">
      {sections.map((s, i) => {
        const hasActive = s.pages.some((p) => norm(p.url) === pathname);
        return (
          <details className="nav-section" key={s.section} open={i === 0 || hasActive}>
            <summary>{s.section}</summary>
            <ul>
              {s.pages.map((p) => (
                <li key={p.url} className={norm(p.url) === pathname ? "is-active" : ""}>
                  <a href={p.url}>{p.title}</a>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </aside>
  );
}
