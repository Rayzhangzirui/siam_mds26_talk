Deck.slide({
  id: 'bilo-connections',
  title: 'Summary of BiLO',
  notes: `There are many ways to understand BiLO. It sits at the intersection of several existing ideas, and depending on your background, you can interpret it in different ways.

If you're coming from adjoint methods, you can think of BiLO as using a neural network together with automatic differentiation to compute sensitivities. Instead of deriving the adjoint equation explicitly, we rely on the network and autograd to give us a descent direction under the PDE constraint.

If you're more familiar with physics-informed neural networks, the key difference is that we move from a single-level, unconstrained optimization problem to a bilevel structure. The lower level enforces the PDE more strongly, and the upper level focuses on fitting the data. We separate these two roles instead of balancing them in one objective.

If you're thinking in terms of neural operators, you can view this as a kind of physics-informed, very local operator learning. We're not learning from a dataset of solutions; at each step we rely only on the equation and the residual gradients, so everything is driven directly by the physics in a local way.`,
  html: String.raw`
<svg viewBox="0 0 1600 872" style="position:absolute; inset:0" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-size="34">
  <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#0054EA"/></marker></defs>
  <text x="800" y="140" text-anchor="middle">PINN</text>
  <text x="800" y="470" text-anchor="middle" font-weight="600">BiLO</text>
  <text x="560" y="760" text-anchor="middle">Adjoint Method</text>
  <text x="1080" y="760" text-anchor="middle">Neural Operator</text>
  <line x1="800" y1="170" x2="800" y2="420" stroke="#0054EA" stroke-width="3" marker-end="url(#ah)"/>
  <line x1="600" y1="710" x2="760" y2="490" stroke="#0054EA" stroke-width="3" marker-end="url(#ah)"/>
  <line x1="1040" y1="710" x2="840" y2="490" stroke="#0054EA" stroke-width="3" marker-end="url(#ah)"/>
  <text x="825" y="280">bilevel</text><text x="825" y="320">formulation</text>
  <text x="655" y="590" text-anchor="end">autograd</text><text x="655" y="630" text-anchor="end">sensitivity</text>
  <text x="965" y="590">local,</text><text x="965" y="630">physics-only</text>
</svg>`,
});
