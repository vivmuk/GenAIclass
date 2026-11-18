# DESIGN — genaichutney.com revamp

Decision record for the new home page (`index.html`) and the visual system every page will share.
Written before markup. Design lead: claude-opus-5-5, 16 November 2026.

Inputs read, in the commission's order: `COMMISSION.md`; scrollcraft `SKILL.md`, `references/uniqueness.md`,
`taste.md`, `devices.md`, `feel.md`, `verify.md`, `template.html` (plus `assets.md` and `worlds.md`, which
`ASSETS.md` depends on); standalone-html-studio `SKILL.md`; `assets/model-economy.json`; the nine legacy pages.

**Relationship to `BRIEF.md`.** `BRIEF.md` is a self-authored brief, not an interview, and the commission says
nothing in the inputs is a decision already made. This file keeps its grammar, rejects its signature move,
its interactive ELIZA, its 2012–2017 date range and its orange-as-text, and supersedes it wherever the two
disagree (every departure is argued below). `BRIEF.md` is left untouched because this pass is scoped to two
files; before build, its curve, peak and "It's the site where" lines should be brought into line with §6.

---

## 1. The idea in one paragraph

The page is a printed field guide with a working machine in its margin. From the title page onward, a
20×20 plate sits in the folio: 400 inputs, one weight each, all zero. Reading the first chapter trains it,
for real, with Rosenblatt's 1958 rule, and the weights draw what it learned in orange and blue. The second
chapter asks it for XOR, and it fails in front of you, which is the argument Minsky and Papert made. The
third chapter gives it a hidden layer and backpropagation, and it solves the problem. Then the ground goes
black and the camera carries you down a hall of machines that make 400 weights look like a grain of sand.
The page then turns to the 2026 catalogue, says plainly which models made it, and closes by showing that the
mark at the top of every page on the site is the plate you trained in chapter one.

**It's the site where** *your scrolling trains a 1958 perceptron in the margin, you watch it fail XOR exactly
the way history says it did, and then the page drops you into the hall where its descendants live.*

---

## 2. Grammar: chaptered editorial

The page is a printed feature. Chapters are the unit. Each chapter lands on its own painted ground with a
hard cut, opens on a full-stop intertitle, and sets its media in its own column with a caption. The
grammar's forbids are adopted as constraints, not preferences:

- no `drift` (grounds are painted per section, opaque, hard edges);
- no full-bleed scrub hero; the hero is a type-only title page;
- no pinned crossfade type acts (pinned copy accumulates, it never replaces);
- no `spotlight`, no `magnet`, no centred hero copy;
- media never sits under type, so the page uses **no scrims at all**;
- `scrub` in exactly one chapter.

### Why the other seven lost

| Grammar | Why it lost on this brief |
|---|---|
| Filmic one-shot | It hides seams and forbids visible sequence. This is a history: the seams between 1958, 1966, 1980 and 1997 are the content, and the reader needs to know where in time they are. It is also the house default that carries a burden of proof this brief cannot meet. |
| Live surface | The honesty rule only allows a surface that really computes. The retina does compute, but it is one instrument, not the page; making the whole page a tool would forbid the photography and the long-form reading the commission asks for, and the history chapters have no product surface to be. |
| Continuous world | Requires worldflight and one geography. A Victorian mechanism, a 1973 machine room and a 2017 data hall are not one place, and faking continuity between them would be an invented visual claim. It is also the most fragile build there is, for no gain in meaning. |
| Typographic poster | Bans photographic ground and `scrub`. The commission explicitly wants the image and video models used to show the history, and the provenance chapter needs real generated media to point at. |
| Gallery / catalog | A collection answers "what are the options". This page answers "how did we get here", which is an argument through time. The 2026 chapter is catalogue-shaped, so its table borrows the label discipline, but one chapter does not set the grammar. |
| Split stage | Needs a two-sided argument resolved by a collapse. The history has turns (promise, bill, winter, revival) rather than two sides; forcing "rules versus learning" across eight chapters would make the 1843 and 2026 chapters decorative. |
| Rhythmic cutlist | Twelve to twenty short cuts with no dwell. The substance here is dense, sourced prose read at a reading pace; the cutlist would turn Lovelace and Lighthill into slogans. |

---

## 3. Nav treatment: the folio

No bar. The navigation is a **folio**, the printed page's margin furniture, and it carries the signature move.

**Desktop, ≥1100px wide: margin folio.** Fixed to the left edge, `--folio-w: 13rem` wide, full height, on no
background of its own (it takes the ground of whatever chapter is under it, and re-inks on the night chapter).
Top to bottom:

1. Wordmark "GenAI Chutney" as text, linking to `index.html#title`.
2. **The Retina** canvas, 176×176 CSS px (20 cells of 8px plus 1px gaps), with its caption line under it.
3. The running chapter head: date range on one line, chapter title on the next. Updates as chapters pass.
4. `Contents`: a `<nav aria-label="Chapters">` list of the eight chapter links. Always visible at this width.
5. The one next action as a text link: **Subscribe** (to `newsletter.html`).

**Under 1100px: running head.** The same folio, set as a 56px band fixed at the top (`--folio-h: 56px`):
a 48×48 Retina, the running chapter head in one truncating line, and a `Contents` button that opens the
chapter list as a sheet (`<dialog>`, focus trapped, Escape closes, focus returns to the button). The running
head is a printed running head, not a marketing bar: no CTA button island, no logo lockup.

**Reserved space.** Every pinned stage reserves the folio: `padding-left: calc(var(--folio-w) + var(--sc-gutter))`
at ≥1100px, `padding-top: calc(var(--folio-h) + var(--sc-4))` below it. Verification measures it:
no visible text, image, caption or control may come within 8px of the folio box at any sampled progress, at
1440×900, 1440×780, 1024×768 and 390×844.

**Legacy pages** use the same folio component. Pages with a natural index (vocabulary terms, Katha issues)
put that index in the folio's `Contents`; tool pages (prompt lab, image generator) use the running head at all
widths so the tool keeps the full measure. The folio there shows the **static mark** (§7) instead of the live
plate.

---

## 4. Hero device: the title page

Type on the paper ground, no media above the fold, the media starts in chapter one. Four text elements, left
aligned on the text column, h1 at most two lines at 1440 and four at 390:

- **h1:** How machines learned, and the market they became.
- **Deck (17 words):** A field guide from Ada Lovelace's Note G to the price of a million tokens in 2026.
- **Byline:** By Vivek Mukhatyar.
- **Imprint:** Set in markup by claude-opus-5-5, 16 November 2026.

What the first screen *does*: the Retina is already in the margin, untrained, every cell at the ground colour,
captioned "Untrained. One weight for each of 400 inputs, all zero." Nothing moves until the reader does.
The next chapter's intertitle is allowed to show below the fold line as a continuation cue in the printed
sense; there is no scroll cue, arrow or mouse icon. Hero h1 uses `--sc-t-4xl` (a genuine hero moment) and
steps down to `--sc-t-2xl` below 700px.

---

## 5. Act sequence, spans and budget

Ten acts across eight chapters. "Span" is `data-sc-span` for pinned acts and the measured target height for
flow acts, both in viewport-heights at 1440×900.

| # | Chapter (id) | Ground | Device | Span | Moment |
|---|---|---|---|---|---|
| A0 | What this is (`#title`) | paper | `flow`, type only | 0.9 | The title page and the empty plate. |
| A1 | 1843–1958, the idea that a machine could be taught (`#taught`) | plate | `pin` + accumulating cues, `parallax` in media column | 1.5 | Five dated entries arrive and stay; the plate trains. |
| A2 | 1966–1974, the first promise, the first bill (`#first-bill`) | winter | `flow` + `reveal` (down) | 1.0 | The room goes cold; the plate fails XOR. |
| A3 | 1980–1993, rules bought, rules broken (`#rules`) | plate | `pan` rail | 2.0 | An era read sideways; the plate divides and XOR resolves. |
| A4 | Intertitle, 1997–2017 (`#curve`) | night | `flow`, ground only + one line | 0.7 | Authored silence. |
| A5 | 1997–2017, the decade the curve bent | night | `scrub` (the only one), `dwell` 0.4 | **3.0** | **The peak.** |
| A6 | Why attention scaled (`#attention`) | paper | `flow` + `in` | 0.8 | The one diagram; daylight again. |
| A7 | 2020–2026, the economy of tokens (`#tokens`) | white | `pin` + `count` | 1.5 | The plane of 25 real models. |
| A7b | The catalogue (coda of A7) | white | `flow` | 0.2 | One `<details>` with the full table and its source. |
| A8 | What made this page (`#made`) | plate | `flow` + `reveal` (iris, once) | 0.8 | The page shows its own making. |
| A9 | Where to go next (`#next`) | paper | `flow`, colophon | 0.7 | The mark is explained; one next action. |

**Total: 13.1 viewport-heights at 1440×900.** Ceiling 14.0 at both 1440×900 and 390×844; flow chapters grow
on phones, so copy is capped per chapter (A1 entries ≤ 18 words each; A2 entries ≤ 30 words; A6 ≤ 110 words;
A8 rows one line each). If the phone measures over 14.0, cut copy; do not shorten the peak.

**Checks against the skill's rules.** Device families used: flow, pin/cue, parallax, reveal, pan, scrub,
count, plus the bespoke move (≥4). No device twice in a row (flow, pin, reveal, pan, flow, scrub, flow, pin,
flow, reveal, flow). One `scrub`. The peak has the largest span by a full viewport-height over the next
largest (3.0 against 2.0). Grammar bans hold (§2).

### Cue and stage specifics

- **A1 (pin 1.5).** Ground: the chapter plate colour plus plate image A already in the media column, so the
  stage is never empty on entry. Entries, all two-value windows ending at 1 (only the last act may hold):
  Lovelace `"0 1 0 0.04"`, McCulloch and Pitts `"0.14 1 0.06 0.04"`, Turing `"0.28 1 0.06 0.04"`, Dartmouth
  `"0.42 1 0.06 0.04"`, Rosenblatt `"0.56 1 0.06 0.04"`. Media column holds two stills: image A (the 1843
  mechanism) greets, image B (the photocell panel) arrives with Rosenblatt's entry (`"0.54 1 0.06 0.04"` on B,
  A stays beneath it, so no half-lit gap). `data-sc-parallax="0.6"` on the image inside a clipped frame.
  Under 700px the media column becomes a 14svh strip at the top of the stage.
- **A2 (flow 1.0).** Intertitle, three entries (ELIZA 1966, *Perceptrons* 1969, Lighthill 1973), the single
  second-person line of the page, and the winter still in the media column with
  `data-sc-reveal="down" data-sc-reveal-at="0.12 0.5"`: the frame is uncovered from the top like a dust sheet
  pulled down. A wipe is a change of state, and this is the beat where the money stops.
- **A3 (pan 2.0).** Rail: lead (intertitle) | XCON, 1980 (still) | Fifth Generation, 1982 (type only) |
  Backpropagation, 1986 (still) | closing note, the second winter, "kept alive through the cold". Card headings
  are one or two words because they are read cropped. Edge-fade mask on the stage. Rail overflow must measure
  ≥ 0.5 × viewport width at 1440 and 1024; if it does not, widen the lead and note, never the cards.
  Staggered settle from `--sc-p`, first item exempt, opacity floor 0.55, gated to no-preference.
- **A4 (flow 0.7).** Night ground, `min-height: 70svh`, the intertitle "1997–2017. The decade the curve bent."
  set in the lower third, nothing else. This is the authored silence before the peak; it is recorded here so
  verification treats it as intended.
- **A5 (scrub 3.0, dwell 0.4).** Stage split, never layered: text column left (5 of 12), video column right
  (7 of 12) bleeding to the right edge and full stage height. Under 700px: video band 50svh under the running
  head, text below. No scrim, because no type sits on the frame. Five entries accumulate, two-value windows
  ending at 1: Deep Blue 1997 `"0.04 1 0.05 0.04"`, ImageNet 2009 `"0.18 1 …"`, AlexNet 2012 `"0.36 1 …"`,
  AlphaGo 2016 `"0.56 1 …"`, transformer 2017 `"0.72 1 …"`. AlexNet's line lands on the dwell settle: "60
  million parameters, 15.3 percent top-5 error." At that cue the folio caption reads "This plate: one weight for
  each of 400 inputs." The juxtaposition is the peak; the page prints no ratio, because a ratio is a figure the
  commission does not supply. Section-local grain at 4% on this act only.
- **A6 (flow 0.8).** Hard cut back to paper. One inline SVG diagram drawn in markup: recurrence as a chain
  where each step waits for the previous one; attention as every position connected to every other in a single
  step. The copy says why that mattered: recurrence is sequential, so training cannot spread one sequence
  across parallel hardware, while attention computes all the pairwise relations at once as matrix arithmetic,
  which is what accelerators do well. Source line: Vaswani et al., 2017.
- **A7 (pin 1.5).** Ground: the plotted axes are drawn at p = 0, so the stage is never empty. Lead line greets
  (`"0 1 0 0.04"`). Dots for all 25 models arrive in price order across `0.08–0.6`; `data-sc-count="0 25"` on
  "models" and `"0 11"` on "vendors". The context band annotation arrives at 0.55, the highlight on
  claude-opus-5-5 at 0.7. All cue windows end at 1.
- **A8 (flow 0.8).** Iris reveal, the page's only iris, on the contact sheet of the page's own generated assets
  (`data-sc-reveal="iris" data-sc-reveal-at="0.1 0.5"`), beside the provenance list. The change of state is
  real: the page stops being about the history and becomes the exhibit.
- **A9 (flow 0.7, last element).** The colophon. Content is present at rest, nothing fades, the footer lives
  inside it, so the last screen stands still with content on it.

### Anchors that must keep working

Legacy pages, emails and the newsletter link to fragments on the old home page. Every one keeps a target
(a zero-size `<span id>` at the top of the mapped act where the act already has its own id):

| Old fragment | New target |
|---|---|
| `#foundations`, `#history` | A1 |
| `#mechanics` | A6 |
| `#models`, `#economics`, `#benchmarks` | A7 (benchmarks are gone: no benchmark figure is in the commission or the JSON) |
| `#build`, `#harness` | A8 |
| `#katha-latest`, `#subscribe`, `#author` | A9 |
| `#main` | `<main id="main">`, also the skip-link target |

No page is renamed, moved or removed. `_redirects` is untouched.

---

## 6. The feeling curve, the peak, the journey

### Journey (what the visitor knows by the end of each beat)

1. This is a guide to how machines learned and what they became, and it has a machine in its margin.
2. A machine can be taught, and the idea is older than the computer (1843 to 1958).
3. Promises outran results, and a single layer provably cannot learn some simple things (1966 to 1974).
4. Rules sold, then failed; learning survived the cold with a second layer (1980 to 1993).
5. Scale arrived, and one architecture made scale cheap to use (1997 to 2017).
6. Today the frontier is a priced commodity; context has converged and price has not (2026).
7. This page was made by those machines, and says exactly which.

### Feeling curve (emotion, then cause)

| Act | Emotion | Cause |
|---|---|---|
| A0 | Curiosity | A quiet title page and a grey, empty grid in the margin that is plainly waiting for something. |
| A1 | Discovery | The grid starts drawing a cross in orange and a ring in blue while the dates move from Lovelace to Rosenblatt; the caption says it is his rule, running. |
| A2 | Unease | The ground goes cold, the dust sheet comes down, and the plate, asked for XOR, will not settle. "You have been training it since the title page." |
| A3 | Vindication | Sideways through the boom and the second winter, then the plate splits into two and the flicker stops. |
| A4 | Stillness | Black ground, one line, nothing else for most of a screen. |
| A5 | **Awe (peak)** | The camera moves down an endless machine hall under your hand while the margin says 400 and the text says 60 million. |
| A6 | Clarity | Daylight, one diagram, the reason attention scaled. |
| A7 | Trust | Every dot is a real, published, dated price; the source is printed under the plot. |
| A8 | Candour | The page names the models that wrote it and shows the frames they made. |
| A9 | Resolve | The site's mark turns out to be the plate you trained; one next action. |

No two adjacent rows share an emotion. Silence (A4) sits directly before the peak.

### The peak

As a visitor would say it: *"I'd been training this tiny 400-square machine in the margin the whole way down,
and then the page went black and I was flying down a hall of computers, scrubbing the camera myself."*

It gets the asset budget (the only clip, the best still), the silence before it (A4), and the most scroll room
(3.0 with `dwell` 0.4 settling on the AlexNet line). The signature move and the tell-someone sentence point at
the same moment: the plate is visibly in the margin during the peak, which is where the scale lands.

---

## 7. The signature move: the Retina

**What it is.** A real single-layer perceptron with a 20×20 input plate, drawn in the folio, trained by scroll
position. Its 400 weights are its picture: orange cells are positive (excitatory) weights, blue cells are
negative (inhibitory), the ground colour is zero, and intensity is `|w| / max|w|`. The two brand accents are
doing information work, which is the reason the palette has two hues (§9).

**Why it is not a kit device.** It is not a progress readout, a trace rail or a recoloured spotlight; it is a
working learning machine whose state is the history being told. Describe it to someone who knows the kit and
they cannot map it to anything in it.

**Why the brief's seismograph was rejected.** The winter seismograph in `BRIEF.md` is the skill's own worked
example in `uniqueness.md` §3 (scroll-as-playhead over a persistent trace rail), so it fails the "describe it
to someone" test; its amplitude would have to plot booms and busts that have no published series, which is an
invented statistic drawn as a line; and as a bottom-fixed strip it costs a reserved band in every pinned stage
for decoration. The Retina is honest computation, sits in the margin the grammar already gives the folio, and
carries the chapter argument instead of decorating it.

### The four phases

All training is deterministic and precomputed at page load (a few kilobytes of arithmetic, well under 50ms),
so scroll position maps to a stored snapshot index. Scrolling back up un-trains it exactly. Nothing about the
training is simulated: the snapshots are the outputs of the stated rule on the stated data.

| Phase | Where | Task and rule | What the plate shows | Caption (live region, polite, phase changes only) |
|---|---|---|---|---|
| Zero | A0 | none | all cells at ground | "Untrained. One weight for each of 400 inputs, all zero." |
| Teach | A1, p 0.10→0.85 | Cross versus ring, centred glyphs with ±1 cell jitter and 3% pixel noise, seeded PRNG (seed 1958), Rosenblatt's perceptron rule, one example per step, K = 120 steps | an orange cross and a blue ring condense out of grey | "Learning to tell a cross from a ring." then, once error is zero, "Learned. Orange weights excite, blue inhibit." |
| XOR | A2, p 0.15→0.9 | "Exactly one half lit": blobs in the left half, the right half, both, or neither; "both" is always the union of a left and a right example; same rule, K = 120 | weights swing and never settle | "Asked for XOR: one half lit, not both. A single layer cannot learn this." |
| Divide | A3, p 0.55→0.95 | Same XOR data, 400 → 2 hidden (sigmoid) → 1, backpropagation, full batch, seed 1986, E = 200 epochs | the plate splits into two 20×20 hidden-unit maps side by side (4px cells), then stops flickering | "Two layers, trained by backpropagation. Solved." |
| Rest | A4 onward | none (Teach weights) | the learned cross and ring, re-inked on night | A5: "This plate: one weight for each of 400 inputs." Then the chapter head only. |

**The claims the page makes are proven, then checked.** The XOR claim follows from linear algebra (if
`w·L + b > 0`, `w·R + b > 0` and `b < 0`, then `w·(L+R) + b > 0`, so "both" cannot be rejected); the build adds
a check that Teach reaches zero training error within K, XOR never does, and Divide reaches zero within E. If
a seed stalls, change the seed and record it in a comment; never adjust a displayed result. The plate shows
no numeric readouts beyond the commission's 400, so the page states no figure that is not in the commission or
the JSON.

### How it is built

- Markup: `<figure class="retina" data-retina>` containing `<canvas aria-hidden="true">` and
  `<figcaption aria-live="polite">`. Page JS only; the engine is not touched.
- Progress: the page computes each chapter's own progress from `getBoundingClientRect()` on a single rAF loop
  (pinned acts may also read the engine's `--sc-p`), so the move works over flow sections too.
- Drawing: canvas sized by devicePixelRatio; 400 `fillRect`s per frame only when the snapshot index or ground
  changes. Colours read from CSS custom properties, so the night re-ink is a token swap.
- Verification hook: `data-sc-verify-state` on the figure publishes `phase:index`, rounded, so the harness can
  tell a moving plate from a stuck one on flow acts.
- Reduced motion: no per-frame stepping. Each chapter shows its end state (Zero, Learned, unsettled XOR shown
  as its final snapshot with the caption, Solved, Rest) and changes only on chapter entry.
- No JS: the folio shows the static mark; captions in markup describe the end states, so nothing is lost.
- Print: on `beforeprint` each history chapter gets its end-state plate painted into a print-only figure;
  without JS the print simply omits them.
- **The static mark.** The Teach phase's final weights, exported once as `assets/mark.svg` (20×20 rects, the
  same two tokens) and as the favicon. This is the site's logo on every page. Because the seed is fixed, the
  live plate at the end of A1 and the mark are the same picture, which is what the close reveals.

**Rejected extension:** letting the visitor draw on the plate to test it. It would make the close a toy, add a
second interaction competing with the peak, and make a 400-cell keyboard grid the hardest control on the site.

---

## 8. Close pattern: the colophon plate

Small type on paper, `--sc-t-sm` and `--sc-t-xs`. Left column: the mark printed at 160px with one sentence,
"The mark on every page of this site is the plate from the first chapter, trained the same way every time."
Right column, in this order: the next action as running text, "Katha Weekly argues the week in AI, one email
on Sundays. **Subscribe**." (one label, `newsletter.html`, used identically in the folio); one line naming the
other pages (Vocabulary, Prompting lab, Image generator, Apps, Katha Weekly, About); `Sources`, a `<details>`
endnote list of every source line on the page; the small print. No button island, no magnet, no spotlight.

---

## 9. Token set

All values below were measured for WCAG contrast against each ground before this file was written.

### Colour, light family (default)

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--sc-canvas` / `--gc-paper` | `#FAFBFC` | default ground | — |
| `--sc-surface` / `--gc-white` | `#FFFFFF` | raised surfaces, data chapter ground, inputs | — |
| `--gc-plate` | `#EEF2F6` | alternate chapter ground | — |
| `--gc-winter` | `#DDE5EE` | the winter chapter only | — |
| `--sc-ink` | `#121722` | text | 17.3 paper, 15.9 plate, 14.1 winter, 17.9 white |
| `--sc-ink-soft` | `#4A5466` | secondary text, captions | 7.37 paper, 6.79 plate, 6.0 winter |
| `--sc-accent` (blue) | `#1D4ED0` | action: links, focus ring, buttons, controls, negative weights, default data dots | 6.64 paper, 5.41 winter, 6.88 white |
| `--sc-accent-ink` | `#FFFFFF` | text on blue | 6.88 |
| `--gc-accent-press` | `#173FA8` | pressed/hover fill | white on it 9.08 |
| `--gc-accent-tint` | `#E8EEFB` | selection, selected rows | blue text on it 5.91 |
| `--gc-signal` (orange) | `#D9530F` | the marked thing: positive weights, the highlighted datum, rules ≥2px, large text ≥24px | 3.9 paper, 3.18 winter (non-text and large only) |
| `--gc-signal-text` | `#A8400A` | orange as small text: dates, the "this page's model" label | 5.96 paper, 5.49 plate, 4.85 winter |
| `--gc-signal-tint` | `#FCE9DE` | highlight wash | ink 15.24, signal-text 5.25 |
| `--gc-control` | `#6B7587` | input and button borders | 4.48 paper, 4.13 plate, 3.65 winter, 4.65 white |
| `--sc-hairline` | ink at 12% | rules, dividers (decorative) | — |

### Colour, night family (A4 and A5 only)

| Token | Value | Contrast on `#0B0F17` |
|---|---|---|
| `--gc-night` (ground) | `#0B0F17` | — |
| ink | `#EEF2F8` | 17.07 |
| ink-soft | `#A7B2C4` | 8.96 |
| accent (blue, light stop) | `#8FB1FF`, accent-ink `#0B0F17` | 9.04 |
| signal (orange, light stop) | `#FF8D4F` | 8.38 |
| control | `#5C6880` | 3.42 |

**Two hues, by client mandate, each owning one role.** Taste's default is one accent. Vivek's standing palette
names orange and blue, so the system gives each a job and never swaps them: **blue acts** (anything you can
press, plus inhibitory weights and ordinary data), **orange marks** (when something happened, which weight
excites, which datum is this page's own). Each hue has a light-ground and a night-ground stop, redefined with
`color` restated on the night subtree. Off the table everywhere: cream, brass, brown, sepia grades,
violet-to-blue gradients, gradient text, glow.

**Browser surfaces.** `::selection` on `--gc-accent-tint` with ink; `caret-color` and `accent-color` blue;
scrollbar thumb `--gc-control` on the ground; underline offset 0.18em, thickness 1px, 2px on hover; tabular
lining figures in every table, date and count.

### Type

Two families, both self-hosted under `assets/fonts/` with their OFL licences. No remote fonts.

| Token | Value |
|---|---|
| `--sc-font-display` | `"Instrument Sans", "IBM Plex Sans", system-ui, sans-serif`, variable `wdth` 75–100, `wght` 400–700 |
| `--sc-font-text` | `"IBM Plex Sans", system-ui, sans-serif`, variable `wght` 100–700, plus italic |
| `--sc-font-mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`: system stack, code and prompts only, never as a costume |

**Why these two.** Instrument Sans has a width axis, so intertitles get a printed broadsheet voice from
condensing (`font-stretch: 80%`) rather than from size alone, and it carries `tnum`. IBM Plex Sans was drawn
for a company whose machines are in this story; its figures are tabular by default (every digit 600 units),
which is exactly what a page of dates and prices needs, and it reads well at small sizes for captions and
tables. A serif was considered and rejected: this is paper-and-machine, and the machine side wins the text face.

| Use | Family | Size | Settings |
|---|---|---|---|
| Title page h1 | display | `--sc-t-4xl` (`--sc-t-2xl` < 700px) | stretch 80%, wght 600, track −0.025em, leading 0.96 |
| Intertitle h2 | display | `--sc-t-3xl` | stretch 82%, wght 600, track −0.02em, leading 0.98 |
| Entry title h3 | display | `--sc-t-lg` | stretch 100%, wght 600, track −0.01em, leading 1.15 |
| Body | text | `--sc-t-base` | wght 400, leading 1.6, measure 62ch, `text-wrap: pretty` |
| Body on night | text | `--sc-t-base` | wght 440, leading 1.66, track +0.005em |
| Dates | text | `--sc-t-sm` | wght 500, `--gc-signal-text`, tabular |
| Captions, source lines | text | `--sc-t-xs` | wght 400, `--sc-ink-soft`, leading 1.45 |
| Folio | display | `--sc-t-sm` | stretch 88%, wght 600 |
| Table | text | `--sc-t-sm` | tabular lining, numbers right-aligned |

Headings get `text-wrap: balance`. Titles of works (*Perceptrons*) in Plex italic. Emphasis inside a heading uses
the display face's weight, never a second face. No visible em dashes anywhere; en dashes in date ranges only.

Font files (latin subsets; latin-ext behind `unicode-range`, fetched only if used): Instrument Sans roman,
IBM Plex Sans roman and italic. About 142 KB for the three latin files; the two romans are preloaded.

### Space and grid

- The engine's 4px-base scale (`--sc-1` … `--sc-11`), `--sc-section`, `--sc-gutter`, `--sc-maxw` unchanged.
- Rhythm: date to title `--sc-2`, title to sentence `--sc-3`, entry to entry `--sc-6`; intertitle has
  `--sc-9` above and `--sc-6` below (more above a heading than below); a flow section directly after a pinned
  act takes `--sc-6` top padding instead of `--sc-section`.
- Grid ≥1100px: `[folio] var(--folio-w) [gap] var(--sc-gutter) [content] 1fr`; content is 12 columns, 1.5rem
  gaps. Spreads put text on columns 1–5 and media on 7–12, media bleeding to the right edge only.
- 700–1099px: running head, spreads 6 + 6, media bleeds right.
- Under 700px: one column, text in gutters, media full bleed edge to edge.
- `--folio-w: 13rem`, `--folio-h: 56px`.

### Radius, depth, grain

- One radius scale: `--sc-r-sm: 2px`, `--sc-r-md: 3px`, `--sc-r-lg: 4px`. No pills anywhere, including chips.
- Light-ground elevation: `--sc-shadow-color: 218 30% 22%` with the engine's alphas halved; `--sc-edge: none`
  (raised things carry a hairline instead). Elevation is rare: the Contents sheet (e3), tooltips (e2),
  raised tool surfaces on legacy pages (e1).
- No grain on paper. Section-local grain at 4% on the night acts only.

### Motion

- Easing `--sc-ease-out`; hover 140ms, press 120ms (`translateY(1px)`), sheet open 240ms
  (`--sc-ease-drawer`). Never `ease-in`, never `transition: all`, never width/height/top/left.
- Entrances from `opacity: 0; translateY(12px)` (or `scale(0.97)` for the sheet), stagger 60ms.
- Hover motion gated to `(hover: hover) and (pointer: fine)`.
- Reduced motion: engine fallbacks (poster in place of the clip, pan as a scroll region), opacity-only
  entrances, the Retina in discrete chapter states, `scroll-behavior: auto`.

### Engine contract

`assets/scrollcraft.{js,css}` stay byte-identical. `assets/site.css` overrides tokens and styles the page's own
classes; it never restyles `.sc-stage`, `.sc-copy` or any `[data-sc-*]` selector. Bespoke behaviour lives in
the page's own script. Verification compares the engine files' hashes before and after.

---

## 10. Media-column rules

1. Media never sits under type. No scrims, no text over frames, no overlays. Copy holds a column; media holds
   another.
2. Media bleeds to the outside (right) edge only, never towards the folio.
3. Every figure has a caption saying what it shows and that it is a generated image made for this page, e.g.
   "A photocell panel of the kind Rosenblatt wired to weights. Generated for this page; not the Mark I."
   Generated machines are evocations and the caption must never present one as the historical object.
4. Stage media is capped in viewport units, never percentages: `max-height: min(72svh, 760px)` in pinned
   stages at desktop, 14svh strips in A1 and 50svh in A5 on phones, `min(40svh, 360px)` in flow sections on
   phones.
5. Every `<img>` carries `width` and `height`; CSS overrides both or neither (`width: 100%; height: auto`, or
   explicit height with `object-fit: cover` where the frame shape is the design).
6. Aspect discipline: 3:4 stills for spread columns and rail cards, 16:9 for the reveal and the clip.
7. `parallax` only on an image inside an overflow-clipped frame in the media column, rate 0.6; never on text.
8. No CSS filters on media; anything off-grade is regenerated, not corrected.
9. A clip's poster is its own first frame, extracted, never a separate generation.
10. Formats: WebP stills at 1600 and 900 wide via `srcset`; `loading="lazy"` and `decoding="async"` below the
    first screen; clips through `encode.sh` (dense GOP, no audio) plus a hand-cut portrait phone encode.
11. Alt text describes the image, not the history; the caption carries the history and the disclosure.
12. No logos, no legible text, no portraits of real people in any asset (ASSETS.md enforces this at source).

---

## 11. Component inventory the legacy pages inherit

One stylesheet, `assets/site.css`, loaded after `assets/scrollcraft.css` (the engine CSS supplies the token
floor; legacy pages that are not scroll pages simply do not mount the engine JS). Each legacy page keeps its
URL, its content and its working scripts, loses its inline `<style>` blocks and its old stylesheets, and gains:

| Component | What it is | Where it lands |
|---|---|---|
| Skip link | "Skip to content", first focusable, visible on focus | every page |
| Folio | margin form ≥1100px, running-head form below and on tool pages; static mark, page title, Contents, Subscribe | every page (replaces `.nav`, `.cn-bar`, the vocabulary sidebar) |
| Mark | `assets/mark.svg`, the trained plate; also favicon | every page |
| Intertitle | display h1/h2, date or kicker on the same element, never an eyebrow stack | page heads, chapter heads |
| Spread | text column plus media column with caption | katha issues, author, apps intro |
| Plate figure | image + caption + generated-image disclosure where applicable | anywhere media appears |
| Ledger entry | date (signal-text) / title / one sentence / source line | history, Katha issue lists, changelogs |
| Source line and Endnotes | `--sc-t-xs` attribution; page-end `<details>` list | every page that states a fact |
| Label | gallery label schema: name. what it does. what it runs on. link. Same fields for every item | apps catalogue (replaces identical feature cards), vocabulary terms |
| Data table | tabular figures, right-aligned numbers, sticky header, sort buttons in headers with `aria-sort`, caption and source | model catalogue, apps table, bench data |
| Chart frame | hairline axes, ink-soft tick labels, blue dots, one orange highlight, `<title>`/`<desc>`, table twin | home A7; any future chart |
| Button | primary: blue fill, white text; secondary: 1px `--gc-control` border on surface; text link. 2px radius, one-line labels; hover, focus-visible, active, disabled all styled | forms, tools |
| Field | label above, 1px `--gc-control` border, white surface, 2px blue focus ring, inline error in signal-text with `aria-describedby` | newsletter, prompt lab, image generator |
| Disclosure | `<details>` with a drawn chevron, hairline rule | FAQs, sources, catalogue |
| Contents sheet | `<dialog>`, e3, focus trapped | folio under 1100px |
| Notice | empty, loading and error states as one-line text in ink-soft with a retry text link; no toasts | tools, data fetches |
| Code / prompt block | system mono, plate ground, hairline, copy button | prompt lab, apps |
| Icons | one local inline-SVG sprite (`assets/icons.svg`), 1.5px stroke, `currentColor` | replaces Font Awesome |
| Colophon | mark, Subscribe line, page list, small print | every page |

**Migration notes per page (deliverable 4, not this pass).** `vocabulary.html`: the sidebar becomes the folio
with the term index as Contents. `prompt-optimizer.html`, `image-generator.html`: running head at all widths;
tool panels on white surfaces with e1; Font Awesome CDN removed in favour of the sprite; `js/config.js` and
its `printf` step untouched. `apps.html`: Label schema instead of identical cards. `katha.html`,
`newsletter.html`, `author.html`: spreads, ledger, field. `blog.html`: keeps its redirect role, gains the shell.
Every page: no CDN, no remote fonts (`css/chutney.css` imports Google Fonts today and goes), light default.

---

## 12. Engineering, accessibility, data integrity

- Vanilla HTML, CSS, JS. No framework, bundler, CDN, remote font or external script. Media local under `assets/`.
- `100svh` on every pinned stage; folio space reserved (§3).
- Keyboard: every link and control reachable in reading order; focus ring 2px blue (light stop on night) with
  3px offset; the engine centres focused elements inside acts; the Contents sheet traps and returns focus.
- The Retina and the plotted dots are `aria-hidden`; their meaning is carried by captions and the table.
- Data: the page fetches `assets/model-economy.json`, the single source for the plot and the table. Counts in
  markup (25 models, 11 vendors, 21 of 25 with a served window from 1,000,000 to 1,050,000 tokens, output price
  from $0.25 to $50 per million tokens) are direct reads of that file; a runtime check compares them with the
  file and verification fails on any mismatch. No ratios, averages or derived figures are printed. If the
  fetch fails, the chapter shows a one-line notice and a link to the JSON file. The source line repeats the
  file's own `source`, `retrieved` and `note` fields.
- Provenance (A8) is filled from the generation log in `ASSETS.md`, never from the model suggestions there.
- Security: `rel="noopener"` on any new-window link; no inline event handlers; CSP meta on the home page:
  `default-src 'self'; img-src 'self' data:; media-src 'self' blob:; style-src 'self'; script-src 'self'`.
  (Page JS lives in a local file for this reason.)
- Print: history chapters print as a plain document. Folio hidden; pinned acts unpinned (`height: auto`,
  stages static); every cue forced to opacity 1; video hidden and its poster shown; rail laid out vertically;
  source lines shown inline; Retina end states painted per chapter; night chapter printed on white with ink.
- QA: `audit_html.py --strict` on every page; scrollcraft `shoot.mjs` at 1440×900, 390×844 and reduced motion;
  folio-collision measurement; rail overflow measurement; Retina phase assertions; engine hash check;
  feel check run cold and diffed against §6.

---

## 13. Fingerprint row (to append after ship)

The registry at `genai-tutorial/scrollcraft/FINGERPRINTS.md` is empty, so the gate has nothing to clear.
This build's row, recorded now so the build can be held to it:

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| genaichutney-home | Chaptered editorial | Margin folio holding a live perceptron plate, running chapter head and Contents; running head under 1100px | Type-only title page with an untrained 20×20 plate in the margin | 10 acts: flow, pin, reveal, pan, silence, scrub (peak 3.0), flow, pin+count, iris reveal, colophon; 13.1vh | Colophon plate revealing the site mark as the trained plate; running-text Subscribe | The Retina: scroll trains a real perceptron, it fails XOR, backprop divides it | Archival documentary, cool high-key, one night hall | genaichutney.com |

Claims for "What is taken": a learning machine in the folio as the signature; the logo-as-trained-weights close.
