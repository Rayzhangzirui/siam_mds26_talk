Deck.slide({
  id: 'calibrating',
  title: 'Calibrating Model to Data',
  html: String.raw`
<ul>
  <li>Infer the unknown parameters or functions of a PDE from observed data</li>
  <li>PDE-constrained optimization problem: given \(\Data = \{x_i, \hat u_i\}_{i=1}^{N}\)</li>
</ul>
\[
\begin{aligned}
&\min_{\theta}\ \Ldata[u] = \frac{1}{N}\sum_{i=1}^{N}\big(u(x_i)-\hat u_i\big)^2\\
&\ \ \text{s.t.}\quad F(D^k u,\dots,u,\theta)=0
\end{aligned}
\]
<ul>
  <li>We need to find \(\blue{\nabla_\theta \Ldata[u]}\) <span class="blue">subject to the PDE constraint</span></li>
</ul>`,
});
