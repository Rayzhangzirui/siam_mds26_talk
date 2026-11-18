/* Minimal slide engine.
 *
 * Each file in slides/ calls Deck.slide({...}) once. Slide order = order of <script> tags in index.html.
 *
 * Slide definition fields (all optional except html):
 *   id      short name, used in the URL (#/id) so reloading keeps your place
 *   title   text for the black title bar (omit for no bar)
 *   cls     extra CSS classes on the slide, e.g. 'dark'
 *   html    slide body; math with \( inline \) and \[ display \] (rendered by KaTeX)
 *   notes   speaker notes (press N)
 *   setup(el)              called once after the slide is built (el = the slide element)
 *   enter(el, fromEnd)     called when the slide becomes current (fromEnd = arrived by going back)
 *   leave(el)              called when leaving the slide
 *   next() / prev()        custom step handling; return true if handled, false to let the deck move on
 *
 * Builds: give elements class="frag" to reveal them one click at a time (DOM order),
 * or data-step="n" to group several elements on the same click.
 * class="frag-out" with data-step="n" hides an element from click n on.
 */
(function () {
  const W = 1600, H = 1000;
  const defs = [];
  let slides = [], cur = 0, scale = 1;

  const MACROS = {
    '\\Ldata': 'L_{\\mathrm{data}}',
    '\\Lres': 'L_{\\mathrm{res}}',
    '\\Lrgrad': 'L_{\\mathrm{rgrad}}',
    '\\LLO': 'L_{\\mathrm{LO}}',
    '\\uLO': 'u_{\\mathrm{LO}}',
    '\\wdata': 'w_{\\mathrm{data}}',
    '\\wrgrad': 'w_{\\mathrm{rgrad}}',
    '\\Tres': 'T_{\\mathrm{res}}',
    '\\Tdata': 'T_{\\mathrm{data}}',
    '\\Data': '\\mathrm{Data}',
    '\\argmin': '\\operatorname*{arg\\,min}',
    '\\blue': '\\textcolor{##0054EA}{#1}',
    '\\red': '\\textcolor{##FF5970}{#1}',
    '\\pink': '\\textcolor{##E070F0}{#1}',
    '\\gray': '\\textcolor{##8a8a8a}{#1}',
  };
  const KATEX_OPTS = {
    delimiters: [
      { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false },
    ],
    macros: MACROS,
    throwOnError: false,
  };

  function typeset(el) { if (window.renderMathInElement) renderMathInElement(el, KATEX_OPTS); }
  function tex(s, display = false) {
    return katex.renderToString(s, { displayMode: display, macros: MACROS, throwOnError: false });
  }

  function build() {
    const stage = document.getElementById('stage');
    defs.forEach((d, i) => {
      const el = document.createElement('section');
      el.className = 'slide ' + (d.cls || '');
      el.dataset.id = d.id || String(i + 1);
      el.innerHTML = (d.title !== undefined ? `<h1 class="title">${d.title}</h1>` : '') +
        `<div class="body">${d.html || ''}</div>` +
        `<div class="slide-num">${i + 1}</div>`;
      stage.appendChild(el);
      typeset(el);
      // builds
      let auto = 0;
      const frags = [...el.querySelectorAll('.frag, .frag-out')];
      frags.forEach(f => {
        let s = f.dataset.step ? +f.dataset.step : ++auto;
        auto = Math.max(auto, s);
        f._step = s;
      });
      const s = { def: d, el, frags, nSteps: auto, step: 0 };
      slides.push(s);
      if (d.setup) d.setup(el);
    });
  }

  function applyStep(s) {
    s.frags.forEach(f => {
      const on = f.classList.contains('frag-out') ? s.step < f._step : s.step >= f._step;
      f.classList.toggle('shown', on);
    });
  }

  function go(i, fromEnd = false) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    const old = slides[cur];
    if (old && old.el.classList.contains('active') && old.def.leave) old.def.leave(old.el);
    slides.forEach(s => s.el.classList.remove('active'));
    cur = i;
    const s = slides[i];
    s.step = fromEnd ? s.nSteps : 0;
    applyStep(s);
    s.el.classList.add('active');
    if (s.def.enter) s.def.enter(s.el, fromEnd);
    document.getElementById('notes').innerHTML = s.def.notes || '<i>(no notes)</i>';
    history.replaceState(null, '', '#/' + (s.def.id || i + 1));
  }

  function next() {
    const s = slides[cur];
    if (s.def.next && s.def.next()) return;
    if (s.step < s.nSteps) { s.step++; applyStep(s); return; }
    if (cur < slides.length - 1) go(cur + 1);
  }
  function prev() {
    const s = slides[cur];
    if (s.def.prev && s.def.prev()) return;
    if (s.step > 0) { s.step--; applyStep(s); return; }
    if (cur > 0) go(cur - 1, true);
  }

  function fit() {
    const stage = document.getElementById('stage');
    scale = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
    window.dispatchEvent(new CustomEvent('deck:resize', { detail: { scale } }));
  }

  function fromHash() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    if (!h) return 0;
    const byId = slides.findIndex(s => s.def.id === h);
    if (byId >= 0) return byId;
    const n = parseInt(h, 10);
    return isNaN(n) ? 0 : n - 1;
  }

  function start() {
    build();
    fit();
    addEventListener('resize', fit);
    addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea')) return;
      const k = e.key;
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
      else if (k === 'Home') go(0);
      else if (k === 'End') go(slides.length - 1);
      else if (k === 'n' || k === 'N') document.body.classList.toggle('show-notes');
      else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen();
      }
    });
    document.getElementById('stage').addEventListener('click', e => {
      if (e.target.closest('a,video,button,[data-noclick]')) return;
      next();
    });
    addEventListener('hashchange', () => { const i = fromHash(); if (i !== cur) go(i); });
    go(fromHash());
  }

  window.Deck = {
    slide: d => defs.push(d),
    start,
    next, prev, go,
    tex, typeset, MACROS,
    get scale() { return scale; },
  };
})();
