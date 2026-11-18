/* LoRA for B-BiLO, animated in 8 steps (replaces diagram-lora-*.png).
 * Message: at the current θ, train the local operator → get the gradient → update θ (HMC) → adapt the operator.
 *
 *  1 upper: posterior P(θ | data)        2 upper: sample θ1              3 lower: local operator at θ1
 *  4 upper: ∇θU(θ1)                      5 upper: θ2 appears              6 lower: local operator moves to θ2
 *  7 upper: ∇θU(θ2)                      8 lower: LoRA arrow connects the two strips
 *
 * Same conventions as bilo-animation.js: canvas for drawing, KaTeX labels in an overlay.
 */
(function () {
  const PI = Math.PI;
  // ---------------- upper level: P(θ | data) ----------------
  const PT0 = 0.6, PT1 = 2.1, MU = 1.35, SD = 0.3;
  const TH1 = 0.95, TH2 = 1.6;
  const post = th => Math.exp(-((th - MU) ** 2) / (2 * SD * SD));
  const dlogp = th => -(th - MU) / (SD * SD);
  const UX0 = 560, UX1 = 1220, UYB = 330, UH = 260;
  const UX = th => UX0 + (th - PT0) / (PT1 - PT0) * (UX1 - UX0);
  const UY = p => UYB - p * UH;

  // ---------------- lower level: u(x, θ) surface ----------------
  const ST0 = 0.6, ST1 = 2.0, YLEN = 1.4, ZS = 0.55, DELTA = 0.11;
  const u = (x, th) => Math.sin(PI * x) / th;
  const Yof = th => (th - ST0) / (ST1 - ST0) * YLEN;
  const AZ = 66 * PI / 180, EL = 27 * PI / 180, SC = 270, CX = 820, CY = 615;
  const raw = (X, Y, Z) => {
    const x1 = X * Math.cos(AZ) + Y * Math.sin(AZ), y1 = -X * Math.sin(AZ) + Y * Math.cos(AZ);
    return [x1, Z * Math.cos(EL) + y1 * Math.sin(EL), y1 * Math.cos(EL) - Z * Math.sin(EL)];
  };
  const P = (() => {
    let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
    for (const X of [0, 1.1]) for (const Y of [0, YLEN]) for (const Z of [0, 0.95]) {
      const p = raw(X, Y, Z); mnx = Math.min(mnx, p[0]); mxx = Math.max(mxx, p[0]); mny = Math.min(mny, p[1]); mxy = Math.max(mxy, p[1]);
    }
    const bx = (mnx + mxx) / 2, by = (mny + mxy) / 2;
    return (X, Y, Z) => { const p = raw(X, Y, Z); return [CX + (p[0] - bx) * SC, CY - (p[1] - by) * SC, p[2]]; };
  })();

  // ---------------- animation steps ----------------
  const S0 = { pDraw: 0, t1: 0, low: 0, strip: 0, thK: TH1, g1: 0, t2: 0, dim1: 0, ghost: 0, g2: 0, lora: 0 };
  const STEPS = [
    [{ dur: 1200, to: { pDraw: 1 } }],
    [{ dur: 600, to: { t1: 1 } }],
    [{ dur: 700, to: { low: 1 } }, { dur: 700, to: { strip: 1 } }],
    [{ dur: 600, to: { g1: 1 } }],
    [{ dur: 600, to: { t2: 1, dim1: 1 } }],
    [{ dur: 300, to: { ghost: 1 } }, { dur: 1300, to: { thK: TH2 } }],
    [{ dur: 600, to: { g2: 1 } }],
    [{ dur: 900, to: { lora: 1 } }],
  ];

  // ---------------- DOM ----------------
  const BW = 1600, BH = 872;
  let root, cv, ctx, layer, upTxt, lowTxt, K = 1, raf = 0, used;
  const labels = new Map();
  function label(key, src, x, y, opt = {}) {
    let L = labels.get(key);
    if (!L) { L = { el: document.createElement('div'), src: null }; L.el.className = 'lbl'; layer.appendChild(L.el); labels.set(key, L); }
    if (L.src !== src) { L.el.innerHTML = opt.text ? src : Deck.tex(src); L.src = src; }
    const [ax, ay] = opt.anchor || [0.5, 0.5];
    L.el.style.transform = `translate(${x}px, ${y}px) translate(${-ax * 100}%, ${-ay * 100}%)`;
    L.el.style.opacity = opt.alpha === undefined ? 1 : opt.alpha;
    L.el.style.color = opt.color || '';
    L.el.style.fontSize = (opt.size || 30) + 'px';
    L.el.style.display = '';
    used.add(key);
  }
  function resize() {
    K = Deck.scale * (devicePixelRatio || 1);
    cv.width = Math.round(BW * K); cv.height = Math.round(BH * K);
  }

  // ---------------- drawing ----------------
  const BLUE = [150, 174, 230], BLUE_TXT = '#0054EA', RED = '#FF5970';
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
  function headAt(x, y, a, col, head = 16) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x - head * Math.cos(a - .38), y - head * Math.sin(a - .38));
    ctx.lineTo(x - head * Math.cos(a + .38), y - head * Math.sin(a + .38)); ctx.closePath(); ctx.fill();
  }

  // one sampled θ in the upper plot: dashed drop line, dot, label, gradient arrow
  function sample(th, name, alpha, gAlpha) {
    if (alpha <= 0.001) return;
    const x = UX(th), y = UY(post(th));
    ctx.globalAlpha = alpha;
    ctx.setLineDash([8, 6]); ctx.strokeStyle = '#111'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, UYB); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x, y, 7, 0, 2 * PI); ctx.fill();
    label('u-' + name, '\\theta_' + name.slice(-1), x, UYB + 10, { anchor: [0.5, 0], alpha });
    if (gAlpha > 0.001) {
      const d = Math.sign(dlogp(th)), len = Math.min(120, 26 * Math.abs(dlogp(th)));
      ctx.globalAlpha = gAlpha;
      arrow(x, y, x + d * len, y, BLUE_TXT, 3.2, 15);
      label('g-' + name, '\\nabla_\\theta U(\\theta_' + name.slice(-1) + ')', x + d * 10, y + 14,
        { anchor: [d > 0 ? 0 : 1, 0], color: BLUE_TXT, size: 30, alpha: gAlpha });
    }
    ctx.globalAlpha = 1;
  }

  function drawUpper(st) {
    arrow(UX0, UYB, UX1 + 40, UYB, '#555', 2.2);
    arrow(UX0, UYB, UX0, UYB - UH - 40, '#555', 2.2);
    label('u-th', '\\theta', UX1 + 48, UYB, { anchor: [0, 0.5], size: 34 });
    label('u-P', 'P(\\theta \\mid \\mathrm{data})', UX0 + 14, UYB - UH - 40, { anchor: [0, 0.5], size: 32 });
    if (st.pDraw > 0.001) {
      const tEnd = PT0 + (PT1 - PT0) * st.pDraw;
      ctx.strokeStyle = '#111'; ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let t = PT0, first = true; t <= tEnd + 1e-9; t += 0.005, first = false) first ? ctx.moveTo(UX(t), UY(post(t))) : ctx.lineTo(UX(t), UY(post(t)));
      ctx.stroke();
    }
    const dim = 1 - 0.55 * st.dim1;
    sample(TH1, 'th1', st.t1 * dim, st.g1 * dim);
    sample(TH2, 'th2', st.t2, st.g2);
  }

  function drawLower(st) {
    if (st.low <= 0.001) return;
    ctx.globalAlpha = st.low;
    const O = P(0, 0, 0), Xe = P(1.12, 0, 0), Ye = P(0, YLEN + 0.18, 0), Ze = P(0, 0, 1.02);
    arrow(O[0], O[1], Xe[0], Xe[1], '#555', 2.2);
    arrow(O[0], O[1], Ze[0], Ze[1], '#555', 2.2);
    arrow(O[0], O[1], Ye[0], Ye[1], '#555', 2.2);
    ctx.globalAlpha = 1;
    label('l-x', 'x', Xe[0] - 20, Xe[1] + 8, { anchor: [0.5, 0], size: 32, alpha: st.low });
    label('l-u', 'u', Ze[0] - 14, Ze[1], { anchor: [1, 0.5], size: 32, alpha: st.low });
    label('l-th', '\\theta', Ye[0] + 10, Ye[1], { anchor: [0, 0.5], size: 32, alpha: st.low });

    const prims = [], NX = 40, NT = 56, light = [-0.35, -0.55, 0.76];
    const band = (t0, t1, c) => Math.max(0, Math.min(t1, c + DELTA) - Math.max(t0, c - DELTA)) / (t1 - t0);
    for (let i = 0; i < NX; i++) for (let j = 0; j < NT; j++) {
      const x0 = i / NX, x1 = (i + 1) / NX;
      const t0 = ST0 + (ST1 - ST0) * j / NT, t1 = ST0 + (ST1 - ST0) * (j + 1) / NT;
      const W = [[x0, t0], [x1, t0], [x1, t1], [x0, t1]].map(([x, t]) => [x, Yof(t), u(x, t) * ZS]);
      const a = W[1].map((v, k) => v - W[0][k]), b = W[3].map((v, k) => v - W[0][k]);
      let n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const nn = Math.hypot(...n); n = n.map(v => v / nn);
      const sh = 0.86 + 0.14 * Math.abs(n[0] * light[0] + n[1] * light[1] + n[2] * light[2]);
      const ov = Math.max(band(t0, t1, st.thK) * st.strip, band(t0, t1, TH1) * st.ghost * 0.5);
      const col = [236, 236, 236].map((c, k) => Math.round((c + (BLUE[k] - c) * ov) * sh));
      const S = W.map(w => P(...w));
      prims.push({ d: (S[0][2] + S[1][2] + S[2][2] + S[3][2]) / 4, f: () => {
        ctx.globalAlpha = st.low; ctx.fillStyle = ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(S[0][0], S[0][1]); for (let k = 1; k < 4; k++) ctx.lineTo(S[k][0], S[k][1]);
        ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
      } });
    }
    const curveOn = (th, alpha, w) => {
      for (let k = 0, n = 80; k < n; k++) {
        const A = P(k / n, Yof(th), u(k / n, th) * ZS + .003), B = P((k + 1) / n, Yof(th), u((k + 1) / n, th) * ZS + .003);
        prims.push({ d: (A[2] + B[2]) / 2 - 0.01, f: () => {
          ctx.globalAlpha = alpha; ctx.strokeStyle = '#111'; ctx.lineWidth = w; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.globalAlpha = 1;
        } });
      }
    };
    if (st.strip > 0.001) curveOn(st.thK, st.strip, 3);
    if (st.ghost > 0.001) curveOn(TH1, st.ghost * 0.45, 2.4);
    prims.sort((a, b) => b.d - a.d).forEach(p => p.f());

    // θ labels where the strips meet the floor at the front edge
    const f1 = P(1, Yof(TH1), 0), fk = P(1, Yof(st.thK), 0);
    if (st.ghost > 0.001) label('l-th1', '\\theta_1', f1[0] + 8, f1[1] + 8, { anchor: [0, 0], alpha: st.ghost * 0.6, color: BLUE_TXT });
    const kName = st.thK > (TH1 + TH2) / 2 ? '\\theta_2' : '\\theta_1';
    if (st.strip > 0.001) label('l-thk', kName, fk[0] + 8, fk[1] + 8, { anchor: [0, 0], alpha: st.strip, color: BLUE_TXT });
    label('l-cap', 'Local operator at ' + Deck.tex(kName), 1130, CY + 120, { anchor: [0, 0.5], text: true, size: 30, alpha: st.strip, color: BLUE_TXT });

    if (st.lora > 0.001) {
      // LoRA: curved arrow from the strip at θ1 to the strip at θ2
      const a = P(0.5, Yof(TH1), u(0.5, TH1) * ZS), b = P(0.5, Yof(TH2), u(0.5, TH2) * ZS);
      const ax = a[0], ay = a[1] - 14, bx = b[0], by = b[1] - 14, cx = (ax + bx) / 2, cy = Math.min(ay, by) - 120;
      const n = 60, m = Math.round(n * st.lora);
      const q = t => [(1 - t) ** 2 * ax + 2 * t * (1 - t) * cx + t * t * bx, (1 - t) ** 2 * ay + 2 * t * (1 - t) * cy + t * t * by];
      ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
      for (let k = 0; k <= m; k++) { const p = q(k / n); k ? ctx.lineTo(...p) : ctx.moveTo(...p); }
      ctx.stroke();
      const e = q(m / n), e0 = q(Math.max(0, m - 2) / n);
      if (m > 2) headAt(e[0], e[1], Math.atan2(e[1] - e0[1], e[0] - e0[0]), RED, 18);
      const mid = q(0.5);
      const la = clamp(st.lora * 2 - 1, 0, 1);
      label('lora', '<b>LoRA</b>', mid[0], mid[1] - 10, { anchor: [0.5, 1], text: true, size: 32, color: RED, alpha: la });
      // low-rank sketch: tall-thin factor × short-wide factor
      const sx = mid[0] + 50, sy = mid[1] - 50;
      ctx.globalAlpha = la; ctx.fillStyle = 'rgba(255,89,112,.25)'; ctx.strokeStyle = RED; ctx.lineWidth = 2.5;
      ctx.fillRect(sx, sy, 13, 50); ctx.strokeRect(sx, sy, 13, 50);
      ctx.fillRect(sx + 20, sy-13, 50, 13); ctx.strokeRect(sx + 20, sy-13, 50, 13);
      ctx.globalAlpha = 1;
    }
  }

  // ---------------- step engine (same as bilo-animation.js) ----------------
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
  function enterStep(s) { step = s; state = s > 0 ? finalState(s - 1) : { ...S0 }; queue = STEPS[s].map(p => ({ ...p })); startNext(); }
  function jumpTo(s) { step = s; state = finalState(s); anim = null; queue = []; }

  function frame(now) {
    if (anim) {
      const p = clamp((now - anim.t0) / anim.dur, 0, 1), e = ease(p);
      for (const k in anim.to) state[k] = anim.from[k] + (anim.to[k] - anim.from[k]) * e;
      if (p >= 1) startNext();
    }
    used = new Set();
    ctx.setTransform(K, 0, 0, K, 0, 0);
    ctx.clearRect(0, 0, BW, BH);
    drawUpper(state); drawLower(state);
    for (const [k, L] of labels) if (!used.has(k)) L.el.style.display = 'none';
    lowTxt.style.opacity = state.low;
    raf = requestAnimationFrame(frame);
  }

  Deck.slide({
    id: 'bbilo-lora',
    title: 'Low-Rank Adaptation for Efficient Sampling',
    notes: 'At the current θ: train the local operator (lower level), get ∇θU, take an HMC step to the next θ (upper level). The local operator at θ2 is a small LoRA update of the one at θ1.',
    html: String.raw`
<style>
  .lora-anim { position:absolute; inset:0; }
  .lora-anim canvas { position:absolute; left:0; top:0; width:1600px; height:872px; }
  .lora-anim .labels { position:absolute; inset:0; pointer-events:none; }
  .lora-anim .lbl { position:absolute; left:0; top:0; white-space:nowrap; line-height:1; }
  .lora-anim .lvl { position:absolute; left:110px; width:440px; font-size:34px; line-height:1.4; }
</style>
<div class="lora-anim">
  <canvas></canvas>
  <div class="labels"></div>
  <div class="lvl up" style="top:130px">Upper level:<br>Sampling PDE parameters</div>
  <div class="lvl low" style="top:600px">Lower level:<br>Train local operator</div>
</div>`,
    setup(el) {
      root = el.querySelector('.lora-anim');
      cv = root.querySelector('canvas'); ctx = cv.getContext('2d');
      layer = root.querySelector('.labels');
      upTxt = root.querySelector('.up'); lowTxt = root.querySelector('.low');
      addEventListener('deck:resize', resize);
    },
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
