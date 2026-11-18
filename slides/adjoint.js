/* Adjoint method, with a static cartoon of PDE-constrained optimization (replaces diagram-adjoint-sketch.png).
 * u and θ are scalars; contours of L_data(u) are horizontal lines, darker = smaller loss (û lies above the plot);
 * the constraint F(u, θ) = 0 is the arc of a circle between the two axes.
 * The optimum is where the arc is tangent to a contour (top of the arc). Coordinates are in the 560×500 SVG box. */
(function () {
  const OX = 50, OY = 460;                 // axes origin
  const CX = 240, CY = 480, R = 280;       // constraint circle (only an arc is drawn)
  const P = a => [CX + R * Math.cos(a * Math.PI / 180), CY - R * Math.sin(a * Math.PI / 180)];
  const DEG = 180 / Math.PI, AG = 45;      // gradient arrow drawn at AG°
  const A0 = Math.asin((CY - OY) / R) * DEG, A1 = Math.acos((OX - CX) / R) * DEG;   // arc meets the θ axis and the u axis
  const [x0, y0] = P(A0), [x1, y1] = P(A1), [gx, gy] = P(AG), [tx, ty] = P(90);
  const g = AG * Math.PI / 180, L = 95;    // tangent toward the top of the arc
  const gx1 = gx - L * Math.sin(g), gy1 = gy - L * Math.cos(g);
  const CONTOURS = [-2, -1, 0, 1, 2, 3].map(k => ty + 70 * k);
  const SHADES = ['#3f007d', '#54278f', '#6a51a3', '#807dba', '#9e9ac8', '#bcbddc'];   // smaller loss → darker

  const lbl = (x, y, html, style = '') => `<div class="alb" style="left:${x}px; top:${y}px; ${style}">${html}</div>`;

  Deck.slide({
    id: 'adjoint',
    title: 'Adjoint Method',
    html: String.raw`
<style>
  .adj-fig { position:relative; width:560px; height:500px; flex:none; }
  .adj-fig svg { position:absolute; left:0; top:0; }
  .adj-fig .alb { position:absolute; transform:translate(-50%,-50%); white-space:nowrap; line-height:1; font-size:30px; }
</style>
<div class="row top">
  <div class="col">
    <ul>
      <li>Deriving the adjoint equation.<br>
        For example, if the PDE is \(\mathcal{L}u = f\),<br>
        we need to solve \(\mathcal{L}^{*}\lambda = u - \hat u\) to obtain \(\nabla_\theta \Ldata\)</li>
      <li class="frag" data-step="2">Accurate gradient and solution for optimization and sampling</li>
      <li class="frag" data-step="2">Need to solve forward and adjoint equations at every step.</li>
    </ul>
  </div>
  <div class="adj-fig frag" data-step="1">
    <svg width="560" height="500" viewBox="0 0 560 500">
      <defs>
        <marker id="adj-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#111"/></marker>
        <marker id="adj-ahb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#0054EA"/></marker>
      </defs>
      <g stroke-width="3">
        ${CONTOURS.map((y, i) => `<line x1="${OX}" y1="${y}" x2="545" y2="${y}" stroke="${SHADES[i]}"/>`).join('')}
      </g>
      <line x1="${OX}" y1="${OY}" x2="545" y2="${OY}" stroke="#111" stroke-width="2.4" marker-end="url(#adj-ah)"/>
      <line x1="${OX}" y1="${OY}" x2="${OX}" y2="30" stroke="#111" stroke-width="2.4" marker-end="url(#adj-ah)"/>
      <path d="M${x0},${y0} A${R},${R} 0 0 0 ${x1},${y1}" fill="none" stroke="#FF5970" stroke-width="4"/>
      <line x1="${gx}" y1="${gy}" x2="${gx1}" y2="${gy1}" stroke="#0054EA" stroke-width="4" marker-end="url(#adj-ahb)"/>
      <circle cx="${gx}" cy="${gy}" r="7" fill="#0054EA"/>
      <circle cx="${tx}" cy="${ty}" r="7" fill="#111"/>
    </svg>
    ${lbl(OX + 22, 30, '\\(u\\)')}
    ${lbl(540, OY + 26, '\\(\\theta\\)')}
    ${lbl(545, CONTOURS[0] - 22, 'contours of \\(\\Ldata(u)\\)', 'transform:translate(-100%,-50%); font-size:26px')}
    ${lbl((gx + gx1) / 2 + 22, ty + 35, '\\(-\\nabla_\\theta \\Ldata\\)', 'transform:translate(0,-50%); color:#0054EA')}
    ${lbl(P(22)[0] - 18, P(22)[1], '\\(F(u,\\theta)=0\\)', 'transform:translate(-100%,-50%); color:#FF5970; background:#fff; padding:2px 4px')}
  </div>
</div>
<div class="cite">Hinze, M., Pinnau, R., Ulbrich, M., Ulbrich, S., 2008. Optimization with PDE Constraints.</div>`,
  });
})();
