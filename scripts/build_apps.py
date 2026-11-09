#!/usr/bin/env python3
"""Render genai-tutorial/apps.html from genai-tutorial/data/apps.json.

The apps list is a snapshot of https://venice.up.railway.app (the Venice Projects
catalogue). Refresh data/apps.json, re-run this script, commit both.

    python3 scripts/build_apps.py
"""
import json
import os
from datetime import date
from html import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "genai-tutorial")
DATA = os.path.join(SITE, "data", "apps.json")

GROUPS = {
    "learn": ("Learning", "Courses, drills and reframes"),
    "health": ("Health", "Medicine, biology, evidence"),
    "agents": ("Agents", "Harnesses, skills, evals"),
    "media": ("Media", "Video, music, chat"),
    "play": ("Play", "Games and toys"),
    "data": ("Data", "Archives and scoreboards"),
}

CSS = """
/* ---------- apps page ---------- */
.apps-hero .hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(2.5rem, 5vw, 5rem); align-items: center; }
.apps-hero .hero-stats { display: flex; flex-wrap: wrap; gap: 1px; margin-top: 1.5rem; background: var(--line-soft); border: 1px solid var(--line-soft); }
.apps-hero .hero-stats div { flex: 1 1 110px; background: var(--ink); padding: .9rem 1.15rem; }
.apps-hero .hero-stats b { display: block; font-family: var(--f-display); font-size: clamp(1.6rem, 2.8vw, 2.2rem); line-height: 1; letter-spacing: -.03em; }
.apps-hero .hero-stats span { display: block; margin-top: .35rem; font-family: var(--f-mono); font-size: .6rem; letter-spacing: .13em; text-transform: uppercase; color: var(--paper-dim); }
.apps-hero .hero-stats div:first-child b { color: var(--saffron); }
.apps-hero .hero-stats div:nth-child(2) b { color: var(--cyan); }
.apps-hero .hero-stats div.key { background: var(--paper); }
.apps-hero .hero-stats div.key b { color: var(--ink); }
.apps-hero .hero-stats div.key span { color: #5b5a57; }

.hero-collage { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line-soft); border: 1px solid var(--line-soft); }
.hero-collage figure { margin: 0; overflow: hidden; aspect-ratio: 4 / 3; background: var(--ink-3); position: relative; }
.hero-collage figure.big { grid-column: span 2; aspect-ratio: 16 / 9; }
.hero-collage img { width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: saturate(.92); }
.apps-hero { padding: clamp(6rem, 9vw, 8rem) 0 clamp(2rem, 4vw, 3rem); }
.hero-collage .cap { grid-column: span 2; display: flex; justify-content: space-between; gap: 1rem; padding: .6rem .75rem; background: var(--ink-2); font-family: var(--f-mono); font-size: .56rem; letter-spacing: .13em; text-transform: uppercase; color: var(--muted); }

@media (max-width: 900px) {
  .apps-hero .hero-grid { grid-template-columns: 1fr; }
  .hero-collage { order: 2; }
  .hero-collage figure:not(.big), .hero-collage .cap { display: none; }
  .hero-collage figure.big { aspect-ratio: 16 / 9; }
}

.spotlight { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, .6fr); border: 1px solid var(--line); background: var(--ink-2); transition: border-color .4s var(--ease); }
.spotlight:hover { border-color: rgba(255,176,32,.45); }
.spotlight figure { margin: 0; overflow: hidden; aspect-ratio: 16 / 9; background: var(--ink-3); }
.spotlight img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 1.4s var(--ease); }
.spotlight:hover img { transform: scale(1.025); }
.spotlight-copy { padding: clamp(1.4rem, 3vw, 2.6rem); display: flex; flex-direction: column; justify-content: center; gap: .7rem; border-left: 1px solid var(--line-soft); }
.spotlight-copy h2 { font-size: clamp(1.7rem, 3vw, 2.5rem); }
.spotlight-copy p { color: var(--paper-dim); font-size: .95rem; margin: 0; max-width: 30ch; }
.spotlight-copy .cta { margin-top: .6rem; display: inline-flex; align-items: center; gap: .5rem; font-family: var(--f-mono); font-size: .68rem; letter-spacing: .14em; text-transform: uppercase; color: var(--amber); }
.spotlight-copy .cta svg { width: 13px; transition: transform .35s var(--ease); }
.spotlight:hover .cta svg { transform: translate(3px, -3px); }

.view-toggle { display: flex; gap: .45rem; margin-left: auto; }
.view-toggle .chip { border-radius: 0; }

.app-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: var(--line-soft); border: 1px solid var(--line-soft); }
.app-card { position: relative; display: flex; flex-direction: column; background: var(--ink); transition: background .35s var(--ease); min-width: 0; }
a.app-card:hover { background: var(--ink-3); }
.app-card.wide { grid-column: span 2; }
.app-card figure { margin: 0; position: relative; overflow: hidden; aspect-ratio: 16 / 10; background: var(--ink-3); }
.app-card.wide figure { aspect-ratio: 16 / 10; }
.app-card img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 1.1s var(--ease), filter .5s; }
a.app-card:hover img { transform: scale(1.035); }
.app-card .body { padding: 1.05rem 1.15rem 1.2rem; display: flex; flex-direction: column; gap: .4rem; flex: 1; }
.app-card h3 { font-size: clamp(1rem, 1.35vw, 1.16rem); letter-spacing: -.022em; line-height: 1.15; }
.app-card p { margin: 0; font-size: .845rem; line-height: 1.5; color: var(--paper-dim); }
.app-card .meta { margin-top: auto; padding-top: .7rem; display: flex; align-items: center; justify-content: space-between; gap: .6rem; font-family: var(--f-mono); font-size: .57rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted-2); }
.app-card .meta .dir { color: var(--amber); opacity: 0; transform: translate(-3px, 3px); transition: opacity .3s, transform .3s; }
a.app-card:hover .meta .dir { opacity: 1; transform: none; }

.state { position: absolute; top: .7rem; left: .7rem; display: inline-flex; align-items: center; gap: .35rem; padding: .22rem .5rem; font-family: var(--f-mono); font-size: .54rem; letter-spacing: .14em; text-transform: uppercase; background: rgba(5,6,10,.72); border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(6px); color: var(--paper-dim); }
.state::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 8px var(--lime); }
.state.off::before { background: var(--amber); box-shadow: 0 0 8px var(--amber); }

.app-card.is-offline img { filter: grayscale(.85) brightness(.62); }
.app-card.is-offline h3 { color: var(--muted); }
.app-card.is-offline { cursor: default; }
.app-card[hidden] { display: none; }

.app-table { display: none; border: 1px solid var(--line-soft); }
.app-table.is-on { display: block; }
.app-table table { width: 100%; border-collapse: collapse; }
.app-table th, .app-table td { text-align: left; padding: .7rem .9rem; border-bottom: 1px solid var(--line-soft); font-size: .84rem; vertical-align: top; }
.app-table th { font-family: var(--f-mono); font-size: .58rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted-2); font-weight: 400; background: var(--ink-2); }
.app-table td:first-child { color: var(--paper); }
.app-table td.desc { color: var(--paper-dim); }
.app-table tr.is-offline td { color: var(--muted-2); }
.app-table .pill { font-family: var(--f-mono); font-size: .55rem; letter-spacing: .12em; text-transform: uppercase; border: 1px solid var(--line); padding: .16rem .4rem; color: var(--muted); }
.app-table .pill.live { color: var(--lime); border-color: rgba(124,255,107,.3); }
.app-grid.is-off { display: none; }

.groups { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1px; background: var(--line-soft); border: 1px solid var(--line-soft); }
.group-tile { position: relative; display: flex; flex-direction: column; background: var(--ink); text-align: left; transition: background .35s var(--ease); }
.group-tile:hover { background: var(--ink-3); }
.group-tile figure { position: relative; margin: 0; aspect-ratio: 1 / 1; overflow: hidden; background: var(--ink); }
.group-tile figure::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 50% 45%, transparent 52%, rgba(5,6,10,.9) 100%); }
.group-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
.group-tile:hover img { transform: scale(1.05); }
.group-tile .gt-body { padding: .75rem .9rem 1rem; display: flex; flex-direction: column; gap: .18rem; }
.group-tile b { font-family: var(--f-display); font-size: clamp(.95rem, 1.1vw, 1.08rem); font-weight: 500; letter-spacing: -.02em; }
.group-tile span { font-family: var(--f-mono); font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
.group-tile.is-active { background: var(--ink-3); box-shadow: inset 0 0 0 1px rgba(255,176,32,.5); }
@media (max-width: 1000px) { .groups { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 560px) { .groups { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

.retired { display: flex; flex-wrap: wrap; gap: .5rem; align-items: baseline; margin-top: 1.4rem; font-size: .82rem; color: var(--muted); }
.retired b { color: var(--paper-dim); font-weight: 500; }

@media (max-width: 980px) {
  .app-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .spotlight { grid-template-columns: 1fr; }
  .spotlight-copy { border-left: 0; border-top: 1px solid var(--line-soft); }
  .app-table td.desc { display: none; }
  .app-table th.desc { display: none; }
}
@media (max-width: 620px) {
  .app-grid { grid-template-columns: 1fr; }
  .app-card.wide { grid-column: span 1; }
  .app-card.wide figure { aspect-ratio: 16 / 10; }
  .apps-hero .hero-stats div { flex-basis: 45%; }
}
"""

NAV = """<header class="nav" id="nav">
  <div class="nav-inner">
    <a class="brand" href="index.html" aria-label="GenAI Chutney home">
      <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14.6" stroke="rgba(255,255,255,.26)"/>
        <path d="M7.2 17.4h17.6c0 4.9-3.9 8.4-8.8 8.4s-8.8-3.5-8.8-8.4Z" stroke="#f4efe6" stroke-width="1.2"/>
        <circle cx="12.2" cy="13.1" r="1.45" fill="#00e5ff"/><circle cx="16" cy="11.2" r="1.45" fill="#ff4dff"/><circle cx="19.8" cy="13.1" r="1.45" fill="#ffb020"/>
      </svg>
      <span class="brand-name">GenAI <span>Chutney</span></span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="index.html#foundations">Foundations</a>
      <a href="index.html#models">Models</a>
      <a href="index.html#benchmarks">Benchmarks</a>
      <a href="katha.html">Katha Weekly</a>
      <a href="newsletter.html">Newsletter</a>
      <a href="apps.html" aria-current="page">Apps</a>
      <a href="author.html">About</a>
    </nav>
    <a class="nav-cta desktop" href="https://infiniteproductivity.up.railway.app" target="_blank" rel="noopener">
      <span>Infinite Productivity</span>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" stroke="currentColor" stroke-width="1.3"/></svg>
    </a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span></button>
  </div>
</header>

<div class="mobile-menu" id="mobile-menu">
  <button class="close">Close ✕</button>
  <a href="index.html">Home <small>Guide</small></a>
  <a href="katha.html">Katha Weekly <small>Blog</small></a>
  <a href="newsletter.html">Newsletter <small>Subscribe</small></a>
  <a href="apps.html">Apps <small>Lab</small></a>
  <a href="author.html">About <small>Author</small></a>
  <a href="https://infiniteproductivity.up.railway.app" target="_blank" rel="noopener">Infinite Productivity <small>↗</small></a>
</div>"""

FOOTER = """<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="index.html">
          <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="14.6" stroke="rgba(255,255,255,.26)"/>
            <path d="M7.2 17.4h17.6c0 4.9-3.9 8.4-8.8 8.4s-8.8-3.5-8.8-8.4Z" stroke="#f4efe6" stroke-width="1.2"/>
            <circle cx="12.2" cy="13.1" r="1.45" fill="#00e5ff"/><circle cx="16" cy="11.2" r="1.45" fill="#ff4dff"/><circle cx="19.8" cy="13.1" r="1.45" fill="#ffb020"/>
          </svg>
          <span class="brand-name">GenAI <span>Chutney</span></span>
        </a>
        <p>The classroom is here. The record is Infinite Productivity.</p>
      </div>
      <div><h4>Learn</h4><ul>
        <li><a href="index.html#foundations">Foundations</a></li>
        <li><a href="index.html#models">Model map</a></li>
        <li><a href="index.html#benchmarks">Benchmarks</a></li>
        <li><a href="vocabulary.html">Vocabulary</a></li>
      </ul></div>
      <div><h4>Read</h4><ul>
        <li><a href="katha.html">Katha Weekly</a></li>
        <li><a href="newsletter.html">Newsletter</a></li>
        <li><a href="index.html#history">History</a></li>
        <li><a href="https://www.linkedin.com/in/vivmuk" target="_blank" rel="noopener">LinkedIn ↗</a></li>
      </ul></div>
      <div><h4>Build</h4><ul>
        <li><a href="prompt-optimizer.html">Prompting lab</a></li>
        <li><a href="image-generator.html">Image generator</a></li>
        <li><a href="apps.html">Apps</a></li>
        <li><a href="https://infiniteproductivity.up.railway.app" target="_blank" rel="noopener">Infinite Productivity ↗</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> GenAI Chutney · Vivek Mukhatyar</span>
      <span>Updated <span data-edition>Nov 2026</span></span>
    </div>
  </div>
</footer>

<script src="js/site.js"></script>
<script src="js/apps.js"></script>"""

ARROW = '<svg class="dir" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" stroke="currentColor" stroke-width="1.4"/></svg>'


def card(app):
    offline = app["status"] != "live"
    tag = "div" if offline else "a"
    attrs = "" if offline else f' href="{escape(app["url"])}" target="_blank" rel="noopener"'
    cls = "app-card" + (" wide" if app.get("wide") else "") + (" is-offline" if offline else "")
    img = ""
    if app.get("shot"):
        img = (f'<img src="{app["shot"]}" alt="Screenshot of {escape(app["name"])}" '
               f'width="900" height="563" loading="lazy" decoding="async">')
    state = ('<span class="state off">offline</span>' if offline
             else '<span class="state">live</span>')
    tags = " · ".join([app["group"]] + app.get("tags", []))
    return f"""      <{tag} class="{cls}" data-group="{app['group']}" data-status="{app['status']}"{attrs}>
        <figure>{img}{state}</figure>
        <div class="body">
          <h3>{escape(app['name'])}</h3>
          <p>{escape(app['line'])}</p>
          <span class="meta"><span>{escape(tags)}</span>{'' if offline else ARROW}</span>
        </div>
      </{tag}>"""


def row(app):
    offline = app["status"] != "live"
    name = escape(app["name"]) if offline else f'<a href="{escape(app["url"])}" target="_blank" rel="noopener">{escape(app["name"])}</a>'
    pill = '<span class="pill">offline</span>' if offline else '<span class="pill live">live</span>'
    return (f'        <tr class="{"is-offline" if offline else ""}"><td>{name}</td>'
            f'<td class="desc">{escape(app["line"])}</td>'
            f'<td>{GROUPS[app["group"]][0]}</td><td>{pill}</td></tr>')


def main():
    data = json.load(open(DATA))
    apps = data["apps"]
    live = sum(1 for a in apps if a["status"] == "live")
    counts = {g: sum(1 for a in apps if a["group"] == g) for g in GROUPS}
    offline = [a for a in apps if a["status"] != "live"]

    chips = [f'<button class="chip is-active" data-group="all" aria-pressed="true">All <span>{len(apps)}</span></button>']
    for g, (label, _) in GROUPS.items():
        chips.append(f'<button class="chip" data-group="{g}" aria-pressed="false">{label} <span>{counts[g]}</span></button>')

    cards = "\n".join(card(a) for a in apps)
    rows = "\n".join(row(a) for a in apps)
    retired = ", ".join(escape(a["name"]) for a in offline)
    created = date.fromisoformat(data["generated"])
    pretty_date = created.strftime("%-d %B %Y")

    tiles = "\n".join(
        f'''        <button class="group-tile" data-jump="{g}">
          <figure><img src="images/apps/groups/{g}.jpg" alt="" width="700" height="700" loading="lazy" decoding="async"></figure>
          <div class="gt-body"><b>{escapelabel}</b><span>{counts[g]} apps</span></div>
        </button>'''
        for g, (escapelabel, _) in GROUPS.items()
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Apps — 30 builds on one Venice API key | GenAI Chutney</title>
<meta name="description" content="Every app Vivek Mukhatyar has shipped on a single Venice API key: 30 working builds across health, learning, agents, media, games and data. Screenshots, status and links.">
<meta name="theme-color" content="#05060a">
<meta property="og:title" content="The Apps — 30 builds on one Venice API key">
<meta property="og:description" content="Screenshots, status and links for every GenAI Chutney build. 27 live, 6 groups, one key.">
<meta property="og:image" content="images/apps/katha.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="css/chutney.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%2305060a'/%3E%3Ccircle cx='10' cy='13' r='2' fill='%2300e5ff'/%3E%3Ccircle cx='16' cy='11' r='2' fill='%23ff4dff'/%3E%3Ccircle cx='22' cy='13' r='2' fill='%23ffb020'/%3E%3Cpath d='M6 17h20c0 5.5-4.5 9-10 9s-10-3.5-10-9Z' stroke='%23f4efe6' stroke-width='1.4' fill='none'/%3E%3C/svg%3E">
<style>{CSS}</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="scroll-progress" aria-hidden="true"></div>
<div class="cursor-glow" aria-hidden="true"></div>

{NAV}

<main id="main">
  <section class="page-hero apps-hero">
    <div class="container">
      <div class="hero-grid">
        <div>
          <div class="kicker mono">The lab — {pretty_date}</div>
          <h1>Thirty apps.<br><em class="serif gradient-text">One API key.</em></h1>
          <p class="lede" style="max-width:34ch">Not pitches. Working software, photographed and linked — built on one Venice key since 2024.</p>
          <div class="hero-stats">
            <div><b>{len(apps)}</b><span>apps shipped</span></div>
            <div><b>{live}</b><span>live today</span></div>
            <div><b>{len(GROUPS)}</b><span>groups</span></div>
            <div class="key"><b>1</b><span>Venice API key</span></div>
          </div>
        </div>
        <div class="hero-collage" aria-hidden="true">
          <figure class="big"><img src="images/apps/katha.jpg" alt="" width="900" height="563" loading="eager" decoding="async"></figure>
          <figure><img src="images/apps/gujarati-kids.jpg" alt="" width="900" height="563" loading="eager" decoding="async"></figure>
          <figure><img src="images/apps/benchmark.jpg" alt="" width="900" height="563" loading="eager" decoding="async"></figure>
          <div class="cap"><span>Katha · Gujarati Kids · ViviIndex</span><span>Screens from the live builds</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:clamp(2.4rem,4.5vw,3.6rem)">
    <div class="container">
      <a class="spotlight" href="/kinderquill">
        <figure><img src="images/apps/kinderquill.jpg" alt="KinderQuill story builder screenshot" width="1200" height="750" loading="eager" decoding="async"></figure>
        <div class="spotlight-copy">
          <div class="kicker mono" style="color:var(--muted)">Flagship · Venice-funded</div>
          <h2>KinderQuill</h2>
          <p>Bedtime stories, illustrated and narrated, with a grown-up in the loop.</p>
          <span class="cta">Open KinderQuill <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" stroke="currentColor" stroke-width="1.4"/></svg></span>
        </div>
      </a>
    </div>
  </section>

  <section class="section" id="groups">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="kicker mono">Six groups</div>
          <h2>Six ways in.</h2>
        </div>
        <p class="section-lede">Pick a group, and the index below filters to it.</p>
      </div>
      <div class="groups">
{tiles}
      </div>
    </div>
  </section>

  <section class="section" id="all-apps">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="kicker mono">The index</div>
          <h2>Every build, in six groups.</h2>
        </div>
        <p class="section-lede">Filter by what you need. Each card is the real interface, not a mockup. Offline builds stay listed with their status, because a portfolio without the failures is a brochure.</p>
      </div>

      <div class="filters" role="group" aria-label="Filter apps">
        {''.join(chips)}
        <div class="view-toggle" role="group" aria-label="Change view">
          <button class="chip is-active" data-view="grid" aria-pressed="true">Grid</button>
          <button class="chip" data-view="table" aria-pressed="false">Table</button>
        </div>
      </div>

      <div class="app-grid" id="appGrid">
{cards}
      </div>

      <div class="app-table" id="appTable">
        <table>
          <thead><tr><th>App</th><th class="desc">What it does</th><th>Group</th><th>Status</th></tr></thead>
          <tbody>
{rows}
          </tbody>
        </table>
      </div>

      <p class="retired"><b>Offline right now:</b> {retired}. The code and the screenshots are real; the hosting is not.</p>
    </div>
  </section>

  <section class="section" style="border-bottom:0">
    <div class="container">
      <div class="subscribe">
        <div class="grid">
          <div>
            <div class="kicker mono" style="color:var(--muted);margin-bottom:1rem">The common thread</div>
            <h2>One key, <em class="serif gradient-text">thirty answers.</em></h2>
            <p>Every app here asks the same question the day job asks: can a workflow be governed, repeated and trusted by someone who did not build it? The builds are the evidence.</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:.8rem;justify-content:center">
            <a class="btn" href="https://venice.up.railway.app" target="_blank" rel="noopener"><span>The full private catalogue</span>
              <svg class="arw" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" stroke="currentColor" stroke-width="1.4"/></svg>
            </a>
            <a class="btn btn-ghost" href="author.html"><span>How this started</span></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

{FOOTER}
</body>
</html>
"""
    out = os.path.join(SITE, "apps.html")
    with open(out, "w") as fh:
        fh.write(html)
    print(f"wrote {out}: {len(apps)} apps, {live} live, {len(html)//1024} KB")


if __name__ == "__main__":
    main()
