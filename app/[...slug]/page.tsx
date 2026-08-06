import { notFound } from "next/navigation";
import { allSlugParams, pageBySlugSegments } from "../../lib/content";

export function generateStaticParams() {
  return allSlugParams();
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = pageBySlugSegments(slug);
  if (!page) notFound();

  const isDoc = page.type !== "about";

  return (
    <article className={`prose ${page.type}`} lang={page.language}>
      <h1>{page.title}</h1>
      {isDoc && (page.section || page.difficulty || page.gitVersion) ? (
        <div className="doc-meta">
          {page.section ? <span className="badge badge--section">{page.section}</span> : null}
          {page.difficulty ? <span className="badge badge--difficulty">{page.difficulty}</span> : null}
          {page.gitVersion ? <span className="badge badge--version">Git {page.gitVersion}</span> : null}
        </div>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </article>
  );
}
