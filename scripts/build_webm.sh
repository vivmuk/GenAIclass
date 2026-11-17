#!/usr/bin/env bash
# Second source for every clip: VP9/WebM. Headless Chromium (and any Firefox)
# cannot decode H.264, so the page ships both and lets the browser choose.
set -euo pipefail
V="$(cd "$(dirname "$0")/../genai-tutorial/assets/video" && pwd)"
for f in "$V"/v*.mp4; do
  case "$(basename "$f")" in
    *_test*|*vp9*) continue ;;
  esac
  out="${f%.mp4}.webm"
  [ -f "$out" ] && { echo "skip $(basename "$out")"; continue; }
  ffmpeg -y -loglevel error -i "$f" -an -c:v libvpx-vp9 -crf 35 -b:v 0 \
    -row-mt 1 -cpu-used 4 -deadline good -g 48 "$out"
  echo "ok $(basename "$out") $(du -h "$out" | cut -f1)"
done
rm -f "$V/_test-vp9.webm"
du -sh "$V"
