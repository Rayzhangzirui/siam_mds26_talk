Deck.slide({
  id: 'why-sciml',
  title: 'Why Scientific Machine Learning?',
  cls: 'dark',
  html: String.raw`
<div class="grid g2" style="align-items:start; width:760px; margin:0 auto">
  <figure><img src="images/app-gbm-mri.jpg" style="height:280px">
    <figcaption class="small">Glioblastoma (GBM) under MRI</figcaption></figure>
  <figure><img src="images/app-smfish.png" style="height:280px">
    <figcaption class="small">Gene expression snapshot under smFISH</figcaption></figure>
</div>
<ul style="margin-top:50px">
  <li>Data are sparse and expensive to acquire</li>
  <li>Need interpretability</li>
  <li>Fitting mathematical model to data — PDE inverse problem</li>
</ul>`,
});
