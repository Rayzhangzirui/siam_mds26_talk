Deck.slide({
  id: 'unknown-function-nn',
  title: 'Learning Unknown Functions',
  html: String.raw`
<ul>
  <li>If the PDE depends on some unknown function \(f(x)\)</li>
  <li class="frag">Parametrize \(f(x)\) by another neural network, \(f(x;\red{V})\)</li>
  <li class="frag">Simple extension: learn the operator \(u(x,\red{V};\blue{W})\)</li>
</ul>
<figure class="frag" style="margin-top:10px"><img src="images/diagram-unknown-fn-V.png" style="height:470px"></figure>
<ul class="frag"><li>But \(\red{V}\) is high dimensional</li></ul>`,
});
