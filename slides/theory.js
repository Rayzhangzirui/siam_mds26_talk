Deck.slide({
  id: 'theory',
  title: 'Theoretical Results',
  html: String.raw`
<p>The <span class="red">correct gradient (hyper-gradient)</span> is
  \[\mathrm{d}_\theta \Ldata\big(\theta, W^*(\theta)\big)\]
  where \(W^*(\theta) = \argmin_W \LLO(\theta,W)\).</p>
<p style="margin-top:30px">The <span class="blue">approximate gradient</span> is
  \[\nabla_\theta \Ldata(\theta,\bar W)\]
  where \(\LLO(\theta,\bar W) < \epsilon\).</p>
<p style="margin-top:40px">Under some assumptions on the regularity of the PDE operator and the neural network,
  the <span class="blue">error of the approximate gradient is \(O(\epsilon)\)</span>.</p>`,
});
