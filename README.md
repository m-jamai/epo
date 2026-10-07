# Mohammed Jamai — portfolio

Static site, no build step. Upload the folder to any static host (GitHub Pages, Netlify, OVH...) and open `index.html`.
Opening the file straight from disk also works; browsers just skip the font preload there.

## Identity
- **Logo** (`assets/img/logo/`): the initials MJ drawn as a Simulink-style block, with an input arrow on the left
  and an output line ending in an amber "measured response" point: a system with an input and an output.
  - `mj-logo.svg`, `mj-logo-inverse.svg` (white, for dark backgrounds), `mj-logo-1200.png`
  - `mj-icon.svg` / `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`: compact icon for browser tabs and phones
  - `og-image.png`: preview shown when the link is shared (LinkedIn, WhatsApp...)
- The sidebar shows your name as text only, no logo. The logo appears on the landing card, the browser tab and the share image.
- **Colors**: paper `#F6F7F9`, ink `#15202B`, signal blue `#0072BD`, amber `#EDB120`. Dark mode follows the visitor's system setting.
- **Type**: Archivo (headings, interface) and Newsreader (reading text), self-hosted in `assets/fonts/` (SIL OFL).
  No Google Fonts or CDN calls, so the site sets no third-party cookies.

## Files
- `index.html`: all page content
- `css/style.css`: design tokens at the top, then one section per page
- `js/main.js`: navigation (shareable links such as `#/projects/zoe`), mobile menu, local time, copy email, resources
- `js/resources.js`: your articles, documents and recommendations. Add an entry there and it appears with its own page.
- `assets/projects/zoe/`: Renault ZOE figures and the downloadable project ZIP

## Shareable links
`#/profile`, `#/profile/education`, `#/experiences`, `#/projects`, `#/projects/zoe`, `#/projects/brushless`,
`#/projects/pmsm`, `#/resources`, `#/contact`, `#/terms`

## To update before publishing
1. **Profile links**: GitHub, Jupyter, ResearchGate and Hashnode still point to the sites' home pages. Replace them with your profile URLs (search for `github.com/` in `index.html`).
2. **Certifications**: add the year after each issuer when you have it (there is a comment above the list).
3. **Share image**: once the site has a domain, set `og:image` to the full URL, e.g. `https://your-domain.com/assets/img/logo/og-image.png`.
4. **Brushless and PMSM images**: these use line illustrations. To use your own figures, replace the `<svg class="ill">` inside
   `.project-figure` (and on the project page) with `<img src="assets/projects/your-image.png" alt="...">`.
