# COMMISSION — genaichutney.com, full revamp

From Vivek, 16 Nov 2026, verbatim in substance: "completely revamp the site with the scroll
skill and this skill to make it incredibly innovative and beautiful site highlighting the
history of AI and then talk about the latest AI and then harmonize all the pages and redo the
full site. Also, we use the image and the video models to incorporate a really interesting way
to show this... Only use the Opus 55 model and have it do the full update... let claude-opus-5-5
also do the design."

So: **the design is yours.** Grammar, palette, type, grid, component language, motion,
signature move, all of it. This file is the client's content brief and the hard constraints,
nothing more. Do not treat any suggestion in it as a decision already made.

## The site

`genaichutney.com` = GenAI Chutney, a field guide to the 2026 model economy, written by Vivek
(a scientist, not a developer). Static HTML, Netlify, publish directory `genai-tutorial/`.
Existing pages: `index.html`, `apps.html`, `blog.html`, `vocabulary.html`,
`prompt-optimizer.html`, `image-generator.html`, `newsletter.html`, `katha.html`,
`author.html`. Plain HTML + one shared `styles.css` today; each page also carries inline
styles. No framework, no build step beyond a `printf` that writes `js/config.js`.

New home page: the history of AI, then the present model economy, then the making of the page
itself. The other pages must come out of the revamp looking like the same publication.

## What the home page must say (content spine, in this order)

1. **What this is.** A field guide to how machines learned, and to the market they became.
2. **1843–1958: the idea that a machine could be taught.** Ada Lovelace's Note G on the
   Analytical Engine (1843). McCulloch and Pitts' artificial neuron (1943). Turing's
   "Computing Machinery and Intelligence" (1950). The Dartmouth workshop that named the field
   (1956). Rosenblatt's perceptron, the Mark I, 400 photocells wired to weights (1958).
3. **1966–1974: the first promise, the first bill.** Weizenbaum's ELIZA and its DOCTOR script
   (1966). Minsky and Papert's *Perceptrons* on what a single layer cannot do, XOR included
   (1969). The Lighthill report and the British funding collapse (1973). The first winter.
4. **1980–1993: rules bought, rules broken.** Expert systems in industry (XCON at DEC, 1980).
   Japan's Fifth Generation Computer project (1982). The second winter. Backpropagation
   popularised by Rumelhart, Hinton and Williams (1986), kept alive through the cold.
5. **1997–2017: the decade the curve bent.** Deep Blue over Kasparov (1997). ImageNet (2009).
   AlexNet, 60 million parameters, 15.3 percent top-5 error (2012). AlphaGo over Lee Sedol
   (2016). "Attention Is All You Need" (2017): the transformer, and why attention scaled
   where recurrence did not.
6. **2020–2026: the economy of tokens.** Context length, price per million tokens, and what
   actually separates one frontier model from another. Real published figures only, from
   `assets/model-economy.json` (Venice catalogue, pulled 16 Nov 2026, source recorded in the
   file). This is the chapter that answers "the latest AI".
7. **What made this page.** The provenance plate. State plainly which model wrote the markup
   (claude-opus-5-5), which model generated the stills, which model generated the camera move,
   and on what date. The page demonstrates its own thesis; do not hide that.
8. **Where to go next.** The field guide pages, the apps, the newsletter. One next action.

Every fact above is published and checkable. Do not add any figure that is not in this file
or in `assets/model-economy.json`, and do not invent quotes. If a claim needs a source line,
write one.

## The assets (generated, not stock)

`assets/stills/` and `assets/video/` are filled by the operator from your `ASSETS.md` sheet
(see Deliverable 2). You art-direct: subject, framing, lens, light, colour, crop, and what each
one is *for*. Rules: photoreal or period-documentary, no text baked into any image, no visible
corporate logos, nothing that pretends to be a real photograph of a real person. Machines,
rooms, paper, hands, tape, plotters: yes. Invented portraits of real historical figures: no.
The camera-move clip is generated image-to-video from one of your stills, so keep at least one
still composed to move through.

## Hard constraints

**Palette and taste.** Vivek's standing palette: white or near-white ground with orange and
blue accents, light theme as the default. Cream-and-brass and violet-to-blue AI gradients are
both out. Dark acts are allowed as scenes if the design earns them, but the publication's
default surface is light.

**Skills.** Read and obey, in this order:
- `/home/vivgates/.hermes/skills/web-development/scrollcraft/SKILL.md`, then
  `references/uniqueness.md`, `references/taste.md`, `references/devices.md`,
  `references/feel.md`, `references/verify.md`, and `references/template.html`.
  The engine is already copied to `genai-tutorial/assets/scrollcraft.{js,css}`; never edit it.
  The fingerprint registry is empty, so this is the first row, but the grammar still has to be
  a deliberate choice with the other seven argued down.
- `/home/vivgates/.hermes/skills/creative/standalone-html-studio/SKILL.md` for the QA and
  portability discipline (`scripts/audit_html.py` is at that skill's path and can be run
  against any file). Note this site is multi-file by necessity (video, stills), so the
  single-file rule applies to its accessibility, security and data-integrity clauses, not to
  bundling media.

**Engineering.** No framework, no bundler, no CDN, no remote fonts, no external JS. Vanilla
HTML, CSS, JS. All media local under `assets/`. Keyboard reachable, focus visible, reduced
motion honoured, `100svh` where a stage pins, print styles for the history chapters. The engine
stays byte-identical; bespoke behaviour lives in the page.

**Never break the other pages' URLs.** They are linked from email, search and the newsletter.

## Deliverables, in this order

1. **`genai-tutorial/DESIGN.md`** — the design decision record: grammar and why the other
   seven lost, nav treatment, hero device, act sequence with spans and total viewport-height
   budget, close pattern, the one signature move with how it is built, the feeling curve with
   the peak, the token set (colour, type, spacing, motion), the media-column rules, and the
   component inventory the legacy pages will inherit. Written before markup.
2. **`genai-tutorial/ASSETS.md`** — the art-direction sheet: one row per asset with filename,
   purpose, exact generation prompt (shared style preamble repeated verbatim), model
   suggestion, aspect ratio, and which chapter and crop it serves. Include the camera-move
   clip's start frame, the move itself, and the duration.
3. `index.html` + `assets/site.css` built from 1 and 2.
4. Legacy page migration, after the home page is verified.

Start with 1 and 2 only. Stop after writing them and report the grammar, the signature move,
and the asset list. Do not write HTML yet, and do not touch the legacy pages.
