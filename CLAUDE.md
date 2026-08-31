# quarto-revealjs-bjk

Personal Quarto reveal.js theme (fork of grantmcdermott/quarto-revealjs-clean, heavily diverged as of the 2026 overhaul). The entire theme is `_extensions/clean/clean.scss` plus `_extension.yml`, `mathjax-config.js`, `slide-number.js` (title slide unnumbered, counting starts at 1 after it), and bundled fonts.

## Hard constraints

- The extension directory must stay `_extensions/clean/` and the format name `clean-revealjs` — course-deck branches (`qps2`, `wasd`) and many existing decks depend on both.
- Theme classes are API: `.alert`, `.fg`, `.bg`, `.button`, `.example`, `.tight`, `.invert-colors`, `.wide-table`, `.v-center`, `.etable`, `.columns3070/.columns7030/.columns4060/.columns6040`. Restyle freely; never rename or drop.
- All fonts are self-hosted (subset woff2 in `_extensions/clean/fonts/`, shipped via `format-resources`). Never reintroduce a font CDN — an offline class laptop is the motivating failure. MathJax is the only permitted CDN dependency.

## Design system (2026)

Editorial serif direction: Source Serif for display (deck title 700, slide h2 600, tight tracking), Source Sans for body at 400, Iosevka for code (ligatures stripped at font level and in CSS; ~93-char lines must not wrap at 0.66em), STIX Two math via MathJax v4. Warm paper ground `$paper`, ink text, burgundy `$accent` for emphasis (.alert, h4, links), slate `$secondary` for structure (list markers, callout-notes, .example). Subtitles (deck subtitle and h3) are tracked caps eyebrows: 0.62em, weight 500, 0.12em letter-spacing, `$gray-600` — not italic, not slate. Title-page metadata (email, affiliation, date) is upright gray; no unmotivated italics anywhere.

All colors, families, and weights are single variables at the top of `clean.scss`. Section layout is numbered (01 Palette … 14 Chrome); keep new rules in the matching section.

## Non-obvious mechanics (each burned us once)

- **Font paths**: `format-resources` copies `fonts/*.woff2` flattened to the output-document root, but the compiled theme css lands 5 levels down (`<doc>_files/libs/revealjs/dist/theme/`), and css `url()` is stylesheet-relative — hence `$font-path: "../../../../.."`. Breaks under `embed-resources: true` or custom `lib-dir` (documented caveat in README).
- **No digits in @font-face family names**: Quarto interpolates font lists into css custom properties unquoted; a bare `3`/`4` token invalidates the declaration and everything silently falls back to Times. Hence "Source Sans", not "Source Sans 3".
- **Image blending**: white plot boxes are killed by `mix-blend-mode: multiply` on slide images. This only works because sections carry `background-color: $paper` themselves — reveal's transformed `.slides` isolates the stacking context, so images cannot blend with the page background. Sections with `data-background-color/image` are excluded from the paper background; don't "simplify" either half.
- **Transparent R figures**: `knitr: opts_chunk: dev.args: bg: transparent` in `_extension.yml` only helps R themes with a blank `plot.background` (e.g. cowplot). ggplot's default `theme_gray` paints its own white box — that's what the multiply blend is for.
- **Callout specificity**: Quarto's compiled rule is `.reveal .slides section div.callout` (0,3,2); the theme wins with an added `.callout-style-default` class, not `!important` (except `border-left-color`, where Quarto's own rule pattern requires it).
- **Reveal callout markup differs from HTML format**: `.callout > .callout-body > .callout-title`; there is no `.callout-header`. R figures with captions render as a bare `img.r-stretch` directly in the section — no `.cell-output-display` wrapper.
- **`#` headings wrap slides in a `section.stack`**, which is slide-sized and matches any bare `section` selector. The paper-ground rule in section 12 therefore excludes `.stack`: left in, it paints over whatever ground sits behind its children, so a `background-color=` or `.invert-colors` slide inside a stack showed only a band as tall as its own text. Slides inside a stack still paint their own paper, so the image-blend backing survives. Any future full-slide rule needs the same exclusion — and the template now puts a `#` heading before the figure and inverted slides so this case is actually rendered.
- **Slide classes reach the background layer**: reveal copies a section's whole class list onto its matching `.backgrounds > .slide-background` element, which is the only thing covering the full viewport — a section paints just its content box, inset from the slide edges and (under `.center`) no taller than its text. That is how `.invert-colors` gets a full-bleed ground without setting `background-color=`; both the section and the background element are painted the same color so the join is seamless. Reveal's automatic light-on-dark text flip is *not* available this way — it keys off the `background-color` attribute — so `.invert-colors` states every color explicitly, and anything added to the theme with a hardcoded light-ground assumption needs a counterpart there.
- **List spacing is not ours**: the airy gap between bullets comes from Quarto, which injects `.reveal .slide ul li, .reveal .slide ol li { margin: 0.4em 0 0.2em }` into an inline `<style>` in the document head. It is invisible to `grep` over the compiled theme css and to a CSSOM cascade probe, so don't go hunting for it in `clean.scss`. `.tight` overrides it on specificity (0,3,1 vs 0,2,2), no `!important`.
- **`.v-center`** (title stays top, body centers below): reveal puts an inline `display: block` on the active section, so the flex override needs `!important` — and MUST stay scoped to `.present`, or every slide un-hides at once. The auto-margin sandwich uses `:nth-child(1 of :not(h2, h3))` (skips title + eyebrow) and `:nth-last-child(1 of :not(aside.notes))` (skips speaker notes). Incompatible with `r-stretch` on the same slide.

## Workflows

- Verify changes with `quarto render template.qmd` — the template deliberately exercises math, tables, figures, code, callouts, and every theme class.
- Real-deck test harness: `test-decks/` (gitignored) holds copies of a discussant, course, and research deck, each with an `_extensions` symlink to the live theme. Render them for QA against real content. If absent, recreate by copying decks from `~/Dropbox/discuss`, `~/Dropbox/courses/wasd/public/slides`, `~/Dropbox/projects/*/slides` and symlinking `_extensions`.
- Browser screenshots: serve the repo over local HTTP (`python3 -m http.server`) — the Playwright MCP blocks `file://`. Reveal lazy-loads images; wait for `img.complete` before screenshotting.
- Font subsetting recipe (fonttools via `uvx`) is in the README; keep the arrow/box-drawing/checkmark unicode ranges — tidyverse console output uses them.
- Render artifacts land in the repo root (`template.html`, `template_files/`, `*.woff2`, `mathjax-config.js`) and are gitignored.

## Migration contract for existing decks

Decks adopting this version must delete any per-deck `html-math-method` MathJax 3 pin from their YAML (it overrides the extension's MathJax v4 + STIX Two config). Per-deck `.wide-table` `<style>` hacks are obsolete.
