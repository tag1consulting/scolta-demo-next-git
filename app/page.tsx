import { loadEnglishDocs } from "../lib/content";

export default function Home() {
  const docs = loadEnglishDocs();
  const sections = [...new Set(docs.map((d) => d.section))].filter(Boolean);
  return (
    <div>
      <h1>GitMastery</h1>
      <p>Master Git with {docs.length} pages of reference docs in five languages.</p>
      <h2>Sections</h2>
      <ul>
        {sections.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p>
        <a href="/about/">About this demo</a>
      </p>
    </div>
  );
}
