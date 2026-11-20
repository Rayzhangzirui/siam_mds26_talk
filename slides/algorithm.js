Deck.slide({
  id: 'algorithm',
  title: 'Algorithm',
  notes: `Before inference: pre-train the local operator at the initial guess theta_0, min_W L_LO(theta_0, W).
Details (were off-slide in the PowerPoint):
- Use ADAM with alpha_theta = alpha_W = 1e-3 and w_rgrad = 1e-3 for all experiments.
- The lower-level problem does not need to be solved to high accuracy -- only need an approximate descent direction.
- Optional pre-training term L_{u0}(W) = mean over residual points of |u(x, theta_0; W) - u_0(x)|^2 is not mandatory but can improve speed.`,
  html: String.raw`
<style>
  .alg .st { transition: color .35s; }
  .alg li:has(> .strike-on.shown) .st { text-decoration: line-through; text-decoration-thickness: 3px; color: #8a8a8a; }
</style>
<ul class="alg">
  <li><span class="frag strike-on" data-step="1"></span><span class="st"><b>Iterative scheme</b>: solve the lower-level problem to convergence, perform one step of the upper-level problem, and repeat.</span></li>
  <li class="frag" data-step="2"><b><u>Simultaneous</u> gradient descent</b> at the upper and lower level
    \[\begin{cases}
      \theta^{(k+1)} = \theta^{(k)} - \alpha_\theta\,\nabla_\theta \Ldata\big(\theta^{(k)};W^{(k)}\big)\\
      W^{(k+1)} = W^{(k)} - \alpha_W\,\nabla_W \LLO\big(\theta^{(k)};W^{(k)}\big)
    \end{cases}\]</li>
</ul>`,
});
