Deck.slide({
  id: 'gbm-inverse',
  title: 'GBM Example: Inverse Problem',
  html: String.raw`
<p>Infer patient-specific PDE parameters</p>
\[\begin{cases}
  \dfrac{\partial u}{\partial t} = \blue{D}\,\nabla\cdot(P\nabla u) + \blue{\rho}\, u(1-u) & \text{in } \Omega\\
  \nabla u\cdot\mathbf{n} = 0 & \text{on } \partial\Omega\\
  u_0(\mathbf{x}) = 0.1\exp\!\big(-0.1|\mathbf{x}-\mathbf{x}_0|^2\big)
\end{cases}\]
<p>and imaging parameters \(\blue{u_c^{TC},\ u_c^{WT}}\)<br>
such that the <span class="red">predicted segmentation</span> \(\red{y_{pred}^{TC},\ y_{pred}^{WT}}\)<br>
approximate the <span class="pink">data segmentation</span> \(\pink{y^{TC},\ y^{WT}}\)</p>`,
});
