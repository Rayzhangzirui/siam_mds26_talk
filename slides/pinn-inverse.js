Deck.slide({
  id: 'pinn-inverse',
  title: 'PINN for Inverse Problems',
  html: String.raw`
<p>In PINN, the PDE solution is represented as \(u(x;\blue{W})\).<br>
We solve the following unconstrained optimization problem</p>
\[\min_{\red{\theta},\blue{W}}\ \Lres(\red{\theta},\blue{W}) + \wdata\,\Ldata(\blue{W})\]
<p>where</p>
\[\Lres(\red{\theta},\blue{W}) = \frac{1}{|\Tres|}\sum_{x\in \Tres} F\big(D^k u(x;\blue{W}),\dots,u(x;\blue{W}),\red{\theta}\big)^2\]
\[\Ldata(\blue{W}) = \frac{1}{|\Tdata|}\sum_{x\in \Tdata}\big|u(x;\blue{W})-\hat u(x)\big|^2\]
<p>\(\Tres\) and \(\Tdata\) are the residual points and data points.</p>
<p class="frag">\(\red{\theta}\) is updated according to \(-\nabla_{\red{\theta}} \Lres\), which does not directly depend on \(\Ldata\)</p>`,
});
