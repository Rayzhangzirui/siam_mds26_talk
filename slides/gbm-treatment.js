Deck.slide({
  id: 'gbm-treatment',
  title: 'GBM Example: Treatment and Recurrence',
  cls: 'dark',
  notes: `RTOG = Radiation Therapy Oncology Group.
Standard treatment includes surgical resection followed by radiotherapy and chemotherapy.
Radiotherapy: define the CTV as a 2 cm margin around the visible tumor.
However, almost all tumors come back. Median survival time is about 15 months.

Even though it is not visible, there is potential infiltration.
GBM infiltration is anisotropic due to brain anatomy and highly patient specific.

A uniform 2 cm margin may miss infiltrating tumor cells,
and is also ineffective at killing radioresistant tumor cells.`,
  html: String.raw`
<div class="row top" style="gap:40px; justify-content:center">
  <div class="frag infil-txt small" data-step="2" style="flex:none; width:300px; margin-top:280px; text-align:right">Potential infiltration, heterogeneous, anisotropic and patient specific.</div>
  <div style="flex:none; width:373px">
    <figure><img class="seg" src="images/gbm-segmentation.jpg" style="height:560px; width:373px; max-width:none"></figure>
    <div class="small" style="margin-top:14px; line-height:1.4">
      <div><span style="display:inline-block;width:46px;height:22px;background:#f8a39a;vertical-align:middle"></span>&nbsp; Tumor Core (TC)</div>
      <div><span style="display:inline-block;width:46px;height:22px;background:#fffbd0;vertical-align:middle"></span>&nbsp; Whole Tumor (WT)</div>
      <div style="display:flex; gap:12px; align-items:baseline"><span style="flex:none;display:inline-block;width:46px;height:5px;background:#7cad3a;position:relative;top:-6px"></span><span>RTOG Clinical Target Volume (CTV): 2 cm margin</span></div>
    </div>
  </div>
  <figure class="frag" data-step="1" style="flex:none"><img src="images/gbm-recurrence.jpg" style="height:560px; width:369px; max-width:none"><figcaption>Recurrence</figcaption></figure>
</div>
<svg class="frag infil-arrow" data-step="2" style="position:absolute; left:0; top:0; width:100%; height:100%; pointer-events:none; overflow:visible">
  <defs><marker id="infil-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fff"/></marker></defs>
  <line stroke="#fff" stroke-width="5" marker-end="url(#infil-ah)"/>
</svg>`,
  // the arrow runs from the text (left of the segmentation) into the gap between the segmentation and the CTV contour;
  // GAP is that point as a fraction of gbm-segmentation.jpg (608×912)
  enter(el) {
    const GAP = [150 / 608, 530 / 912];
    const s = Deck.scale, b = el.querySelector('.body').getBoundingClientRect();
    const img = el.querySelector('img.seg').getBoundingClientRect(), txt = el.querySelector('.infil-txt').getBoundingClientRect();
    const X = r => (r - b.left) / s, Y = r => (r - b.top) / s;
    const line = el.querySelector('.infil-arrow line');
    line.setAttribute('x1', X(txt.right) + 12); line.setAttribute('y1', Y(txt.top) + txt.height / s / 2);
    line.setAttribute('x2', X(img.left) + GAP[0] * img.width / s); line.setAttribute('y2', Y(img.top) + GAP[1] * img.height / s);
  },
});
