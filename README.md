# Mohammed Jamai — portfolio

Static site, no build step. Open `index.html` through any web server (GitHub Pages, Netlify, OVH…).
Opening the file directly from disk works too, but browsers block the font preload there; it is fine once hosted.

## Identity
- **Logo** (`assets/img/logo/`): a lowercase *mj* drawn as one continuous signal. The arches of the m read as a
  waveform, its last leg drops into the hook of the j, and the j's dot is an amber measurement point.
  - `mj-mark.svg` (dark ink), `mj-mark-inverse.svg` (white, for dark backgrounds), `mj-mark-1024.png`
  - `mj-app-icon.svg`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`
  - `og-image.png`: preview shown when the link is shared on LinkedIn, WhatsApp, etc.
- The sidebar shows your name as text only, no logo. The mark appears on the landing page, favicon and share image.
- **Colors**: paper `#F6F7F9`, ink `#15202B`, signal blue `#0072BD` and amber `#EDB120` (MATLAB's default plot colors).
  Dark mode follows the visitor's system setting.
- **Type**: Archivo (headings, interface) and Newsreader (reading text), self-hosted in `assets/fonts/` (SIL OFL).
  No Google Fonts or CDN calls, which also keeps the site GDPR-friendly.

## Files
- `index.html` — all content
- `css/style.css` — design tokens at the top, then one section per page
- `js/main.js` — navigation (shareable URLs like `#/projects`), mobile menu, local time, copy-email, resources
- `js/step-response.js` — the interactive Fig. 1 on the landing page
- `js/resources.js` — your articles, documents and recommendations (edit this to add entries)

## To update before publishing
1. **Profile links**: GitHub, ResearchGate, Jupyter and Hashnode still point to the sites' home pages. Replace with your profile URLs (search for `github.com/` in `index.html`).
2. **Project links**: each project has hidden "Case study" and "Code" buttons. They appear automatically as soon as you replace `href="#"` with a real link.
3. **Project images**: the line illustrations can be swapped for real photos or plots (see the comment above the Projects section).
4. **Share image**: once the site has a domain, change `og:image` to the full URL, e.g. `https://your-domain.com/assets/img/logo/og-image.png`.
5. **Contact page**: check "Working setup: Remote, or on site around Toulouse" matches what you offer.
6. **Certifications**: add years if you want them shown.
