#!/usr/bin/env node
/* Emits assets/mark.svg and assets/favicon.svg from the same Teach-phase weights
   the live plate trains in the browser. The training code below is a transcription
   of the pure block at the top of assets/home.js; if that block changes, change this.
   Run: node scripts/make-mark.mjs (from genai-tutorial/) */

import { writeFileSync } from 'node:fs';

const N = 20, CELLS = N * N, K = 120, SEED_TEACH = 1958, SEED_XOR = 1969;

const prng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const jitter = (rand) => Math.floor(rand() * 3) - 1;

function glyph(kind, rand) {
  const x = new Uint8Array(CELLS);
  const cx = N / 2 + jitter(rand), cy = N / 2 + jitter(rand);
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const dx = c + 0.5 - cx, dy = r + 0.5 - cy;
    let on;
    if (kind === 'cross') on = (Math.abs(dx) < 1 && Math.abs(dy) < 5.5) || (Math.abs(dy) < 1 && Math.abs(dx) < 5.5);
    else on = Math.abs(Math.sqrt(dx * dx + dy * dy) - 6.5) < 0.9;
    if (rand() < 0.03) on = !on;
    x[r * N + c] = on ? 1 : 0;
  }
  return x;
}

const teachData = () => {
  const rand = prng(SEED_TEACH), data = [];
  for (let i = 0; i < 20; i++) {
    data.push({ x: glyph('cross', rand), y: 1 });
    data.push({ x: glyph('ring', rand), y: -1 });
  }
  return { data, rand };
};

const shuffledOrder = (n, rand) => {
  const order = [...Array(n).keys()];
  for (let j = n - 1; j > 0; j--) { const k = Math.floor(rand() * (j + 1)); [order[j], order[k]] = [order[k], order[j]]; }
  return order;
};

function perceptron({ data, rand }) {
  const w = new Float32Array(CELLS);
  let b = 0, order = [], solvedAt = -1;
  const errors = () => {
    let e = 0;
    for (const { x, y } of data) { let s = b; for (let k = 0; k < CELLS; k++) if (x[k]) s += w[k]; if (y * s <= 0) e++; }
    return e;
  };
  const snaps = [new Float32Array(w)];
  for (let step = 1; step <= K; step++) {
    if (!order.length) order = shuffledOrder(data.length, rand);
    const ex = data[order.shift()];
    let s = b;
    for (let k = 0; k < CELLS; k++) if (ex.x[k]) s += w[k];
    if (ex.y * s <= 0) { for (let m = 0; m < CELLS; m++) if (ex.x[m]) w[m] += ex.y; b += ex.y; }
    snaps.push(new Float32Array(w));
    if (errors() === 0 && solvedAt < 0) solvedAt = step;
  }
  return { snaps, solvedAt, finalErrors: errors(), bias: b };
}

const teach = perceptron(teachData());
const w = teach.snaps[K];
const max = w.reduce((m, v) => Math.max(m, Math.abs(v)), 0);

/* drawMaps() geometry, transcribed: square cells inset by round(pitch/9) */
function plate({ size, inset = true }) {
  const pitch = size / N;
  const in0 = inset ? Math.max(1, Math.round(pitch / 9)) : 0;
  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = +(c * pitch).toFixed(3), y = +(r * pitch).toFixed(3);
    const s = +(pitch - in0).toFixed(3);
    const v = w[r * N + c];
    if (v === 0) cells.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#121722" fill-opacity=".09"/>`);
    else cells.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${v > 0 ? '#D9530F' : '#1D4ED0'}" fill-opacity="${(Math.abs(v) / max).toFixed(3)}"/>`);
  }
  return cells.join('');
}

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 176" width="176" height="176" role="img" aria-label="A 20 by 20 plate of weights, orange where it votes for a cross and blue where it votes for a ring.">
<title>The GenAI Chutney mark</title>
${plate({ size: 176 })}
</svg>
`;

/* The favicon is the same plate at 32px, where 1.6px cells need no inset. */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
${plate({ size: 32, inset: false })}
</svg>
`;

writeFileSync('assets/mark.svg', mark);
writeFileSync('assets/favicon.svg', favicon);
console.log(JSON.stringify({ solvedAt: teach.solvedAt, finalErrors: teach.finalErrors, bias: teach.bias, maxW: +max.toFixed(3), cells: w.filter((v) => v !== 0).length }));
