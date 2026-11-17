#!/usr/bin/env python3
"""Generate the site's stills from a manifest, via the Venice image API.

usage: python3 scripts/gen_images.py assets/stills-manifest.json

manifest: {"style": "...", "negative": "...", "items": [
   {"id": "01-...", "prompt": "...", "model": "gpt-image-2-6-flare",
    "aspect_ratio": "3:4", "resolution": "2K", "out": "assets/stills/01.webp"}]}

The shared style preamble is prepended verbatim to every prompt, which is what
keeps a set reading as one shoot. Existing outputs are skipped unless --force.
"""
import base64, json, os, pathlib, sys, time, urllib.error, urllib.request

BASE = "https://api.venice.ai/api/v1"
KEY_FILE = os.path.expanduser("~/.hermes/secrets/venice_api_key")


def post(path, body, timeout=300):
    key = pathlib.Path(KEY_FILE).read_text().strip()
    req = urllib.request.Request(
        BASE + path, data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def main(manifest_path, force=False):
    root = pathlib.Path(manifest_path).resolve().parent.parent
    m = json.load(open(manifest_path))
    style = m.get("style", "").strip()
    negative = m.get("negative", "").strip()
    for item in m["items"]:
        out = root / item["out"]
        if out.exists() and not force:
            print(f"skip {item['id']} (exists)")
            continue
        prompt = (style + "\n\n" + item["prompt"]).strip()
        body = {
            "model": item.get("model", "gpt-image-2-6-flare"),
            "prompt": prompt,
            "aspect_ratio": item.get("aspect_ratio", "3:4"),
            "resolution": item.get("resolution", "2K"),
            "safe_mode": False,
            "hide_watermark": True,
        }
        if negative:
            body["negative_prompt"] = negative
        if "seed" in item:
            body["seed"] = item["seed"]
        t0 = time.time()
        try:
            d = post("/image/generate", body)
        except urllib.error.HTTPError as e:
            print(f"FAIL {item['id']} http {e.code}: {e.read()[:300]}")
            continue
        imgs = d.get("images") or []
        if not imgs:
            print(f"FAIL {item['id']} no images: {json.dumps(d)[:300]}")
            continue
        raw = base64.b64decode(imgs[0])
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(raw)
        head = raw[:4]
        kind = "webp" if head == b"RIFF" else "png" if head[:4] == b"\x89PNG" else "?"
        print(f"ok {item['id']} -> {out.name} {len(raw)/1024:.0f} KB {kind} {time.time()-t0:.1f}s")


if __name__ == "__main__":
    main(sys.argv[1], force="--force" in sys.argv)
