# Kairo: SaaS template plan (v2, astro-skills structure)

**Name:** Kairo, from *kairos* ("the right moment"). It's short, soft and invented, the same naming style as Linear, Raycast and Attio.
**Product:** AI signal intelligence. Kairo watches a company's metrics, tickets, calls and docs, and briefs the team on what matters before the moment passes.
**Hero line:** "Know the moment before it passes."

**Design read:** a premium SaaS landing site for founders and operators, in the cinematic editorial style of the references (Santioni, Sobha, Pensatori, BOC, LXL, Noho). Dials: VARIANCE 8 / MOTION 9 / DENSITY 3.

## Visual system
- One dark theme everywhere: off-black `#0b0c0b`, bone `#ebe9e2`, warm greys. No section inverts.
- One accent: signal orange `#ff5b1f`, used only for "the moment" (primary CTA, progress, live pulse).
- Type (Fontshare through Astro Fonts): **Cabinet Grotesk** for display, **General Sans** for body. **JetBrains Mono** (Google) for small labels and numbers. No serif.
- Shapes: media frames are sharp (radius 0). Buttons, nav and chips are full pills.
- Images: moody, low-key photography from Lummi with warm red and orange light that matches the accent. Stored in `assets/images/`, rendered with `<Image>`.

## Project structure (astro-skills rules)
Location: `D:\Templetes\astro\development\kairo`. No `src/`; `@/` is the project root.
```
assets/images/            every photo (optimised by astro:assets)
pages/                    index, customers/{index,[slug]}, journal/{index,[slug]}, pricing, about, 404
layouts/layout.astro      head + SEO, inline hidden states, loader, transition overlay, navbar, footer, motion bootstrap
components/
├── home/                 hero, signal-field, logos, manifesto, product-reveal, capabilities, how-it-works, stories, proof, cta
├── customers/            customers-hero, story-grid, results-band
├── customers-details/    story-hero, story-results, story-body, story-gallery, next-story
├── journal/              journal-hero, featured-post, post-list
├── journal-details/      post-header, post-body, related-posts
├── pricing/              pricing-hero, plans, compare, faq, sales-form
├── about/                about-hero, timeline, values, team, roles
├── shared/
│   ├── layout/           navbar, menu, footer, loader, transition
│   ├── ui/               button, text-roll, magnetic, section-heading, media
│   └── icons/            arrow, logo, social
└── animation/
    ├── main.ts           lenis + gsap registry, auto-loads init/*.ts
    ├── lenis-instance.ts
    └── init/             loader, transition, navbar, menu, hero, signal-field, split-reveal, manifesto,
                          product-reveal, capabilities, stack, stories-pan, proof, odometer, magnetic,
                          text-roll, media-hover, view-chip, marquee, footer, pricing-toggle, accordion,
                          filter, list-preview, reading-progress, parallax, newsletter, forms
data/                     navbar, footer, logos, capabilities, steps, plans, faq, team, values, timeline (TS);
                          customers/*.md and journal/*.md collections
interface/index.ts        shared types
utils/                    cn, dom, generate-meta-data, image (resolveImage), collections
styles/                   global, variables, typography, common
content.config.ts         customers + journal collections (zod)
```
Conventions: kebab-case, one component per file, `interface Props`, `cn()` (never `class:list`), thin pages, no comments in code, Prettier formatting. Hidden initial states go in the inline `<style is:inline>` keyed on `.js`. Every init tolerates missing elements and reduced motion.

## The four priority pieces
1. **Loading screen** (`shared/layout/loader` + `init/loader.ts`): a mono odometer rolls to 100, the KAIRO letters rise through a mask and an orange hairline traces progress. At 100 the screen opens like an aperture from a horizontal slit, and the hero headline lines and canvas play in, handed off exactly as the loader leaves. The full version plays once per session; later visits get a short 0.6 s version.
2. **Page transition** (`shared/layout/transition` + `init/transition.ts`): clicking an internal link sends five columns up from the bottom, staggered from the side the cursor is on, with the destination name set large in the middle. The site is a real MPA, so the next page starts covered (an inline head flag) and the columns lift away while its hero plays in. bfcache and back/forward are handled.
3. **Nav** (`navbar` + `init/navbar.ts`): a floating pill. A highlight slides under the hovered link, labels roll, the CTA is magnetic and an orange scroll-progress hairline runs along the bottom. It hides when you scroll down and returns blurred when you scroll up. Small screens get a full-screen menu with staggered giant links and a preview image that follows the hovered link.
4. **Hero** (`home/hero` + `signal-field` + `init/signal-field.ts`): an asymmetric kinetic headline over a live canvas signal field. The dot grid ripples with noise and bends around the cursor, and an orange pulse blooms on "the moment". On scroll the headline sinks and the field drifts.

## Pages (5 + 2 detail = 7, plus a 404)
| Route | Sections |
|---|---|
| `/` Home | hero, logo marquee, manifesto (words light up while scrolling, with inline images), product reveal (pinned image grows to full bleed with 3 captions), capabilities bento (5 cells with live micro motion), how it works (sticky stack of 3), customer stories (pinned horizontal pan), proof (quote slider + odometer numbers), final CTA |
| `/customers` | hero with split title, filterable story grid with clip reveal on hover, results band |
| `/customers/[slug]` | full-bleed parallax hero, results numbers, narrative with sticky aside, gallery, pull quote, next story |
| `/pricing` | hero, monthly/yearly toggle with rolling prices, 3 plans, grouped comparison, FAQ accordion, talk-to-sales form with every state |
| `/journal` | hero, featured post, category filter, list with cursor-follow preview image |
| `/journal/[slug]` | reading progress, header, article body, related posts |
| `/about` | manifesto hero, timeline (horizontal pan), values, team (hover reveal), open roles |
| `/404` | the signal field with a lost pulse, back home |

**Footer:** a giant KAIRO wordmark whose letters rise as the page bottoms out, rolling-text links, a newsletter field (idle, loading, success, error) and a back-to-top button with a progress ring.

## Micro-interactions
Text roll on every link and button, magnetic CTAs, direction-aware button fills, image clip reveal and hover zoom, a "View" chip that follows the cursor only over story and journal media (the system cursor stays), split-line heading reveals, odometer numbers, focus-visible rings, and states for loading, success, error and empty. Everything collapses to static under `prefers-reduced-motion`.

## Execution
1. Scaffold: package.json (Astro 7, Tailwind v4, GSAP, Lenis), config, tsconfig, Prettier, git init, launch.json, and copy the astro-skills skill.
2. Images: pick and download from Lummi into `assets/images/`.
3. Tokens, layout, the loader, the transition, the navbar, the menu and the footer.
4. Home sections, one by one.
5. Inner pages, collections and detail pages.
6. OG image, `astro check` (0/0/0), `astro build`, link check, browser QA at 1440 and 390, reduced motion, anti-slop pre-flight, commit.
