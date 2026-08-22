# quarto-revealjs-bjk

Brenton Kenkel's [Quarto reveal.js](https://quarto.org/docs/presentations/revealjs/) theme for academic slides, forked from Grant McDermott's excellent [quarto-revealjs-clean](https://github.com/grantmcdermott/quarto-revealjs-clean).

Where upstream is a light grotesque theme, this fork is an editorial serif design:

- **Type**: [Source Serif](https://github.com/adobe-fonts/source-serif) for display (deck and slide titles), [Source Sans](https://github.com/adobe-fonts/source-sans) for text, [Iosevka](https://github.com/be5invis/Iosevka) for code (narrow enough for ~93-character lines, ligatures disabled)
- **Math**: MathJax v4 with [STIX Two](https://www.stixfonts.org/), so equations look journal-grade next to the serif headers
- **Color**: warm paper ground, near-black ink, deep burgundy accent for emphasis, muted slate for structure
- **Self-hosted fonts**: all faces ship as subset woff2 files inside the extension — decks render identically with no network connection and make zero third-party font requests (MathJax and its font still load from CDN)

## Installation

Add the theme to an existing project:

```bash
quarto install extension brentonk/quarto-revealjs-bjk
```

Or start a new deck from the template:

```bash
quarto use template brentonk/quarto-revealjs-bjk
```

Then use the format:

```yaml
title: A title
subtitle: A subtitle
format: clean-revealjs
author:
  - name: Your Name
    email: you@example.com
    affiliations: Your Institution
date: last-modified
```

## Theme classes

| Class | Effect |
|---|---|
| `.alert` | burgundy bold emphasis: `[text]{.alert}` |
| `.fg` | custom foreground color: `[text]{.fg style="--col: #123456"}` |
| `.bg` | custom background chip: `[text]{.bg style="--col: #123456"}` |
| `.button` | Beamer-style button link: `[[Appendix]{.button}](#sec-appendix)` |
| `.example` | worked-example block; each paragraph gets an arrow marker |
| `.tight` | drops the inter-item spacing from a list. Wrap one list in `::: {.tight}` or apply to a whole slide (`## Title {.tight}`); set `--tight-list-spacing` for something between tight and the default |
| `.wide-table` | centers a table at 70% slide width (override with `--wide-table-width`) |
| `.v-center` | slide class (`## Title {.v-center}`): title and eyebrow stay at the top, body centers vertically in the remaining space; don't combine with `r-stretch` |
| `.etable` | fits a regression-table image to the slide |
| `.columns3070` etc. | column-width presets for `output-location: column` (`3070`, `7030`, `4060`, `6040`) |

R figures sit directly on the paper-toned slide: the graphics device renders with a transparent background, and computational figure output is additionally blended onto the slide (`mix-blend-mode: multiply`) so white plot backgrounds from any ggplot theme disappear. Markdown-included images (photos, scans) keep their true colors.

## Migrating decks from v1 of this theme

- **Delete any per-deck MathJax pin.** Decks that carry `html-math-method: {method: mathjax, url: ...mathjax@3...}` in their YAML will override the extension's MathJax v4 + STIX Two setup. Remove the block entirely.
- Body text moved from weight 300 to 400, headings from Fira Sans to Source Serif, and the teal/red palette to burgundy/slate. Expect decks to look different — deliberately so.
- Per-deck `<style>` hacks for `.wide-table` can be deleted; it is now a theme class.

## Swapping fonts

Each family is one variable plus one `@font-face` group in `_extensions/clean/clean.scss`, and the woff2 files live in `_extensions/clean/fonts/` (listed under `format-resources` in `_extension.yml`). To swap the code font for, say, [Maple Mono](https://github.com/subframe7536/maple-font): drop in subset woff2 files, point the `@font-face` group at them, and update `$font-mono`. Subsetting recipe (fonttools via uv):

```bash
uvx --from fonttools --with brotli pyftsubset Font.ttf --flavor=woff2 \
  --unicodes="U+0000-00FF,U+0100-024F,U+1E00-1EFF,U+2000-206F,U+20A0-20BF,U+2113,U+2122,U+2139,U+2190-21FF,U+2200-22FF,U+2500-257F,U+25A0-25FF,U+2713-2717,U+FEFF,U+FFFD" \
  --output-file=font-subset.woff2
```

## Caveats

- The `@font-face` URLs assume Quarto's default output layout (`<doc>_files/libs/...` beside the output file). `embed-resources: true` or a custom `lib-dir` will break the relative font paths; if you need those, move the `@font-face` block into an `include-in-header` `<style>` snippet with document-relative URLs.
- Font files are latin + common-symbol subsets. Extensive non-Latin text will fall back to system fonts.

## Credits

The structure and much of the machinery come from [grantmcdermott/quarto-revealjs-clean](https://github.com/grantmcdermott/quarto-revealjs-clean) (MIT), itself inspired by Kyle Butts' [LaTeX beamer themes](https://github.com/kylebutts/templates). Bundled fonts are licensed under the [SIL Open Font License 1.1](_extensions/clean/fonts/LICENSE-OFL.txt).
