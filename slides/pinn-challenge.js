Deck.slide({
  id: 'pinn-challenge',
  title: 'Challenge of PINNs',
  html: String.raw`
<p>We solve the following unconstrained optimization problem</p>
\[\min_{\red{\theta},\blue{W}}\ \Lres(\red{\theta},\blue{W}) + \wdata\,\Ldata(\blue{W})\]
<ul>
  <li class="frag">There is a trade-off between solving the PDE and fitting the data.</li>
  <li class="frag">\(\wdata \gg 1\): overfit the data, inaccurate PDE solution</li>
  <li class="frag">\(\wdata \ll 1\): underfit the data, inaccurate PDE parameter</li>
  <li class="frag">\(\theta\) is updated according to \(-\nabla_\theta \Lres\), which does not directly depend on \(\Ldata\)</li>
  <li class="frag">Can we get \(\nabla_\theta \Ldata\) subject to the PDE?</li>
</ul>`,
});
