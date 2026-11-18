'use strict';
/* Startseite: öffnet die Stationen und merkt sich ihren Fortschritt, solange die Seite offen ist. */
const TITLES = {
  epikur: 'Ein Fest bei Epikur', aristoteles: 'Ein guter Tag mit Aristoteles',
  epiktet: 'Was liegt in meiner Hand? · Epiktet', finale: 'Das große Glücks-Finale'
};
const THINGS = { epikur: 'Feigen', aristoteles: 'Schwalben', epiktet: 'Lampen' };
const frames = new Map(), progress = {};
let current = null;
const q = s => document.querySelector(s);
const home = q('#home'), homePage = q('#homePage'), modulePage = q('#modulePage');

function stopModule(frame) {
  try { const w = frame.contentWindow; if (w.speechSynthesis) w.speechSynthesis.cancel(); w.document.querySelectorAll('dialog[open]').forEach(d => d.close()); } catch (e) { /* Station noch nicht geladen */ }
}
function openModule(id) {
  if (!TITLES[id]) return;
  frames.forEach(f => { f.hidden = true; stopModule(f); });
  if (!frames.has(id)) {
    const f = document.createElement('iframe');
    f.title = TITLES[id]; f.src = id + '/index.html'; f.allow = 'fullscreen'; f.setAttribute('allowfullscreen', '');
    q('#frames').append(f); frames.set(id, f);
  }
  frames.get(id).hidden = false;
  homePage.hidden = true; modulePage.hidden = false; home.hidden = false;
  document.body.classList.add('in-module');
  current = id; document.title = TITLES[id] + ' · Auf der Suche nach dem Glück';
  home.focus();
}
function showHome() {
  frames.forEach(f => { f.hidden = true; stopModule(f); });
  homePage.hidden = false; modulePage.hidden = true; home.hidden = true;
  document.body.classList.remove('in-module');
  document.title = 'Auf der Suche nach dem Glück';
  showProgress();
  const b = q('[data-open="' + current + '"]'); if (b) b.focus();
}
function showProgress() {
  let done = 0;
  Object.keys(THINGS).forEach(id => {
    const p = progress[id], s = q('[data-status="' + id + '"]');
    if (!p) return;
    if (p.done) done++;
    s.textContent = (p.done ? '✓ Station geschafft · ' : '') + p.got + ' von ' + p.total + ' ' + THINGS[id];
    s.classList.toggle('done', !!p.done); s.classList.toggle('started', !p.done);
  });
  const f = q('[data-status="finale"]'), pf = progress.finale;
  if (pf && pf.done) { f.textContent = '✓ Finale geschafft – Urkunde verdient!'; f.classList.add('done'); }
  else if (done) { f.textContent = done === 3 ? 'Alle drei Stationen geschafft – das Finale wartet!' : done + ' von 3 Stationen geschafft'; f.classList.toggle('done', done === 3); }
}
// Die Stationen melden ihren Stand.
window.addEventListener('message', e => {
  const d = e.data;
  if (!d || d.glueck !== true || !TITLES[d.station]) return;
  const old = progress[d.station] || {};
  progress[d.station] = { got: Math.max(+d.got || 0, old.got || 0), total: +d.total || 0, done: !!d.done || !!old.done };
});
document.querySelectorAll('[data-open]').forEach(b => { b.onclick = () => openModule(b.dataset.open); });
home.onclick = showHome;
q('#full').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (e) { /* nicht möglich */ } };
