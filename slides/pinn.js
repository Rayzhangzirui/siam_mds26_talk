/* PINN schematic, drawn as SVG lines + HTML/KaTeX labels (replaces diagram-pinn-network.png).
 * Node positions are in the 1380×430 diagram box; edit NODES / BOXES to move things. */
(function () {
  const R = 40;                        // neuron radius
  const NODES = {
    x: [70, 130], t: [70, 300],
    a1: [230, 55], a2: [230, 190], a3: [230, 375],
    b1: [380, 55], b2: [380, 190], b3: [380, 375],
    u: [530, 215],
    ut: [690, 85], uxx: [690, 215],
  };
  const BOXES = {                      // [left, top, width, height]
    res: [820, 90, 230, 120],
    dat: [820, 300, 230, 90],
    loss: [1135, 205, 90, 56],
    out: [1270, 205, 110, 56],
  };
  const DOTS = [[230, 285], [380, 285]];

  // segment from node a to node b, trimmed to the circle edges
  function edge(a, b) {
    const [x0, y0] = NODES[a], [x1, y1] = NODES[b];
    const d = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / d, uy = (y1 - y0) / d;
    return line(x0 + ux * R, y0 + uy * R, x1 - ux * (R + 2), y1 - uy * (R + 2));
  }
  const line = (x0, y0, x1, y1) => `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" marker-end="url(#pinn-ah)"/>`;
  const poly = pts => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" marker-end="url(#pinn-ah)"/>`;

  const lines = [];
  for (const i of ['x', 't']) for (const j of ['a1', 'a2', 'a3']) lines.push(edge(i, j));
  for (const i of ['a1', 'a2', 'a3']) for (const j of ['b1', 'b2', 'b3']) lines.push(edge(i, j));
  for (const i of ['b1', 'b2', 'b3']) lines.push(edge(i, 'u'));
  lines.push(edge('u', 'ut'), edge('u', 'uxx'));
  const [rl, rt, rw, rh] = BOXES.res, [dl, dt, dw, dh] = BOXES.dat, [ll, lt, lw, lh] = BOXES.loss, [ol, ot, , oh] = BOXES.out;
  const [utx, uty] = NODES.ut, [uxx, uxy] = NODES.uxx, [ux, uy] = NODES.u;
  lines.push(line(utx + R * 0.8, uty + R * 0.6, rl - 2, rt + rh * 0.4));
  lines.push(line(uxx + R * 0.8, uxy - R * 0.6, rl - 2, rt + rh * 0.6));
  lines.push(poly([[ux + R * 0.7, uy + R * 0.7], [700, dt + dh / 2], [dl - 2, dt + dh / 2]]));
  lines.push(poly([[rl + rw, rt + rh / 2], [ll + lw / 2, rt + rh / 2], [ll + lw / 2, lt - 2]]));
  lines.push(poly([[dl + dw, dt + dh / 2], [ll + lw / 2, dt + dh / 2], [ll + lw / 2, lt + lh + 2]]));
  lines.push(line(ll + lw, lt + lh / 2, ol - 2, ot + oh / 2));

  const at = (x, y, html, cls = '', style = '') =>
    `<div class="pn ${cls}" style="left:${x}px; top:${y}px; ${style}">${html}</div>`;
  const node = (k, html) => at(NODES[k][0], NODES[k][1], html, 'neuron');
  const box = (k, html) => {
    const [l, t, w, h] = BOXES[k];
    return at(l + w / 2, t + h / 2, html, 'pbox', `width:${w}px; height:${h}px`);
  };

  const diagram = String.raw`
<div class="pinn-diagram">
  <svg width="1380" height="430" viewBox="0 0 1380 430">
    <defs><marker id="pinn-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#111"/></marker></defs>
    <g stroke="#111" stroke-width="1.8">${lines.join('')}</g>
  </svg>
  ${node('x', '\\(x\\)')}${node('t', '\\(t\\)')}
  ${['a1', 'a2', 'a3', 'b1', 'b2', 'b3'].map(k => node(k, '')).join('')}
  ${DOTS.map(([x, y]) => at(x, y, '\\(\\vdots\\)')).join('')}
  ${at(150, 50, '\\(\\blue{W}\\)')}
  ${node('u', '\\(\\blue{u}\\)')}
  ${node('ut', '\\(\\blue{u_t}\\)')}
  ${node('uxx', '\\(\\blue{u_{xx}}\\)')}
  ${box('res', '\\(\\blue{u_t} - \\red{\\theta}\\,\\blue{u_{xx}}\\)')}
  ${box('dat', '\\(\\blue{u} - \\hat u\\)')}
  ${box('loss', 'loss')}
  ${box('out', '\\(\\blue{W},\\red{\\theta}\\)')}
  ${at(1100, 125, '\\(\\Lres\\)')}
  ${at(1100, 375, '\\(\\Ldata\\)')}
  ${at(1248, 268, 'min', 'small', 'transform:translate(-50%,0)')}
</div>`;

  Deck.slide({
    id: 'pinn',
    title: 'PINN',
    html: String.raw`
<style>
  .pinn-diagram { position:relative; width:1380px; height:430px; margin:-6px 0 0; }
  .pinn-diagram svg { position:absolute; left:0; top:0; }
  .pinn-diagram .pn { position:absolute; transform:translate(-50%,-50%); white-space:nowrap; line-height:1; }
  .pinn-diagram .neuron { width:${2 * R}px; height:${2 * R}px; border:2px solid #111; border-radius:50%; background:#fff;
    display:flex; align-items:center; justify-content:center; box-sizing:border-box; }
  .pinn-diagram .pbox { border:2px solid #111; background:#fff; display:flex; align-items:center; justify-content:center; box-sizing:border-box; }
</style>
${diagram}
<div style="margin-top:14px; font-size:30px">
  <p style="margin:0">Schematic of inferring the diffusion coefficient of the heat equation</p>
  <div class="frag">
  <ul>
    <li>represent the solution to the PDE by a neural network</li>
    <li>mesh free, flexible loss function</li>
    <li>solve the PDE, fit the data, infer parameters at the same time</li>
    <li>For UQ, we sample \(\red{\theta}\) and \(\blue{W}\) (Bayesian Neural Network)</li>
  </ul>
  </div>
</div>
<div class="cite">Raissi, M., Perdikaris, P., Karniadakis, G.E., 2019. Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations.</div>`,
  });
})();
