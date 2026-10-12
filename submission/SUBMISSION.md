# Submission pack — Sundanese (Canva App)

Everything needed to submit the app for review in the Canva Developer Portal.

## 1. Visual assets (ready)

| Asset | File | Spec (Canva requirement) | Status |
| --- | --- | --- | --- |
| App icon | `submission/app-icon-512.png` | 512 × 512, 1:1, full-bleed, no transparency, no corner radius | ✅ 512×512, RGB (no alpha) |
| Featured image | `submission/featured-image-2400x1800.png` | 2400 × 1800, 4:3 | ✅ 2400×1800, RGB (no alpha) |

- Source files: `submission/app-icon.html` and `submission/featured-image.html`.
- Re-render after editing either source:

  ```bash
  CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
  cd submission
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 \
    --window-size=512,512 \
    --screenshot="$(pwd)/app-icon-512.png" \
    "file://$(pwd)/app-icon.html"

  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 \
    --window-size=2400,1800 \
    --screenshot="$(pwd)/featured-image-2400x1800.png" \
    "file://$(pwd)/featured-image.html"
  ```

> **Note**: the icons are rendered with the bundled Noto Sans Sundanese font so
> the Sundanese glyphs render correctly. The font is SIL OFL 1.1 (`assets/OFL.txt`).

## 2. Support and policy pages (ready)

Static site in `support-pages/`:

- `index.html` — landing
- `support.html` — how to use + contact
- `privacy.html` — no data collection
- `terms.html` — terms of use
- `style.css`

**Hosted on GitHub Pages** (enabled with the included workflow):

- Repo: https://github.com/Elwyun/Sundanese
- Support: https://elwyun.github.io/Sundanese/support.html
- Privacy: https://elwyun.github.io/Sundanese/privacy.html
- Terms: https://elwyun.github.io/Sundanese/terms.html

Paste the three URLs into the Developer Portal under **Release → App listing
details → App support and links**.

How it works: `.github/workflows/deploy-pages.yml` publishes `support-pages/`
on every push to `main` (Pages → Source: GitHub Actions). To re-publish, push a
change under `support-pages/` or run the "Deploy support pages" workflow.

## 3. Listing copy

> ⚠️ **App name must be under 10 characters** (Canva rule). "Aksara Sunda" is
> 12 characters, so it can't be used as the marketplace/listing name.

**App name**: `Sundanese` (9 characters) — chosen

Alternatives considered: `Sunda` (5), `Aksara` (6).
The name "Sundanese" is used consistently: the in-app heading, the support
pages, the featured image, and the marketplace listing name.

**Short description** (one sentence, sentence case, no trailing punctuation,
plain text, no emojis):

```
Convert Latin text into Sundanese script and add it to your design as editable text
```

**Description** (multiple sentences, ends with punctuation, no marketing claims):

```
Converts Latin text into Sundanese script (Aksara Sunda Baku) and adds the result to your design as editable text. It also converts Sundanese script back into Latin. You can choose a Sundanese font from Canva's font library and apply a preset text style before adding text. The app runs entirely in your browser, with no account or server required.
```

### Translations

Canva translates apps for free after review — **developers can't upload their
own translations**. The Developer Portal only accepts the English source file,
`dist/messages_en.json` (produced by `npm run build`).

`submission/messages_id.json` is an Indonesian reference translation kept for
your own review only. It is **not** uploaded to the portal and Canva does not
read it.

## 4. Pre-submission checklist

### Product
- [x] 100% client-side, no backend, no accounts
- [x] Core functionality works (two-way conversion, add to design)
- [x] App UI Kit used (light/dark theme support)
- [x] Feature support handled (`useFeatureSupport` gates buttons)
- [x] Loading / disabled state while adding to design
- [x] Error handling with a dismissible `Alert`
- [x] Translation rules shown in-app
- [ ] Manually test in Canva: light + dark theme, Presentation / Docs / Post
- [ ] Choose a Sundanese font before "Add to design" (avoids tofu in the design)

### Assets and links
- [x] App icon (512×512)
- [x] Featured image (2400×1800)
- [x] Support / privacy / terms pages written
- [x] Support pages hosted on GitHub Pages
- [ ] Paste the 3 support URLs into the portal

### Configuration
- [x] No localhost URL in the app config (backend vars removed)
- [x] App ID / app origin set in `.env`
- [x] Production build passes and is under size limits
- [ ] Upload UI strings for translation (Developer Portal → Code upload → Translations, drop `dist/messages_en.json`)
- [ ] Read and accept Canva Terms of Use and Canva Developer Terms

### Build and submit

```bash
cd aksara-sunda
npm run lint:check   # eslint + tsc
npm test             # jest
npm run build        # dist/app.js + dist/messages_en.json
```

Then in the Developer Portal: **Submit for review**.

## 5. Reference

- App icon guidelines: https://www.canva.dev/docs/apps/app-listing-guidelines/app-icon/
- Featured image guidelines: https://www.canva.dev/docs/apps/app-listing-guidelines/featured-image/
- Written content guidelines: https://www.canva.dev/docs/apps/app-listing-guidelines/written-content/
- Submission checklist: https://www.canva.dev/docs/apps/submission-checklist/
