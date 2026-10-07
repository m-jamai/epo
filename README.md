# Mohammed Jamai — portfolio

Static site, no build step. Upload the folder to any static host (GitHub Pages, Netlify, OVH...) and open `index.html`.
Opening the file straight from disk also works; browsers just skip the font preload there.

## Design direction: quiet technical minimalism
Calm, precise and engineered, like a well-organized technical document. Confidence through restraint.

- **Color**: soft pale-gray ground `#F4F5F5` and flat panels `#FAFBFB` (never pure white), charcoal and gray text
  (`#2A3035` headings, `#4E565C` body, `#656D73` meta), one muted blue accent `#2D6A99` used sparingly.
  No gradients, no shadows, no second accent. All text passes WCAG AA contrast.
- **Type**: IBM Plex Mono for labels and headings; Archivo in a light weight for reading text. Both self-hosted
  in `assets/fonts/` (SIL OFL), so no Google Fonts or CDN calls.
- **Labels**: small uppercase mono with wide tracking and a short blue dash, used as annotations for every section.
- **Structure**: hairline 1px borders, flat panels, square corners, spec-sheet blocks (label, title, short description).
- **Buttons**: outlined, small uppercase text with a thin arrow; on hover the border and text turn blue and the arrow nudges.
- The design tokens are at the top of `css/style.css`.

## Logo
`assets/img/logo/`: the initials MJ drawn as a schematic block with an input arrow on the left and an output line
ending in a blue measurement point, a system with an input and an output.
- `mj-logo.svg`, `mj-logo-inverse.svg` (white, for dark backgrounds), `mj-logo-1200.png`
- `mj-icon.svg` / `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`: compact icon for tabs and phones
- `og-image.png`: preview shown when the link is shared (LinkedIn, WhatsApp...)

The sidebar shows your name as text only, no logo.

## Files
- `index.html`: all page content
- `css/style.css`: tokens, then one section per page
- `js/main.js`: navigation (shareable links such as `#/projects/zoe`), mobile menu, local time, copy email, resources
- `js/resources.js`: articles, documents and recommendations. Add an entry there and it appears with its own page.
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
