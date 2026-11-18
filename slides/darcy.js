Deck.slide({
  id: 'darcy',
  title: '2D Darcy Flow',
  html: String.raw`
<p>Steady-state Darcy flow inverse problem. Let \(\Omega = [0,1]^2\).</p>
\[\min_{D}\ \|u-\hat u\|_2^2 + \lambda\,|\nabla D|^2\]
\[\text{s.t.}\quad \begin{cases} -\nabla\cdot\big(D(x)\nabla u(x)\big) = f(x) & \text{in } \Omega\\ u(x) = 0 & \text{on } \partial\Omega\end{cases}\]
<p>Given \(u\), infer \(D\).</p>
<div class="cite"><i>Example from Zongyi Li et al. “Physics-Informed Neural Operator for Learning Partial Differential Equations”.</i></div>`,
});
