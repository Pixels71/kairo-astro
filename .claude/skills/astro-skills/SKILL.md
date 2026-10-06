---
name: astro-skills
description: Rules for working on this Astro project (a port of the Next.js jobfit template). Use before building or changing any page, section, animation, image, link or content. Written from mistakes already made; follow it so they are not repeated.
---

# Jobfit Astro: working rules

The Next.js project at `D:\Templetes\nextjs\jobfit` is the source of truth for markup, classes and behaviour. Its dependencies must be installed from its `yarn.lock` (`yarn install --frozen-lockfile`): installing newer Next/React broke hydration and gave a false baseline.

## 1. Plan first

State the plan and every structural decision (folders, where images live, libraries) before writing code, and wait for a clear go-ahead on anything structural. Moving images to a different folder without asking was the mistake this rule exists for.

## 2. Structure

No `src/`; `@/` is the project root; `pages/` holds routes; files kebab-case, one component per file.

| New thing                      | Location                                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| A route                        | `pages/<name>.astro` (dynamic: `pages/<name>/[slug].astro` with `getStaticPaths`), thin: layout + sections |
| A section                      | `components/<page>/<section>.astro`                                                                        |
| Used on several pages          | `components/shared/`, `components/ui/`, `components/icons/`                                                |
| A scroll/hover/click behaviour | `components/animation/init/<name>.ts` with `export default function init()`, auto-loaded by `main.ts`      |
| Long content                   | `data/<collection>/<slug>.md` + schema in `content.config.ts`                                              |
| Lists                          | `data/<concern>.ts` or json, typed from `interface/index.ts`                                               |
| Images                         | `assets/images/`                                                                                           |

Component format: `interface Props`, `const { ..., class: className } = Astro.props`, `cn()` from `@/utils/cn` (never `class:list`), `@/` imports. Format with `bunx prettier --write` (the project `.prettierrc`); `data/**/*.md` is in `.prettierignore`, never let Prettier rewrite content.

## 3. Images

Components import images from `assets/images/` and render `<Image>` from `astro:assets` (optimised like `next/image`). Data-driven paths (`'/images/x.png'` in Markdown front matter or JSON) go through `resolveImage()`. Markdown-body images are rewritten by the plugin in `astro.config.ts`. CSS references use `../assets/images/...`. Only `public/images/og-image.jpg`, favicons, manifest and the icon font live in `public/`. `<Image>` needs `alt` (use `alt=""` for decoration).

## 4. Parity with Next

Never guess. Compare numerically: element count, document height and every element's rect, opacity, display, colour and background between `http://localhost:3000` (Next dev) and `http://localhost:4321` (Astro dev), at 1440, 820 and 390, after scrolling through the page. Fix the root cause of each difference. Dynamic things (marquee position, slider autoplay phase, mid-flight animations) are the only acceptable differences; check those by structure (copy counts, durations) instead. Compare Next with JavaScript enabled and the hydrated DOM; the SSR-only HTML hides content wrapped by `RevealAnimation`.

## 5. Motion

- `RevealAnimation` became attributes: `data-reveal` plus `data-delay`, `data-offset`, `data-direction`, `data-duration`, `data-instant`, `data-use-spring`, `data-start`, `data-end`, `data-rotation`, `data-animation-type`. They go on a real element, never on a component tag (components do not forward unknown attributes).
- Hidden initial states live in the inline `<style is:inline>` in `layouts/layout.astro`, keyed on `.js`, which is only added when motion is allowed. The bundled stylesheet arrives too late.
- Every `init/*.ts` tolerates pages where its elements are missing and respects reduced motion (`motionEnabled()` from `@/utils/dom`).
- Animate `transform`, `opacity` and `filter`. Tailwind v4 `translate-*`, `scale-*` and `rotate-*` set the separate CSS properties; `transform-none` does not reset them.
- react-fast-marquee is reproduced by `components/ui/marquee/marquee.astro`: each child is wrapped by the caller in `<div class="rfm-child">`, exactly like the library does.

## 6. Checks before reporting done

1. `bun run check` reports 0 errors, 0 warnings, 0 hints.
2. `bun run build` succeeds (71 pages) and every local `src`, `href` and `srcset` in `dist/` exists.
3. Every page has `og:image` and `twitter:image`, and `public/images/og-image.jpg` exists. If it is missing, generate it, never leave metadata pointing at nothing:

```bash
node .claude/skills/astro-skills/og/generate-og.mjs --force --logo=public/images/shared/dark-logo.svg --eyebrow="// AI RESUME BUILDER" --title="Smarter resumes." --italic="Better opportunities." --tagline="ATS-ready · Role-specific · Keyword-aligned" --cta="Get started" --dark="#13171e" --dark-top="#181d26" --accent="#83e7ee" --accent-glow="rgba(134,79,254,0.55)" --muted-glow="rgba(131,231,238,0.35)"
```

On Windows Git Bash set `MSYS_NO_PATHCONV=1` first, otherwise `//` and `/route` arguments are rewritten. It needs Chrome or Edge (`CHROME_PATH` to override) and `sharp`. Look at the image after generating it. 4. Report what was verified and what was not (hover states and frame-by-frame motion are not covered by numeric checks).

## 7. The prod (template) folder

`D:\Templetes\astro\jobfit-astro-prod` is the shippable copy: identical code, no `.git`, `.astro`, `dist`, `node_modules`, `bun.lock` or `.claude`, a buyer README, `site` set to `https://your-domain.com`, and `assets/images` where every photo is a placeholder with the same name, format and pixel size (size and file name printed on it). Gradients, UI illustrations, logos, icons and SVGs stay real (`keepAsIs` in the script); assets referenced nowhere are dropped (`unusedAssets`). Regenerate it after any change to the project:

```bash
node .claude/skills/astro-skills/prod/make-prod.mjs --force
```

- Close terminals and servers that sit inside the prod folder first: a locked folder makes the script stop.
- A new photo is a placeholder by default; a new design asset that must stay real goes in `keepAsIs`; a new unused asset goes in `unusedAssets`.
- The buyer README is `prod/README.prod.md`; update its tables when the structure or images change.
- Verify: junction `node_modules` into the prod folder, run `astro check` and `astro build`, confirm every local reference in `dist/` exists, then remove the junction, `dist` and `.astro`.

## 8. Tooling traps

- In Node `String.replace`, `$$` in a replacement string becomes `$` and breaks `$$()` calls. Use a function replacement.
- Bash heredocs choke on some content; write multi-line files with the editor tools.
- Git Bash rewrites arguments that start with `/` into Windows paths.
- Astro's compiler drops whitespace between a text node and a following element; use `{' '}`.
- After adding an `.astro` file with arbitrary Tailwind classes, `touch styles/global.css` if the dev build misses them.

## 9. Working agreement

- Commit and push after every independent change, with a clear message.
- No explanatory or measurement comments in code (CSS, TS and Astro). Names and structure carry the meaning.
- A missing asset the code already references is a bug: create it, then report it.
