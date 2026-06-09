import type { ReactNode } from "react";
import "./globals.css";
import { sectionNav, translatableSlugs } from "../lib/content";
import LanguageSwitcher from "./_components/LanguageSwitcher";
import SidebarNav from "./_components/SidebarNav";

export const metadata = {
  title: "GitMastery",
  description: "GitMastery — multilingual Git documentation with Scolta AI search.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const sections = sectionNav();
  const translatable = translatableSlugs();
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>

        <header className="site-header">
          <div className="site-header__inner">
            <a className="site-brand" href="/">
              <span className="site-brand__mark">⎇</span>
              <span className="site-brand__name">GitMastery</span>
            </a>
            <LanguageSwitcher translatable={translatable} />
          </div>
        </header>

        <div className="layout">
          <SidebarNav sections={sections} />
          <main id="main" className="content">
            {children}
          </main>
        </div>

        <footer className="site-footer">
          <p>
            GitMastery is a fictional demo by <a href="https://tag1.com">Tag1 Consulting</a>,
            showcasing <a href="https://tag1.com/scolta">Scolta</a> AI search on Next.js.
          </p>
        </footer>
      </body>
    </html>
  );
}
