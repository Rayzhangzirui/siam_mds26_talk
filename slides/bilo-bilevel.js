Deck.slide({
  id: 'bilo-bilevel',
  title: 'Bilevel Local Operator Learning',
  html: String.raw`
<ul>
  <li>Only need the operator <u>locally</u>: \(u(x,\theta)\) solves the PDE in a neighborhood of <span style="white-space:nowrap">\(\theta\).</span><br>
    \(\Rightarrow\) For fixed \(\theta\), \(\ \blue{r(x,\theta) := F(D^k u,\dots,Du,\theta) = 0}\ \) and \(\ \red{\nabla_\theta r(x,\theta) = 0}\)</li>
  <li>Train a <u>local PDE solution operator</u> \(u(x,\theta;W)\) by minimizing the “local operator loss”:
    \[\LLO(\theta,W) = \blue{\Lres(\theta,W)} + \wrgrad\,\red{\Lrgrad(\theta,W)}\]</li>
</ul>
<div class="row" style="margin-top:30px; justify-content:center; gap:50px">
  <div class="frag center">
    <div>PDE-constrained optimization</div>
    <div class="box">\[\begin{aligned}\theta^* &= \argmin_{\theta}\ \Ldata(\theta)\\ \text{s.t.}\ & F(D^k u,\dots,Du,\theta) = 0\end{aligned}\]</div>
  </div>
  <div class="frag" data-step="2" style="font-size:60px">\(\longrightarrow\)</div>
  <div class="frag center" data-step="2">
    <div>Bi-level optimization problem</div>
    <div class="box">\[\begin{aligned}\theta^* &= \argmin_{\theta}\ \Ldata\big(\theta;W^*(\theta)\big)\\ W^*(\theta) &= \argmin_{W}\ \LLO(\theta,W)\end{aligned}\]</div>
  </div>
</div>`,
});
