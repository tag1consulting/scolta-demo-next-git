# Changelog

## Unreleased

- Port the GitMastery theme (from the Django/Drupal demos) to feature parity:
  sticky header with brand + collapsible language switcher, sidebar section nav
  with active-page highlighting, hero + section grid on the home page, themed
  per-type article rendering with the `.doc-meta` badge row, and the full
  `globals.css` (Inter + Fira Code, Git-orange accent, GitHub-dark code blocks).
- Move the Scolta search widget into the global header (`.site-header__inner`)
  on every page, matching the Drupal/Django demos, with the results/AI panel
  overlaid as a dropdown. The client `Search` component derives the active
  content language from the route (EN at `/<slug>/`, translations at
  `/<lang>/<slug>/`) and injects it as `currentLanguage`, and `auto_language_filter`
  is enabled, so search results and the AI overview lock to that page's language.
- Serve a real production build in ddev: the post-start hook runs `npm run build`
  (Pagefind index + runtime assets via `postbuild`) and the web daemon runs
  `next start` instead of `next dev`. `NODE_ENV` is no longer pinned to
  `development` (which made `next build` mix the dev/prod React server runtimes
  and fail client-component prerender); `next build`/`next start` default to
  production on their own.
- Enable Scolta AI out of the box via `ai_provider: "amazee"` — a free LiteLLM
  trial is auto-provisioned on first use (no key). Set `SCOLTA_AI_PROVIDER` +
  `SCOLTA_API_KEY` (gitignored `.ddev/config.local.yaml`) to use a custom
  provider instead.
