Deck.slide({
  id: 'neural-operator-training',
  title: 'Neural Operators',
  html: String.raw`
<ul>
  <li>Start with pairs of numerical solutions \(\{\red{\theta^j}, u^j\}_{j=1}^{M}\) at \(\{x_i\}_{i=1}^{N}\):
    \[\min_{\blue{W}}\ \frac{1}{MN}\sum_{j=1}^{M}\sum_{i=1}^{N}\big(u(x_i,\red{\theta^j};\blue{W})-u^j(x_i)\big)^2\]</li>
  <li>Once trained, very fast to evaluate</li>
  <li>For inference, we freeze \(\blue{W}\) and optimize \(\red{\theta}\)
    \[\min_{\red{\theta}}\ \frac{1}{N}\sum_{i=1}^{N}\big(u(x_i,\red{\theta};\blue{W})-\hat u_i\big)^2\]
    or sample \(\red{\theta}\)</li>
  <li>Accuracy degrades when the true parameter is out-of-distribution.</li>
</ul>`,
});
