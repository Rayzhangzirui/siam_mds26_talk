Deck.slide({
  id: 'identifiability',
  title: 'Identifiability from Static Snapshots',
  notes: `Ongoing work with Rujie Gu and Christopher Miles: inferring spatial stochastic dynamics (e.g. gene transcription) from smFISH snapshots.
The three diffusion operators correspond to the Itô, Stratonovich, and isothermal (Hänggi–Klimontovich) interpretations of a stochastic process with spatially varying D.`,
  html: String.raw`
<div class="row top" style="gap:60px">
  <div class="col">
    \[\mathcal{L}u(x) - \gamma\,u(x) + B(x) = 0 \quad \text{in } \Omega\]
    <p style="margin-top:30px">Identifiability depends on</p>
    <ul>
      <li class="frag">Source \(B(x)\): smooth or point source</li>
      <li class="frag">Boundary condition</li>
      <li class="frag">Stochastic convention for \(\mathcal{L}u\):
        <div style="display:grid; grid-template-columns:auto 1fr; gap:6px 28px; margin-top:10px; font-size:30px; align-items:center">
          <div>\(\Delta(Du)\)</div><div>Itô</div>
          <div>\(\nabla\cdot\big(\sqrt{D}\,\nabla(\sqrt{D}\,u)\big)\)</div><div>Stratonovich</div>
          <div>\(\nabla\cdot(D\,\nabla u)\)</div><div>Fickian</div>
        </div>
      </li>
    </ul>
  </div>
  <div style="flex:none; width:330px; text-align:center">
    <figure><img src="images/app-smfish.png" style="width:300px"><figcaption class="small">smFISH snapshot</figcaption></figure>
    <figure style="margin-top:24px"><img src="images/ack-miles.jpg" style="width:300px"><figcaption class="small">Prof. Christopher Miles</figcaption></figure>
  </div>
</div>
<div class="cite">
  Gu, R., Zhang, R.Z., Miles, C.E., 2026. Identifiability Limits of Physics-Informed Inference for Spatial Stochastic Dynamics from Static Snapshots. arXiv:2607.01749.<br>
  Miles, C.E., McKinley, S.A., Ding, F., Lehoucq, R.B., 2024. Inferring Stochastic Rates from Heterogeneous Snapshots of Particle Positions. Bull. Math. Biol. 86, 74. doi:10.1007/s11538-024-01301-4.
</div>`,
});
