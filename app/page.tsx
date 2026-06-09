import { loadEnglishDocs, sectionNav } from "../lib/content";

export default function Home() {
  const docs = loadEnglishDocs();
  const sections = sectionNav();

  return (
    <>
      <article className="prose hero">
        <h1>GitMastery</h1>
        <p>Master Git with {docs.length} pages of reference docs in five languages.</p>
        <p className="hero__hint">
          Try searching: <em>undo my last commit</em>, <em>how to delete a branch</em>,{" "}
          <em>slow git</em>.
        </p>
      </article>

      <div className="section-grid">
        {sections.map((s) => (
          <section className="section-card" key={s.section}>
            <h2>{s.section}</h2>
            <p className="section-card__count">{s.pages.length} page(s)</p>
            <ul>
              {s.pages.slice(0, 6).map((p) => (
                <li key={p.url}>
                  <a href={p.url}>{p.title}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
