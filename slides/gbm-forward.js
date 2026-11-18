Deck.slide({
  id: 'gbm-forward',
  title: 'GBM Example: Forward Model',
  cls: 'dark',
  html: String.raw`
<div style="display:grid; grid-template-columns:150px 240px 460px 60px 260px; gap:20px 30px; align-items:center; text-align:center; margin:0 -60px">
  <div>Data</div>
  <figure><img src="images/gbm-fwd-flair.jpg" style="height:270px"><figcaption>FLAIR</figcaption></figure>
  <figure><img src="images/gbm-fwd-t1gd.jpg" style="height:270px; display:inline-block"><figcaption>T1Gd</figcaption></figure>
  <div style="font-size:48px">\(\rightarrow\)</div>
  <figure><img src="images/gbm-segmentation.jpg" style="height:280px"><figcaption>Segmentation<br>\(y^{TC}, y^{WT}\)</figcaption></figure>

  <div class="frag" data-step="1">Model<br><br>\(D,\rho\ \rightarrow\)</div>
  <figure class="frag" data-step="1"><img src="images/gbm-pred-u.jpg" style="height:250px"><figcaption>Predicted \(u\)</figcaption></figure>
  <figure class="frag" data-step="1"><img src="images/diagram-threshold.png" style="width:440px"></figure>
  <div class="frag" data-step="1" style="font-size:48px">\(\rightarrow\)</div>
  <figure class="frag" data-step="1"><img src="images/gbm-pred-seg.jpg" style="height:250px"><figcaption>Predicted segmentation<br>\(y^{TC}_{pred}, y^{WT}_{pred}\)</figcaption></figure>
</div>`,
});
