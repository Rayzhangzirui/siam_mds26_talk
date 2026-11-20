/* BiLO idea, animated in 9 steps (replaces PowerPoint slides 16–17).
 *
 *  1 one solution u(x; θ=1)          2 θ = 2, θ = 1/2 → more curves    3 rotate: θ becomes an axis
 *  4 surface u(x, θ)                 5 data on the surface             6 split: loss L_data(θ)
 *  7 gradient descent with the full operator                           8 restart: local operator strip at θ^(k)
 *  9 iterate: θ^(k) moves, both strips move with it
 *
 * Everything for this slide lives in this file. Tune the numbers in the "problem setup" and
 * "animation steps" blocks. Labels are KaTeX (via the overlay), the plots are drawn on a canvas.
 * Drag on the 3D plot to rotate it (from step 3 on); double-click resets the view.
 */
(function () {
  // ---------------- problem setup ----------------
  const TH0 = 0.5, TH1 = 2.1;          // θ range of the 3D surface
  const RT0 = 0.6, RT1 = 2.0;          // θ range of the L_data(θ) plot
  const YLEN = 1.4, ZS = 0.42;         // world lengths: θ axis, u scale
  const THSTAR = 1.3;                  // true parameter that generated the data
  const DELTA = 0.11;                  // half-width of the local neighbourhood (blue strip)
  const PI = Math.PI;
  const u = (x, th) => Math.sin(PI * x) / th;
  const Yof = th => (th - TH0) / (TH1 - TH0) * YLEN;

  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * PI * rnd());
  const XS = Array.from({ length: 9 }, (_, i) => 0.1 + 0.1 * i);
  const DS = XS.map(x => u(x, THSTAR) + 0.03 * gauss());
  const L = th => XS.reduce((s, x, i) => s + (u(x, th) - DS[i]) ** 2, 0) / XS.length;
  const dL = th => (L(th + 1e-4) - L(th - 1e-4)) / 2e-4;
  const d2L = th => (L(th + 1e-3) - 2 * L(th) + L(th - 1e-3)) / 1e-6;
  let LMAX = 0; for (let t = RT0; t <= RT1; t += 0.01) LMAX = Math.max(LMAX, L(t));
  LMAX *= 1.08;
  // iterates: half Newton steps, so the strip moves at an even pace toward the minimizer
  const ITERS = [0.66];
  for (let k = 0; k < 7; k++) { const t = ITERS[k]; ITERS.push(t - 0.6 * dL(t) / d2L(t)); }
  const G0 = Math.abs(dL(ITERS[0]));

  // ---------------- animation steps ----------------
  // pt = iterate θ^(k) visible (black with the full operator, blue once strip = 1)
  const S0 = { rot: 0, curveDraw: 0, curvesN: 1, curvesAlpha: 1, thetaAxis: 0, surf: 0,
               split: 0, data: 0, lossDraw: 0, pt: 0, strip: 0, grad: 0, thetaK: ITERS[0], iter: 0 };
  const iterate = () => {
    const ph = [];
    for (let j = 1; j < ITERS.length; j++) ph.push({ dur: 1000, to: { thetaK: ITERS[j] }, set: { iter: j } }, { dur: 350, to: {} });
    return ph;
  };
  const STEPS = [
    [{ dur: 1100, to: { curveDraw: 1 } }],
    [{ dur: 900, to: { curvesN: 2 } }, { dur: 900, to: { curvesN: 3 } }],
    [{ dur: 2000, to: { rot: 1, thetaAxis: 1 } }],
    [{ dur: 1300, to: { surf: 1, curvesAlpha: 0 } }],
    [{ dur: 800, to: { data: 1 } }],
    [{ dur: 1000, to: { split: 1 } }, { dur: 1400, to: { lossDraw: 1 } }],
    [{ dur: 700, to: { pt: 1 } }, { dur: 500, to: { grad: 1 } }, ...iterate()],
    [{ dur: 500, to: { pt: 0, grad: 0 } }, { dur: 1000, set: { thetaK: ITERS[0], iter: 0 }, to: { pt: 1, strip: 1 } }, { dur: 600, to: { grad: 1 } }],
    iterate(),
  ];
  const FULL_OP = String.raw`<span class="gray"><b>Full PDE solution operator \(u(x,\theta)\)</b></span><br>solves \(F(D^k u,\dots,u,\theta)=0\) for <u>all</u> \(\theta\)`;
  const CAP_L = [
    String.raw`Fix a parameter \(\theta\). Solving the PDE gives one solution \(u(x)\)`,
    String.raw`Each value of \(\theta\) gives a different solution`,
    String.raw`Treat \(\theta\) as a new axis`,
    FULL_OP, FULL_OP, FULL_OP, FULL_OP,
    String.raw`<span class="blue"><b>Local operator \(\uLO(x;\theta)\)</b></span> approximates the solution<br><u>in a neighborhood</u> of \(\theta^{(k)}\)`,
    String.raw`<span class="blue"><b>Local operator \(\uLO(x;\theta)\)</b></span> approximates the solution<br><u>in a neighborhood</u> of \(\theta^{(k)}\)`,
  ];
  const CAP_R = ['', '', '', '', '',
    String.raw`The full operator turns the PDE-constrained problem into \(\min_\theta \Ldata(\theta)\)`,
    String.raw`The full operator turns the PDE-constrained problem into \(\min_\theta \Ldata(\theta)\)`,
    String.raw`The <span class="blue"><b>local operator</b></span> suffices to compute the descent direction \(-\nabla_\theta \Ldata(\theta^{(k)})\)`,
    String.raw`The <span class="blue"><b>local operator</b></span> suffices to compute the descent direction \(-\nabla_\theta \Ldata(\theta^{(k)})\)`,
  ];

  // ---------------- DOM ----------------
  const BW = 1600, BH = 872;           // slide body size in px
  let root, cv, ctx, layer, capL, capR, foot, K = 1, raf = 0;
  const labels = new Map();

  function setup(el) {
    root = el.querySelector('.anim');
    cv = root.querySelector('canvas'); ctx = cv.getContext('2d');
    layer = root.querySelector('.labels');
    capL = root.querySelector('.capL'); capR = root.querySelector('.capR'); foot = root.querySelector('.foot');
    addEventListener('deck:resize', resize);
    resize();
    // drag to rotate
    let drag = null;
    root.addEventListener('mousedown', e => { drag = { x: e.clientX, y: e.clientY, az: dAz, el: dEl, moved: false }; });
    addEventListener('mousemove', e => {
      if (!drag) return;
      const s = Deck.scale, dx = (e.clientX - drag.x) / s, dy = (e.clientY - drag.y) / s;
      if (Math.hypot(dx, dy) > 6) drag.moved = true;
      if (drag.moved && state.rot > 0.5) { dAz = drag.az + dx * 0.006; dEl = clamp(drag.el + dy * 0.004, -0.4, 1.0); }
    });
    addEventListener('mouseup', () => { if (drag && drag.moved) root.dataset.noclick = '1'; setTimeout(() => delete root.dataset.noclick, 0); drag = null; });
    root.addEventListener('dblclick', () => { dAz = 0; dEl = 0; });
  }
  function resize() {
    K = Deck.scale * (devicePixelRatio || 1);
    cv.width = Math.round(BW * K); cv.height = Math.round(BH * K);
  }

  // KaTeX label in the overlay. anchor: [fx, fy] fraction of label size to shift (0.5,0.5 = centered)
  let used;
  function label(key, texSrc, x, y, opt = {}) {
    let L = labels.get(key);
    if (!L) { L = { el: document.createElement('div'), src: null }; L.el.className = 'lbl'; layer.appendChild(L.el); labels.set(key, L); }
    if (L.src !== texSrc) { L.el.innerHTML = opt.text ? texSrc : Deck.tex(texSrc); L.src = texSrc; }
    const [ax, ay] = opt.anchor || [0.5, 0.5];
    L.el.style.transform = `translate(${x}px, ${y}px) translate(${-ax * 100}%, ${-ay * 100}%)`;
    L.el.style.opacity = opt.alpha === undefined ? 1 : opt.alpha;
    L.el.style.color = opt.color || '';
    L.el.style.fontSize = (opt.size || 30) + 'px';
    L.el.style.display = '';
    used.add(key);
  }

  // ---------------- drawing ----------------
  const BLUE = [150, 174, 230], BLUE_TXT = '#0054EA';
  // iterate colour: black (full operator) → blue (local operator)
  const PT = t => `rgb(${Math.round(17 * (1 - t))},${Math.round(17 + 67 * t)},${Math.round(17 + 217 * t)})`;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function arrow(x0, y0, x1, y1, col, w = 2, head = 12) {
    const a = Math.atan2(y1 - y0, x1 - x0);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - Math.cos(a) * head * .6, y1 - Math.sin(a) * head * .6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - head * Math.cos(a - .38), y1 - head * Math.sin(a - .38));
    ctx.lineTo(x1 - head * Math.cos(a + .38), y1 - head * Math.sin(a + .38)); ctx.closePath(); ctx.fill();
  }

  let dAz = 0, dEl = 0;
  function camera(st) {
    const r = ease(clamp(st.rot, 0, 1));
    const az = lerp(0, 66, r) * PI / 180 + dAz, el = lerp(0, 27, r) * PI / 180 + dEl;
    const sc = lerp(540, 360, r);
    const cx = lerp(800, 480, ease(clamp(st.split, 0, 1))), cy = 400;
    const raw = (X, Y, Z) => {
      const x1 = X * Math.cos(az) + Y * Math.sin(az), y1 = -X * Math.sin(az) + Y * Math.cos(az);
      return [x1, Z * Math.cos(el) + y1 * Math.sin(el), y1 * Math.cos(el) - Z * Math.sin(el)];
    };
    let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
    for (const X of [0, 1.1]) for (const Y of [0, YLEN]) for (const Z of [0, 0.95]) {
      const p = raw(X, Y, Z); mnx = Math.min(mnx, p[0]); mxx = Math.max(mxx, p[0]); mny = Math.min(mny, p[1]); mxy = Math.max(mxy, p[1]);
    }
    const bx = (mnx + mxx) / 2, by = (mny + mxy) / 2;
    return (X, Y, Z) => { const p = raw(X, Y, Z); return [cx + (p[0] - bx) * sc, cy - (p[1] - by) * sc, p[2]]; };
  }

  const NX = 40, NT = 64;
  const CURVE_THS = [1, 2, 0.5];
  const CURVE_TEX = ['\\theta = 1', '\\theta = 2', '\\theta = 1/2'];

  function drawLeft(st) {
    const P = camera(st), prims = [], thK = st.thetaK;
    // axes first: the surface may cover parts of them
    const O = P(0, 0, 0), Xe = P(1.12, 0, 0), Ye = P(0, YLEN + 0.18, 0), Ze = P(0, 0, 1.02);
    arrow(O[0], O[1], Xe[0], Xe[1], '#222', 2.2);
    arrow(O[0], O[1], Ze[0], Ze[1], '#222', 2.2);
    label('ax-x', 'x', Xe[0] - 26, Xe[1] + 8, { anchor: [0.5, 0], size: 34 });
    label('ax-u', 'u', Ze[0] - 16, Ze[1], { anchor: [1, 0.5], size: 34 });
    if (st.thetaAxis > 0.001) {
      ctx.globalAlpha = st.thetaAxis; arrow(O[0], O[1], Ye[0], Ye[1], '#222', 2.2); ctx.globalAlpha = 1;
      label('ax-th', '\\theta', Ye[0] + 10, Ye[1], { anchor: [0, 0.5], size: 34, alpha: st.thetaAxis });
    }

    if (st.surf > 0.001) {
      const light = [-0.35, -0.55, 0.76];
      for (let i = 0; i < NX; i++) for (let j = 0; j < NT; j++) {
        const x0 = i / NX, x1 = (i + 1) / NX;
        const t0 = TH0 + (TH1 - TH0) * j / NT, t1 = TH0 + (TH1 - TH0) * (j + 1) / NT;
        const W = [[x0, t0], [x1, t0], [x1, t1], [x0, t1]].map(([x, t]) => [x, Yof(t), u(x, t) * ZS]);
        const a = W[1].map((v, k) => v - W[0][k]), b = W[3].map((v, k) => v - W[0][k]);
        let n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
        const nn = Math.hypot(...n); n = n.map(v => v / nn);
        const sh = 0.86 + 0.14 * Math.abs(n[0] * light[0] + n[1] * light[1] + n[2] * light[2]);
        const ov = Math.max(0, Math.min(t1, thK + DELTA) - Math.max(t0, thK - DELTA)) / (t1 - t0) * st.strip;
        const col = [232, 232, 232].map((c, k) => Math.round((c + (BLUE[k] - c) * ov) * sh));
        const S = W.map(w => P(...w));
        const d = (S[0][2] + S[1][2] + S[2][2] + S[3][2]) / 4;
        prims.push({ d, f: () => {
          ctx.globalAlpha = st.surf; ctx.fillStyle = `rgb(${col})`; ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); for (let k = 1; k < 4; k++) ctx.lineTo(S[k][0], S[k][1]);
          ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
        } });
      }
    }
    CURVE_THS.forEach((th, ci) => {
      let a = clamp(st.curvesN - ci, 0, 1);
      a *= ci > 0 ? st.curvesAlpha : lerp(1, st.curvesAlpha, st.surf);
      if (a <= 0.001) return;
      const xmax = ci === 0 ? st.curveDraw : 1, n = 80;
      for (let k = 0; k < n; k++) {
        const xa = k / n; if (xa >= xmax) break;
        const xe = Math.min((k + 1) / n, xmax);
        const A = P(xa, Yof(th), u(xa, th) * ZS), B = P(xe, Yof(th), u(xe, th) * ZS);
        prims.push({ d: (A[2] + B[2]) / 2 - 0.004, f: () => {
          ctx.globalAlpha = a; ctx.strokeStyle = ci === 0 ? '#111' : '#555'; ctx.lineWidth = ci === 0 ? 3.2 : 2.4;
          ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.globalAlpha = 1;
        } });
      }
      const la = a * (1 - clamp(st.rot * 2, 0, 1)) * (ci === 0 ? clamp(st.curveDraw * 3 - 2, 0, 1) : 1);
      if (la > 0.001) { const pk = P(0.5, Yof(th), u(0.5, th) * ZS); label('curve' + ci, CURVE_TEX[ci], pk[0], pk[1] - 12, { anchor: [0.5, 1], size: 28, alpha: la }); }
    });
    if (st.pt > 0.001) {
      for (let k = 0, n = 80; k < n; k++) {
        const xa = k / n, xb = (k + 1) / n;
        const A = P(xa, Yof(thK), u(xa, thK) * ZS + .003), B = P(xb, Yof(thK), u(xb, thK) * ZS + .003);
        prims.push({ d: (A[2] + B[2]) / 2 - 0.01, f: () => {
          ctx.globalAlpha = st.pt; ctx.strokeStyle = '#111'; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.globalAlpha = 1;
        } });
      }
    }
    if (st.data > 0.001) XS.forEach((x, i) => {
      const p = P(x, Yof(THSTAR), DS[i] * ZS);
      prims.push({ d: p[2] - 0.06, f: () => {
        ctx.globalAlpha = st.data; ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 2 * PI); ctx.fill(); ctx.globalAlpha = 1;
      } });
    });
    prims.sort((a, b) => b.d - a.d).forEach(p => p.f());

    // labels at the front edge (x = 1), where each highlighted curve meets the floor
    const near = clamp(1.5 - Math.abs(thK - THSTAR) / 0.08, 0, 1) * st.pt;
    const ps = P(1, Yof(THSTAR), 0), pk = P(1, Yof(thK), 0);
    if (st.data * st.thetaAxis > 0.001) label('3d-thstar', '\\theta^*', ps[0] + 10, ps[1] + 10, { anchor: [0, 0], alpha: st.data * st.thetaAxis * (1 - near) });
    if (st.pt > 0.001) label('3d-thk', '\\theta^{(k)}', pk[0] + 10, pk[1] + 10, { anchor: [0, 0], color: PT(st.strip), alpha: st.pt * st.thetaAxis });
    if (st.data > 0.001) {
      const p = P(XS[8], Yof(THSTAR), DS[8] * ZS);
      label('3d-data', 'data', p[0] + 16, p[1], { anchor: [0, 0.5], text: true, size: 26, alpha: st.data });
    }
  }

  function drawRight(st) {
    const A = clamp((st.split - 0.4) / 0.6, 0, 1);
    if (A <= 0.001) return;
    ctx.globalAlpha = A;
    const x0 = 1010, x1 = 1530, y0 = 220, y1 = 630;
    const X = th => x0 + (th - RT0) / (RT1 - RT0) * (x1 - x0);
    const Y = l => y1 - l / LMAX * (y1 - y0);
    if (st.strip > 0.001) {
      const a = X(st.thetaK - DELTA), b = X(st.thetaK + DELTA);
      ctx.fillStyle = `rgba(${BLUE},${0.55 * st.strip * A})`;
      ctx.fillRect(a, y0 - 10, b - a, y1 - y0 + 10);
    }
    arrow(x0, y1, x1 + 40, y1, '#222', 2.2);
    arrow(x0, y1, x0, y0 - 40, '#222', 2.2);
    label('r-th', '\\theta', x1 + 48, y1, { anchor: [0, 0.5], size: 34, alpha: A });
    label('r-L', '\\Ldata(\\theta)', x0 + 14, y0 - 40, { anchor: [0, 0.5], size: 32, alpha: A });
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(X(THSTAR), y1 - 7); ctx.lineTo(X(THSTAR), y1 + 7); ctx.stroke();
    label('r-thstar', '\\theta^*', X(THSTAR), y1 + 12, { anchor: [0.5, 0], alpha: A });

    const tEnd = RT0 + (RT1 - RT0) * st.lossDraw;
    if (st.lossDraw > 0.001) {
      ctx.strokeStyle = '#111'; ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let t = RT0, first = true; t <= tEnd + 1e-9; t += 0.005, first = false) first ? ctx.moveTo(X(t), Y(L(t))) : ctx.lineTo(X(t), Y(L(t)));
      ctx.stroke();
    }
    if (st.pt > 0.001) {
      const a = A * st.pt, col = PT(st.strip);
      ctx.globalAlpha = a;
      for (let j = 0; j < st.iter; j++) {
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(X(ITERS[j]), Y(L(ITERS[j])), 5.5, 0, 2 * PI); ctx.fill(); ctx.stroke();
      }
      const th = st.thetaK, px = X(th), py = Y(L(th));
      ctx.setLineDash([7, 6]); ctx.strokeStyle = col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, y1 + 50); ctx.stroke(); ctx.setLineDash([]);
      label('r-thk', '\\theta^{(k)}', px, y1 + 52, { anchor: [0.5, 0], color: col, alpha: a });
      const g = dL(th), len = 95 * Math.sqrt(Math.abs(g) / G0);
      if (st.grad > 0.001 && len > 10) {
        // descent direction lives in θ-space: horizontal
        const vx = -Math.sign(g);
        ctx.globalAlpha = A * st.grad;
        arrow(px, py, px + vx * len, py, '#111', 2.4, 13);
        label('r-grad', '-\\nabla_\\theta \\Ldata', px + 8, py - 12, { anchor: vx > 0 ? [0, 1] : [1, 1], size: 26, alpha: A * st.grad });
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, py, 7, 0, 2 * PI); ctx.fill();
      if (st.iter > 0) label('r-iter', 'k = ' + st.iter, x1 + 20, y0, { anchor: [1, 0.5], color: col, alpha: a });
    }
    ctx.globalAlpha = 1;
  }

  // ---------------- step engine ----------------
  let state = { ...S0 }, step = 0, queue = [], anim = null;
  function finalState(s) {
    const st = { ...S0 };
    for (let i = 0; i <= s; i++) for (const ph of STEPS[i]) Object.assign(st, ph.set || {}, ph.to);
    return st;
  }
  function startNext() {
    if (!queue.length) { anim = null; return; }
    const ph = queue.shift();
    if (ph.set) Object.assign(state, ph.set);
    anim = { from: { ...state }, to: ph.to, t0: performance.now(), dur: ph.dur };
  }
  function setCap(el, html) {
    if (el.dataset.src === html) return;
    el.dataset.src = html; el.style.opacity = 0;
    setTimeout(() => { if (el.dataset.src === html) { el.innerHTML = html; Deck.typeset(el); el.style.opacity = 1; } }, 180);
  }
  function setCaps() { setCap(capL, CAP_L[step]); setCap(capR, CAP_R[step]); }
  function enterStep(s) { step = s; state = s > 0 ? finalState(s - 1) : { ...S0 }; queue = STEPS[s].map(p => ({ ...p })); startNext(); setCaps(); }
  function jumpTo(s) { step = s; state = finalState(s); anim = null; queue = []; setCaps(); }

  function frame(now) {
    if (anim) {
      const p = clamp((now - anim.t0) / anim.dur, 0, 1), e = ease(p);
      for (const k in anim.to) state[k] = anim.from[k] + (anim.to[k] - anim.from[k]) * e;
      if (p >= 1) startNext();
    }
    used = new Set();
    ctx.setTransform(K, 0, 0, K, 0, 0);
    ctx.clearRect(0, 0, BW, BH);
    drawLeft(state); drawRight(state);
    for (const [k, L] of labels) if (!used.has(k)) L.el.style.display = 'none';
    raf = requestAnimationFrame(frame);
  }

  Deck.slide({
    id: 'bilo-animation',
    title: 'Bilevel Local Operator Learning',
    notes: 'Steps: one solution (θ = 1) → θ = 2, θ = 1/2 → θ axis → solution operator surface → data and L_data(θ) → gradient descent with the full operator → restart with the local operator strip at θ^(k) → strip follows the iterates.',
    html: String.raw`
<style>
  .anim { position:absolute; inset:0; }
  .anim canvas { position:absolute; left:0; top:0; width:1600px; height:872px; }
  .anim .labels { position:absolute; inset:0; pointer-events:none; }
  .anim .lbl { position:absolute; left:0; top:0; white-space:nowrap; line-height:1; }
  .anim .capL, .anim .capR { position:absolute; top:18px; font-size:29px; line-height:1.35; transition:opacity .3s; }
  .anim .capL { left:56px; width:880px; }
  .anim .capR { left:990px; width:570px; }
  .anim .foot { position:absolute; left:56px; top:770px; font-size:26px; line-height:1.4; transition:opacity .5s; }
</style>
<div class="anim">
  <canvas></canvas>
  <div class="labels"></div>
  <div class="capL"></div>
  <div class="capR"></div>
  <div class="foot">Example problem: \(\theta\, u_{xx} = -\pi^2 \sin(\pi x)\)<br>Solution: \(u(x,\theta) = \sin(\pi x)/\theta\)</div>
</div>`,
    setup,
    enter(el, fromEnd) {
      resize();
      if (fromEnd) jumpTo(STEPS.length - 1); else enterStep(0);
      cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
    },
    leave() { cancelAnimationFrame(raf); },
    next() {
      if (anim || queue.length) { state = finalState(step); anim = null; queue = []; return true; }
      if (step < STEPS.length - 1) { enterStep(step + 1); return true; }
      return false;
    },
    prev() {
      if (step > 0) { jumpTo(step - 1); return true; }
      return false;
    },
  });
})();
