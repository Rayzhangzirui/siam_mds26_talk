/* Builds reveal the result figure piece by piece with white masks (percentages of darcy-result.png, 2694×1547):
 *   start: Initial Guess column · click 1: Data/GT row 1 (u) · click 2: Inference column · click 3: Data/GT row 2 (A) */
Deck.slide({
  id: 'darcy-result',
  title: 'Example: Darcy Flow Constrained Optimization',
  html: String.raw`
<style>
  .darcy-fig { position:relative; width:1184px; height:680px; margin:-20px auto 0; }
  .darcy-fig img { width:1184px; height:680px; display:block; }
  .darcy-fig .mask { position:absolute; background:#fff; }
</style>
<div class="darcy-fig">
  <img src="images/darcy-result.png">
  <div class="mask frag-out" data-step="1" style="left:31%; width:30.8%; top:0; height:51.9%"></div>
  <div class="mask frag-out" data-step="2" style="left:61.8%; width:30.7%; top:0; height:100%"></div>
  <div class="mask frag-out" data-step="3" style="left:31%; width:30.8%; top:51.9%; height:48.1%"></div>
</div>`
});
