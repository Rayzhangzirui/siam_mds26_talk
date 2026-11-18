/* Two-network diagram f(x; V) → z → u(x, z; W), drawn as SVG + HTML/KaTeX labels
 * (replaces diagram-unknown-fn-network.png). Positions are in the 740×420 diagram box. */
(function () {
  const R = 28;
  const N = {
    x: [40, 220],
    a1: [140, 130], a2: [140, 220], a3: [140, 310],
    b1: [240, 130], b2: [240, 220], b3: [240, 310],
    x2: [345, 140], z: [345, 230],
    c1: [460, 60], c2: [460, 145], c3: [460, 230], c4: [460, 315],
    d1: [580, 60], d2: [580, 145], d3: [580, 230], d4: [580, 315],
    u: [700, 190],
  };
  const edge = (a, b) => {
    const [x0, y0] = N[a], [x1, y1] = N[b];
    const d = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / d, uy = (y1 - y0) / d;
    return `<line x1="${x0 + ux * R}" y1="${y0 + uy * R}" x2="${x1 - ux * R}" y2="${y1 - uy * R}"/>`;
  };
  const E = [];
  for (const j of ['a1', 'a2', 'a3']) E.push(edge('x', j));
  for (const i of ['b1', 'b2', 'b3']) E.push(edge(i, 'z'));
  for (const i of ['x2', 'z']) for (const j of ['c1', 'c2', 'c3', 'c4']) E.push(edge(i, j));
  for (const i of ['d1', 'd2', 'd3', 'd4']) E.push(edge(i, 'u'));
  // curly brace under [xa, xb] at height y
  const brace = (xa, xb, y) => {
    const m = (xa + xb) / 2, h = 14;
    return `<path d="M${xa},${y - h} q0,${h} ${h},${h} H${m - h} q${h},0 ${h},${h} q0,${-h} ${h},${-h} H${xb - h} q${h},0 ${h},${-h}"/>`;
  };
  const at = (x, y, html, cls = '') => `<div class="un ${cls}" style="left:${x}px; top:${y}px">${html}</div>`;
  const node = (k, html = '') => at(N[k][0], N[k][1], html, 'neuron');

  const diagram = String.raw`
<div class="ufn-diagram">
  <svg width="740" height="420" viewBox="0 0 740 420">
    <g stroke="#111" stroke-width="1.8" fill="none">${E.join('')}${brace(15, 330, 370)}${brace(365, 725, 370)}</g>
  </svg>
  ${node('x', '\\(x\\)')}
  ${['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3', 'c4', 'd1', 'd2', 'd3', 'd4'].map(k => node(k)).join('')}
  ${node('x2', '\\(x\\)')}${node('z', '\\(\\blue{z}\\)')}${node('u', '\\(u\\)')}
  ${at(190, 110, '\\(\\cdots\\)')}${at(520, 190, '\\(\\cdots\\)')}
  ${at(172, 404, '\\(f(x;\\red{V})\\)')}${at(545, 404, '\\(u(x,\\blue{z};\\blue{W})\\)')}
</div>`;

  Deck.slide({
    id: 'unknown-function',
    title: 'BiLO: Learning Unknown Functions',
    html: String.raw`
<style>
  .ufn-diagram { position:relative; width:740px; height:420px; margin:24px auto 0; }
  .ufn-diagram svg { position:absolute; left:0; top:0; }
  .ufn-diagram .un { position:absolute; transform:translate(-50%,-50%); white-space:nowrap; line-height:1; font-size:30px; }
  .ufn-diagram .neuron { width:${2 * R}px; height:${2 * R}px; border:2px solid #111; border-radius:50%; background:#fff;
    display:flex; align-items:center; justify-content:center; box-sizing:border-box; }
</style>
<ul>
  <li>Introduce an auxiliary variable \(\blue{z = f(x)}\)</li>
  <li>Find the operator \(u(x,\blue{z})\) such that \(u(x,\blue{f(x)})\) solves the PDE</li>
  <li>Define \(a(x,z) := F\big(D^k u(x,z),\dots,Du(x,z),z\big)\)</li>
  <li>If \(u\) is a local operator at \(f\), then \(\blue{a(x,f(x)) = 0}\) and \(\red{\nabla_z a(x,f(x)) = 0}\)</li>
</ul>
<div class="frag">${diagram}</div>`,
  });
})();
