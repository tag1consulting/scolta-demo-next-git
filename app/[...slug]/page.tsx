import { notFound } from "next/navigation";
import { allSlugParams, pageBySlugSegments } from "../../lib/content";

export function generateStaticParams() {
  return allSlugParams();
}

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const page = pageBySlugSegments(params.slug);
  if (!page) notFound();
  return (
    <article lang={page.language}>
      <h1>{page.title}</h1>
      {page.section ? <p><em>{page.section} · {page.difficulty}</em></p> : null}
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </article>
  );
}
