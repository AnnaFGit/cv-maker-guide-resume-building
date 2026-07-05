# Project Rules - CV Maker Guide

- **Static export only**: No server runtime, no backend database, no login, no dynamic routes. All pages statically exported.
- **Warm Editorial design system**: Use the warm editorial tokens (cream backgrounds, Hanken Grotesk body, Newsreader headings, Spline Sans Mono micro-labels, and terracotta accents).
- **Accessibility (WCAG AA)**: 
  - Ensure micro-labels are >= 11px.
  - Every input must have a real `<label for="...">`.
  - Contrasts verified: `--muted-2` #776B5B is used on `--surface` / `--paper` (meets 4.5:1), and `--accent-text` #A8431F is used for small text/links (never the #B9502E fill-only accent).
- **Single-column, ATS-safe templates only**: Editorial, Classic, Compact. No two-column, sidebars, tables, or text-in-images.
- **PDF Export**: Must use text-based jsPDF (selectable, ATS-readable) for Editorial and Classic templates. Compact template uses html2canvas fallback where styling requires it. Never call `window.print()` in-app; use native bridge postMessage.
- **AdSense & Consent**: Use Google-certified CMP (Privacy & Messaging configured in AdSense dashboard). Load script via head in layout. AdSlot components must trigger `(adsbygoogle = window.adsbygoogle || []).push({})` on route changes, guard double-push, and render nothing offline.
- **Route Outbound Links**: External/affiliate links must route through `bridge.openExternal(url)` in-app to open in SFSafariViewController, or normal `window.open` in browser.
- **Offline / PWA**: Serwist/Workbox based Service Worker. Web manifest configured.
