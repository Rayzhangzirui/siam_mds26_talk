Deck.slide({
  id: 'outline',
  title: 'Outline',
  html: String.raw`
<ul>
  <li>Scientific Machine Learning</li>
  <li>Overview of solving PDE inverse problems
    <ul>
      <li>Adjoint Method</li>
      <li>Neural Operator</li>
      <li>Physics-Informed Neural Network</li>
    </ul>
  </li>
  <li><b>Bilevel Local Operator Learning (BiLO)</b> for <b>PDE-constrained Optimization</b>
    <ul>
      <li>Idea and Algorithm</li>
      <li>Examples: inferring rate from gene snapshot, inferring tumor infiltration</li>
      <li>Inferring unknown function</li>
    </ul>
  </li>
  <li><b>Bayesian BiLO</b> for <b>Uncertainty Quantification</b></li>
</ul>`,
});
