Deck.slide({
  id: 'examples',
  title: 'Examples',
  cls: 'dark',
  html: String.raw`
<div class="grid g2" style="align-items:start; margin:20px auto 0; width:900px">
  <figure><img src="images/app-gbm-mri.jpg" style="height:440px">
    <figcaption>Glioblastoma (GBM)<br>under MRI</figcaption></figure>
  <figure><img src="images/app-smfish.png" style="height:440px">
    <figcaption>Gene expression<br>under smFISH <span class="tiny gray">(Ding and Elowitz 2019)</span></figcaption></figure>
</div>
<div class="grid g2" style="margin:30px auto 0; width:900px; font-size:30px; text-align:center">
  <div>How far do tumor cells infiltrate?</div>
  <div>How are genes transcribed?</div>
</div>`,
});
