/* Adjoint method, with a static cartoon of PDE-constrained optimization (replaces diagram-adjoint-sketch.png).
 * u and θ are scalars; contours of L_data(u) are horizontal lines, darker = smaller loss (û lies above the plot);
 * the constraint F(u, θ) = 0 is the arc of a circle between the two axes.
 * The optimum is where the arc is tangent to a contour (top of the arc). Coordinates are in the 560×500 SVG box.
 *
 * Builds: start = figure centered (axes, contours, constraint) · click 1 = a dot slides along the constraint and stops
 * at the tangent point · click 2 = figure moves right, then the text appears one line per click. */
(function () {
  const OX = 50, OY = 460;                 // axes origin
  const CX = 240, CY = 480, R = 280;       // constraint circle (only an arc is drawn)
  const P = a => [CX + R * Math.cos(a * Math.PI / 180), CY - R * Math.sin(a * Math.PI / 180)];
  const DEG = 180 / Math.PI;
  const A0 = Math.asin((CY - OY) / R) * DEG, A1 = Math.acos((OX - CX) / R) * DEG;   // arc meets the θ axis and the u axis
  const [x0, y0] = P(A0), [x1, y1] = P(A1), [tx, ty] = P(90);
  const AS = 12, [sx, sy] = P(AS);          // the moving dot starts at AS° and stops at the top (90°)
  const CONTOURS = [-2, -1, 0, 1, 2, 3].map(k => ty + 70 * k);
  const SHADES = ['#3f007d', '#54278f', '#6a51a3', '#807dba', '#9e9ac8', '#bcbddc'];   // smaller loss → darker

  const lbl = (x, y, html, style = '') => `<div class="alb" style="left:${x}px; top:${y}px; ${style}">${html}</div>`;

  Deck.slide({
    id: 'adjoint',
    title: 'Adjoint Method',
    html: String.raw`
<style>
  .adj-wrap { position:relative; height:640px; }
  .adj-fig { position:absolute; top:0; left:410px; width:560px; height:500px; transition:left .8s ease; }
  .adj-wrap:has(.adj-move.shown) .adj-fig { left:820px; }
  .adj-fig svg { position:absolute; left:0; top:0; }
  .adj-fig .alb { position:absolute; transform:translate(-50%,-50%); white-space:nowrap; line-height:1; font-size:30px; }
  .adj-dot { position:absolute; left:0; top:0; width:18px; height:18px; border-radius:50%; background:#0054EA;
    offset-path: path('M${sx},${sy} A${R},${R} 0 0 0 ${tx},${ty}'); offset-rotate:0deg; offset-distance:0%;
    transition: opacity .35s, offset-distance 2.6s ease-in-out .3s; }
  .adj-dot.shown { offset-distance:100%; }
  .adj-text { position:absolute; left:0; top:0; width:780px; }
</style>
<div class="adj-wrap">
  <span class="frag adj-move" data-step="2"></span>
  <div class="adj-text">
    <ul>
      <li class="frag" data-step="2">Deriving the adjoint equation</li>
      <li class="frag" data-step="3">For example, if the PDE is \(\mathcal{L}u = f\), solve the adjoint equation \(\mathcal{L}^{*}\lambda = u - \hat u\)</li>
      <li class="frag" data-step="4">Then the gradient is
        \[\nabla_\theta \Ldata = -\Big\langle \lambda,\ \frac{\partial \mathcal{L}}{\partial\theta}\,u \Big\rangle\]</li>
      <li class="frag" data-step="5">Accurate gradient and solution for optimization and sampling</li>
      <li class="frag" data-step="6">Need to solve forward and adjoint equations at every step</li>
    </ul>
  </div>
  <div class="adj-fig">
    <svg width="560" height="500" viewBox="0 0 560 500">
      <defs>
        <marker id="adj-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#111"/></marker>
      </defs>
      <g stroke-width="3">
        ${CONTOURS.map((y, i) => `<line x1="${OX}" y1="${y}" x2="545" y2="${y}" stroke="${SHADES[i]}"/>`).join('')}
      </g>
      <line x1="${OX}" y1="${OY}" x2="545" y2="${OY}" stroke="#111" stroke-width="2.4" marker-end="url(#adj-ah)"/>
      <line x1="${OX}" y1="${OY}" x2="${OX}" y2="30" stroke="#111" stroke-width="2.4" marker-end="url(#adj-ah)"/>
      <path d="M${x0},${y0} A${R},${R} 0 0 0 ${x1},${y1}" fill="none" stroke="#FF5970" stroke-width="4"/>
    </svg>
    ${lbl(OX + 22, 30, '\\(u\\)')}
    ${lbl(540, OY + 26, '\\(\\theta\\)')}
    ${lbl(545, CONTOURS[0] - 22, 'contours of \\(\\Ldata(u)\\)', 'transform:translate(-100%,-50%); font-size:26px')}
    ${lbl(P(22)[0] - 18, P(22)[1], '\\(F(u,\\theta)=0\\)', 'transform:translate(-100%,-50%); color:#FF5970; background:#fff; padding:2px 4px')}
    <div class="adj-dot frag" data-step="1"></div>
  </div>
</div>
<div class="cite">Hinze, M., Pinnau, R., Ulbrich, M., Ulbrich, S., 2008. Optimization with PDE Constraints.</div>`,
  });
})();
