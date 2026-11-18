'use strict';
/* =====================================================================
   Gemeinsame Spiel-Bausteine für Aristoteles, Epiktet und das Finale.
   Die Inhalte (Texte, Fälle, Karten) stehen in der app.js der Station.
   Grundsatz: Sammelstücke gibt es für untersuchte Gedanken, nie für
   Meinungen. Punkte gibt es nur für Wissensfragen im Finale.
   ===================================================================== */

const $ = s => document.querySelector(s);
const clone = o => JSON.parse(JSON.stringify(o));
const shuffled = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
let CFG, panel, stage, state, trail = [], toastId = null, lastTokens = null, timer = null;
let prevStep = null;    // der zuletzt gezeigte Schritt
let flashZone = null;   // Feld, das nach einem Fehlversuch kurz wackelt

const ICONS = {
  schwalbe: '<svg viewBox="0 0 48 34" aria-hidden="true"><path d="M1 7c9-1 16 2 21 8 2-7 8-11 17-12-5 3-8 7-9 11l17 5-19 3c-3 6-9 9-16 9 5-3 7-6 7-10C12 18 5 13 1 7z"/></svg>',
  lampe: '<svg viewBox="0 0 48 34" aria-hidden="true"><path d="M4 21c0-5 6-8 14-8 7 0 11 2 15 2 3 0 5-2 9-3-1 6-5 9-10 10-2 5-8 8-15 8S4 26 4 21z"/><path class="flame" d="M40 9c2-3 0-5 1-8 3 3 4 6 2 8-1 1-2 1-3 0z"/></svg>',
  stern: '<svg viewBox="0 0 48 46" aria-hidden="true"><path d="M24 2l6.6 14 15.400 1.900-11.300 10.600 3 15.200L24 36.200 10.300 43.700l3-15.200L2 17.900 17.400 16z"/></svg>'
};

/* ---------- Seite aufbauen ---------- */
function setup(cfg) {
  CFG = cfg;
  document.title = cfg.title;
  document.body.innerHTML = `
<div class="app st-${cfg.station}">
  <header>
    <div class="brand"><small>AUF DER SUCHE NACH DEM GLÜCK</small><strong>${cfg.title}</strong></div>
    <nav id="chapters" aria-label="Kapitel"></nav>
    <div class="tools">
      ${cfg.profile ? '<button id="profileBtn">Steckbrief</button>' : ''}
      <button id="sound" aria-pressed="true">Ton an</button><button id="read">Vorlesen</button>
      <button id="full">Vollbild</button><button id="teach">Lehrkraft</button>
    </div>
  </header>
  <main>
    <section class="world" aria-label="${cfg.place}" style="background-image:url('${cfg.bg}')">
      <div class="place">${cfg.place}</div>
      <div id="hud" aria-label="Sammelstücke"></div>
      ${cfg.figure ? `<img id="figure" src="${cfg.figure}" alt="${cfg.name}">` : ''}
      <figure id="picture" hidden><img id="sceneImage" alt=""><button id="enlarge">Bild groß ansehen ⤢</button></figure>
      <div id="stage"></div>
      <div id="fx" aria-hidden="true"></div>
    </section>
    <aside id="panel" aria-live="polite"></aside>
  </main>
  <footer>
    <button id="back">← Zurück</button><span id="progress"></span>
    <div><button id="pause">Gesprächspause</button><button id="reset">Neu beginnen</button></div>
  </footer>
</div>
<div id="toast" role="status"></div>
<dialog id="pauseDialog"><small>ZEIT ZUM DENKEN</small><h1 id="pauseTitle">Was denkt ihr?</h1>
  <p>Erst still überlegen. Dann mit dem Nachbarkind sprechen. Anschließend hören wir verschiedene Gründe.</p>
  <div class="scaffold">Ich denke …, weil …<br>Ich sehe das anders, weil …<br>Meine Meinung hat sich verändert, weil …</div>
  <div class="timer"><span>Sanduhr:</span><button data-sec="30">30 Sek.</button><button data-sec="60">1 Min.</button><button data-sec="120">2 Min.</button><b id="timerText"></b><div class="timerbar"><i id="timerFill"></i></div></div>
  <button class="primary" id="resume">Weiter</button></dialog>
<dialog id="imageDialog"><button id="closeImage" class="secondary">Bild schließen</button><img id="bigImage" alt=""></dialog>
<dialog id="teacherDialog"><h1>Für dein Gespräch am Board</h1>${cfg.teacher}<button class="primary" id="closeTeacher">Zurück zur Klasse</button></dialog>
${cfg.profile ? `<dialog id="profileDialog"><small>STECKBRIEF</small><h1>${cfg.name}</h1>${profileHtml(cfg.profile)}<button class="primary" id="closeProfile">Schließen</button></dialog>` : ''}`;
  panel = $('#panel'); stage = $('#stage');
  document.body.classList.toggle('embedded', window.parent !== window);

  $('#back').onclick = undo;
  $('#reset').onclick = () => { if (confirm('Von vorn beginnen? Auswahl und Notizen werden zurückgesetzt.')) restart(); };
  $('#pause').onclick = () => openPause();
  $('#resume').onclick = () => $('#pauseDialog').close();
  $('#pauseDialog').addEventListener('close', stopTimer);
  $('#teach').onclick = () => $('#teacherDialog').showModal();
  $('#closeTeacher').onclick = () => $('#teacherDialog').close();
  if (cfg.profile) { $('#profileBtn').onclick = () => $('#profileDialog').showModal(); $('#closeProfile').onclick = () => $('#profileDialog').close(); }
  $('#enlarge').onclick = () => { stopSpeech(); $('#bigImage').src = $('#sceneImage').src; $('#bigImage').alt = $('#sceneImage').alt; $('#imageDialog').showModal(); };
  $('#closeImage').onclick = () => $('#imageDialog').close();
  $('#sound').onclick = () => { soundOn = !soundOn; $('#sound').textContent = soundOn ? 'Ton an' : 'Ton aus'; $('#sound').setAttribute('aria-pressed', soundOn); if (soundOn) sfx('tap'); };
  $('#full').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (e) { /* nicht möglich */ } };
  $('#read').onclick = () => {
    if (!('speechSynthesis' in window)) { alert('Dieser Browser unterstützt das Vorlesen nicht.'); return; }
    if (speechSynthesis.speaking) { stopSpeech(); return; }
    const u = new SpeechSynthesisUtterance([...stage.querySelectorAll('[data-read]')].map(n => n.innerText).concat(panel.innerText).join('. '));
    u.lang = 'de-DE'; u.rate = .9; u.onend = () => { $('#read').textContent = 'Vorlesen'; };
    speechSynthesis.speak(u); $('#read').textContent = 'Stopp';
  };
  document.querySelectorAll('.timer button').forEach(b => b.onclick = () => {
    stopTimer();
    const total = +b.dataset.sec; let left = total;
    const show = () => { $('#timerText').textContent = left > 0 ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : 'Die Zeit ist um!'; $('#timerFill').style.width = (100 - left / total * 100) + '%'; };
    show();
    timer = setInterval(() => { left--; show(); if (left <= 0) { clearInterval(timer); timer = null; sfx('bell'); } }, 1000);
  });
  restart();
}
function profileHtml(rows) { return '<dl class="profile">' + rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('') + '</dl>'; }
function restart() { prevStep = null; state = Object.assign({ step: CFG.start, tokens: [], done: false }, CFG.fresh()); trail = []; lastTokens = null; render(); }

/* ---------- Spielstand ---------- */
function snapshot() { trail.push(clone(state)); if (trail.length > 150) trail.shift(); }
function go(step, change) { snapshot(); if (change) change(state); state.step = step; render(); }
function act(change) { snapshot(); change(state); render(); }
function undo() { if (trail.length) { state = trail.pop(); render(); } }
function award(id) { if (CFG.tokens && !state.tokens.includes(id)) { state.tokens.push(id); toastId = id; } }

function render() {
  stopSpeech();
  panel.innerHTML = ''; stage.innerHTML = ''; stage.className = '';
  $('#picture').hidden = true;
  document.body.classList.remove('scene-mode', 'wide-stage');
  document.body.dataset.step = state.step;
  CFG.steps[state.step]();
  prevStep = state.step;
  // Kopf- und Fußzeile
  const info = CFG.info[state.step] || [0, ''];
  $('#progress').textContent = info[1];
  $('#back').disabled = !trail.length;
  const nav = $('#chapters'); nav.innerHTML = '';
  CFG.chapters.forEach(([name, step], i) => button(name, () => { if (i !== info[0]) go(step, CFG.onChapter); }, i === info[0] ? 'active' : '', nav));
  renderHud(); showToast(); report();
  panel.scrollTop = 0;
}
function renderHud() {
  const hud = $('#hud'); hud.innerHTML = '';
  if (CFG.hud) { CFG.hud(hud); return; }
  if (!CFG.tokens) return;
  const pill = el('div', 'pill', '', hud);
  CFG.tokens.forEach(t => { el('span', 'tok' + (state.tokens.includes(t.id) ? ' on' : ''), '', pill).innerHTML = ICONS[CFG.tokenIcon]; });
  el('small', '', `${state.tokens.length} von ${CFG.tokens.length} ${CFG.tokenName}`, pill);
  if (lastTokens !== null && state.tokens.length > lastTokens) pill.classList.add('bump');
  lastTokens = state.tokens.length;
}
function showToast() {
  if (!toastId) return;
  const t = CFG.tokens.find(x => x.id === toastId), box = $('#toast');
  toastId = null; box.innerHTML = '';
  el('span', 'tok on', '', box).innerHTML = ICONS[CFG.tokenIcon];
  const d = el('div', '', '', box); el('small', '', CFG.tokenToast, d); el('b', '', t.name, d); el('span', '', t.text, d);
  box.className = 'show st-' + CFG.station; sfx('token');
  clearTimeout(showToast.t); showToast.t = setTimeout(() => box.classList.remove('show'), 5200);
}
function report() {   // Fortschritt an die Startseite melden
  if (window.parent === window) return;
  try { window.parent.postMessage({ glueck: true, station: CFG.station, got: state.tokens.length, total: CFG.tokens ? CFG.tokens.length : 0, done: !!state.done, stars: state.stars || 0 }, '*'); } catch (e) { /* allein geöffnet */ }
}

/* ---------- Bausteine für die Anzeige ---------- */
function el(tag, cls, txt, parent = panel) {
  const x = document.createElement(tag);
  if (cls) x.className = cls;
  if (txt !== undefined && txt !== null && txt !== '') x.textContent = txt;
  parent.append(x);
  return x;
}
function button(txt, fn, cls = 'primary', parent = panel) { const b = el('button', cls, txt, parent); b.onclick = fn; return b; }
function heading(kicker, title, text) { el('div', 'kicker', kicker); el('h1', '', title); if (text) el('p', '', text); }
function say(text, who) { const d = el('div', 'speech'); el('small', '', who || CFG.speaker, d); el('span', '', text, d); return d; }
function note(text) { return el('div', 'note', text); }
function talk(label, question) { return button(label, () => openPause(question), 'secondary'); }
function figure(show) { const f = $('#figure'); if (f) f.hidden = !show; }
function picture(src, alt) {
  document.body.classList.add('scene-mode');
  $('#picture').hidden = false; $('#sceneImage').src = src; $('#sceneImage').alt = alt;
}
function wide() { document.body.classList.add('wide-stage'); }   // Bühne über die ganze Breite, Figur ausgeblendet
function pickGrid(list, key, max) {
  const grid = el('div', 'pickgrid');
  list.forEach(([id, icon, label]) => {
    const on = state[key].includes(id);
    const b = button('', () => {
      if (on) state[key] = state[key].filter(x => x !== id);
      else if (state[key].length < max) state[key].push(id);
      else { shake(b); return; }
      sfx('tap'); render();
    }, 'pick' + (on ? ' on' : ''), grid);
    b.setAttribute('aria-pressed', on);
    el('i', '', icon, b); el('span', '', label, b);
  });
  el('div', 'count', `${state[key].length} von ${max} ausgewählt`);
}
function compare(list, before, after) {
  const cmp = el('div', 'compare');
  [['Am Anfang', before], ['Jetzt', after]].forEach(([t, ids]) => {
    const col = el('div', '', '', cmp); el('small', '', t.toUpperCase(), col);
    if (!ids.length) el('p', '', 'Noch keine Auswahl', col);
    else { const ul = el('ul', '', '', col); ids.forEach(id => { const w = list.find(x => x[0] === id); el('li', '', w[1] + ' ' + w[2], ul); }); }
  });
}
function shake(node) { node.classList.add('shake'); sfx('bad'); setTimeout(() => node.classList.remove('shake'), 400); }
function tokenBoard(title) {   // alle Sammelstücke mit ihrem Gedanken (nichts ist versteckt)
  const box = el('div', 'tokenboard', '', stage); box.dataset.read = '1';
  el('h2', '', title, box);
  CFG.tokens.forEach(t => {
    const on = state.tokens.includes(t.id), row = el('div', 'tokenrow' + (on ? ' on' : ''), '', box);
    el('span', 'tok' + (on ? ' on' : ''), '', row).innerHTML = ICONS[CFG.tokenIcon];
    const d = el('div', '', '', row); el('b', '', t.name, d); el('span', '', on ? t.text : 'Noch nicht untersucht: ' + t.where, d);
  });
}
function celebrate() {
  const fx = $('#fx'); fx.innerHTML = '';
  const colors = ['#7d9a4f', '#b8862b', '#6b3f6e', '#c9703c', '#9fb46a'];
  for (let i = 0; i < 34; i++) { const l = el('i', '', '', fx); l.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % 5]};animation-delay:${Math.random() * 1.6}s;animation-duration:${3 + Math.random() * 2.5}s`; }
  setTimeout(() => { fx.innerHTML = ''; }, 7000);
  sfx('token');
}

/* ---------- Baustein: Wahr oder erfunden? ----------
   items: [{ text, truth: true|false, why }] · state[key] = { i, answer }            */
function truthGame(items, key, kicker, onDone) {
  const s = state[key], it = items[s.i], answered = s.answer !== null;
  const card = el('div', 'bigcard' + (answered ? (it.truth ? ' true' : ' false') : ''), '', stage);
  card.dataset.read = '1';
  el('small', '', `BEHAUPTUNG ${s.i + 1} VON ${items.length}`, card);
  el('span', '', '„' + it.text + '“', card);
  if (answered) el('b', '', it.truth ? '✓ Das stimmt!' : '✗ Das ist erfunden!', card);
  if (!answered) {
    heading(kicker, 'Wahr oder erfunden?', 'Stimmt ab: Daumen hoch oder runter. Tippt dann eure Mehrheit an.');
    const row = el('div', 'tworow');
    button('👍 Wahr', () => answer(true), 'choice big', row); button('👎 Erfunden', () => answer(false), 'choice big', row);
  } else {
    heading(kicker, s.answer === it.truth ? 'Gut vermutet!' : 'Überraschung!', it.why);
    button(s.i < items.length - 1 ? 'Nächste Behauptung →' : 'Weiter →', () => { if (s.i < items.length - 1) act(st => { st[key] = { i: s.i + 1, answer: null }; }); else onDone(); });
  }
  function answer(a) { sfx(a === it.truth ? 'good' : 'bad'); act(st => { st[key].answer = a; }); }
}

/* ---------- Baustein: Karten zuordnen (ziehen oder tippen) ----------
   opt: { key, items:[{id,text}], zones:[{id,label,sub,icon,img,cls}], answer:{itemId:zoneId},
          queue:true|false, hint(item, zone) -> Text, onPlace(item, firstTry) }
   state[key] = { placed:{}, wrong:{}, sel:null, lastWrong:null }
   Rückgabe: { done, current, lastWrong }                                               */
function placer(opt) {
  const s = state[opt.key], open = opt.items.filter(it => !(it.id in s.placed));
  const visible = opt.queue ? open.slice(0, 1) : open, done = !open.length;
  const box = el('div', 'placer' + (opt.queue ? ' queue' : '') + (opt.cls ? ' ' + opt.cls : ''), '', stage);
  const cards = el('div', 'cards', '', box), zones = el('div', 'zones n' + opt.zones.length, '', box);
  if (opt.scale) { const sc = el('div', 'scalebar', '', box); el('span', '', opt.scale[0], sc); el('b', '', opt.scale[1], sc); el('span', '', opt.scale[2], sc); box.insertBefore(sc, zones); }
  if (done && opt.doneText) el('div', 'alldone', opt.doneText, cards);
  const tryPlace = (id, zone) => {
    const ok = opt.answer[id] === zone, first = !(s.wrong[id] || []).length;
    sfx(ok ? 'good' : 'bad');
    flashZone = ok ? null : zone;
    act(st => {
      const p = st[opt.key];
      if (ok) { p.sel = null; p.placed[id] = zone; p.lastWrong = null; p.last = id; if (opt.onPlace) opt.onPlace(st, id, first); }
      else { (p.wrong[id] = p.wrong[id] || []).push(zone); p.lastWrong = { id, zone }; }
    });
  };
  visible.forEach(it => {
    const toggle = keep => { s.sel = (s.sel === it.id && !keep) ? null : it.id; sfx('tap'); render(); };
    const c = button('', e => { if (!e.detail) toggle(false); }, 'card' + (s.sel === it.id ? ' sel' : ''), cards);   // onclick nur für die Tastatur
    c.dataset.read = '1';
    if (opt.queue) el('small', '', `KARTE ${opt.items.length - open.length + 1} VON ${opt.items.length}`, c);
    el('span', '', it.text, c);
    drag(c, zone => tryPlace(it.id, zone), toggle);
  });
  opt.zones.forEach(z => {
    const tried = s.sel && (s.wrong[s.sel] || []).includes(z.id);
    const b = button('', () => { const id = s.sel || (visible.length === 1 ? visible[0].id : null); if (id) tryPlace(id, z.id); else shake(cards); }, 'zone ' + (z.cls || '') + (tried ? ' tried' : ''), zones);
    b.dataset.zone = z.id;
    if (z.img) { const im = el('img', '', '', b); im.src = z.img; im.alt = ''; }
    else if (z.icon) el('i', '', z.icon, b);
    el('b', '', z.label, b); if (z.sub) el('small', '', z.sub, b);
    const put = opt.items.filter(it => s.placed[it.id] === z.id);
    if (!opt.queue) put.forEach(it => el('span', 'placed' + (s.last === it.id ? ' new' : ''), it.text, b));
    else if (put.length) el('span', 'counted', '●'.repeat(put.length), b);
    if (flashZone === z.id) b.classList.add('shake');
  });
  if (!done && s.sel) box.classList.add('has-sel');
  flashZone = null;
  return { done, current: visible[0], lastWrong: s.lastWrong ? opt.items.find(i => i.id === s.lastWrong.id) : null, wrongZone: s.lastWrong && s.lastWrong.zone };
}
function freshPlacer() { return { placed: {}, wrong: {}, sel: null, lastWrong: null, last: null }; }
function drag(card, onDrop, onTap) {   // Karte ziehen (Finger, Stift, Maus) oder antippen
  let sx = 0, sy = 0, on = false, moved = false;
  const zones = () => [...stage.querySelectorAll('.zone')];
  const under = e => document.elementsFromPoint(e.clientX, e.clientY).find(x => x.classList && x.classList.contains('zone'));
  const end = () => { on = false; card.classList.remove('dragging'); card.style.transform = ''; zones().forEach(z => z.classList.remove('over')); };
  card.onpointerdown = e => { on = true; moved = false; sx = e.clientX; sy = e.clientY; try { card.setPointerCapture(e.pointerId); } catch (x) { /* ohne Zeiger-Bindung weiter */ } };
  card.onpointermove = e => {
    if (!on) return;
    if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 14) return;
    moved = true; card.classList.add('dragging');
    card.style.transform = `translate(${e.clientX - sx}px,${e.clientY - sy}px) rotate(-2deg)`;
    const t = under(e); zones().forEach(z => z.classList.toggle('over', z === t));
  };
  card.onpointerup = e => {
    if (!on) return;
    const t = moved ? under(e) : null;
    end();
    if (t) onDrop(t.dataset.zone);   // auf einem Feld losgelassen
    else onTap(moved);               // getippt oder verrutscht: Karte auswählen (nach Verrutschen bleibt sie gewählt)
  };
  card.onpointercancel = end;
}

/* ---------- Gesprächspause, Ton, Vorlesen ---------- */
function stopTimer() { clearInterval(timer); timer = null; $('#timerText').textContent = ''; $('#timerFill').style.width = '0%'; }
function openPause(question) { stopSpeech(); stopTimer(); $('#pauseTitle').textContent = typeof question === 'string' ? question : 'Was denkt ihr?'; $('#pauseDialog').showModal(); }
function stopSpeech() { if ('speechSynthesis' in window) speechSynthesis.cancel(); const r = $('#read'); if (r) r.textContent = 'Vorlesen'; }
let audio = null, soundOn = true;
const SOUNDS = {
  tap:   [[660, 0, .06, 'sine', .06]],
  good:  [[523, 0, .12, 'sine', .11], [659, .1, .12, 'sine', .11], [784, .2, .24, 'sine', .11]],
  bad:   [[233, 0, .16, 'triangle', .12], [196, .14, .26, 'triangle', .12]],
  token: [[659, 0, .1, 'sine', .1], [784, .09, .1, 'sine', .1], [988, .18, .1, 'sine', .1], [1319, .27, .35, 'sine', .1]],
  step:  [[392, 0, .09, 'triangle', .1], [523, .08, .14, 'triangle', .1]],
  bell:  [[880, 0, .5, 'sine', .12], [1320, 0, .7, 'sine', .06]]
};
function sfx(name) {
  if (!soundOn) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
    SOUNDS[name].forEach(([freq, start, dur, type, vol]) => {
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + start;
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + dur + .05);
    });
  } catch (e) { /* kein Ton verfügbar */ }
}
