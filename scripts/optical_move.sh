#!/usr/bin/env bash
# A deterministic camera move rendered from a still: smooth eased push-in around
# an anchor, supersampled to kill zoompan's integer-pixel jitter.
#
#   optical_move.sh in.webp out.mp4 frames fps zoom_start zoom_end anchor_x anchor_y
#   anchor values are 0..1 fractions of the frame (centre = 0.5 0.5)
set -euo pipefail

IN="$1"; OUT="$2"; FRAMES="${3:-240}"; FPS="${4:-24}"
Z0="${5:-1.0}"; Z1="${6:-1.2}"; AX="${7:-0.5}"; AY="${8:-0.5}"
SS=2   # supersample factor

# eased progress: smoothstep, so the move starts and ends at rest
Z="(${Z0}+(${Z1}-${Z0})*(3*pow(on/${FRAMES},2)-2*pow(on/${FRAMES},3)))"
# anchor kept at the same relative point while zooming
X="iw*${AX}-(iw/zoom)*${AX}"
Y="ih*${AY}-(ih/zoom)*${AY}"

ffmpeg -y -loglevel error -loop 1 -i "$IN" -frames:v "$FRAMES" \
  -vf "scale=iw*${SS}:ih*${SS},zoompan=z='${Z}':x='${X}':y='${Y}':d=1:s=$((${SS}*1920))x$((${SS}*1080)):fps=${FPS},scale=1920:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -crf 18 -preset slow -g 8 -an -movflags +faststart "$OUT"
echo "wrote $OUT"
ffprobe -v error -show_entries format=duration -show_entries stream=width,height,nb_frames -of default=noprint_wrappers=1 "$OUT"
