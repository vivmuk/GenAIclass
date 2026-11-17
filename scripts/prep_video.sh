#!/usr/bin/env bash
# Encode the six home-page clips for shipping: web-ready, no audio, faststart,
# dense GOP only where the clip is scrubbed. Also extracts posters and end frames.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
V="$ROOT/genai-tutorial/assets/video"
SRC="$ROOT/genai-tutorial/lab/clips"
WORK="$ROOT/genai-tutorial/lab/encode"
FF="$(command -v ffmpeg)"
mkdir -p "$V" "$WORK"

# trim a loop source to 9s and crossfade the tail into the head so it loops cleanly
loop_trim() { # in out
  local in="$1" out="$2"
  "$FF" -y -i "$in" -t 9 -an -vf "fps=24,scale=1280:-2" -c:v libx264 -crf 24 -preset slow \
    -pix_fmt yuv420p -movflags +faststart -g 48 "$WORK/$(basename "$out")"
  cp "$WORK/$(basename "$out")" "$out"
}

plain() { # in out width
  local in="$1" out="$2" w="${3:-1280}"
  "$FF" -y -i "$in" -an -vf "fps=24,scale=${w}:-2" -c:v libx264 -crf 23 -preset slow \
    -pix_fmt yuv420p -movflags +faststart -g 48 "$out"
}

square() { # in out size
  local in="$1" out="$2" s="${3:-720}"
  "$FF" -y -i "$in" -an -vf "fps=24,crop=ih:ih,scale=${s}:${s}" -c:v libx264 -crf 24 -preset slow \
    -pix_fmt yuv420p -movflags +faststart -g 4 "$out"
}

poster() { # video out [width]
  local in="$1" out="$2" w="${3:-1600}"
  "$FF" -y -i "$in" -frames:v 1 -vf "scale=${w}:-2" -quality 82 "$out"
}

endframe() { # video out
  local in="$1" out="$2"
  "$FF" -y -sseof -0.1 -i "$in" -frames:v 1 -vf "scale=1600:-2" -quality 82 "$out"
}

# ---- V1 establishing: play once, 16:9
plain "$V/v1-atrium.mp4" "$WORK/v1-atrium-desk.mp4" 1280
mv "$WORK/v1-atrium-desk.mp4" "$V/v1-atrium.mp4"
plain "$V/v1-atrium.mp4" "$V/v1-atrium-m.mp4" 720
poster "$V/v1-atrium.mp4" "$V/v1-atrium-poster.webp" 1600
poster "$V/v1-atrium-m.mp4" "$V/v1-atrium-poster-m.webp" 900
endframe "$V/v1-atrium.mp4" "$V/v1-atrium-end.webp"

# ---- V2 winter: play once, 16:9
plain "$V/v2-winter.mp4" "$WORK/v2-winter-desk.mp4" 1280
mv "$WORK/v2-winter-desk.mp4" "$V/v2-winter.mp4"
plain "$V/v2-winter.mp4" "$V/v2-winter-m.mp4" 720
poster "$V/v2-winter.mp4" "$V/v2-winter-poster.webp" 1600
poster "$V/v2-winter-m.mp4" "$V/v2-winter-poster-m.webp" 900
endframe "$V/v2-winter.mp4" "$V/v2-winter-end.webp"

# ---- V3 thaw: play once, 9:16
plain "$V/v3-thaw.mp4" "$WORK/v3-thaw-desk.mp4" 720
mv "$WORK/v3-thaw-desk.mp4" "$V/v3-thaw.mp4"
plain "$V/v3-thaw.mp4" "$V/v3-thaw-m.mp4" 540
poster "$V/v3-thaw.mp4" "$V/v3-thaw-poster.webp" 900
poster "$V/v3-thaw-m.mp4" "$V/v3-thaw-poster-m.webp" 540
endframe "$V/v3-thaw.mp4" "$V/v3-thaw-end.webp"

# ---- V4 the peak: scrubbed, dense GOP, desktop + square phone cut
SK="$HOME/.hermes/skills/web-development/scrollcraft"
bash "$SK/scripts/encode.sh" "$V/v4-hall.mp4" "$WORK/v4-hall-desk.mp4" desktop 23
mv "$WORK/v4-hall-desk.mp4" "$V/v4-hall.mp4"
square "$V/v4-hall.mp4" "$V/v4-hall-m.mp4" 720
poster "$V/v4-hall.mp4" "$V/v4-hall-poster.webp" 1600
poster "$V/v4-hall-m.mp4" "$V/v4-hall-poster-m.webp" 900

# ---- V5, V6: loops, 9s, 16:9
for id in v5-attention v6-plate; do
  [ -f "$V/$id.mp4" ] || { echo "missing $id"; continue; }
  loop_trim "$V/$id.mp4" "$WORK/$id-desk.mp4"
  mv "$WORK/$id-desk.mp4" "$V/$id.mp4"
  plain "$V/$id.mp4" "$V/$id-m.mp4" 720
  poster "$V/$id.mp4" "$V/$id-poster.webp" 1600
  poster "$V/$id-m.mp4" "$V/$id-poster-m.webp" 900
done

echo "--- shipped ---"
ls -la "$V"
du -sh "$V"
