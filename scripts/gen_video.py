#!/usr/bin/env python3
"""Queue Venice image-to-video / text-to-video jobs and poll them to disk.

usage: python3 scripts/gen_video.py <manifest.json> [--poll]

manifest: {"items": [{"id": "05-peak", "model": "kling-v3-pro-image-to-video",
                      "image": "assets/stills/raw/06-hall.png" | null,
                      "prompt": "...", "duration": "10s", "resolution": "720p",
                      "aspect_ratio": "16:9", "out": "lab/clips/05-peak.mp4",
                      "negative_prompt": "..."}]}

Job ids are persisted next to the manifest in jobs.json so a re-run resumes
polling instead of paying twice. Each item is quoted before it is queued.
"""
import base64, json, os, pathlib, sys, time, urllib.error, urllib.request

BASE = "https://api.venice.ai/api/v1"
KEY_FILE = os.path.expanduser("~/.hermes/secrets/venice_api_key")
ROOT = pathlib.Path("/home/vivgates/Projects/genaichutney/genai-tutorial")


def post(path, body, timeout=180, raw=False):
    key = pathlib.Path(KEY_FILE).read_text().strip()
    req = urllib.request.Request(
        BASE + path, data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
        ctype = r.headers.get("Content-Type", "")
        return (ctype, data) if raw else json.loads(data or b"{}")


def data_url(path):
    p = pathlib.Path(path)
    if not p.is_absolute():
        p = ROOT / p
    ext = p.suffix.lstrip(".").lower().replace("jpg", "jpeg")
    return f"data:image/{ext};base64," + base64.b64encode(p.read_bytes()).decode()


def main(manifest_path):
    mp = pathlib.Path(manifest_path).resolve()
    man = json.loads(mp.read_text())
    state_p = mp.parent / "jobs.json"
    state = json.loads(state_p.read_text()) if state_p.exists() else {}

    for it in man["items"]:
        if it["id"] in state:
            print(f"skip {it['id']} (queued)")
            continue
        body = {"model": it["model"], "prompt": it["prompt"],
                "duration": it.get("duration", "5s"),
                "resolution": it.get("resolution", "720p"),
                "aspect_ratio": it.get("aspect_ratio", "16:9")}
        if it.get("negative_prompt"):
            body["negative_prompt"] = it["negative_prompt"]
        if it.get("image"):
            body["image_url"] = data_url(it["image"])
        try:
            q = post("/video/quote", {k: body[k] for k in ("model", "duration", "resolution", "aspect_ratio")})
            print(f"{it['id']}: quote ${q.get('quote')}")
        except Exception as e:
            print(f"{it['id']}: quote failed ({e})")
        r = None
        for _ in range(3):
            try:
                r = post("/video/queue", body, timeout=300)
                break
            except urllib.error.HTTPError as e:
                detail = e.read().decode()
                print(f"{it['id']}: queue {e.code} {detail[:300]}")
                drop = next((f for f in ("aspect_ratio", "resolution", "audio", "negative_prompt")
                             if f'"{f}"' in detail and "does not support" in detail), None)
                if drop and drop in body:
                    body.pop(drop)
                    continue
                break
        if not r or not r.get("queue_id"):
            print(f"{it['id']}: FAILED to queue")
            continue
        state[it["id"]] = {"model": it["model"], "queue_id": r["queue_id"],
                           "download_url": r.get("download_url"), "out": it["out"]}
        print(f"{it['id']}: queued {r['queue_id']}" + (" (+download_url)" if r.get("download_url") else ""))
        state_p.write_text(json.dumps(state, indent=1))

    if "--poll" not in sys.argv:
        print("queued; re-run with --poll to fetch")
        return

    deadline = time.time() + 45 * 60
    pending = {k: v for k, v in state.items() if not (ROOT / v["out"]).exists()}
    while pending and time.time() < deadline:
        for k, v in list(pending.items()):
            try:
                ctype, data = post("/video/retrieve",
                                   {"model": v["model"], "queue_id": v["queue_id"]},
                                   timeout=300, raw=True)
            except Exception as e:
                print(f"{k}: poll error {e}")
                continue
            if ctype.startswith("video/"):
                out = ROOT / v["out"]
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_bytes(data)
                print(f"{k}: done {len(data)/1e6:.1f} MB -> {v['out']}")
                pending.pop(k)
            else:
                j = json.loads(data or b"{}")
                status = j.get("status")
                print(f"{k}: {status} {j.get('execution_duration')}")
                if status == "COMPLETED" and v.get("download_url"):
                    with urllib.request.urlopen(v["download_url"], timeout=300) as r:
                        blob = r.read()
                    out = ROOT / v["out"]
                    out.parent.mkdir(parents=True, exist_ok=True)
                    out.write_bytes(blob)
                    print(f"{k}: downloaded {len(blob)/1e6:.1f} MB")
                    pending.pop(k)
                elif status in ("FAILED", "ERROR"):
                    print(f"{k}: job failed: {json.dumps(j)[:300]}")
                    pending.pop(k)
        time.sleep(8)
    print("remaining:", list(pending))


if __name__ == "__main__":
    main(sys.argv[1])
