Deck.slide({
  id: 'bilo-local-loss',
  title: 'Bilevel Local Operator Learning',
  html: String.raw`
<ul>
  <li>Only need the operator <u>locally</u>: \(u(x,\theta)\) solves the PDE in a neighborhood of <span style="white-space:nowrap">\(\theta\).</span><br>
    \(\Rightarrow\) For fixed \(\theta\), \(\ \blue{r(x,\theta) := F(D^k u,\dots,Du,\theta) = 0}\ \) and \(\ \red{\nabla_\theta r(x,\theta) = 0}\)</li>
</ul>
<div class="row frag" style="gap:20px">
  <div style="width:820px">
    \[\blue{\Lres(\theta,W) = \frac{1}{|\Tres|}\sum_{x\in\Tres}\big|r(x,\theta;W)\big|^2}\]
    \[\red{\Lrgrad(\theta,W) = \frac{1}{|\Tres|}\sum_{x\in\Tres}\big|\nabla_\theta r(x,\theta;W)\big|^2}\]
  </div>
  <div class="red" style="margin-top:110px">“residual gradient loss” (sensitivity)</div>
</div>
<div class="frag">
  <ul>
    <li>Train a <u>local PDE solution operator</u> \(u(x,\theta;W)\) at <u>fixed</u> \(\theta\)<br>
      by minimizing the “local operator loss”:</li>
  </ul>
  \[\LLO(\theta,W) = \blue{\Lres(\theta,W)} + \wrgrad\,\red{\Lrgrad(\theta,W)}
    \qquad W^*(\theta) = \argmin_{W}\ \LLO(\theta,W)\]
</div>`,
});
