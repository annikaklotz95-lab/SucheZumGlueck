'use strict';
/* =====================================================================
   EIN FEST BEI EPIKUR – Spiel-Logik
   Teil 1: Inhalte (Texte, Preise, Karten) – hier kannst du alles anpassen.
   Teil 2: Technik (Spielstand, Darstellung, Ton).
   ===================================================================== */

/* ---------- TEIL 1: INHALTE ---------- */

const START_COINS = 15;   // Münzen zu Beginn
const SORT_ROUNDS = 4;    // Anzahl der Wunschkarten pro Spiel

// Die drei Arten von Wünschen
const GROUPS = [
  { name: 'Brauch-Wünsche', term: 'natürlich und notwendig', icon: '🌱',
    hint: 'Das brauchen wir – für den Körper und für das Glück.',
    test: 'Was passiert, wenn dieser Wunsch NICHT erfüllt wird?' },
  { name: 'Genuss-Wünsche', term: 'natürlich, aber nicht notwendig', icon: '🍯',
    hint: 'Das genießen wir zusätzlich. Schön – aber es geht auch ohne.',
    test: 'Ginge es auch ohne? Und wäre es trotzdem gut?' },
  { name: 'Wünsche ohne Genug', term: 'weder natürlich noch notwendig', icon: '🌀',
    hint: 'Immer mehr haben oder gelten wollen. Es gibt kein „Genug“.',
    test: 'Gibt es bei diesem Wunsch ein „Genug“?' }
];

// Die sechs Erkenntnis-Feigen
const FACTS = [   // Wahr oder erfunden? – Epikur stellt sich vor
  { text: 'In meiner Schule durften auch Frauen und Sklaven mitlernen.', truth: true,
    why: 'Das war vor 2300 Jahren sehr ungewöhnlich. Epikurs Schule lag in Athen und hieß einfach „der Garten“.' },
  { text: 'Am liebsten feierte ich riesige Feste mit teurem Essen.', truth: false,
    why: 'Epikur lebte einfach: meist von Brot und Wasser. Einmal bat er einen Freund um ein Töpfchen Käse – damit er auch einmal schlemmen könne.' },
  { text: 'Ich fand: Freunde braucht man nicht, um glücklich zu sein.', truth: false,
    why: 'Im Gegenteil! Für Epikur war Freundschaft das Wichtigste für ein glückliches Leben. In seinem Garten lebte er mit Freunden zusammen.' },
  { text: 'Ich habe ungefähr 300 Bücher geschrieben.', truth: true,
    why: 'Epikur schrieb sehr viel. Fast alles ging verloren. Erhalten sind vor allem einige Briefe und Merksätze – daher kennen wir seine Ideen.' }
];

const FIGS = [
  { id: 'know',    name: 'Epikur kennen',  text: 'Epikur lebte einfach und lehrte in einem Garten, in dem alle mitlernen durften.' },
  { id: 'need',    name: 'Brauchen',       text: 'Ein Wunsch kann natürlich und notwendig sein, etwa den Durst zu stillen.' },
  { id: 'enjoy',   name: 'Genießen',       text: 'Zusätzlicher Genuss ist erlaubt – nötig ist er nicht.' },
  { id: 'never',   name: 'Kein Genug',     text: 'Manche Wünsche werden niemals satt.' },
  { id: 'weigh',   name: 'Abwägen',        text: 'Wir prüfen mögliche Folgen – jetzt und später.' },
  { id: 'reason',  name: 'Der Grund zählt', text: 'Nicht das Ding entscheidet, sondern der Wunsch dahinter.' },
  { id: 'friends', name: 'Freundschaft',   text: 'Freundschaft ist für Epikur besonders wertvoll. Sie braucht Zeit und Zuwendung.',
    hint: 'Freundschaft braucht Zeit und Zuwendung.' }
];

// Vermutung am Anfang und Glücksrezept am Ende
const WISHES = [
  { id: 'basics',  icon: '🍞', label: 'Genug zu essen und zu trinken' },
  { id: 'friends', icon: '🤝', label: 'Freunde, die gern zusammen sind' },
  { id: 'treats',  icon: '🍇', label: 'Besondere Leckereien' },
  { id: 'gold',    icon: '🏆', label: 'Goldene Becher für alle' },
  { id: 'music',   icon: '🎶', label: 'Musik, Spiele und Geschichten' },
  { id: 'gifts',   icon: '🎁', label: 'Viele teure Geschenke' },
  { id: 'fame',    icon: '👑', label: 'Berühmte Gäste' },
  { id: 'biggest', icon: '🎆', label: 'Das größte Fest der ganzen Stadt' }
];

// Szene 1: Was bekommt die durstige Reisende?
const DRINKS = {
  water: { label: 'Wasser im Tonbecher', cost: 1 },
  juice: { label: 'Besonderer Fruchtdrink', cost: 3 },
  gold:  { label: 'Leerer goldener Becher', cost: 5 }
};

// Szene 2: Der Markt. group = Art des Wunsches (0, 1 oder 2)
const ITEMS = {
  water:   { label: 'Wasser für alle', cost: 2, sprite: 'water', group: 0, wish: 'Wir wollen unseren Durst stillen.' },
  bread:   { label: 'Brot für alle', cost: 2, sprite: 'bread', group: 0, wish: 'Wir wollen satt werden.' },
  juice:   { label: 'Fruchtdrink für alle', cost: 4, sprite: 'juice', group: 1, wish: 'Wir wollen etwas besonders Leckeres trinken.' },
  feast:   { label: 'Festliche Speisenplatte', cost: 5, sprite: 'feast', group: 1, wish: 'Wir wollen etwas besonders Leckeres essen.' },
  flowers: { label: 'Blumen für den Tisch', cost: 1, icon: '💐', group: 1, wish: 'Wir wollen, dass der Tisch hübsch aussieht.' },
  gold:    { label: 'Goldene Becher für alle', cost: 8, sprite: 'gold', group: 2, wish: 'Alle sollen staunen, wie reich wir sind.' },
  statue:  { label: 'Ein riesiges Standbild von uns', cost: 7, icon: '🗿', group: 2, wish: 'Die ganze Stadt soll uns bewundern.' }
};
const MARKET_ORDER = ['water', 'bread', 'juice', 'feast', 'flowers', 'gold', 'statue'];

// Szene 3: Der Gast kauft immer mehr Becher – und es reicht nie.
const VAIN_GOLD = [
  { cups: 3,  peak: 82, end: 45, say: 'Ha, drei Becher! Jetzt staunen alle … Moment. Mein Nachbar Kleon hat fünf!' },
  { cups: 6,  peak: 78, end: 30, say: 'Sechs Becher! Mehr als Kleon! Aber … in der Stadt soll jemand ZWANZIG haben!' },
  { cups: 10, peak: 72, end: 15, say: 'Zehn Becher – und mein Beutel ist leer. Irgendwo hat immer jemand mehr …' }
];

// Kapitel „Abwägen“: Freude und Kummer, jetzt und später
const WEIGH = [
  { title: 'Die ganze Platte für mich!', guest: 'gast', who: 'DER GAST',
    say: 'Die Honigkuchen sind so lecker! Ich esse einfach die ganze Platte allein auf.',
    yes: 'Ja, iss ruhig alles auf!', no: 'Lieber nicht alles!', wise: 'no',
    joy: [['Schmeckt herrlich', 'jetzt']], pain: [['Bauchweh am Abend', 'später'], ['Die anderen bekommen nichts', 'später']],
    epikur: 'Viel Freude jetzt – aber noch mehr Kummer später. Auf so eine Freude verzichte ich lieber.' },
  { title: 'Wasser vom Brunnen holen', guest: 'reisende', who: 'DIE REISENDE',
    say: 'Der Krug ist leer. Der Brunnen ist weit weg und die Sonne brennt. Soll ich trotzdem losgehen?',
    yes: 'Ja, geh los!', no: 'Nein, bleib lieber sitzen!', wise: 'yes',
    joy: [['Alle haben zu trinken', 'später'], ['Der Abend bleibt fröhlich', 'später']], pain: [['Anstrengend und heiß', 'jetzt']],
    epikur: 'Eine kleine Mühe jetzt – und viel Freude später. Diese Mühe nehme ich gern auf mich.' },
  { title: 'Den ganzen Vormittag backen?', guest: null, who: 'EPIKUR',
    say: 'Für die festliche Platte müsste ich den ganzen Vormittag backen. Lohnt sich das?',
    yes: 'Ja, das lohnt sich!', no: 'Nein, lieber etwas Einfaches!', wise: null,
    joy: [['Köstlicher Genuss', 'später'], ['Stolz auf das Werk', 'später']], pain: [['Viel Arbeit', 'jetzt'], ['Weniger Zeit für Freunde', 'jetzt']],
    epikur: 'Das kommt darauf an! Macht mir das Backen Freude? Backen wir zusammen? Hier gibt es nicht nur eine richtige Antwort.' }
];

// Kapitel „Wünsche prüfen“. core = ist in jedem Spiel dabei.
const CARDS = [
  { id: 'durst',   group: 0, core: true, text: 'Ich habe Durst und möchte etwas trinken.',
    why: 'Trinken braucht jeder Mensch. Und dieser Wunsch ist schnell gestillt.' },
  { id: 'ruhm',    group: 2, core: true, text: 'Mein Fest soll berühmter sein als alle anderen!',
    why: 'Berühmter als alle? Irgendwer feiert immer noch größer. Dieser Wunsch wird nie satt.' },
  { id: 'jacke',   group: 0, core: true, text: 'Es ist Winter und mir ist kalt. Ich brauche eine warme Jacke.',
    why: 'Wärme braucht der Körper. Jede warme Jacke erfüllt diesen Wunsch.' },
  { id: 'marke',   group: 2, core: true, text: 'Ich will genau die teure Marken-Jacke, damit mich alle cool finden.',
    why: 'Wieder eine Jacke – aber ein anderer Grund! Hier geht es um Bewunderung. Und die hat kein „Genug“.' },
  { id: 'freunde', group: 0, core: false, text: 'Ich wünsche mir Freunde, mit denen ich reden und lachen kann.',
    why: 'Überrascht? Für Epikur gehört Freundschaft zu dem, was wir zum Glücklichsein brauchen.' },
  { id: 'feige',   group: 1, text: 'Ich bin satt. Aber eine süße Feige hätte ich noch gern!',
    why: 'Satt ist er schon. Die Feige ist ein zusätzlicher Genuss: schön, aber nicht nötig.' },
  { id: 'eis',     group: 1, text: 'Zum Nachtisch hätte ich am liebsten mein Lieblingseis.',
    why: 'Eis macht Freude. Aber auch ohne Eis geht es dir gut. Ein Genuss obendrauf.' },
  { id: 'mehr',    group: 2, text: 'Ich will mehr Spielsachen haben als alle anderen in der Klasse.',
    why: '„Mehr als alle anderen“ – sobald jemand etwas Neues hat, braucht man wieder mehr.' },
  { id: 'schlaf',  group: 0, text: 'Ich bin müde und möchte schlafen.',
    why: 'Schlaf braucht der Körper. Ohne Schlaf geht es niemandem gut.' },
  { id: 'kissen',  group: 1, text: 'Ich hätte gern ein Kissen mit meinem Lieblingsmuster.',
    why: 'Schlafen kannst du auf jedem Kissen. Das Lieblingsmuster ist ein schönes Extra.' },
  { id: 'likes',   group: 2, text: 'Mein Video soll die meisten Likes der ganzen Welt bekommen.',
    why: 'Die meisten der Welt? Dann zählt man jeden Tag nach und wird unruhig. Hier gibt es kein „Genug“.' },
  { id: 'sicher',  group: 0, text: 'Ich möchte mich sicher fühlen und keine Angst haben.',
    why: 'Ohne Angst leben zu können, gehört für Epikur fest zum Glück dazu.' }
];

const CHAPTERS = [
  ['Ankommen', 'start'], ['Das Fest', 'gate'], ['Abwägen', 'weigh'], ['Wünsche prüfen', 'tool'], ['Unser Gedanke', 'recipe']
];
const STEP_INFO = {  // Kapitel-Nummer und Text für die Fußzeile
  start: [0, 'Ankommen'], facts: [0, 'Wahr oder erfunden?'], guess: [0, 'Eure Vermutung'],
  gate: [1, 'Das Tor'], thirst: [1, 'Durst'], thirstResult: [1, 'Genug trinken'], market: [1, 'Der Markt'],
  feast: [1, 'Das Fest'], reveal: [1, 'Epikurs Blick'], vain: [1, 'Bewunderung'], vainResult: [1, 'Grenzen'],
  weigh: [2, 'Klug abwägen'], tool: [3, 'Epikurs Ordnung'], sort: [3, 'Wünsche prüfen'],
  recipe: [4, 'Unser Glücksrezept'], end: [4, 'Unser Gedanke']
};
const TAGLINES = [
  'Gemeinsam entdecken · entscheiden · begründen',
  'Entscheidet gemeinsam. Jede Wahl hat Folgen – mit „Zurück“ könnt ihr es anders versuchen.',
  'Freude und Kummer, jetzt und später: Was wiegt schwerer?',
  'Wir ordnen Wünsche ein – und achten auf ihre Gründe.',
  'Was nehmt ihr aus Epikurs Garten mit?'
];


/* ---------- TEIL 2: TECHNIK ---------- */

const $ = s => document.querySelector(s);
const panel = $('#panel'), bubble = $('#bubble'), stage = $('#stage'), needs = $('#needs'), hud = $('#hud');
const clone = o => JSON.parse(JSON.stringify(o));
const CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));
const FIG_SVG = '<svg viewBox="0 0 24 28" aria-hidden="true"><path class="stem" d="M12 6c0-2 .6-3.6 2.6-4.6" fill="none" stroke-width="2" stroke-linecap="round"/><path class="body" d="M12 5c1.2 4.2 8 7 8 13.5a8 8 0 0 1-16 0C4 12 10.8 9.200 12 5z"/></svg>';

function freshState() {
  return {
    step: 'start', coins: START_COINS, figs: [], facts: { i: 0, answer: null },
    guess: [], recipe: [], drink: null, basket: [], revealed: [], revealIndex: 0, revealChoice: null, revealShown: false, friendshipSeen: false,
    vain: { cups: 1, purse: 6, gold: 0, friends: false, enough: false, last: null },
    weigh: { i: 0, choice: null },
    sort: { order: [], i: 0, tries: 0, wrong: [], phase: 'ask', streak: 0, marks: [] }
  };
}
let state = freshState(), trail = [], toastFig = null, lastGuest = null;
let shown = {};

/* --- Spielstand ändern --- */
function snapshot() { trail.push(clone(state)); if (trail.length > 120) trail.shift(); }
function move(step, change) { snapshot(); if (change) change(state); if (step === 'gate') resetFest(state); state.step = step; render(); }
function resetFest(st) {   // das Fest beginnt immer mit vollem Beutel
  const f = freshState();
  ['coins', 'drink', 'basket', 'revealed', 'revealIndex', 'revealChoice', 'revealShown', 'friendshipSeen', 'vain'].forEach(k => { st[k] = f[k]; });
}
function act(change) { snapshot(); change(state); render(); }
function undo() { if (trail.length) { state = trail.pop(); render(); } }
function award(id) { if (!state.figs.includes(id)) { state.figs.push(id); toastFig = id; } }
function basketCost(b = state.basket) { return b.reduce((n, id) => n + ITEMS[id].cost, 0); }
function coinsNow() { return state.step === 'market' ? state.coins - basketCost() : state.coins; }

function feastEffects(b) {
  const thirst = b.includes('water') || b.includes('juice');
  const hunger = b.includes('bread') || b.includes('feast');
  const talk = state.friendshipSeen;
  const genuss = b.filter(id => ITEMS[id].group === 1).length;
  const vain = b.filter(id => ITEMS[id].group === 2).length;
  return { thirst, hunger, talk, genuss, vain };
}

function newSort(rounds = SORT_ROUNDS) {
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const core = CARDS.filter(c => c.core).map(c => c.id);
  const extra = shuffle(CARDS.filter(c => !c.core).map(c => c.id)).slice(0, Math.max(0, rounds - core.length));
  const order = shuffle(core.concat(extra)).filter(id => id !== 'marke');
  order.splice(order.indexOf('jacke') + 1, 0, 'marke');   // die zwei Jacken direkt nacheinander
  return { order, i: 0, tries: 0, wrong: [], phase: 'ask', streak: 0, marks: [] };
}

/* --- Bausteine für die Anzeige --- */
function el(tag, cls, txt, parent = panel) {
  const x = document.createElement(tag);
  if (cls) x.className = cls;
  if (txt) x.textContent = txt;
  parent.append(x);
  return x;
}
function button(txt, fn, cls = 'primary', parent = panel) { const b = el('button', cls, txt, parent); b.onclick = fn; return b; }
function heading(kicker, title, text) { el('div', 'kicker', kicker); el('h1', '', title); if (text) el('p', '', text); }
function say(name, txt) { bubble.innerHTML = ''; el('small', '', name, bubble); el('span', '', txt, bubble); }
function note(txt) { return el('div', 'note', txt); }
function coinTag(n, parent) { const c = el('span', 'cost', '', parent); el('i', 'coin', '', c); el('b', '', n === 0 ? 'kostet nichts' : String(n), c); return c; }

function sprite(kind, parent) {
  const crops = {
    water: [0, 0, 700, 724, 'getraenke'], juice: [700, 0, 755, 724, 'getraenke'], gold: [1465, 0, 707, 724, 'getraenke'],
    bread: [0, 0, 910, 724, 'speisen'], feast: [920, 0, 1252, 724, 'speisen']
  };
  const [x, y, w, h, file] = crops[kind], box = el('span', 'sprite ' + kind, '', parent);
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), img = document.createElementNS(ns, 'image');
  const clip = document.createElementNS(ns, 'clipPath'), rect = document.createElementNS(ns, 'rect'), id = 'crop-' + Math.random().toString(36).slice(2);
  svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`); svg.setAttribute('preserveAspectRatio', 'xMidYMid meet'); svg.setAttribute('aria-hidden', 'true');
  clip.id = id; rect.setAttribute('x', x); rect.setAttribute('y', y); rect.setAttribute('width', w); rect.setAttribute('height', h);
  clip.append(rect); svg.append(clip);
  img.setAttribute('clip-path', `url(#${id})`); img.setAttribute('href', `assets/${file}.webp`); img.setAttribute('width', '2172'); img.setAttribute('height', '724');
  svg.append(img); box.append(svg);
  return box;
}
function token(id, parent) {   // Bild oder Symbol einer Sache
  const it = ITEMS[id];
  return it.sprite ? sprite(it.sprite, parent) : el('span', 'sprite emoji', it.icon, parent);
}
function category(i, parent = panel, withTest = false) {
  const g = GROUPS[i], d = el('div', 'category g' + i, '', parent);
  el('i', '', g.icon, d);
  const t = el('div', '', '', d);
  el('b', '', g.name, t); el('em', '', g.term, t); el('small', '', withTest ? 'Prüf-Frage: ' + g.test : g.hint, t);
  return d;
}
function needBar(label, pct, text, cls = '', from = null) {
  needs.hidden = false;
  const r = el('div', 'need ' + cls, '', needs);
  el('span', '', label, r);
  const fill = el('i', '', '', el('div', 'bar', '', r));
  fill.style.width = (from === null ? pct : from) + '%';
  if (from !== null) requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = pct + '%'; }));
  if (text) el('em', '', text, r);
  return fill;
}
function scene({ guest = null, table = false, items = [] } = {}) {
  const g = $('#guest');
  g.hidden = !guest;
  if (guest && guest !== lastGuest) {
    g.src = `assets/${guest}.webp`;
    g.alt = guest === 'reisende' ? 'Durstige Reisende' : 'Gast mit einem goldenen Becher';
    g.classList.remove('enter'); void g.offsetWidth; g.classList.add('enter');
  }
  lastGuest = guest;
  $('#table').hidden = !table;
  const on = $('#onTable'); on.innerHTML = '';
  items.forEach(id => token(id, on));
  on.className = items.length > 4 ? 'many' : '';
}
function pickGrid(key, onChange) {   // drei Dinge auswählen (Vermutung / Glücksrezept)
  const grid = el('div', 'pickgrid');
  WISHES.forEach(w => {
    const on = state[key].includes(w.id);
    const b = button('', () => {
      if (on) state[key] = state[key].filter(x => x !== w.id);
      else if (state[key].length < 3) state[key].push(w.id);
      else { b.classList.add('shake'); sfx('bad'); setTimeout(() => b.classList.remove('shake'), 400); return; }
      sfx('tap'); onChange();
    }, 'pick' + (on ? ' on' : ''), grid);
    b.setAttribute('aria-pressed', on);
    el('i', '', w.icon, b); el('span', '', w.label, b);
  });
  el('div', 'count', `${state[key].length} von 3 ausgewählt`);
}
function wishList(ids, parent) {
  const ul = el('ul', 'wishlist', '', parent);
  ids.forEach(id => { const w = WISHES.find(x => x.id === id); el('li', '', w.icon + ' ' + w.label, ul); });
}

/* --- Kopfzeile: Münzen nur beim Einkauf --- */
function renderHud() {
  hud.innerHTML = '';
  if (['thirst','thirstResult','market'].includes(state.step)) {
    const c = el('div', 'pill', '', hud); el('i', 'coin', '', c);
    el('b', '', String(coinsNow()), c); el('small', '', 'Münzen', c);
  }
  // Feigen: eine für jeden untersuchten Gedanken (nie für eine Meinung)
  const f = el('div', 'pill figs', '', hud);
  FIGS.forEach(fig => { el('span', 'fig' + (state.figs.includes(fig.id) ? ' on' : ''), '', f).innerHTML = FIG_SVG; });
  el('small', '', `${state.figs.length} von ${FIGS.length} Feigen`, f);
  if (shown.figs !== undefined && state.figs.length > shown.figs) f.classList.add('bump');
  shown.figs = state.figs.length;
}
function renderChrome() {
  const [chapter, label] = STEP_INFO[state.step];
  $('#tagline').textContent = TAGLINES[chapter];
  $('#progress').textContent = label;
  $('#back').disabled = !trail.length;
  const nav = $('#chapters'); nav.innerHTML = '';
  CHAPTERS.forEach(([name, step], i) => button(name, () => {
    if (i === chapter) return;
    move(step, st => { if (step === 'weigh') st.weigh = { i: 0, choice: null }; });
  }, i === chapter ? 'active' : '', nav));
}
function showToast() {
  if (!toastFig) return;
  const fig = FIGS.find(f => f.id === toastFig), t = $('#toast');
  toastFig = null; t.innerHTML = '';
  el('span', 'fig on', '', t).innerHTML = FIG_SVG;
  const d = el('div', '', '', t); el('small', '', 'NEUE FEIGE', d); el('b', '', fig.name, d); el('span', '', fig.text, d);
  t.classList.add('show'); sfx('fig');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => t.classList.remove('show'), 5200);
}
function report() {   // Fortschritt an die Startseite melden
  if (window.parent === window) return;
  try { window.parent.postMessage({ glueck: true, station: 'epikur', got: state.figs.length, total: FIGS.length, done: state.step === 'end' || !!state.finished }, '*'); } catch (e) { /* allein geöffnet */ }
}
function leaves() {   // kleines Blätter-Fest am Ende
  const fx = $('#fx'); fx.innerHTML = '';
  const colors = ['#7d9a4f', '#b8862b', '#6b3f6e', '#c9703c', '#9fb46a'];
  for (let i = 0; i < 34; i++) {
    const l = el('i', '', '', fx);
    l.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % 5]};animation-delay:${Math.random() * 1.6}s;animation-duration:${3 + Math.random() * 2.5}s`;
  }
  setTimeout(() => { fx.innerHTML = ''; }, 7000);
}

/* --- Ton (kleine Klänge, ohne Dateien) --- */
let audio = null, soundOn = true;
const SOUNDS = {
  tap:   [[660, 0, .06, 'sine', .06]],
  coin:  [[988, 0, .08, 'triangle', .1], [1319, .07, .16, 'triangle', .1]],
  good:  [[523, 0, .12, 'sine', .11], [659, .1, .12, 'sine', .11], [784, .2, .24, 'sine', .11]],
  bad:   [[233, 0, .16, 'triangle', .12], [196, .14, .26, 'triangle', .12]],
  fig:   [[659, 0, .1, 'sine', .1], [784, .09, .1, 'sine', .1], [988, .18, .1, 'sine', .1], [1319, .27, .35, 'sine', .1]],
  knock: [[120, 0, .07, 'square', .14], [110, .22, .07, 'square', .14], [120, .44, .07, 'square', .14]],
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
function stopSpeech() { if ('speechSynthesis' in window) speechSynthesis.cancel(); $('#read').textContent = 'Vorlesen'; }


/* ---------- DIE SCHRITTE DES SPIELS ---------- */

const STEPS = {

  start() {
    scene();
    say('EPIKUR', 'Willkommen! Helft mir, ein Fest vorzubereiten. Wir untersuchen gemeinsam, welche Wünsche uns guttun.');
    heading('UNSERE FRAGE', 'Was brauchen wir zum Glück?', 'Ihr versorgt Gäste, entscheidet über Wünsche und prüft mögliche Folgen. Eure Begründungen zählen.');
    note('Zuerst vermuten wir. Danach probieren wir aus. Am Schluss vergleichen wir unsere Gedanken.');
    button('Wer ist Epikur? →', () => move('facts'));
  },

  facts() {
    scene();
    const f = state.facts, it = FACTS[f.i], answered = f.answer !== null;
    stage.className = 'single-wish';
    const card = el('div', 'large-wish fact' + (answered ? (it.truth ? ' true' : ' false') : ''), '', stage);
    el('small', '', `BEHAUPTUNG ${f.i + 1} VON ${FACTS.length}`, card);
    el('p', '', '„' + it.text + '“', card);
    if (answered) el('b', '', it.truth ? '✓ Das stimmt!' : '✗ Das ist erfunden!', card);
    if (!answered) {
      heading('EPIKUR ERZÄHLT', 'Wahr oder erfunden?', 'Stimmt ab: Daumen hoch oder runter. Tippt dann eure Mehrheit an.');
      button('👍 Wahr', () => { sfx(it.truth ? 'good' : 'bad'); act(st => { st.facts.answer = true; }); }, 'choice');
      button('👎 Erfunden', () => { sfx(it.truth ? 'bad' : 'good'); act(st => { st.facts.answer = false; }); }, 'choice');
    } else {
      heading('EPIKUR ERZÄHLT', f.answer === it.truth ? 'Gut vermutet!' : 'Überraschung!', it.why);
      if (f.i < FACTS.length - 1) button('Nächste Behauptung →', () => act(st => { st.facts = { i: f.i + 1, answer: null }; }));
      else button('Unsere Vermutung sammeln →', () => move('guess', () => award('know')));
    }
  },

  guess() {
    scene();
    say('EPIKUR', 'Bevor wir anfangen: Was braucht ein richtig gutes Fest? Ich bin gespannt auf eure Vermutung!');
    heading('EURE VERMUTUNG', 'Was braucht ein gutes Fest?', 'Wählt gemeinsam genau drei Dinge aus. Am Ende schauen wir, ob ihr dabei bleibt.');
    pickGrid('guess', render);
    button('Vermutung festhalten →', () => move('gate'), 'primary').disabled = state.guess.length !== 3;
  },

  gate() {
    scene();
    say('ES KLOPFT AM TOR', 'Poch, poch, poch! Jemand ist nach einem langen Weg am Garten angekommen.');
    heading('HÖRT MAL …', 'Wer steht vor dem Tor?', 'Ein Kind öffnet das Tor am Board. Überlegt vorher: Was könnte der Gast brauchen?');
    button('Das Tor öffnen', () => move('thirst'), '', $('#sceneAction'));
    sfx('knock');
  },

  thirst() {
    scene({ guest: 'reisende', table: true });
    say('DIE REISENDE', 'Der Weg war lang und heiß. Ich habe so großen Durst!');
    needBar('Durst', 100, 'sehr durstig', 'bad');
    heading('1 · WAS BRAUCHT SIE?', 'Was bietet ihr an?', 'Jedes Angebot kostet Münzen. Begründet erst – tippt dann.');
    Object.entries(DRINKS).forEach(([k, d]) => {
      const b = button('', () => { sfx('coin'); move('thirstResult', st => { st.drink = k; st.coins -= d.cost;  }); }, 'object');
      b.disabled = d.cost > state.coins;
      sprite(k, b);
      const t = el('span', 'label', d.label, b); coinTag(d.cost, t);
    });
  },

  thirstResult() {
    const k = state.drink || 'water';
    scene({ guest: 'reisende', table: true, items: [k] });
    if (k === 'gold') {
      say('DIE REISENDE', 'Oh, wie der glänzt! Aber … da ist ja gar nichts drin. Ich habe immer noch Durst!');
      needBar('Durst', 100, 'immer noch durstig', 'bad');
      heading('EURE ENTSCHEIDUNG', 'Schön – aber kein Getränk.', 'Fünf Münzen sind weg, und der Durst ist noch da. Was kann ein goldener Becher – und was kann er nicht?');
      note('Der Durst ist noch nicht gestillt. Was würdet ihr verändern?');
      button('Becher zurückgeben und neu wählen', undo);
      return;
    }
    if (k === 'water') {
      say('DIE REISENDE', 'Aaah, das tut gut! Wenn man richtig Durst hat, schmeckt Wasser einfach herrlich.');
      needBar('Durst', 0, 'gestillt ✓', 'bad', 100);
      heading('EURE ENTSCHEIDUNG', 'Durst gestillt!', 'Eine einzige Münze hat gereicht. Die Reisende ist zufrieden.');
      note('Epikur fragt: Hätte sie für ihren Durst einen besonderen Geschmack gebraucht?');
    } else {
      say('DIE REISENDE', 'Mmh, köstlich! Granatapfel und Trauben. Mein Durst ist weg.');
      needBar('Durst', 0, 'gestillt ✓', 'bad', 100);
      needBar('Extra-Genuss', 100, 'besonders lecker ✨', 'treat', 0);
      heading('EURE ENTSCHEIDUNG', 'Durst gestillt – und lecker!', 'Der Durst ist weg, und es hat besonders gut geschmeckt. Dafür sind drei Münzen ausgegeben.');
      note('Epikur fragt: Was davon hat sie gebraucht – und was war ein Extra?');
    }
    button('Gespräch: Brauchen oder Extra?', () => openPause('Was braucht jemand, der Durst hat? Und was ist ein schönes Extra?'), 'secondary');
    button('Anders entscheiden', undo, 'secondary');
    button('Jetzt kommen alle Gäste →', () => move('market', () => award('need')));
  },

  market() {
    scene({ table: true, items: state.basket });
    const left = coinsNow();
    say('EPIKUR', 'Gleich kommen alle Gäste! Kauft ein, was unser Fest braucht. Aber Achtung: Die Münzen reichen nicht für alles.');
    heading('2 · DER MARKT', 'Was kommt auf den Tisch?', `Tippt an, was ihr kaufen wollt. Noch einmal tippen legt es zurück. Übrig: ${left} ${left === 1 ? 'Münze' : 'Münzen'}.`);
    const grid = el('div', 'market');
    MARKET_ORDER.forEach(id => {
      const it = ITEMS[id], on = state.basket.includes(id), tooDear = !on && it.cost > left;
      const b = button('', () => {
        if (on) state.basket = state.basket.filter(x => x !== id);
        else if (tooDear) { b.classList.add('shake'); sfx('bad'); setTimeout(() => b.classList.remove('shake'), 400); return; }
        else state.basket.push(id);
        sfx(on ? 'tap' : 'coin'); render();
      }, 'ware' + (on ? ' on' : '') + (tooDear ? ' dear' : ''), grid);
      b.setAttribute('aria-pressed', on);
      token(id, b); el('span', 'label', it.label, b); coinTag(it.cost, b);
    });
    button('Das Fest beginnt! →', () => move('feast', st => {
      const e = feastEffects(st.basket);
      st.coins -= basketCost(st.basket); 
      
    })).disabled = !state.basket.length;
  },

  feast() {
    const e = feastEffects(state.basket), ok = e.thirst && e.hunger;
    scene({ guest: 'reisende', table: true, items: state.basket });
    needBar('Durst', e.thirst ? 0 : 100, e.thirst ? 'gestillt ✓' : 'nichts zu trinken!', 'bad', 100);
    needBar('Hunger', e.hunger ? 0 : 100, e.hunger ? 'gestillt ✓' : 'nichts zu essen!', 'bad', 100);
    
    if (!e.thirst && !e.hunger) say('DIE GÄSTE', 'Wir haben Hunger und Durst! Auf dem Tisch ist nichts, was uns hilft.');
    else if (!e.thirst) say('DIE GÄSTE', 'Wir haben solchen Durst! Hier gibt es ja gar nichts zu trinken.');
    else if (!e.hunger) say('DIE GÄSTE', 'Unsere Mägen knurren! Hier gibt es ja gar nichts zu essen.');
    else if (e.vain) say('DIE GÄSTE', 'Oh, das glänzt und funkelt! Aber eigentlich wollten wir nur essen, trinken und zusammen sein.');
    else if (!e.talk) say('EPIKUR', 'Essen und Trinken sind da. Was könnten wir gemeinsam tun, damit sich die Gäste willkommen fühlen?');
    else if (e.genuss) say('DIE GÄSTE', 'Satt, zufrieden und in bester Gesellschaft. Was für ein schönes Fest!');
    else say('DIE GÄSTE', 'Brot, Wasser und gute Freunde – uns fehlt nichts! Was für ein schönes Fest.');

    heading('SO LÄUFT EUER FEST', ok ? 'Essen und Trinken sind da.' : 'Da fehlt etwas Wichtiges!',
      ok ? 'Schaut auf die Balken bei den Gästen. So hat euer Einkauf gewirkt:' : 'Die Gäste können nicht zufrieden sein. Schaut auf die Balken: Was fehlt?');
    const list = el('ul', 'effects');
    const row = (good, txt, d) => { const li = el('li', good ? 'plus' : 'minus', txt, list); if (d) el('b', '', (d > 0 ? '+' : '−') + Math.abs(d), li); };
    row(e.thirst, e.thirst ? 'Der Durst ist gestillt.' : 'Die Gäste sind durstig.', 0);
    row(e.hunger, e.hunger ? 'Alle sind satt.' : 'Die Gäste sind hungrig.', 0);
    if (e.talk) row(true, 'Ihr habt euch Zeit füreinander genommen.', 0);
    if (e.genuss) row(true, `${e.genuss === 1 ? 'Ein Extra macht' : e.genuss + ' Extras machen'} das Fest besonders schön.`, 0);
    if (e.vain) row(false, 'Schmuck stillt weder Hunger noch Durst. Welcher Wunsch steckt dahinter?', 0);
    if (ok && state.coins >= 3) note(`Ihr habt noch ${state.coins} Münzen übrig. Epikur meint: Wer wenig braucht, hat schnell genug.`);
    if (!ok) { button('Zurück zum Markt', undo); return; }
    button('Zurück zum Markt: anders einkaufen', undo, 'secondary');
    button('Zeit füreinander: Gäste ins Gespräch bringen', () => act(st => { st.friendshipSeen = true; award('friends'); }), 'secondary').disabled = state.friendshipSeen;
    if (state.friendshipSeen) note('Was hilft bei Freundschaft außer Geld? Zeit, Zuhören und gegenseitige Zuwendung.');
    button('Epikurs Blick auf euren Einkauf →', () => move('reveal', st => { st.revealed = []; st.revealIndex = 0; st.revealChoice = null; st.revealShown = false; }));
  },

  reveal() {
    scene();
    const ids = ['water', 'juice', 'gold'];
    const id = ids[state.revealIndex || 0], it = ITEMS[id], done = state.revealShown;
    say('EPIKUR', 'Der Gegenstand allein verrät es nicht. Lest auch den Grund für den Wunsch.');
    stage.className = 'single-wish';
    const card = el('div', 'large-wish', '', stage);
    token(id, card); el('small', '', it.label, card); el('p', '', '„' + it.wish + '“', card);
    heading('WUNSCH UND GRUND · ' + ((state.revealIndex || 0) + 1) + ' / 3', 'Welche Art von Wunsch?', 'Begründet eure Zuordnung. Erst danach öffnet ihr Epikurs Einordnung.');
    if (!done) {
      GROUPS.forEach((g,i) => { const b = button(g.term, () => act(st => { st.revealChoice = i; }), 'choice'); b.setAttribute('aria-pressed', state.revealChoice === i); });
      button('Epikurs Einordnung ansehen', () => act(st => { st.revealShown = true; })).disabled = state.revealChoice === null;
    } else {
      note('Eure Wahl: ' + GROUPS[state.revealChoice].term + '. Passt eure Begründung zum genauen Wortlaut?');
      category(it.group);
      note(it.group === 2 ? 'Hier geht es ausdrücklich um Bewunderung für Reichtum. Ein schöner Becher allein wäre noch kein Beleg dafür.' : it.group === 1 ? 'Etwas besonders Leckeres zu trinken ist zusätzlicher Genuss. Der Wunsch ist nicht verboten.' : 'Der Wunsch richtet sich darauf, den Durst zu stillen.');
      button('Andere Sicht begründen', () => openPause('Welche andere Einordnung könntet ihr begründen? Müsste dafür der Wortlaut des Wunsches verändert werden?'), 'secondary');
      if (state.revealIndex < 2) button('Nächsten Wunsch untersuchen →', () => act(st => { st.revealIndex++; st.revealChoice = null; st.revealShown = false; }));
      else button('Ein weiterer Gast kommt →', () => move('vain', () => award('enjoy')));
    }
  },

  vain() {
    const v = state.vain, tried = v.gold > 0 || v.friends || v.enough;
    scene({ guest: 'gast', table: true, items: state.basket });
    if (v.last === 'gold') say('DER GAST', VAIN_GOLD[v.gold - 1].say);
    else if (v.last === 'friends') say('DIE GÄSTE', 'Deine Becher zählen wir gar nicht! Setz dich zu uns und erzähl von deiner Reise.');
    else if (v.last === 'enough') say('DER GAST', 'Genug wäre es, wenn ALLE mich bewundern. Aber … was andere über mich denken, kann ich ja gar nicht bestimmen.');
    else say('DER GAST', 'Mein Fest muss das berühmteste sein! Alle sollen mich bewundern. Was ratet ihr mir?');

    heading('3 · WANN IST ES GENUG?', 'Was ratet ihr dem Gast?', 'Probiert einen Rat aus. Was verändert sich – und was bleibt offen?');
    const purse = el('div', 'purse');
    el('span', '', 'Sein Beutel: ', purse);
    for (let i = 0; i < 6; i++) el('i', 'coin' + (i < v.purse ? '' : ' gone'), '', purse);
    el('span', '', ` · Becher: ${v.cups}`, purse);
    button('🏆 Kauf noch mehr goldene Becher! (2 Münzen)', () => { sfx('coin'); act(st => { const g = VAIN_GOLD[st.vain.gold]; st.vain.gold++; st.vain.purse -= 2; st.vain.cups = g.cups; st.vain.last = 'gold';  }); }, 'choice').disabled = v.purse < 2;
    button('💬 Frag deine Gäste, was ihnen Freude macht.', () => act(st => { if (!st.vain.friends) {  award('friends'); } st.vain.friends = true; st.vain.last = 'friends'; }), 'choice');
    button('🤔 Überlege: Wann hättest du genug?', () => act(st => {  st.vain.enough = true; st.vain.last = 'enough'; }), 'choice');
    if (v.purse < 2) note('Sein Beutel ist leer. Trotzdem vergleicht er sich weiter mit anderen. Muss das bei jedem Menschen so sein?');
    if (tried) button('Epikurs Rückfrage →', () => move('vainResult'));
  },

  vainResult() {
    const v = state.vain;
    scene({ guest: 'gast', table: true, items: state.basket });
    say('EPIKUR', v.gold ? 'Mit jedem Becher wollte er noch mehr. Wann wäre dieser Wunsch endlich satt?' : 'Wie viel Bewunderung wäre genug? Kann er bestimmen, was alle über ihn denken?');
    heading('EPIKURS RÜCKFRAGE', 'Ein Wunsch ohne Boden?', 'Ein schöner Becher ist nicht das Problem. Schwierig ist der Wunsch dahinter: immer mehr haben und von allen bewundert werden.');
    category(2);
    note('Epikur fragt bei jedem Wunsch: Bringt er Ruhe – oder neue Sorgen?');
    button('Gespräch: Kennt ihr solche Wünsche?', () => openPause('Kennt ihr Wünsche, die nie satt werden? Was hilft, wenn man so einen Wunsch hat?'), 'secondary');
    button('Noch einen Rat ausprobieren', undo, 'secondary');
    button('Weiter: Klug abwägen →', () => move('weigh', st => { award('never'); st.weigh = { i: 0, choice: null }; }));
  },

  weigh() {
    const w = state.weigh, c = WEIGH[w.i], done = w.choice !== null;
    scene({ guest: c.guest });
    stage.className = 'weighing';
    const scale = el('div', 'scale', '', stage);
    const beam = el('div', 'beam', '', scale); el('div', 'post', '', scale);
    const pans = ['joy','pain'].map(side => {
      const pan = el('div', 'pan ' + side, '', scale);
      el('b', '', side === 'joy' ? 'Mögliche Freude' : 'Möglicher Kummer', pan);
      c[side].forEach(([txt,when]) => { if (done || when === 'jetzt') {
        const chip = el('span', 'chip', txt, pan); el('small', '', when, chip);
      }}); return pan;
    });
    const tilt = d => { beam.style.transform = `rotate(${d*7}deg)`; pans[0].style.transform=`translateY(${-d*18}px)`;pans[1].style.transform=`translateY(${d*18}px)`; };
    tilt(w.tilt || 0);
    say(done ? 'EPIKUR' : c.who, done ? 'Diese Folgen sind möglich. Welche sind wahrscheinlich? Was wiegt für euch besonders schwer?' : c.say);
    heading('FOLGEN UNTERSUCHEN · ' + (w.i + 1) + ' / ' + WEIGH.length, c.title,
      done ? 'Euer erster Vorschlag bleibt ein Vorschlag. Ihr dürft ihn begründet verändern.' : 'Was könnte jetzt und später passieren? Sammelt erst eigene Ideen.');
    if (!done) {
      ['yes','no'].forEach(a => button(c[a], () => act(st => { st.weigh.choice=a; st.weigh.tilt=0; }), 'choice'));
      if (w.i === 1) button('Gemeinsam gehen oder Hilfe holen', () => act(st => { st.weigh.choice='help'; st.weigh.tilt=0; }), 'choice');
      button('Eigene Alternative besprechen', () => openPause('Welche andere Handlung wäre möglich? Was könnte sie bewirken?'), 'secondary');return;
    }
    note('Euer Vorschlag: ' + (w.choice === 'help' ? 'Gemeinsam gehen oder Hilfe holen' : c[w.choice]));
    note('Die Waage zählt keine Gründe. Ein wichtiger Grund kann schwerer wiegen als mehrere kleine. Ihre Neigung zeigt nur euer begründetes Urteil.');
    button('Für uns wiegt die Freude schwerer', () => act(st => {st.weigh.tilt=-1;}), 'choice');
    button('Für uns wiegt der Kummer schwerer', () => act(st => {st.weigh.tilt=1;}), 'choice');
    button('Offen / unterschiedlich gewichtet', () => act(st => {st.weigh.tilt=0;}), 'choice');
    button('Gespräch: Begründen und Alternativen prüfen', () => openPause(w.i === 1 ? 'Wer kann sicher Wasser holen? Wie könnten die anderen helfen? Welche Folgen ändern sich dadurch?' : 'Welcher Grund ist für euch besonders wichtig? Was könnte die Situation verändern?'), 'secondary');
    if (w.i < WEIGH.length - 1) button('Nächster Fall →', () => act(st => { st.weigh={i:w.i+1,choice:null,tilt:0}; }));
    else button('Wünsche mit Epikur ordnen →', () => move('tool', () => award('weigh')));
  },

  tool() {
    scene();
    say('EPIKUR', 'Schaut nicht nur auf die Dinge. Fragt immer: Was wünscht sich jemand – und warum?');
    stage.className = 'sorting preview';
    const row = el('div', 'baskets', '', stage);
    GROUPS.forEach((g, i) => { const b = el('div', 'basket g' + i, '', row); el('i', '', g.icon, b); el('b', '', g.name, b); el('small', '', g.term, b); });
    heading('UNSER WERKZEUG', 'Drei Arten von Wünschen', 'Zu jeder Art gehört eine Prüf-Frage. Damit könnt ihr jeden Wunsch untersuchen.');
    [0, 1, 2].forEach(i => category(i, panel, true));
    note('Dasselbe Ding kann zu verschiedenen Wünschen gehören. Der Grund entscheidet!');
    button('Vier Wünsche gemeinsam prüfen →', () => move('sort', st => { st.sort = newSort(); }));
  },

  sort() {
    scene();
    if (!state.sort.order.length) state.sort = newSort();
    const so = state.sort, c = CARD[so.order[so.i]], n = so.order.length, right = so.phase === 'right';
    say('EPIKUR', right ? c.why : so.phase === 'wrong' ? 'Hm. Schaut noch einmal genau auf den Grund.' : 'Hört genau hin: Was wünscht sich hier jemand – und warum?');
    stage.className = 'sorting';
    const card = el('div', 'wish-card' + (right ? ' solved g' + c.group : ''), '', stage);
    el('small', '', `WUNSCH ${so.i + 1} VON ${n}`, card); el('span', '', '„' + c.text + '“', card);
    const row = el('div', 'baskets', '', stage);
    GROUPS.forEach((g, i) => {
      const b = button('', () => pick(i), 'basket g' + i, row);
      b.dataset.g = i;
      el('i', '', g.icon, b); el('b', '', g.name, b); el('small', '', g.term, b);
      if (right) { b.disabled = true; if (i === c.group) b.classList.add('hit'); }
      else if (so.wrong.includes(i)) { b.disabled = true; b.classList.add('miss'); }
    });
    if (!right) makeDraggable(card);

    const kicker = `WÜNSCHE PRÜFEN · ${so.i + 1} / ${n}`;
    if (right) heading(kicker, 'So ordnet Epikur den Wunsch ein.', 'Welche Wörter im Wunsch stützen diese Einordnung?');
    else if (so.phase === 'wrong') heading(kicker, 'Prüft den Grund noch einmal.', 'Tipp: ' + GROUPS[c.group].test);
    else heading(kicker, 'Wohin gehört dieser Wunsch?', 'Begründet erst. Zieht die Karte in einen Korb oder tippt ihn an. Die Prüf-Fragen könnt ihr bei Bedarf öffnen.');
    const dots = el('div', 'dots');
    so.order.forEach((_, i) => el('i', i < so.marks.length ? ['seen', 'ok', 'star'][so.marks[i]] : i === so.i ? 'now' : '', '', dots));
    if (right) {
      category(c.group);
      button(so.i === n - 1 ? 'Unser Fest abschließen →' : 'Nächsten Wunsch untersuchen →', () => {
        if (so.i === n - 1) move('recipe', () => award('reason'));
        else act(st => { st.sort.i++; st.sort.tries = 0; st.sort.wrong = []; st.sort.phase = 'ask'; });
      });
      button('Andere Meinung? Darüber sprechen', () => openPause('Welche Begründung könnte jemand für eine andere Zuordnung haben? Passt sie zum genauen Wortlaut des Wunsches?'), 'secondary');
    } else {
      const help = el('details', 'note'); el('summary', '', 'Prüf-Fragen öffnen', help);
      GROUPS.forEach(g => el('div', '', g.icon + ' ' + g.test, help));
      if (so.phase === 'wrong') button('Epikurs Einordnung ansehen', () => act(st => { st.sort.phase = 'right'; st.sort.tries = 9; st.sort.streak = 0; st.sort.marks.push(0); }), 'secondary');
    }
  },

  recipe() {
    scene({ table: true, items: state.basket });
    say('EPIKUR', 'Was denkt ihr jetzt? Ihr dürft bei eurer ersten Idee bleiben oder sie verändern. Nennt eure Gründe.');
    heading('UNSER GLÜCKSREZEPT', 'Wählt noch einmal drei Dinge.', 'Vergleicht danach mit eurer Vermutung vom Anfang. Es gibt keinen Punktestand für eure Meinung.');
    pickGrid('recipe', render);
    button('Unsere Gedanken vergleichen →', () => move('end')).disabled = state.recipe.length !== 3;
  },

  end() {
    scene();
    say('EPIKUR', 'Prüft eure Wünsche und ihre Folgen. Freundschaft und ein einfaches Leben sind mir besonders wichtig. Was überzeugt euch daran – und was nicht?');
    heading('UNSER GEDANKE', 'Was denken wir jetzt?', 'Eine veränderte Meinung ist nicht automatisch besser. Entscheidend ist, wie ihr sie begründet.');
    const cmp=el('div','compare');
    [['Am Anfang',state.guess],['Jetzt',state.recipe]].forEach(([t,ids])=>{const col=el('div','','',cmp);el('h2','',t,col);if(ids.length)wishList(ids,col);else el('p','','Noch keine Auswahl',col);});
    button('Was hat sich verändert – und warum?',()=>openPause('Welche Idee hat sich verändert? Welche ist geblieben? Welches Beispiel hat euch zum Nachdenken gebracht?'));
    note('„Ein natürlicher und notwendiger Wunsch ist …, weil …“\n„Ein zusätzlicher Genuss ist …“\n„Ein Wunsch ohne Genug könnte …“');
    const d=el('details','insights');el('summary','','Unsere Feigen: alle untersuchten Gedanken',d);
    FIGS.forEach(f=>{const row=el('div','insight-row','',d);el('b','',(state.figs.includes(f.id)?'✓ ':'○ ')+f.name,row);el('p','',f.text,row);});
    button('Vertiefung: acht Wunschkarten prüfen',()=>move('sort',st=>{st.sort=newSort(8);}), 'secondary');
    button('Eigene Wünsche untersuchen',()=>openPause('Findet einen eigenen Wunsch, bei dem ihr unsicher seid. Welche Informationen braucht ihr für eine Einordnung?'),'secondary');
    note('Station geschafft! Oben links kommt ihr zurück zu allen Philosophen.');
    if (shown.step !== 'end') leaves();
  }

};

function pick(g) {
  const so = state.sort, c = CARD[so.order[so.i]];
  if (so.phase === 'right') return;
  const ok = g === c.group;
  act(st => {
    const s = st.sort;
    if (ok) { s.phase = 'right'; s.marks.push(1); s.streak = s.tries === 0 ? s.streak + 1 : 0; }
    else { s.phase = 'wrong'; s.tries++; s.streak = 0; s.wrong.push(g); }
  });
  sfx('tap');
}

function makeDraggable(card) {   // Karte mit Finger, Stift oder Maus in einen Korb ziehen
  let sx = 0, sy = 0, drag = false;
  const baskets = () => [...stage.querySelectorAll('button.basket')];
  const under = e => document.elementsFromPoint(e.clientX, e.clientY).find(x => x.matches && x.matches('button.basket:not(:disabled)'));
  card.onpointerdown = e => { drag = true; sx = e.clientX; sy = e.clientY; card.setPointerCapture(e.pointerId); card.classList.add('dragging'); };
  card.onpointermove = e => {
    if (!drag) return;
    card.style.transform = `translate(${e.clientX - sx}px,${e.clientY - sy}px) rotate(-2deg)`;
    const t = under(e); baskets().forEach(b => b.classList.toggle('over', b === t));
  };
  card.onpointerup = card.onpointercancel = e => {
    if (!drag) return;
    drag = false; card.classList.remove('dragging'); card.style.transform = '';
    const t = e.type === 'pointerup' ? under(e) : null;
    baskets().forEach(b => b.classList.remove('over'));
    if (t) pick(+t.dataset.g);
  };
}

function render() {
  stopSpeech();
  panel.innerHTML = ''; stage.innerHTML = ''; stage.className = ''; needs.innerHTML = ''; needs.hidden = true;
  $('#sceneAction').innerHTML = '';
  document.body.dataset.step = state.step;
  STEPS[state.step]();
  if (state.step === 'end') state.finished = true;
  renderHud(); renderChrome(); showToast(); report();
  shown.step = state.step;
  panel.scrollTop = 0;
}
function restart() { state = freshState(); trail = []; shown = {}; lastGuest = null; render(); }


/* ---------- KNÖPFE AUSSERHALB DES SPIELS ---------- */

let timer = null;
function stopTimer() { clearInterval(timer); timer = null; $('#timerText').textContent = ''; $('#timerFill').style.width = '0%'; }
function openPause(question) {
  stopSpeech(); stopTimer();
  $('#pauseDialog h1').textContent = typeof question === 'string' ? question : 'Was denkt ihr?';
  $('#pauseDialog').showModal();
}
document.querySelectorAll('.timer button').forEach(b => b.onclick = () => {
  stopTimer();
  const total = +b.dataset.sec; let left = total;
  const show = () => { $('#timerText').textContent = left > 0 ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : 'Die Zeit ist um!'; $('#timerFill').style.width = (100 - left / total * 100) + '%'; };
  show();
  timer = setInterval(() => { left--; show(); if (left <= 0) { clearInterval(timer); timer = null; sfx('bell'); } }, 1000);
});
$('#pause').onclick = () => openPause();
$('#resume').onclick = () => $('#pauseDialog').close();
$('#pauseDialog').addEventListener('close', stopTimer);
$('#teach').onclick = () => $('#teacherDialog').showModal();
$('#closeTeacher').onclick = () => $('#teacherDialog').close();
$('#back').onclick = undo;
$('#profileBtn').onclick = () => $('#profileDialog').showModal();
$('#closeProfile').onclick = () => $('#profileDialog').close();
$('#reset').onclick = () => { if (confirm('Das Fest neu beginnen?')) restart(); };
$('#sound').onclick = () => { soundOn = !soundOn; $('#sound').textContent = soundOn ? 'Ton an' : 'Ton aus'; $('#sound').setAttribute('aria-pressed', soundOn); if (soundOn) sfx('tap'); };
$('#full').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (e) { /* nicht möglich */ } };
$('#read').onclick = () => {
  if (!('speechSynthesis' in window)) { alert('Dieser Browser unterstützt das Vorlesen nicht.'); return; }
  if (speechSynthesis.speaking) { stopSpeech(); return; }
  const card = stage.querySelector('.wish-card');
  const u = new SpeechSynthesisUtterance([bubble.innerText, card ? card.innerText : '', panel.innerText].join('. '));
  u.lang = 'de-DE'; u.rate = .9; u.onend = () => { $('#read').textContent = 'Vorlesen'; };
  speechSynthesis.speak(u); $('#read').textContent = 'Stopp';
};

render();
