# ASSETS — art-direction sheet, genaichutney.com home page

Companion to `DESIGN.md` (§5 acts, §7 the Retina, §10 media-column rules). Revised 16 November 2026 on the
client's correction: the imagery is **a museum of the future, holographic, made to create wonder**, and video
generation carries as much of the page as the grammar allows. This sheet replaces the earlier archival sheet
in full. Art director: claude-opus-5-5.

Eight generated stills (two shipped as stills, six used as start frames) and six generated clips. Everything
is generated on the **Venice API**. There is no kie.ai key, and nothing in this sheet uses kie.

---

## 1. The world: the museum of the future

The reader walks through a museum that does not exist yet. Its galleries are bright, quiet and white. Each
exhibit is a machine or an idea from the history of AI, shown as a **hologram**: fine luminous filaments,
suspended points of light and translucent panes floating over white stone plinths or inside clear vitrines.
Real period objects (a teletype, a photocell panel, a row of cabinets) stand in the room with their idea
drawn above them in light. Each gallery is a chapter. The deepest gallery, the peak, is the only one at night.

**Why this world.** The page shows the history of AI from where the reader is standing, in 2026, so its
museum is one built by the future. Wonder comes from scale and light, not from darkness: the default surface
stays light and five of the six video moments happen in daylight.

**Colour is the identity, so it is held hard.** Hologram light is drawn in exactly **cobalt blue** and
**signal orange**, plus white. These are the site's two accents (`--sc-accent` #1D4ED0, `--gc-signal`
#D9530F), and they echo the Retina's encoding: orange marks, blue holds. Where the two colours cross they stay
separate filaments. They never mix into purple, pink or magenta. No scene is dominated by violet, there are no
purple gradients, and nothing iridescent, rainbow, neon or cyberpunk.

## 2. Rules that apply to every asset

- **No text of any kind in any frame or video frame.** No letters, digits, labels, wall text, signage,
  screens with writing, numerals on wheels or dials, or printing on paper or cards. Paper is blank. A single
  legible glyph, real or pseudo, means a reroll.
- **No visible corporate logos** or anything that reads as a brand mark.
- **No people.** No faces, hands, figures, silhouettes or reflections of people. Nothing may look like a
  photograph of a real person or a real event.
- **Evocation, not replica.** Every machine is an imagined exhibit of its era, not a named historical object.
  Captions say so ("An imagined exhibit. Generated for this page.") and never present a frame as the real
  Mark I, XCON or anything else.
- **Type never sits on media.** No copy, scrim or overlay is ever placed on a still or clip. Captions,
  sources and the pause control sit under the frame in the caption (DESIGN §10.1). The empty space named in
  each prompt is there for crops, not for copy.
- **Light default.** Every still and clip is high-key daylight except S6/V4, the night gallery that sits on
  DESIGN's night acts (A4–A5).
- **Photosensitivity.** No flashes, strobing or flicker. Brightness changes in clips are gradual. Reject any
  clip with more than three luminance flashes in any second (WCAG 2.3.1).
- **No CSS filters** on any asset. Off-grade means regenerate.

## 3. Shared style preamble (stills)

Pasted verbatim, character for character, at the top of every still prompt, then one blank line, then the
scene. It is repeated in full in every still prompt in §6. With the operator's script it goes in the manifest's
`style` field, which the script prepends to each scene as `style + "\n\n" + prompt`. That is the same text,
so the scene alone goes in `prompt`.

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.
```

**Still negative prompt** (manifest `negative` field, sent as `negative_prompt`):

```
text, letters, numbers, digits, words, signage, labels, watermark, logo, brand, people, person, face, hands, silhouette, purple, violet, magenta, pink, teal, rainbow iridescence, chrome, neon, cyberpunk, lens flare, brass, amber, gold, sepia, cream, 3d render, cgi, illustration, cartoon, video game
```

## 4. Shared motion preamble (clips)

Pasted verbatim at the top of every clip prompt, then one blank line, then the clip's own direction. It is
repeated in full in every clip prompt in §7.

```
One continuous shot inside the same museum of the future as the start frame. Keep the start frame's composition, architecture, materials, colours and light exactly; stone, glass, plinths and walls are solid and never move, bend, melt or morph. Holograms are fine luminous filaments and points of cobalt blue, signal orange and white light, and the two colours never blend into purple, pink or magenta. All motion is slow, smooth, gradual and physically calm. No text, letters, numbers, logos or signage appear at any time. No people, faces, hands or figures appear at any time. No cuts, no scene changes, no flashes, no flicker, no strobing, no camera shake.
```

**Clip negative prompt** (send only if the model accepts one):

```
text, letters, numbers, watermark, logo, signage, people, person, face, hands, purple, violet, magenta, pink, rainbow, flicker, strobe, flash, cut, scene change, warping, morphing, melting architecture, jitter, camera shake, blur
```

---

## 5. The set at a glance

### Stills (Venice `seedream-v5-pro`)

| ID | File (raw → shipped) | Purpose | Chapter, slot, crop | AR | Seed |
|---|---|---|---|---|---|
| S1 | `raw/01-atrium` → start frame of V1 | Establishing gallery: the engine and its cards of light | A1 via V1 | 16:9 | 1843 |
| S2 | `raw/02-retina` → `stills/02-retina-{1600,900}.webp` | Rosenblatt's idea: photocells whose weights are threads of light | A1 media column, arrives with the 1958 entry over V1. Desktop full 3:4. Phone 14svh strip, `object-position: 50% 28%` | 3:4 | 1958 |
| S3 | `raw/03-eliza` → start frame of V2 | The first promise: a conversation drawn in light | A2 via V2 | 16:9 | 1966 |
| S4 | `raw/04-rules` → `stills/04-rules-{1600,900}.webp` | Rules bought: cabinets under a rigid tree of light | A3 rail card "XCON, 1980". 3:4 card, `object-position: 50% 40%` | 3:4 | 1980 |
| S5 | `raw/05-thaw` → start frame of V3 | Kept alive through the cold: a two-layer network asleep | A3 via V3 | 9:16 | 1986 |
| S6 | `raw/06-hall` → start frame of V4 | **The peak's start frame.** The night gallery, composed to be moved through | A5 via V4 | 16:9 | 1997 |
| S7 | `raw/07-attention` → start frame of V5 | Attention: every token weighing every other at once | A6 via V5 | 16:9 | 2017 |
| S8 | `raw/08-plate` → start frame of V6 | The plate as an exhibit: the page's own machine | A8 via V6 | 16:9 | 2026 |

S6 gets the budget: up to four rolls, keep the best. Every other still gets up to two.

### Clips (Venice image-to-video)

| ID | Job | Start frame | Mode on the page | Duration | AR (phone cut) | Model | Chapter, slot |
|---|---|---|---|---|---|---|---|
| V1 | **Establishing** | S1 | Plays once when A1 enters, holds last frame | 10 s | 16:9 (16:9 at 720) | `kling-v3-pro-image-to-video` | A1 media column, greets at p = 0; desktop cover-crops to 3:4, `object-position: 50% 55%` |
| V2 | **Transition into the first winter** | S3 | Plays once when the reveal-down completes, holds last frame | 5 s | 16:9 (16:9 at 720) | `seedance-2-5` | A2 media column, inside the `reveal="down"` figure; phone `object-position: 58% 50%` |
| V3 | **Transition out of the cold** | S5 | Plays once when its rail card settles, holds last frame | 5 s | 9:16 (9:16 at 540) | `seedance-2-5` | A3 rail card "Backpropagation, 1986", cover-cropped to 3:4, `object-position: 50% 50%` |
| V4 | **The peak move** | S6 | **Scrubbed** (`data-sc-scrub`, the page's only scrub), dwell 0.4 | 10 s | 16:9 (1:1 at 720) | `kling-v3-pro-image-to-video` | A5 video column, cols 7–12, full stage height; phone 50svh band |
| V5 | **The attention chapter** | S7 | Seamless loop while in view | 10 s (9 s loop) | 16:9 (16:9 at 720) | `seedance-2-5` | A6 media column beside the text; the SVG diagram stays the explanation |
| V6 | **The provenance loop** | S8 | Seamless loop while in view | 10 s (9 s loop) | 16:9 (16:9 at 720) | `seedance-2-5` | A8 contact sheet, first tile at double width, inside the iris reveal |

**Model assignment.** Camera moves (V1, V4) go to `kling-v3-pro-image-to-video`. Clips where the camera is
locked and only the exhibit changes (V2, V3, V5, V6) go to `seedance-2-5`. If a clip fails its acceptance
check twice, retry once on the other model with the identical prompt and log the switch. Durations are the
targets. If a model does not offer them, use its nearest offered duration and log it. Never take a scrub clip
under 5 s.

---

## 6. Still prompts (full, exact)

### S1 · `01-atrium` · 16:9 · seed 1843 · start frame of V1

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.

The museum's first gallery: a tall, quiet white atrium with one long skylight running the length of the ceiling. In the centre of the room, on a low round white stone plinth, stands a full-size hologram of a nineteenth-century mechanical calculating engine: three tall columns of stacked toothed wheels on vertical shafts, drawn entirely in fine luminous signal-orange filaments, every tooth crisp, no numerals or marks on any wheel. From the engine's right side a long chain of punched cards made of translucent cobalt-blue light, each card a thin pane with small rectangular holes and nothing printed on it, folds down in a loose concertina to the floor and trails away across the stone. Faint haze in the air catches the light. Polished white stone floor holding soft reflections of the orange wheels and blue cards. Camera at standing eye height about eight metres back, centred, perfectly level. The engine and its cards occupy the centre third of the frame from the floor to two-thirds height; generous quiet white wall and skylight on both sides and across the top quarter. Wide horizontal composition, landscape orientation.
```

### S2 · `02-retina` · 3:4 · seed 1958 · shipped still

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.

A late-1950s laboratory apparatus displayed in a tall clear glass vitrine in a white gallery: a square grey-painted steel panel holding a precise grid of small round glass photocells in black sockets, many rows and columns, evenly spaced. From the back of every photocell a single fine thread of light runs forward and down to one shared bright point near the bottom of the case; the threads are of different brightness, some cobalt blue and some signal orange, so the strengths of hundreds of adjustable weights are made visible as a fan of coloured light. A row of plain unmarked rotary knobs along the base of the case. Soft daylight from a skylight above, clean reflections on the glass. The photocell grid occupies the upper third of the frame, centred; the fan of threads fills the middle third; the lower third is white plinth and floor. Vertical composition, portrait orientation.
```

### S3 · `03-eliza` · 16:9 · seed 1966 · start frame of V2

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.

A white gallery with a long low clear glass vitrine on a white stone plinth. Inside it sits a real 1960s teletype terminal in grey enamel, its keys blank, its paper roll blank with no characters anywhere. Rising from the terminal's paper is a hologram of a conversation: one long ribbon of warm signal-orange light that curls up, loops over itself and returns toward the terminal like a dialogue answering itself, bright, lively and inviting, with a few small cobalt-blue points of light caught inside its loops. Soft daylight, white walls, clear glass catching the orange light. The vitrine runs across the centre of the frame, its centre slightly right of the middle; the left third of the frame is quiet white wall and floor. Camera at standing eye height, level, square to the vitrine. Wide horizontal composition, landscape orientation.
```

### S4 · `04-rules` · 3:4 · seed 1980 · shipped still

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.

A 1980 corporate computer room installed as a gallery: a straight aisle of white stone between two rows of tall pale-grey minicomputer cabinets with smoked-glass doors, plain toggle switches and small unlit square lamps, no markings anywhere. Suspended in the air above the aisle is a hologram of a vast branching decision tree drawn in rigid, perfectly straight cobalt-blue lines with right-angled branches, every branch ending in a small closed square of light; one single path from the top of the tree down to one leaf is lit in signal orange. Soft light from a long skylight overhead. Camera at standing height in the middle of the aisle looking down its length, symmetric, vanishing point at the centre of the frame; the cabinets fill the lower half on both sides and the decision tree fills the upper half. Vertical composition, portrait orientation.
```

### S5 · `05-thaw` · 9:16 · seed 1986 · start frame of V3

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.

A narrow, tall clear glass vitrine on a white stone plinth in a quiet white gallery, its glass frosted white at the edges and corners. Inside, suspended in the air, a small hologram of a two-layer network: a row of small points of light along the bottom, a shorter row of points above it, and one single point at the top, every point joined to every point in the next row by fine straight threads of light. Everything inside the case is dim, cold, pale cobalt blue, as if asleep under frost; no orange anywhere yet. Soft daylight from above, the room hushed. The network occupies the centre of the frame between one-third and two-thirds height; plinth below, plain white wall above. Camera at standing eye height, level, centred. Tall vertical composition, portrait orientation.
```

### S6 · `06-hall` · 16:9 · seed 1997 · start frame of V4 (the peak)

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.

The deepest gallery of the museum, at night, with the room lights off. A long, perfectly straight central aisle of polished dark stone runs away from the camera between two unbroken walls of tall transparent glass cabinets, hundreds deep, receding to a single vanishing point exactly at the centre of the frame. Inside every cabinet hangs a dense, perfectly still cloud of tiny steady points of light, mostly white, with cobalt blue throughout and a scattering of signal orange, so the two walls read as an endless library of suspended constellations, each cabinet a machine made of light. A thin line of soft white light runs along the centre of the ceiling into the distance and reflects as a soft line down the middle of the floor. Deep slate-blue darkness at the top corners and the near edges; the aisle and the vanishing point are the brightest region. Symmetric one-point perspective, camera at standing height in the exact middle of the aisle, perfectly level. Wide horizontal composition, landscape orientation, composed so that a slow forward camera move along the aisle stays symmetric throughout.
```

### S7 · `07-attention` · 16:9 · seed 2017 · start frame of V5

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.

A bright white gallery with one long low white stone plinth running across the room. Floating above it at eye height is a single straight row of about a dozen small luminous spheres of white light, evenly spaced like beads on an invisible thread, all the same size. Every sphere is joined to every other sphere at the same moment by fine arcs of light that rise above the row and fall back down to it, forming a dense, delicate canopy of arcs; most arcs are faint cobalt blue and a few are brighter signal orange. Soft daylight from a skylight, faint haze catching the arcs, soft coloured reflections on the plinth. The row of spheres spans the middle half of the frame at mid-height with the canopy above it; quiet white wall all around. Camera at standing eye height, level, square to the row. Wide horizontal composition, landscape orientation.
```

### S8 · `08-plate` · 16:9 · seed 2026 · start frame of V6

```
Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.

The museum's last room: a small, quiet white gallery with one low square white stone plinth in the centre. Floating a hand's width above the plinth, flat and level like a tile, is a square grid of small square cells of light separated by fine clear gaps; the cells are cobalt blue or signal orange at many different brightnesses, and many are nearly clear, together forming a soft abstract pattern with no recognisable picture and no symbols. The grid casts soft coloured light down onto the plinth. Soft daylight from a skylight above. Camera at standing eye height, slightly above the grid, looking down at about twenty degrees, centred, level. The plinth and grid occupy the centre third of the frame; quiet white space all around. Wide horizontal composition, landscape orientation.
```

---

## 7. Clip prompts and specs (full, exact)

Common to every clip:

- **Start frame:** the accepted raw still, unmodified, at full returned resolution.
- **End frame:** none. A pinned end frame makes models pull the camera back to reconcile two images, which
  reads as a reversal. Loops are closed in post (§8), not by an end frame.
- **Poster:** the clip's own first frame, extracted from the **encoded** file, never a separate generation.
- **Play-once clips** also ship an end frame (`-end.webp`), extracted from the encoded file. It is shown under
  reduced motion and in print, because the end state is the chapter's meaning.
- **Every clip that plays** (V1, V2, V3, V5, V6) is muted, `playsinline` and starts only when in view. Loops
  pause when out of view. Each has a visible pause/play text button in its caption, never on the frame.
  Under reduced motion nothing autoplays.
- **No audio** in any shipped file.

### V1 · establishing · `01-atrium` · from S1 · 10 s · 16:9 · `kling-v3-pro-image-to-video`

**Job:** opens the history. It is the first media on the page (the title page stays type-only per DESIGN §4),
and it establishes the museum, the light and the two colours in one shot.
**Move:** a slow, level dolly-in toward the plinth, covering about a third of the distance. The engine stays
centred and whole. The wheels turn and the cards advance in place.
**Page behaviour:** plays once when A1 enters, then holds its last frame for the rest of the chapter.
**Accept only if:** the camera moves one way only; the engine never leaves the centre third (it must survive
the 3:4 column crop); the wheels show no numerals; the cards never pick up printing; the architecture does not
breathe.

```
One continuous shot inside the same museum of the future as the start frame. Keep the start frame's composition, architecture, materials, colours and light exactly; stone, glass, plinths and walls are solid and never move, bend, melt or morph. Holograms are fine luminous filaments and points of cobalt blue, signal orange and white light, and the two colours never blend into purple, pink or magenta. All motion is slow, smooth, gradual and physically calm. No text, letters, numbers, logos or signage appear at any time. No people, faces, hands or figures appear at any time. No cuts, no scene changes, no flashes, no flicker, no strobing, no camera shake.

The camera moves slowly and steadily forward toward the plinth, one smooth continuous dolly-in at constant speed, perfectly level, no tilt, no pan, no zoom, covering about a third of the distance to the engine. As it approaches, the orange wheels of the hologram engine turn slowly, each column at its own gentle pace, and the blue cards of light advance one by one down the concertina chain like a loom being fed. The atrium, skylight and plinth stay perfectly still. The engine stays centred and fully in frame until the last frame.
```

### V2 · transition into the first winter · `02-winter` · from S3 · 5 s · 16:9 · `seedance-2-5`

**Job:** the hinge between the first promise and the first bill. The conversation of light freezes.
**Move:** locked camera. The ribbon slows, stiffens and cools from orange to dim blue. Frost spreads down the
inside of the glass from the top edge, the same direction as the chapter's `reveal="down"` wipe.
**Page behaviour:** plays once when the reveal completes and holds the frozen last frame. Reduced motion and
print show `02-winter-end.webp`.
**Accept only if:** the colour passes from orange to blue without going through purple or pink in any frame
(check 10 evenly spaced frames); no frame brightens suddenly; the teletype paper stays blank.

```
One continuous shot inside the same museum of the future as the start frame. Keep the start frame's composition, architecture, materials, colours and light exactly; stone, glass, plinths and walls are solid and never move, bend, melt or morph. Holograms are fine luminous filaments and points of cobalt blue, signal orange and white light, and the two colours never blend into purple, pink or magenta. All motion is slow, smooth, gradual and physically calm. No text, letters, numbers, logos or signage appear at any time. No people, faces, hands or figures appear at any time. No cuts, no scene changes, no flashes, no flicker, no strobing, no camera shake.

The camera holds perfectly still. Over the whole shot the warm orange ribbon of light slows down, its loops stiffen and stop moving, and its light fades from orange to a dim, pale cobalt blue, the orange simply dimming away while the blue remains, never passing through any purple or pink. A thin bloom of white frost spreads across the inside of the vitrine glass from the top edge downward, and the daylight in the room becomes slightly greyer and colder. In the final second the hologram is a faint, frozen blue ribbon behind frosted glass, completely still.
```

### V3 · transition out of the cold · `03-thaw` · from S5 · 5 s · 9:16 · `seedance-2-5`

**Job:** the hinge out of the winters. Backpropagation wakes the two-layer network: a signal runs from the
output down to the inputs, which is the direction the method sends its error. It mirrors V2.
**Move:** locked camera. Frost clears from the centre outward. An orange pulse runs from the top point down
through the threads, which settle into a steady mix of orange and blue.
**Page behaviour:** plays once when its rail card settles (the page's own `--sc-p` threshold for that card),
then holds its last frame. Reduced motion and print show `03-thaw-end.webp`. Under the engine's reduced-motion
scroll region it does not play.
**Accept only if:** the pulse travels top to bottom and never reverses; the network keeps its structure and no
points appear or vanish; it survives a centre crop to 3:4.

```
One continuous shot inside the same museum of the future as the start frame. Keep the start frame's composition, architecture, materials, colours and light exactly; stone, glass, plinths and walls are solid and never move, bend, melt or morph. Holograms are fine luminous filaments and points of cobalt blue, signal orange and white light, and the two colours never blend into purple, pink or magenta. All motion is slow, smooth, gradual and physically calm. No text, letters, numbers, logos or signage appear at any time. No people, faces, hands or figures appear at any time. No cuts, no scene changes, no flashes, no flicker, no strobing, no camera shake.

The camera holds perfectly still. The frost on the vitrine glass slowly recedes from the centre outward and clears. Then a soft pulse of signal-orange light travels down from the single point at the top, through the threads, to the middle row and on to the bottom row, never going back up. The threads it passes through settle into a steady mix of orange and blue, some brighter than others, and every point of the network now glows gently. In the final second the whole network is awake and completely steady, warm and clear behind clean glass.
```

### V4 · the peak move · `hall` · from S6 · 10 s · 16:9 · `kling-v3-pro-image-to-video`

**Job:** the peak (DESIGN §6). The reader scrubs the camera down the night gallery while the margin plate says
400 and the text says 60 million.
**Move:** one continuous dolly forward along the centre line at constant speed. Level, no tilt, pan, roll or
zoom. It covers about a fifth of the visible aisle, so the vanishing point never arrives. The cabinets slide
past as even, symmetric parallax. The points of light stay steady, because twinkling lights shimmer badly when
scrubbed.
**Page behaviour:** `data-sc-scrub`, the page's only scrub act, span 3.0, dwell 0.4. The engine shows the
poster under reduced motion.
**Accept only if:** the camera moves one way from the first frame to the last; the cabinet glass does not warp
or breathe; no light blinks or swims; symmetry holds within a few percent; there is no glyph in any frame (step
through at 1 fps); the vanishing point is still distant in the last frame.

```
One continuous shot inside the same museum of the future as the start frame. Keep the start frame's composition, architecture, materials, colours and light exactly; stone, glass, plinths and walls are solid and never move, bend, melt or morph. Holograms are fine luminous filaments and points of cobalt blue, signal orange and white light, and the two colours never blend into purple, pink or magenta. All motion is slow, smooth, gradual and physically calm. No text, letters, numbers, logos or signage appear at any time. No people, faces, hands or figures appear at any time. No cuts, no scene changes, no flashes, no flicker, no strobing, no camera shake.

The camera glides slowly and steadily forward along the exact centre of the aisle, one smooth continuous dolly-in at constant speed, perfectly level, no tilt, no pan, no roll, no zoom. The two walls of glass cabinets slide past on both sides as even, symmetric parallax, and the line of ceiling light and its reflection on the floor stay on the centre line the whole time. The vanishing point stays fixed at the centre of the frame and is never reached. The tiny points of light inside the cabinets stay perfectly steady and do not blink or twinkle. Nothing enters or leaves the frame, and nothing moves except the camera. Slow, calm, controlled, one single take with no change of speed.
```

### V5 · the attention chapter · `05-attention` · from S7 · 10 s → 9 s loop · 16:9 · `seedance-2-5`

**Job:** makes the chapter's idea felt. Every token weighs every other at the same moment, and the reader
watches many arcs brighten at once rather than one after another. The inline SVG diagram in A6 stays the
explanation. The clip is atmosphere and is `aria-hidden`; its caption describes it.
**Move:** locked camera. The spheres stay fixed. Arcs brighten to orange and fade back to blue, several at once
in different places, with the scene's overall brightness constant.
**Page behaviour:** seamless loop while in view (seam made in §8), paused out of view, with a pause control in
the caption.
**Accept only if:** the spheres do not drift, multiply or merge; total brightness is steady (no pulsing of the
whole frame); no purple appears where orange and blue arcs cross.

```
One continuous shot inside the same museum of the future as the start frame. Keep the start frame's composition, architecture, materials, colours and light exactly; stone, glass, plinths and walls are solid and never move, bend, melt or morph. Holograms are fine luminous filaments and points of cobalt blue, signal orange and white light, and the two colours never blend into purple, pink or magenta. All motion is slow, smooth, gradual and physically calm. No text, letters, numbers, logos or signage appear at any time. No people, faces, hands or figures appear at any time. No cuts, no scene changes, no flashes, no flicker, no strobing, no camera shake.

The camera holds perfectly still and the row of spheres stays exactly where it is. Across the canopy, brightness moves gently: arcs slowly brighten from faint blue to signal orange and then fade back to blue, several at the same time in different places across the canopy, as if every sphere is weighing every other sphere at the same moment. Where an orange arc crosses a blue arc, each keeps its own colour. The pacing is calm and even and the overall brightness of the scene stays constant from start to finish. The last moments look much like the first.
```

### V6 · the provenance loop · `06-plate` · from S8 · 10 s → 9 s loop · 16:9 · `seedance-2-5`

**Job:** the page shows its own making. The museum's last exhibit is a plate of light like the one in the
page margin, which tells the reader the machine they trained is now on display. It is the first tile, at
double width, of the A8 contact sheet, and the page's one iris reveal uncovers it. The pattern is generated,
and the caption says it is an imagined exhibit, not the site's mark.
**Move:** locked camera. A slow wave of brightening crosses the grid from one corner to the opposite corner,
and the grid rises and settles by a few millimetres.
**Page behaviour:** seamless loop while in view, with a pause control in the caption.
**Accept only if:** the grid stays square, flat and the same size; the cells never form a symbol, letter or
picture; the coloured light on the plinth moves with the cells.

```
One continuous shot inside the same museum of the future as the start frame. Keep the start frame's composition, architecture, materials, colours and light exactly; stone, glass, plinths and walls are solid and never move, bend, melt or morph. Holograms are fine luminous filaments and points of cobalt blue, signal orange and white light, and the two colours never blend into purple, pink or magenta. All motion is slow, smooth, gradual and physically calm. No text, letters, numbers, logos or signage appear at any time. No people, faces, hands or figures appear at any time. No cuts, no scene changes, no flashes, no flicker, no strobing, no camera shake.

The camera holds perfectly still. The square grid of light stays flat, level and the same size, and floats gently, rising and settling by a few millimetres like slow breathing. A slow, soft wave of brightening passes across the grid from the near left corner to the far right corner, each cell briefly glowing a little brighter in its own colour, blue or orange, then returning to its earlier brightness. The coloured light cast on the plinth below follows the cells. The cells never form a symbol, letter or picture. The last moments look much like the first.
```

---

## 8. Generation and encoding, step by step (Venice only)

### Stills: the operator's existing script

`../scripts/gen_images.py` posts to Venice `/image/generate`, prepends the manifest's `style` to each prompt
with a blank line, sends `negative_prompt`, `aspect_ratio`, `resolution` and an optional `seed`, and skips
outputs that already exist unless `--force` is given. It saves the bytes Venice returns and prints the real
format, so the `out` extension is a label. Before the full batch, run S1 alone to confirm `seedream-v5-pro`
accepts `16:9`, `3:4` and `9:16` at `2K`.

Save as `assets/stills-manifest.json`. `style` and `negative` are the §3 blocks verbatim; each `prompt` is the
scene paragraph only.

```json
{
  "style": "Photograph of a museum of the future, made for its permanent collection catalogue: a real place, physically photographed. Luminous galleries of matte white stone, pale ash wood and clear glass, airy, calm and spacious. Every exhibit is a machine or an idea from the history of computing presented as a hologram: a volumetric projection made of fine luminous filaments, tiny suspended points of light and translucent glass-like panes, floating above a low white stone plinth or inside a clear glass vitrine, crisp and solid-looking, casting real coloured light on nearby stone and glass. Hologram light uses exactly two colours plus white: a clean cobalt blue that never leans violet, and a bright signal orange that never leans amber or gold; the two stay separate and never blend into purple, pink or magenta. Shot on a full-frame camera with a 35mm lens at f/5.6, level, corrected verticals, standing eye height unless the scene says otherwise. Light: soft diffuse daylight from skylights unless the scene names another source. Grade: in daylight galleries high key, cool clean whites and soft pale-grey shadows, the hologram the only saturated colour in the frame; in a night gallery, deep slate-blue shadows that never crush to pure black. Texture: fine grain, a faint haze in the air catching the light, true reflections on stone and glass, small honest imperfections in the materials. Mood: hushed wonder, the future arriving. Photographic realism. NOT 3D render, NOT CGI look, NOT illustration, NOT a video game, NOT sci-fi neon, no cyberpunk, no lens flare, no bloom over the whole frame, no rainbow iridescence, no chrome, no purple, no violet, no magenta, no pink, no teal, no brass, no amber, no gold, no cream, no sepia. Absolutely no text, letters, numbers, digits, labels, signage, captions, wall text, screens with writing, logos or brand marks. No people, no faces, no hands, no human figures, no silhouettes, no reflections of people.",
  "negative": "text, letters, numbers, digits, words, signage, labels, watermark, logo, brand, people, person, face, hands, silhouette, purple, violet, magenta, pink, teal, rainbow iridescence, chrome, neon, cyberpunk, lens flare, brass, amber, gold, sepia, cream, 3d render, cgi, illustration, cartoon, video game",
  "items": [
    {"id": "S1-atrium",    "model": "seedream-v5-pro", "aspect_ratio": "16:9", "resolution": "2K", "seed": 1843, "out": "assets/stills/raw/01-atrium.webp",    "prompt": "<S1 scene paragraph from §6, verbatim>"},
    {"id": "S2-retina",    "model": "seedream-v5-pro", "aspect_ratio": "3:4",  "resolution": "2K", "seed": 1958, "out": "assets/stills/raw/02-retina.webp",    "prompt": "<S2 scene paragraph from §6, verbatim>"},
    {"id": "S3-eliza",     "model": "seedream-v5-pro", "aspect_ratio": "16:9", "resolution": "2K", "seed": 1966, "out": "assets/stills/raw/03-eliza.webp",     "prompt": "<S3 scene paragraph from §6, verbatim>"},
    {"id": "S4-rules",     "model": "seedream-v5-pro", "aspect_ratio": "3:4",  "resolution": "2K", "seed": 1980, "out": "assets/stills/raw/04-rules.webp",     "prompt": "<S4 scene paragraph from §6, verbatim>"},
    {"id": "S5-thaw",      "model": "seedream-v5-pro", "aspect_ratio": "9:16", "resolution": "2K", "seed": 1986, "out": "assets/stills/raw/05-thaw.webp",      "prompt": "<S5 scene paragraph from §6, verbatim>"},
    {"id": "S6-hall",      "model": "seedream-v5-pro", "aspect_ratio": "16:9", "resolution": "2K", "seed": 1997, "out": "assets/stills/raw/06-hall.webp",      "prompt": "<S6 scene paragraph from §6, verbatim>"},
    {"id": "S7-attention", "model": "seedream-v5-pro", "aspect_ratio": "16:9", "resolution": "2K", "seed": 2017, "out": "assets/stills/raw/07-attention.webp", "prompt": "<S7 scene paragraph from §6, verbatim>"},
    {"id": "S8-plate",     "model": "seedream-v5-pro", "aspect_ratio": "16:9", "resolution": "2K", "seed": 2026, "out": "assets/stills/raw/08-plate.webp",     "prompt": "<S8 scene paragraph from §6, verbatim>"}
  ]
}
```

Each placeholder is replaced by the scene paragraph exactly as written in §6, the text after the blank line.
To reroll, change that item's `seed` (log it) and run with `--force`, or delete the file.

```bash
cd /home/vivgates/Projects/genaichutney/genai-tutorial
mkdir -p assets/stills/raw assets/video lab/clips lab/prompts
python3 ../scripts/gen_images.py assets/stills-manifest.json
```

### Clips: Venice image-to-video

The operator's script covers stills only. Each clip is one Venice image-to-video request carrying the model id
from §5, the full prompt from §7 (motion preamble, blank line, direction), the accepted start still, the
duration, the aspect ratio, and the clip negative prompt if the model accepts one. **This sheet does not assume
the endpoint path, field names, how the image is passed, or which durations and aspect ratios each model
accepts.** Confirm them in Venice's video API documentation before the first call. If a request is rejected,
read the error rather than guessing a field. Generate V4 first: it is the peak, and everything else can wait
on it. Save raw outputs as `lab/clips/V1-src.mp4` … `V6-src.mp4`.

### Encoding (local ffmpeg; needs a full build with `xfade` and `libwebp`)

```bash
SK=/home/vivgates/.hermes/skills/web-development/scrollcraft
FF=${SCROLLCRAFT_FFMPEG:-ffmpeg}
node $SK/scripts/doctor.mjs                                   # confirms a full ffmpeg

# V4, the scrub: dense GOP via the skill's encoder, plus a hand-cut square phone version
bash $SK/scripts/encode.sh lab/clips/V4-src.mp4 assets/video/hall.mp4
"$FF" -y -i lab/clips/V4-src.mp4 -vf "crop=ih:ih,scale=720:720" -c:v libx264 -crf 20 -g 4 \
  -pix_fmt yuv420p -an -movflags +faststart assets/video/hall-m.mp4

# V5, V6: close the loop. Drop the first second, then crossfade the tail into it.
loop () {  # $1 src, $2 out
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
  "$FF" -y -i "$1" -filter_complex \
    "[0]split[a][b];[a]trim=start=1,setpts=PTS-STARTPTS[main];[b]trim=0:1,setpts=PTS-STARTPTS[head];\
     [main][head]xfade=transition=fade:duration=1:offset=$(echo "$D - 2" | bc)" \
    -c:v libx264 -crf 16 -an "$2"
}
loop lab/clips/V5-src.mp4 lab/clips/V5-loop.mp4
loop lab/clips/V6-src.mp4 lab/clips/V6-loop.mp4

# Played clips (V1, V2, V3, V5, V6): ordinary web encode, 24 fps, 2 s GOP, no audio
web () {  # $1 src, $2 name, $3 desktop width, $4 phone width
  "$FF" -y -i "$1" -vf "fps=24,scale=$3:-2" -c:v libx264 -crf 23 -g 48 -pix_fmt yuv420p -an -movflags +faststart assets/video/$2.mp4
  "$FF" -y -i "$1" -vf "fps=24,scale=$4:-2" -c:v libx264 -crf 25 -g 48 -pix_fmt yuv420p -an -movflags +faststart assets/video/$2-m.mp4
}
web lab/clips/V1-src.mp4  01-atrium    1280 720
web lab/clips/V2-src.mp4  02-winter    1280 720
web lab/clips/V3-src.mp4  03-thaw      720  540
web lab/clips/V5-loop.mp4 05-attention 1280 720
web lab/clips/V6-loop.mp4 06-plate     1280 720

# Posters: first frame of each ENCODED file (desktop and phone)
for n in hall 01-atrium 02-winter 03-thaw 05-attention 06-plate; do
  "$FF" -y -i assets/video/$n.mp4   -frames:v 1 -vf "scale='min(1600,iw)':-2" -c:v libwebp -quality 82 assets/video/$n-poster.webp
  "$FF" -y -i assets/video/$n-m.mp4 -frames:v 1 -c:v libwebp -quality 82 assets/video/$n-poster-m.webp
done
# End frames for the play-once clips (reduced motion and print)
for n in 01-atrium 02-winter 03-thaw; do
  "$FF" -y -sseof -0.1 -i assets/video/$n.mp4 -frames:v 1 -update 1 -c:v libwebp -quality 82 assets/video/$n-end.webp
done

# Shipped stills (S2, S4) to WebP at two long-edge sizes
for f in 02-retina 04-rules; do
  for w in 1600 900; do
    "$FF" -y -i assets/stills/raw/$f.webp -vf "scale='if(gt(iw,ih),$w,-2)':'if(gt(iw,ih),-2,$w)'" \
      -c:v libwebp -quality 82 assets/stills/$f-$w.webp
  done
done
```

**Weight targets.** `hall.mp4` ≤ 7 MB and `hall-m.mp4` ≤ 3.5 MB (dense GOP is the cost of scrubbing). Every
played clip ≤ 2 MB on desktop and ≤ 1 MB on phone; if a clip is over, raise its CRF by 2 and re-encode. No clip
is fetched until its act is within one viewport (`preload="none"`; the engine fetches the scrub clip itself).

## 9. Derived files

| File | Made from | Use |
|---|---|---|
| `assets/mark.svg`, `assets/favicon.svg` | The Retina's Teach-phase final weights (DESIGN §7), exported by the page's own training code | Site mark and favicon; not generated |
| `assets/og.webp` | 1200×630 centre crop of `01-atrium-poster.webp`, no text | Social card for every page (light, daylight wonder) |
| A8 contact sheet | Markup grid: V6 at double width first, then posters of V1–V5 and the S2 and S4 stills, each labelled from the log in §11 | Provenance chapter |

## 10. Cohesion and rejection checks

Lay all eight stills side by side, then one frame from every five seconds of every clip:

- **One museum.** Same white stone, same glass, same skylight quality, same haze. A frame that drifts into a
  different building is rerolled.
- **Two colours, held.** Hologram light is cobalt blue, signal orange and white only. Reject any frame with
  purple, pink, magenta, teal, gold or rainbow sheen, including where colours cross. No scene may be dominated
  by blue tipping toward violet.
- **Light default.** Every asset except S6/V4 reads as daylight on the paper ground. A daylight still that comes
  back dim or moody is rerolled.
- **Wonder, not spectacle.** Holograms are crisp and delicate; reject heavy bloom, glow halos or neon.
- **Zero glyphs, zero logos, zero people,** at 100% zoom, including dials, cards, paper, reflections and glass.
- **One realism level.** Anything that reads as a game engine render or plastic is rerolled.
- **Crops survive:** check each `object-position` in §5 at 1440×900 and 390×844 before accepting, especially V1
  in its 3:4 column and V3 in its 3:4 card.
- **Clips:** one direction per move, solid architecture, no flashes, loops with no visible seam.

## 11. What changes in DESIGN.md at build time (content, not structure)

The act sequence, spans, devices, grammar, scrub count and signature move are unchanged. These slot contents
and wordings change when the HTML is built, and DESIGN.md should note them then:

- A1: the first media is V1 (a played clip) instead of an archival still; S2 still arrives with 1958.
- A2: the `reveal="down"` figure holds V2; the wipe now pairs with frost coming down, not a dust sheet.
- A3: the Backpropagation card holds V3; the XCON card holds S4.
- A6: gains a media column holding V5 beside the text, with the SVG diagram kept under the text. Re-measure
  A6 against the 14.0 vh phone ceiling.
- A8: V6 is the double-width first tile of the contact sheet inside the iris.
- §10 rule 3 caption wording becomes "An imagined exhibit. Generated for this page." plus "not the Mark I"
  style disclaimers where a real object is evoked; rule 6 now allows 16:9 and 9:16 clips cover-cropped into
  3:4 columns; rule 10 now covers played clips (muted, in-view only, pause control in the caption).
- §12 provenance: the image model, every video model used, and the dates come from §12 below.

## 12. Generation log (operator fills; the provenance chapter is set from this table only)

| ID | Accepted file | Venice model actually used | Seed | Date generated | Rolls | Returned size / duration | Notes |
|---|---|---|---|---|---|---|---|
| S1 | | | | | | | |
| S2 | | | | | | | |
| S3 | | | | | | | |
| S4 | | | | | | | |
| S5 | | | | | | | |
| S6 | | | | | | | |
| S7 | | | | | | | |
| S8 | | | | | | | |
| V1 | | | — | | | | |
| V2 | | | — | | | | |
| V3 | | | — | | | | |
| V4 | | | — | | | | |
| V5 | | | — | | | | |
| V6 | | | — | | | | |

Venice spend for the run (from the account dashboard or response metadata): ____
