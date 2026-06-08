# GitMastery (Next.js) — Multilingual Git Documentation Site

A comprehensive Git documentation site built on **Next.js**, showcasing
[Scolta](https://tag1consulting.com/scolta) AI-powered search across **1,426
pages in 5 languages** (EN/ES/FR/IT/DE).

This is the Next.js port of the Drupal [`git-manual`](../git-manual) and
Django/Wagtail [`git-manual-django`](../git-manual-django) demos, built on the
[`scolta`](../../packages/scolta-node) binding (the TS in-process Pagefind
indexer) and [`scolta-next`](../../packages/scolta-next) (the Next.js adapter).
It has feature parity: the same content, the same five languages, the same
Scolta configuration, and **URL-compatible slugs** with both other demos.

## Content

The corpus in `content/` is identical to the Drupal/Django demos' YAML: 285
English docs (Getting Started / Core Concepts / Advanced Workflows / Comparisons
/ Tips) + 1 About page, each translated into es/fr/it/de — 1,426 indexable
pages. See [`SOURCES.md`](./SOURCES.md) for provenance.

URLs match the other demos: English docs at `/<slug>/` (slug =
Django-compatible `slugify(title)`), translations at `/<lang>/<slug>/`, About at
`/about/`.

## Quick start

```bash
npm install --legacy-peer-deps   # peers (next/react) are not auto-pulled
npm run build                    # next build
npm run scolta:build             # build the Pagefind index (content mode)
npm run dev                      # serve at http://localhost:3000
```

For live AI overviews, set `SCOLTA_API_KEY=sk-ant-...` in the environment. The
AI tier degrades gracefully without a key; full-text search always works.

`postbuild` runs `scolta:assets` (copies the vendored runtime bundle into
`public/scolta/`) and `scolta:build` (writes `public/pagefind/`).

## How it works

- `lib/content.ts` — loads the YAML corpus and derives slugs/URLs identically to
  the Drupal/Django importers (full URL parity).
- `lib/source.ts` — a Scolta **content source**: each page → a `ContentItem`
  with the per-page locale as the `language` facet and `section`/`difficulty`
  filters.
- `lib/config.ts` — the Scolta config (`reference` preset, five AI languages,
  facet filters), shared by the build, the API routes, and the search widget.
- `app/api/scolta/v1/*` — the AI Route Handlers (expand/summarize/followup +
  health) from `scolta-next`.
- `components/Search.tsx` — `<ScoltaSearch>` mounting the shared widget.

## Tests

```bash
npm test          # vitest: content parity, URL derivation, content source,
                  # full index build (1,426 pages, 5 language facets), config
npm run typecheck # tsc on the Scolta integration (lib/components)
npm run lint      # eslint
```
