# Changelog

## Unreleased

- Port the GitMastery theme (from the Django/Drupal demos) to feature parity:
  sticky header with brand + collapsible language switcher, sidebar section nav
  with active-page highlighting, hero + section grid on the home page, themed
  per-type article rendering with the `.doc-meta` badge row, and the full
  `globals.css` (Inter + Fira Code, Git-orange accent, GitHub-dark code blocks).
- Move the Scolta search widget into the home-page main content (matching the
  Drupal/Django demos) and render it with the themed `.home-search` container.
- Enable Scolta AI out of the box via `ai_provider: "amazee"` — a free LiteLLM
  trial is auto-provisioned on first use (no key). Set `SCOLTA_AI_PROVIDER` +
  `SCOLTA_API_KEY` (gitignored `.ddev/config.local.yaml`) to use a custom
  provider instead.
