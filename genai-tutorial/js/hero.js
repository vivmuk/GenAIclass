/* GenAI Chutney — hero field.
   One WebGL context. Dust drifts as a spice nebula, then periodically condenses
   into rows of token blocks and disperses again. Pointer parallax, scroll lift,
   static frame under prefers-reduced-motion, paused when offscreen/hidden. */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { canvas.parentNode.classList.add('no-webgl'); return; }

  var THREE = window.THREE;
  var scene, camera, renderer, points, clock;
  var pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  var scrollN = 0, scrollTarget = 0, visible = true, raf = null;
  var NARROW = window.innerWidth < 700;
  var COUNT = NARROW ? 18000 : 42000;
  var DPR = Math.min(window.devicePixelRatio || 1, 1.75);

  var PALETTE = [
    [0.00, 0.90, 1.00],   // cyan
    [0.71, 0.42, 1.00],   // violet
    [1.00, 0.30, 1.00],   // magenta
    [1.00, 0.69, 0.13],   // amber
    [1.00, 0.48, 0.20],   // saffron
    [0.98, 0.94, 0.88]    // paper
  ];

  /* Token lattice: ragged rows of block-shaped tokens in the same world space
     as the nebula. Points packed inside a block read as a solid glyph under
     additive blending, so the cloud can "condense" into tokenised text. */
  function tokenTargets(n) {
    var out = new Float32Array(n * 3);
    var rows = NARROW ? 3 : 3;
    var rowsY = [];
    for (var r = 0; r < rows; r++) rowsY.push((r - (rows - 1) / 2) * 0.95);

    // Word groups: tight gaps inside a word, a wide gap between words, so the
    // lattice reads as tokenised text rather than four strips of static.
    var blocks = [];
    for (var rr = 0; rr < rows; rr++) {
      var x = NARROW ? -3.0 : -3.5;
      var limit = -x;
      while (x < limit) {
        var wordBlocks = 1 + ((Math.random() * 3) | 0);
        for (var wb = 0; wb < wordBlocks && x < limit; wb++) {
          var w = 0.22 + Math.random() * 0.5;
          blocks.push({ x: x + w / 2, y: rowsY[rr], w: w, h: 0.34 });
          x += w + 0.045;
        }
        x += 0.5;
      }
    }

    // Points snap to a 3-row cell grid inside each block, so the lattice shows
    // token cells instead of uniform static.
    for (var i = 0; i < n; i++) {
      var b = blocks[(Math.random() * blocks.length) | 0];
      var cols = Math.max(2, Math.round(b.w / 0.048));
      var cx = Math.floor(Math.random() * cols);
      var cy = Math.floor(Math.random() * 3);
      out[i * 3] = b.x - b.w / 2 + (cx + 0.5) * (b.w / cols) + (Math.random() - 0.5) * 0.012;
      out[i * 3 + 1] = b.y - b.h / 2 + (cy + 0.5) * (b.h / 3) + (Math.random() - 0.5) * 0.012;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return out;
  }

  function smooth(x) { return x * x * (3 - 2 * x); }

  /* One condense-and-release cycle every ~13s: in, hold, out, rest. */
  function morphAt(t) {
    var period = 13.0, inA = 1.7, hold = 3.1, outA = 1.5;
    var p = t % period;
    if (p < inA) return smooth(p / inA);
    if (p < inA + hold) return 1;
    if (p < inA + hold + outA) return 1 - smooth((p - inA - hold) / outA);
    return 0;
  }

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(56, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 2.05, 7.9);
    camera.rotation.x = -0.42;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(DPR);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x000000, 0);

    clock = new THREE.Clock();

    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(COUNT * 3);
    var col = new Float32Array(COUNT * 3);
    var seed = new Float32Array(COUNT);
    var golden = Math.PI * (3 - Math.sqrt(5));

    for (var i = 0; i < COUNT; i++) {
      var rnd = Math.pow(Math.random(), 0.62);
      var r = 0.55 + rnd * 4.15;
      var a = i * golden + r * 1.55 + Math.random() * 0.35;
      var y = (Math.random() + Math.random() + Math.random() - 1.5) * 0.24 * (2.1 - r * 0.22);

      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(a) * r;

      var pick = Math.random();
      var band = r < 1.5 ? 0.70 : r < 2.6 ? 0.46 : 0.22;
      var c = (pick < band + 0.18) ? PALETTE[0] : PALETTE[Math.floor(Math.random() * PALETTE.length)];
      var fade = 0.55 + Math.random() * 0.45;
      col[i * 3] = c[0] * fade;
      col[i * 3 + 1] = c[1] * fade;
      col[i * 3 + 2] = c[2] * fade;

      seed[i] = Math.random();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.setAttribute('aTarget', new THREE.BufferAttribute(tokenTargets(COUNT), 3));

    var mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: NARROW ? 2.0 : 2.35 },
        uDpr: { value: DPR },
        uScroll: { value: 0 },
        uMorph: { value: 0 }
      },
      vertexShader: [
        'uniform float uTime; uniform float uSize; uniform float uDpr; uniform float uScroll; uniform float uMorph;',
        'attribute vec3 aColor; attribute float aSeed; attribute vec3 aTarget;',
        'varying vec3 vColor; varying float vAlpha;',
        'void main() {',
        '  vec3 p = position;',
        '  float r = length(p.xz);',
        '  float t = uTime * 0.085 + aSeed * 6.2831;',
        '  float ang = atan(p.z, p.x) + (0.16 + 0.5 / (1.0 + r)) * uTime * 0.16;',
        '  vec3 cloud = vec3(cos(ang) * r, p.y + sin(t * 1.15 + r * 1.8) * (0.06 + uScroll * 0.05), sin(ang) * r);',
        // stagger per point so the lattice assembles rather than snaps
        '  float local = clamp((uMorph * 1.45) - aSeed * 0.45, 0.0, 1.0);',
        '  vec3 tp = aTarget;',
        '  tp.z += sin(t * 0.7 + aSeed * 12.0) * 0.02;',
        '  vec3 mixed = mix(cloud, tp, local);',
        '  mixed.y += (1.0 - local) * uScroll * (1.15 + aSeed * 1.5) * 0.85;',
        '  mixed.xz *= 1.0 - uScroll * 0.18;',
        '  vec4 mv = modelViewMatrix * vec4(mixed, 1.0);',
        '  gl_Position = projectionMatrix * mv;',
        '  float size = uSize * uDpr * (30.0 / max(0.15, -mv.z)) * (0.45 + aSeed * 0.9);',
        '  gl_PointSize = size * mix(1.0, 0.62, local);',
        '  vec3 tok = mix(vec3(0.0, 0.86, 1.0), vec3(0.98, 0.94, 0.88), step(0.86, aSeed));',
        '  vColor = mix(aColor, tok, local * 0.8);',
        '  vAlpha = smoothstep(0.0, 0.55, 1.0 - r / 4.9) * (0.75 + 0.25 * sin(t));',
        '  float rank = clamp((tp.x + 3.5) / 7.0, 0.0, 1.0);',
        '  vAlpha *= mix(1.0, 0.4 + 0.6 * rank, local);',
        '  vAlpha = mix(vAlpha, 0.95, local * 0.55);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vColor; varying float vAlpha;',
        'void main() {',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  float d = length(uv);',
        '  float a = smoothstep(0.5, 0.0, d);',
        '  a *= a;',
        '  gl_FragColor = vec4(vColor, a * vAlpha * 0.72);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });

    points = new THREE.Points(geo, mat);
    points.rotation.x = 0.04;
    points.position.set(window.innerWidth < 900 ? 0 : 4.5, -0.25, 0);
    scene.add(points);

    animate();
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    if (!visible) return;

    var t = clock.getElapsedTime();
    scrollN += (scrollTarget - scrollN) * 0.06;
    target.x += (pointer.x - target.x) * 0.045;
    target.y += (pointer.y - target.y) * 0.045;

    points.material.uniforms.uTime.value = t;
    points.material.uniforms.uScroll.value = scrollN;
    points.material.uniforms.uMorph.value = morphAt(t);

    points.rotation.y += 0.0004;
    scene.rotation.y = target.x * 0.22;
    scene.rotation.x = target.y * 0.10;
    camera.position.z = 7.9 + scrollN * 1.6;
    camera.position.y = 2.05 + scrollN * 0.5;

    renderer.render(scene, camera);
  }

  function resize() {
    if (!renderer) return;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    points.material.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 1.75);
  }

  window.addEventListener('pointermove', function (e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  window.addEventListener('scroll', function () {
    scrollTarget = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9));
  }, { passive: true });

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () { visible = !document.hidden; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(canvas);
  }

  try { init(); } catch (err) {
    canvas.style.display = 'none';
    if (window.console) console.warn('hero canvas unavailable', err);
  }
})();
