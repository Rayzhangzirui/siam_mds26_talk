Deck.slide({
  id: 'uq-bayes',
  title: 'Uncertainty Quantification',
  notes: 'Potential energy: lower the energy ~ smaller loss, larger probability.',
  html: String.raw`
<ul><li>In Bayesian inference, we want to sample \(\theta\)</li></ul>
\[
\underbrace{P(\theta\mid\Data)}_{\text{posterior}} \;\propto\;
\blue{\underbrace{P(\Data\mid\theta)}_{\text{likelihood}}}\;
\red{\underbrace{P(\theta)}_{\text{prior}}}
\]
<ul><li>The potential energy</li></ul>
\[
U(\theta) = -\log P(\theta\mid\Data)
= \blue{\underbrace{-\log P(\Data\mid\theta)}_{\Ldata[u]}} \;-\; \red{\log P(\theta)}
\]
<p>For gradient-based MCMC, we also need to compute \(\blue{\nabla_\theta \Ldata[u]}\) for \(\nabla U(\theta)\)</p>`,
});
