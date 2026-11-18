Deck.slide({
  id: 'gbm-intro',
  title: 'Example: Glioblastoma (GBM)',
  cls: 'dark',
  notes: `This is an example of how GBM looks in different MRI modalities.
We can see excess water.
We can see the active tumor region highlighted by tracer.
In the PET image, we can see elevated metabolic activity; localized biopsies show positive correlation between PET signal and tumor cell count.
In the center we also see the necrotic region.`,
  html: String.raw`
<div class="grid g3" style="align-items:start; gap:60px">
  <div class="center">
    <div class="small" style="height:90px">Swollen tissue</div>
    <figure><img src="images/gbm-flair.jpg" style="height:520px"><figcaption>FLAIR</figcaption></figure>
  </div>
  <div class="center frag" data-step="1">
    <div class="small" style="height:90px">Active tumor region</div>
    <figure><img src="images/gbm-t1gd.jpg" style="height:520px"><figcaption>T1Gd</figcaption></figure>
  </div>
  <div class="center frag" data-step="2">
    <div class="small" style="height:90px">High metabolic activity</div>
    <figure><img src="images/gbm-fetpet.jpg" style="height:520px"><figcaption>FET-PET</figcaption></figure>
  </div>
</div>`,
});
