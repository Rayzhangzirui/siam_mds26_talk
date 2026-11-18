Deck.slide({
  id: 'bbilo-uq',
  title: 'Uncertainty Quantification',
  notes: 'Potential energy: lower the energy ~ smaller loss, larger probability.',
  html: String.raw`
We want to sample \(\theta\) from the potential energy:
\[
U(\theta) = -\log P(\theta\mid\Data)
= \blue{\underbrace{-\log P(\Data\mid\theta)}_{\Ldata[u]}} \;-\; \red{\log P(\theta)}
\]
For gradient-based MCMC, we need to compute \(\blue{\nabla_\theta \Ldata[u]}\) for \(\nabla U(\theta)\)`,
});
