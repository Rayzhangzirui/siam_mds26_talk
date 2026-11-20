Deck.slide({
  id: 'papers-qr',
  title: 'Papers',
  html: String.raw`
<style>
  .qr-row { display:flex; justify-content:center; gap:160px; margin-top:30px; text-align:center; }
  .qr-row img { width:380px; height:380px; display:block; margin:0 auto 22px; image-rendering:pixelated; }
  .qr-row .name { font-size:36px; font-weight:600; }
  .qr-row .venue { font-size:28px; font-style:italic; margin-top:4px; }
  .qr-row .doi { font-size:20px; color:#555; margin-top:10px; }
</style>
<div class="qr-row">
  <div>
    <img src="images/qr-bilo-jcp.svg" alt="QR code: BiLO, Journal of Computational Physics">
    <div class="name">BiLO</div>
    <div class="venue">Journal of Computational Physics</div>
    <div class="doi">doi.org/10.1016/j.jcp.2026.114679</div>
  </div>
  <div>
    <img src="images/qr-bbilo-ncomms.svg" alt="QR code: Bayesian BiLO, Nature Communications">
    <div class="name">Bayesian BiLO</div>
    <div class="venue">Nature Communications</div>
    <div class="doi">doi.org/10.1038/s41467-026-77768-7</div>
  </div>
</div>`,
});
