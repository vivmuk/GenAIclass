#!/usr/bin/env bash
# Assemble the final six home-page clips.
#
# V1, V4 are camera moves rendered from the generated stills (optical_move.sh):
# the generative models could not hold a rigid dolly, so the move is rendered,
# not generated, and the provenance copy says so.
# V2, V3 are state changes rendered from the same stills (state_clip.py), so the
# geometry cannot morph between frames.
# V5, V6 are AI-generated (kling / seedance), used as ping-pong loops: the drift
# in those generations becomes a gentle sway instead of a seam.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
S="$ROOT/genai-tutorial/assets/stills/raw"
C="$ROOT/genai-tutorial/lab/clips"
V="$ROOT/genai-tutorial/assets/video"
SK="$HOME/.hermes/skills/web-development/scrollcraft"
FF="$(command -v ffmpeg)"
mkdir -p "$V"

# --- camera moves from stills ------------------------------------------------
[ -f "$C/v1-optical.mp4" ] || bash "$ROOT/scripts/optical_move.sh" "$S/01-atrium.webp" "$C/v1-optical.mp4" 200 24 1.0 1.16 0.45 0.52
[ -f "$C/v4-optical.mp4" ] || bash "$ROOT/scripts/optical_move.sh" "$S/06-hall.webp"   "$C/v4-optical.mp4" 240 24 1.0 1.22 0.50 0.50

# --- state changes from stills ----------------------------------------------
[ -f "$C/v2-state.mp4" ] || python3 "$ROOT/scripts/state_clip.py" "$S/03-eliza.webp" "$C/v2-state.mp4" cold 120 24
[ -f "$C/v3-state.mp4" ] || python3 "$ROOT/scripts/state_clip.py" "$S/05-thaw.webp"  "$C/v3-state.mp4" warm 120 24

# --- ping-pong the AI loops --------------------------------------------------
pingpong() { # in out
  "$FF" -y -loglevel error -i "$1" -filter_complex "[0:v]fps=24,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
    -map "[v]" -an -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -g 48 -movflags +faststart "$2"
}
pingpong "$V/v5-attention.mp4" "$C/v5-loop.mp4"
pingpong "$V/v6-plate.mp4"     "$C/v6-loop.mp4"

# --- encode for the page -----------------------------------------------------
plain() { # in out width
  "$FF" -y -loglevel error -i "$1" -an -vf "fps=24,scale=${3:--2}:-2" \
    -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -g 48 "$2"
}
poster() { "$FF" -y -loglevel error -i "$1" -frames:v 1 -vf "scale=${3:-1600}:-2" -quality 82 "$2"; }
endframe() { "$FF" -y -loglevel error -sseof -0.12 -i "$1" -frames:v 1 -vf "scale=1600:-2" -quality 82 "$2"; }

# V1 16:9 play-once
plain "$C/v1-optical.mp4" "$V/v1-atrium.mp4" 1280
plain "$V/v1-atrium.mp4"  "$V/v1-atrium-m.mp4" 720
poster "$V/v1-atrium.mp4" "$V/v1-atrium-poster.webp"
poster "$V/v1-atrium-m.mp4" "$V/v1-atrium-poster-m.webp" 900
endframe "$V/v1-atrium.mp4" "$V/v1-atrium-end.webp"

# V2 16:9 play-once
plain "$C/v2-state.mp4" "$V/v2-winter.mp4" 1280
plain "$V/v2-winter.mp4" "$V/v2-winter-m.mp4" 720
poster "$V/v2-winter.mp4" "$V/v2-winter-poster.webp"
poster "$V/v2-winter-m.mp4" "$V/v2-winter-poster-m.webp" 900
endframe "$V/v2-winter.mp4" "$V/v2-winter-end.webp"

# V3 9:16 play-once
plain "$C/v3-state.mp4" "$V/v3-thaw.mp4" 720
plain "$V/v3-thaw.mp4" "$V/v3-thaw-m.mp4" 540
poster "$V/v3-thaw.mp4" "$V/v3-thaw-poster.webp" 900
poster "$V/v3-thaw-m.mp4" "$V/v3-thaw-poster-m.webp" 540
endframe "$V/v3-thaw.mp4" "$V/v3-thaw-end.webp"

# V4 scrub: dense GOP desktop, square phone cut
bash "$SK/scripts/encode.sh" "$C/v4-optical.mp4" "$V/v4-hall.mp4" desktop 23
"$FF" -y -loglevel error -i "$V/v4-hall.mp4" -an -vf "fps=24,crop=ih:ih,scale=720:720" \
  -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -g 4 -movflags +faststart "$V/v4-hall-m.mp4"
poster "$V/v4-hall.mp4" "$V/v4-hall-poster.webp"
poster "$V/v4-hall-m.mp4" "$V/v4-hall-poster-m.webp" 900

# V5, V6 loops 16:9
for id in v5-attention v6-plate; do
  src="$C/${id%%-*}-loop.mp4"; [ "$id" = "v5-attention" ] && src="$C/v5-loop.mp4"; [ "$id" = "v6-plate" ] && src="$C/v6-loop.mp4"
  plain "$src" "$V/$id.mp4" 1280
  plain "$V/$id.mp4" "$V/$id-m.mp4" 720
  poster "$V/$id.mp4" "$V/$id-poster.webp"
  poster "$V/$id-m.mp4" "$V/$id-poster-m.webp" 900
done

echo "--- final ---"
ls -la "$V"
du -sh "$V"
