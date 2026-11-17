#!/usr/bin/env python3
"""Render a state-change clip from ONE generated still, so the geometry cannot morph.

usage: state_clip.py in.webp out.mp4 cold|warm [frames] [fps]

cold: the room loses its warmth. Saturation falls, a cold blue cast rises, exposure
drops slightly and a soft frost creeps in from the top edge.
warm: the same move backwards: frost clears, colour and light come back.

Every change is a grade on the same pixels plus a procedural overlay, which is why
nothing warps, boils or drifts. No CSS filter is involved; this is the rendered asset.
"""
import math, os, subprocess, sys
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import random

def smoothstep(t):
    return t * t * (3 - 2 * t)

def frost_layer(w, h, seed=7, scale=1.0):
    rnd = random.Random(seed)
    # start from blurred noise, then push it to a crystalline mask
    small = Image.new("L", (w // 12 + 2, h // 12 + 2))
    px = small.load()
    for y in range(small.height):
        for x in range(small.width):
            px[x, y] = int(120 + 100 * rnd.random())
    big = small.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6))
    # bias the frost towards the top edge
    grad = Image.linear_gradient("L").resize((w, h))
    grad = grad.point(lambda v: int(255 * (1 - v / 255.0) ** 1.4))
    mask = Image.composite(big, grad, grad.point(lambda v: 255 if v > 40 else 0))
    return Image.merge("RGBA", (mask, mask, mask, mask))

def tint(img, rgb, amount):
    layer = Image.new("RGB", img.size, rgb)
    return Image.blend(img, layer, amount)

def main(src, out, mode, frames=120, fps=24):
    base = Image.open(src).convert("RGB")
    w, h = base.size
    fr = frost_layer(w, h)
    tmp = out.replace(".mp4", "-frames")
    os.makedirs(tmp, exist_ok=True)
    for i in range(frames):
        t = smoothstep(i / (frames - 1))
        if mode == "cold":
            sat, bright, cast, frost_a = 1 - 0.72 * t, 1 - 0.12 * t, 0.34 * t, t
        else:
            sat, bright, cast, frost_a = 0.28 + 0.72 * t, 0.88 + 0.12 * t, 0.34 * (1 - t), 1 - t
        im = ImageEnhance.Color(base).enhance(sat)
        im = ImageEnhance.Brightness(im).enhance(bright)
        im = tint(im, (128, 168, 224), cast * 0.55)
        if frost_a > 0.02:
            white = Image.new("RGB", im.size, (238, 244, 252))
            fr_s = fr.copy()
            fr_s.putalpha(fr.getchannel("A").point(lambda v: int(v * frost_a * 0.55)))
            im = Image.composite(white, im, fr_s.getchannel("A"))
        im.save(f"{tmp}/f{i:04d}.png")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(fps),
                    "-i", f"{tmp}/f%04d.png", "-c:v", "libx264", "-crf", "20",
                    "-preset", "slow", "-pix_fmt", "yuv420p", "-g", "8",
                    "-movflags", "+faststart", out], check=True)
    subprocess.run(["rm", "-rf", tmp], check=True)
    print("wrote", out)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3],
         int(sys.argv[4]) if len(sys.argv) > 4 else 120,
         int(sys.argv[5]) if len(sys.argv) > 5 else 24)
