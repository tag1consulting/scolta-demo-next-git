import type { ReactNode } from "react";
import { getConfig } from "../lib/config";
import Search from "../components/Search";

export const metadata = { title: "GitMastery", description: "Git documentation reference" };

export default function RootLayout({ children }: { children: ReactNode }) {
  const browserConfig = getConfig().toBrowserConfig();
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
          <a href="/"><strong>GitMastery</strong></a>
          <Search config={browserConfig} />
        </header>
        <main style={{ maxWidth: 820, margin: "0 auto", padding: "1rem" }}>{children}</main>
      </body>
    </html>
  );
}
