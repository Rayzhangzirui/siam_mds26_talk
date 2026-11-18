// Legend shared with gbm-results-bilo.js
window.GBM_LEGEND = String.raw`
<div style="font-size:24px; line-height:2">
  <div><span style="display:inline-block;width:40px;height:22px;background:#f8a39a;vertical-align:middle"></span>&nbsp; \(y^{TC}\)
    &emsp; <span style="display:inline-block;width:40px;height:6px;background:#3fa1ff;vertical-align:middle"></span>&nbsp; \(y^{TC}_{pred}\)</div>
  <div><span style="display:inline-block;width:40px;height:22px;background:#fffbd0;vertical-align:middle"></span>&nbsp; \(y^{WT}\)
    &emsp; <span style="display:inline-block;width:40px;height:6px;background:#0aa39a;vertical-align:middle"></span>&nbsp; \(y^{WT}_{pred}\)</div>
  <div style="margin-top:16px"><span style="display:inline-block;width:50px;border-top:4px solid #fff;vertical-align:middle"></span>&nbsp; Neural Network solution</div>
  <div><span style="display:inline-block;width:50px;border-top:4px dashed #fff;vertical-align:middle"></span>&nbsp; Numerical solution with inferred parameter</div>
</div>`;
Deck.slide({
  id: 'gbm-results-pinn',
  title: 'GBM Example: Results',
  cls: 'dark',
  html: String.raw`
<div class="row" style="gap:50px; justify-content:center; margin-top:-16px">
  <figure><img src="images/gbm-result-pinn.png" style="height:740px">
    <figcaption><b>PINN</b> (\(\wdata = 10^{-5}\))</figcaption></figure>
  <div>${window.GBM_LEGEND}</div>
</div>`,
});
