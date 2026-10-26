#!/usr/bin/env python3
"""Rebuild Katha Weekly data for GenAI Chutney.

Pulls the Katha feed, groups the daily briefings into Mon-Sun issues, writes one
editorial per new issue with the Venice API, downloads the cover/evidence
thumbnails, and writes genai-tutorial/data/katha.json.

Run from anywhere:  python3 scripts/update_katha.py
Requires: gh (authenticated) and a Venice key in ~/.hermes/config.yaml.
"""
import json, os, re, subprocess, sys, datetime, urllib.request, urllib.error
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'genai-tutorial')
DATA = os.path.join(SITE, 'data', 'katha.json')
IMGDIR = os.path.join(SITE, 'images', 'katha')
KEEP_WEEKS = 6


def venice_key():
    for line in open(os.path.expanduser('~/.hermes/config.yaml')):
        m = re.search(r'api_key:\s*(\S+)', line)
        if m and 'VENICE' in m.group(1):
            return m.group(1)
    raise SystemExit('No Venice key found in ~/.hermes/config.yaml')


def gh_raw(path):
    r = subprocess.run(['gh', 'api', '-H', 'Accept: application/vnd.github.raw',
                        f'repos/vivmuk/katha/contents/{path}?ref=main'],
                       capture_output=True)
    if r.returncode != 0:
        raise SystemExit(f'gh api failed for {path}: {r.stderr.decode()[:200]}')
    return r.stdout


def build_issues(feed):
    briefings = sorted(feed['daily_briefings'], key=lambda b: b['date'])
    weeks = defaultdict(list)
    for b in briefings:
        d = datetime.date.fromisoformat(b['date'])
        weeks[d - datetime.timedelta(days=d.weekday())].append(b)

    issues = []
    for ws in sorted(weeks, reverse=True)[:KEEP_WEEKS]:
        days = sorted(weeks[ws], key=lambda b: b['date'], reverse=True)
        trends, seen, stories = [], set(), []
        for day in days:
            for t in day.get('trends') or []:
                k = re.sub(r'\W+', '', t.lower())[:60]
                if k not in seen:
                    seen.add(k); trends.append(t)
            for it in day.get('items') or []:
                stories.append({
                    'title': it['title'], 'channel': it['channel'], 'channel_slug': it['channel_slug'],
                    'date': it['published_date'], 'url': it.get('url'), 'image': it.get('image'),
                    'md_path': it.get('md_path'), 'takeaways': (it.get('takeaways') or [])[:3],
                    'narration': (it.get('narration') or '')[:700],
                })
        lead = max(days, key=lambda b: b.get('item_count') or 0)
        we = ws + datetime.timedelta(days=6)
        issues.append({
            'id': ws.isoformat(), 'week_start': ws.isoformat(), 'week_end': we.isoformat(),
            'label': f"{ws.strftime('%b %-d')} – {we.strftime('%b %-d, %Y')}",
            'days': [{'date': b['date'], 'label': b['label'], 'hook': b.get('hook'),
                      'intro': b.get('intro'), 'outro': b.get('outro'),
                      'item_count': b.get('item_count'), 'trends': b.get('trends') or [],
                      'duration_seconds': b.get('duration_seconds')} for b in days],
            'item_count': sum(b.get('item_count') or 0 for b in days),
            'day_count': len(days),
            'words': sum(b.get('words') or 0 for b in days),
            'minutes': round(sum(float(b.get('duration_seconds') or 0) for b in days) / 60),
            'sources': sorted({s for b in days for s in (b.get('sources') or [])}),
            'trends': trends[:8], 'stories': stories,
            'hook': lead.get('hook'), 'intro': lead.get('intro'), 'outro': days[0].get('outro'),
            'channel_counts': Counter(s['channel'] for s in stories).most_common(),
        })
    return issues


SCHEMA = {
    "type": "object",
    "properties": {
        "headline": {"type": "string"}, "dek": {"type": "string"}, "editorial": {"type": "string"},
        "changed": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 3},
        "do_this": {"type": "string"},
        "themes": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 3},
    },
    "required": ["headline", "dek", "editorial", "changed", "do_this", "themes"],
    "additionalProperties": False,
}


def editorial_for(issue, key):
    takeaways = [t for s in issue['stories'] for t in (s.get('takeaways') or [])][:45]
    brief = {
        'week': issue['label'],
        'days': [{'date': d['date'], 'hook': d['hook'], 'intro': (d['intro'] or '')[:700]} for d in issue['days']],
        'trends': issue['trends'], 'takeaways': takeaways,
        'channel_mix': issue['channel_counts'], 'closing_note': (issue['outro'] or '')[:900],
    }
    prompt = (
        "You are the editor of Katha Weekly, a newsletter that reads every AI video and podcast published "
        "that week and finds the single argument underneath it.\n\nRaw intelligence:\n" + json.dumps(brief, indent=1) +
        "\n\nRules: headline 4-9 words, concrete; dek one sentence 18-30 words; editorial 230-280 words opening on a "
        "specific scene, number or claim, naming at least three real sources, arguing one through-line, conceding "
        "the strongest counter-read, landing on what it means for someone building with AI; no markdown. "
        "changed: exactly three bullets, max 18 words each. do_this: one imperative action, max 30 words. "
        "themes: exactly three 2-4 word labels. Never invent numbers, models or benchmarks not in the source."
    )
    body = {"model": "most_intelligent", "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7, "max_completion_tokens": 1600,
            "response_format": {"type": "json_schema", "json_schema": {"name": "issue", "schema": SCHEMA}},
            "venice_parameters": {"include_venice_system_prompt": False}}
    req = urllib.request.Request('https://api.venice.ai/api/v1/chat/completions',
                                 data=json.dumps(body).encode(),
                                 headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=240) as r:
        d = json.loads(r.read().decode())
    content = d['choices'][0]['message']['content'].strip()
    if content.startswith('```'):
        content = content.split('```')[1]
    return json.loads(content[content.find('{'):])


def fetch_image(repo_path, dest):
    r = subprocess.run(['gh', 'api', '-H', 'Accept: application/vnd.github.raw',
                        f'repos/vivmuk/katha/contents/web/{repo_path}?ref=main'],
                       capture_output=True)
    if r.returncode != 0 or len(r.stdout) < 1000:
        return False
    tmp = '/tmp/_katha_img.bin'
    open(tmp, 'wb').write(r.stdout)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp,
                    '-vf', 'scale=900:-2', '-q:v', '78', dest], check=False)
    return os.path.exists(dest) and os.path.getsize(dest) > 5000


def attach_images(issue):
    picked, seen = [], set()
    for s in sorted(issue['stories'], key=lambda x: x['date'], reverse=True):
        if not s.get('image'):
            continue
        if s['channel'] in seen and len(picked) >= 6:
            continue
        picked.append(s); seen.add(s['channel'])
        if len(picked) >= 10:
            break
    os.makedirs(IMGDIR, exist_ok=True)
    for i, s in enumerate(picked):
        vid = re.sub(r'\W+', '', str(s.get('url') or s['title']))[-10:]
        name = f"{issue['week_start']}-{i:02d}-{vid}.webp"
        dest = os.path.join(IMGDIR, name)
        if not os.path.exists(dest) and not fetch_image(s['image'], dest):
            continue
        if os.path.exists(dest):
            s['local_image'] = 'images/katha/' + name


def main():
    feed = json.loads(gh_raw('web/data/feed.json'))
    issues = build_issues(feed)

    old = {}
    if os.path.exists(DATA):
        try:
            for i in json.load(open(DATA))['issues']:
                old[i['id']] = i
        except Exception:
            pass

    key = venice_key()
    for n, issue in enumerate(issues):
        issue['issue_no'] = len(issues) - n
        prev = old.get(issue['id'], {})
        for field in ('headline', 'dek', 'editorial', 'changed', 'do_this', 'themes'):
            if prev.get(field):
                issue[field] = prev[field]
        if not issue.get('editorial'):
            try:
                issue.update(editorial_for(issue, key))
                print('editorial written for', issue['id'], '—', issue['headline'])
            except Exception as e:
                print('editorial failed for', issue['id'], e)
        attach_images(issue)

    latest = max((p['published_date'] for p in feed['posts'] if p.get('published_date')), default='')
    out = {
        'generated': datetime.datetime.now().isoformat(timespec='seconds'),
        'source_updated': feed.get('last_updated'),
        'total_posts': feed.get('total'),
        'channels': sorted({p['channel_slug']: {'slug': p['channel_slug'], 'name': p['channel_name'],
                                                'neon': p.get('neon') or '#00E5FF'}
                            for p in feed['posts'] if p.get('channel_slug')}.values(), key=lambda c: c['name'] or ''),
        'issues': issues, 'cards': [], 'latest_date': latest,
    }
    os.makedirs(os.path.dirname(DATA), exist_ok=True)
    json.dump(out, open(DATA, 'w'), separators=(',', ':'))
    for i in issues:
        have = 'editorial' if i.get('editorial') else 'MISSING EDITORIAL'
        print(f"#{i['issue_no']:02d} {i['label']:24s} {i['item_count']:3d} stories  {have}")


if __name__ == '__main__':
    main()
