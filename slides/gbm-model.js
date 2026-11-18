Deck.slide({
  id: 'gbm-model',
  title: 'GBM Example: Mathematical Model',
  cls: 'dark',
  notes: `Left: data. Right: we want to know the spatial distribution of tumor cells, to refine the CTV and for dose escalation.
We don't have big data.
Mathematical models complement medical imaging to predict spatial distributions of tumor cells and infiltration.
Challenge: estimate model parameters from medical images; typically we only have one image.`,
  html: String.raw`
<div class="row top" style="gap:0; justify-content:space-between; margin:0 -80px">
  <figure style="width:240px; margin-top:60px"><img src="images/gbm-segmentation.jpg" style="width:230px"><figcaption>Segmentation</figcaption></figure>
  <div class="frag" style="flex:none; width:720px">
    <p>Diffusion-Reaction model of tumor growth</p>
    \[\begin{cases}
      \dfrac{\partial u}{\partial t} = D\nabla\cdot(P\nabla u) + \rho u(1-u) & \text{in } \Omega\\
      \nabla u\cdot\mathbf{n} = 0 & \text{on } \partial\Omega\\
      u_0(\mathbf{x}) = 0.1\exp\!\big(-0.1|\mathbf{x}-\mathbf{x}_0|^2\big)
    \end{cases}\]
    <ul class="small">
      <li>\(u(\mathbf{x},t)\) is the normalized tumor cell density</li>
      <li>\(\rho\) [1/day]: proliferation rate</li>
      <li>\(D\) [mm\(^2\)/day]: diffusion coefficient</li>
      <li>\(P\): tissue distribution</li>
    </ul>
  </div>
  <div style="width:330px; margin-top:20px">
    <figure><img src="images/gbm-tumor-density.jpg" style="width:250px"></figure>
    <p class="small" style="margin-top:14px">Spatial distribution of tumor cells</p>
    <ul class="small"><li>Refine target volume</li><li>Dose escalation</li></ul>
  </div>
</div>
<div class="cite">Swanson et al. (2000), Harpold et al. (2007), Jackson et al. (2015), Swan et al. (2018), …</div>`,
});
