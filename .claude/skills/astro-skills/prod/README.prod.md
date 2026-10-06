# Jobfit — Astro template

A polished, motion-rich website template for an AI resume builder or any SaaS, built with [Astro](https://astro.build),
[Tailwind CSS v4](https://tailwindcss.com), [GSAP](https://gsap.com), [Lenis](https://lenis.darkroom.engineering) smooth
scrolling, [Swiper](https://swiperjs.com) and [Leaflet](https://leafletjs.com). TypeScript throughout. Static output with
no framework runtime: every interactive part is a small script in `components/animation/`.

**Pages:** Home · About · Features · How it works · Pricing · Use case · Services (+ 6 detail pages) · Success stories ·
Testimonials · Blog (+ 28 posts) · Team (+ 16 members) · FAQ · Contact · Security · GDPR · Privacy · Refund · Terms · Login ·
Signup · 404
**Built in:** smooth scrolling · scroll-reveal animations · stacked number counters · accordion and tabs · logo marquees ·
reviews slider · pricing toggle · blog pagination · table of contents · interactive map · video modal

---

## Getting started

You need [Node.js](https://nodejs.org) 22.12 or newer. [Bun](https://bun.sh) works too (and is faster).

```bash
npm install        # or: bun install
npm run dev        # start the dev server at http://localhost:4321
```

| Command           | What it does                             |
| :---------------- | :--------------------------------------- |
| `npm install`     | Install the dependencies                 |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the static site into `./dist/`     |
| `npm run preview` | Preview the built site locally           |
| `npm run check`   | Type-check the `.astro` and `.ts` files  |

---

## Before you publish

1. Set your domain as `site` in `astro.config.ts`. Canonical URLs, `og:url` and the share image URL are built from it.
2. Replace the placeholder images (see **Images**).
3. Replace the share image `public/images/og-image.jpg` (1200 × 630).
4. Edit the texts, navigation and footer links (see **Where content lives**).

---

## Where content lives

The detail pages (blog posts, services and team members) are **Markdown files**: add a file to `data/blogs/`,
`data/services/` or `data/team/` and it gets its own page; the file name is the URL. The fields each collection needs are
defined in `content.config.ts`. Everything else is edited in the component or in a file under `data/`.

| What                                | Where                                               |
| :---------------------------------- | :-------------------------------------------------- |
| Navigation                          | `data/navbar.ts`                                    |
| Footer columns                      | `data/footer.ts`                                    |
| FAQ questions                       | `data/json/faq/faq.json`                            |
| Testimonials                        | `data/json/testimonials/testimonials.json`          |
| About page statistics               | `data/achievements.ts`                              |
| Default title, description          | `utils/generate-meta-data.ts`                       |
| Page titles                         | the `<Layout title="...">` of each file in `pages/` |
| Home sections                       | `components/home/*`                                 |
| Call to action (used on most pages) | `components/shared/cta/cta.astro`                   |

---

## Images

Images live in `assets/images/` and are imported by the components, then resized and converted to WebP at build time by
Astro. Images named in Markdown front matter or JSON (for example `thumbnail: '/images/ns-img-405.jpg'`) are looked up in
the same folder. **Every photo in this package is a placeholder with the same file name, format and pixel size as the
demo image** (size and file name are printed on it): replace a file with your own, keeping the name, or point the
component or front matter to a new file. The gradients, UI illustrations, logos and icons are the real design assets.

| Images                                     | Folder                                          |
| :----------------------------------------- | :---------------------------------------------- |
| Team and testimonial portraits             | `assets/images/ns-avatar-*.png`                 |
| Blog thumbnails                            | `assets/images/ns-img-401.jpg` … `ns-img-435`   |
| Section photos (about, features, services) | `assets/images/ns-img-*.png` / `.jpg`           |
| Logos and icons (SVG)                      | `assets/images/shared/`, `assets/images/icons/` |
| Share image (Open Graph)                   | `public/images/og-image.jpg`                    |

---

## Colours, type and spacing

- **`styles/variables.css`** — design tokens: colours, gradients, type scale, shadows.
- **`styles/typography.css`** and **`styles/base.css`** — heading and paragraph styles.
- **`styles/common.css`** — the `main-container` width, footer links, flip cards and the Markdown content styles.
- **Fonts** — Inter Tight and Instrument Serif from Google Fonts, loaded by Astro's font API (`astro.config.ts`).
- **Breakpoints** — Tailwind defaults plus `lp` (1440px).
- **`cn()`** (`utils/cn.ts`) merges class names — `clsx` + `tailwind-merge`.

---

## Motion

Scroll reveals use data attributes on any element, handled by `components/animation/reveal.ts`:

```astro
<h2 data-reveal data-delay="0.1" data-direction="down" data-offset="60">
  Heading
</h2>
```

`data-reveal` with `data-delay`, `data-duration`, `data-offset`, `data-direction` (`up`, `down`, `left`, `right`),
`data-instant` (play on load instead of on scroll), `data-use-spring`, `data-rotation`, `data-start`, `data-end`.
Every other behaviour is one file in `components/animation/init/` (accordion, tabs, marquee, number counters, slider, map, modal,
navbar), loaded automatically. Elements that animate in are hidden by an inline rule in `layouts/layout.astro`, so nothing
flashes before the script runs. Everything respects the visitor's **reduced motion** setting.

---

## Project structure

```
assets/images/            images used by components and styles
public/                   favicon, manifest, icon font, share image
pages/                    one file per route; blog/[slug], services/[slug], team/[slug]
layouts/layout.astro      html shell: head, metadata, top bar, navbar, footer, motion bootstrap
components/
├── home/ about/ features/ process/ pricing/ services/ service-details/ use-case/ success-stories/ testimonial/
├── blog/ blog-details/ team/ team-details/ faq/ contact-page/ authentication/
├── security-compliance/ gdpr/ privacy/ refund-policy/ terms-conditions/
├── shared/               navbar, mobile menu, footer, cta, reviews, cards
├── ui/                   accordion, tab, marquee, button
├── icons/                one component per SVG icon
└── animation/            reveal, smooth scroll, and init/* (one module per behaviour)
data/                     TypeScript lists, JSON, and the blogs / services / team Markdown collections
interface/index.ts        shared types
utils/                    cn, dom, image, springer, metadata and entry helpers
styles/                   tokens, type, base styles
content.config.ts         the three Markdown collections
```

One component per file, an `interface Props`, `cn()` for conditional classes, `@/` absolute imports.

---

## Deploying

`npm run build` produces a static site in `dist/`. Upload it to any static host (Cloudflare Pages, Netlify, Vercel, GitHub
Pages, S3). Set `site` in `astro.config.ts` first.

---

## Credits

- [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com)
- [GSAP](https://gsap.com) — free for commercial use under the GSAP standard license
- [Lenis](https://lenis.darkroom.engineering), [Swiper](https://swiperjs.com), [Leaflet](https://leafletjs.com)
- Fonts: Inter Tight and Instrument Serif (SIL Open Font License)
