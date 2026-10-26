/* GenAI Chutney — hero particle field.
   One WebGL context, additive spice nebula, pointer parallax, scroll response. */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { canvas.parentNode.classList.add('no-webgl'); return; }

  var THREE = window.THREE;
  var scene, camera, renderer, points, rim, clock;
  var pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  var scrollN = 0, scrollTarget = 0, visible = true, raf = null;
  var COUNT = window.innerWidth < 700 ? 16000 : 34000;

  var PALETTE = [
    [0.00, 0.90, 1.00],   // cyan
    [0.71, 0.42, 1.00],   // violet
    [1.00, 0.30, 1.00],   // magenta
    [1.00, 0.69, 0.13],   // amber
    [1.00, 0.48, 0.20],   // saffron
    [0.98, 0.94, 0.88]    // paper
  ];

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(56, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 2.05, 7.9);
    camera.rotation.x = -0.42;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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

    var mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: window.innerWidth < 700 ? 2.0 : 2.35 },
        uDpr: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uScroll: { value: 0 }
      },
      vertexShader: [
        'uniform float uTime; uniform float uSize; uniform float uDpr; uniform float uScroll;',
        'attribute vec3 aColor; attribute float aSeed;',
        'varying vec3 vColor; varying float vAlpha;',
        'void main() {',
        '  vec3 p = position;',
        '  float r = length(p.xz);',
        '  float t = uTime * 0.085 + aSeed * 6.2831;',
        '  float ang = atan(p.z, p.x) + (0.16 + 0.5 / (1.0 + r)) * uTime * 0.16;',
        '  p.x = cos(ang) * r;',
        '  p.z = sin(ang) * r;',
        '  p.y += sin(t * 1.15 + r * 1.8) * (0.06 + uScroll * 0.05);',
        '  float lift = uScroll * (1.15 + aSeed * 1.5);',
        '  p.y += lift * 0.85;',
        '  p.xz *= 1.0 - uScroll * 0.18;',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  gl_Position = projectionMatrix * mv;',
        '  gl_PointSize = uSize * uDpr * (30.0 / max(0.15, -mv.z)) * (0.45 + aSeed * 0.9);',
        '  vColor = aColor;',
        '  vAlpha = smoothstep(0.0, 0.55, 1.0 - r / 4.9) * (0.75 + 0.25 * sin(t));',
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
    points.position.set(window.innerWidth < 900 ? 0 : 3.15, -0.3, 0);
    scene.add(points);

    // bowl rim
    var rimGeo = new THREE.BufferGeometry();
    var rimPos = [];
    for (var k = 0; k <= 220; k++) {
      var th = (k / 220) * Math.PI * 2;
      rimPos.push(Math.cos(th) * 4.28, 0.02, Math.sin(th) * 4.28);
    }
    rimGeo.setAttribute('position', new THREE.Float32BufferAttribute(rimPos, 3));
    rim = new THREE.Line(rimGeo, new THREE.LineBasicMaterial({
      color: 0x9fd8ff, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    rim.position.copy(points.position);
    scene.add(rim);

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

    points.rotation.y += 0.00055;
    scene.rotation.y = target.x * 0.22;
    scene.rotation.x = target.y * 0.10;
    camera.position.z = 7.9 + scrollN * 1.6;
    camera.position.y = 2.05 + scrollN * 0.5;

    rim.rotation.y = points.rotation.y * 0.6;
    rim.material.opacity = 0.09 * (1 - scrollN * 0.7);

    renderer.render(scene, camera);
  }

  function resize() {
    if (!renderer) return;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    points.material.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 2);
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
