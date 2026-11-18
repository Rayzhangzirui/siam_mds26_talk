Deck.slide({
  id: 'gbm-pipeline',
  title: 'Personalized Prediction of Tumor Infiltration',
  html: String.raw`
<style>
  .pipe { display:grid; grid-template-columns: 840px 1fr; grid-template-rows: 1fr 1fr; position:absolute; inset:0; font-size:24px; }
  .pipe > div { padding: 14px 24px; }
  .pipe h3 { margin:0 0 8px; font-size:28px; font-weight:600; }
  .pipe .model { display:flex; flex-direction:column; }
  .pipe .model .eqs { flex:1; display:flex; flex-direction:column; justify-content:space-evenly; font-size:30px; padding-bottom:10px; }
  .pipe .model .katex-display { margin:0; }
  .pipe figure img, .pipe figure video { height: 250px; }
  .pipe figcaption { font-size:20px; margin: 4px 0; }
</style>
<div class="pipe">
  <div style="background:#e3e8dc">
    <h3>I. Medical Images</h3>
    <div class="row" style="gap:14px; align-items:end">
      <figure><figcaption>T1Gd</figcaption><img src="images/pipe-t1gd.jpg"></figure>
      <figure><figcaption>FLAIR</figcaption><img src="images/pipe-flair.jpg"></figure>
      <figure><figcaption>3D</figcaption><img src="images/pipe-3d.png" style="height:200px"></figure>
    </div>
  </div>
  <div class="model" style="background:#e6ecf4">
    <h3>II. Mathematical Model</h3>
    <div class="eqs">
      \[\partial_t u = D\nabla\cdot(P\nabla u) + \rho u(1-u)\]
      \[y^{s} = \mathbb{1}_{\{u > u_c^{s}\}},\quad s\in\{\mathrm{TC},\mathrm{WT}\}\]
      \[\theta \in \{D,\rho,x_0,u_c^{TC},u_c^{WT}\}\]
    </div>
  </div>
  <div style="background:#ebe6ef">
    <h3>IV. Prediction and Validation</h3>
    <div class="row" style="gap:14px; align-items:start">
      <figure><figcaption>Recurrence</figcaption><img src="images/pipe-recurrence.jpg"><figcaption>Efficiency</figcaption></figure>
      <figure><figcaption>Pre-Operative</figcaption><img src="images/pipe-preop.jpg"><figcaption>DICE</figcaption></figure>
      <figure><figcaption>3D Prediction</figcaption>
        <video src="images/pipe-growth.mp4" poster="images/pipe-growth-poster.png" muted loop autoplay playsinline style="height:250px"></video></figure>
    </div>
  </div>
  <div style="background:#f6f0d6">
    <h3>III. Physics-Informed Neural Network (PINN)</h3>
    <img src="images/diagram-pinn-gbm.png" style="width:100%">
  </div>
</div>`,
});
