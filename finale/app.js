'use strict';
/* =====================================================================
   DAS GROSSE GLÜCKS-FINALE – Abschluss nach den drei Stationen
   Teil 1: Inhalte (Karten, Situationen) – hier kannst du alles anpassen.
   Teil 2: Ablauf. Die Technik steht in ../spiel.js.
   Sterne gibt es nur für Wissens- und Zuordnungsfragen. Die Frage,
   welche Idee am meisten überzeugt, bleibt ohne Wertung.
   ===================================================================== */

/* ---------- TEIL 1: INHALTE ---------- */

const WHO = {
  epikur:      { name: 'Epikur',      img: '../epikur/assets/epikur.webp',           motto: 'Prüfe deine Wünsche: Was brauchst du wirklich?' },
  aristoteles: { name: 'Aristoteles', img: '../aristoteles/assets/aristoteles.webp', motto: 'Suche die gute Mitte – und übe, gut zu handeln.' },
  epiktet:     { name: 'Epiktet',     img: '../epiktet/assets/epiktet.webp',         motto: 'Unterscheide: Was liegt in deiner Hand – und was nicht?' }
};
const ORDER = ['epikur', 'aristoteles', 'epiktet'];

const ROUND1 = [   // Wer bin ich? (Leben)
  { id: 'a1', who: 'epikur',      text: 'Meine Schule war ein Garten. Dort durften auch Frauen und Sklaven mitlernen.', why: 'Epikurs Schule in Athen hieß einfach „der Garten“.' },
  { id: 'a2', who: 'aristoteles', text: 'Ich war der Lehrer eines Prinzen: Alexander der Große.', why: 'Aristoteles unterrichtete Alexander, als dieser 13 Jahre alt war.' },
  { id: 'a3', who: 'epiktet',     text: 'Als Kind war ich ein Sklave in Rom.', why: 'Epiktet wurde später freigelassen und gründete eine eigene Schule.' },
  { id: 'a4', who: 'aristoteles', text: 'Beim Unterrichten ging ich mit meinen Schülern auf und ab.', why: 'In Aristoteles’ Schule, dem Lykeion, gab es dafür eine Wandelhalle.' },
  { id: 'a5', who: 'epikur',      text: 'Über ein Stück Käse freute ich mich wie über ein Festessen.', why: 'Epikur lebte einfach: meist von Brot und Wasser.' },
  { id: 'a6', who: 'epiktet',     text: 'Ich habe nichts aufgeschrieben. Das tat mein Schüler für mich.', why: 'Epiktets Schüler Arrian schrieb das „Handbüchlein“.' }
];
const ROUND2 = [   // Wessen Idee ist das? (Gedanken)
  { id: 'b1', who: 'epikur',      text: 'Prüfe deine Wünsche: Was brauchst du wirklich?', why: 'Epikur unterscheidet Wünsche, die wir brauchen, zusätzlichen Genuss und Wünsche ohne Genug.' },
  { id: 'b2', who: 'aristoteles', text: 'Suche die gute Mitte zwischen zu wenig und zu viel.', why: 'Zum Beispiel: Mut liegt zwischen Feigheit und Tollkühnheit.' },
  { id: 'b3', who: 'epiktet',     text: 'Unterscheide: Was liegt in deiner Hand – und was nicht?', why: 'Epiktet richtet seine Kraft auf das, was er selbst entscheiden kann.' },
  { id: 'b4', who: 'aristoteles', text: 'Eine Schwalbe macht noch keinen Sommer: Gut handeln muss man üben.', why: 'Für Aristoteles wird gutes Handeln durch Üben zur Gewohnheit.' },
  { id: 'b5', who: 'epiktet',     text: 'Nicht die Dinge machen uns unruhig, sondern was wir über sie denken.', why: 'Derselbe Regen – verschiedene Gedanken, verschiedenes Stimmungs-Wetter.' },
  { id: 'b6', who: 'epikur',      text: 'Manche Wünsche werden nie satt – zum Beispiel der Wunsch, von allen bewundert zu werden.', why: 'Denkt an den Gast mit den goldenen Bechern auf Epikurs Fest.' }
];
const ROUND3 = [   // Drei Ratschläge: Welcher Rat stammt von wem?
  { title: 'Das teure Handy',
    story: 'Mia wünscht sich das teuerste Handy, weil alle in der Klasse eins haben. Ihre Eltern sagen Nein. Mia ist wütend.',
    tips: [
      { id: 'c1', who: 'epikur',      text: 'Brauchst du das Handy – oder willst du nur haben, was die anderen haben? So ein Wunsch wird selten satt.' },
      { id: 'c2', who: 'aristoteles', text: 'Nicht toben und nicht schmollen: Sag ruhig, was du dir wünschst, und hör dir die Gründe an.' },
      { id: 'c3', who: 'epiktet',     text: 'Was deine Eltern entscheiden, liegt nicht in deiner Hand. Was du jetzt denkst und tust, schon.' }] },
  { title: 'Der Fehler beim Vorlesen',
    story: 'Ben hat sich beim Vorlesen verlesen. Zwei Kinder haben gelacht. Jetzt will er nie wieder vorlesen.',
    tips: [
      { id: 'd1', who: 'epiktet',     text: 'Ob andere lachen, bestimmst du nicht. Aber ein Lacher ist kein Urteil über dich.' },
      { id: 'd2', who: 'aristoteles', text: 'Mut kann man üben: Lies morgen wieder vor – erst nur einen Satz. Mit jedem Mal wird es leichter.' },
      { id: 'd3', who: 'epikur',      text: 'Du brauchst nicht den Beifall von allen. Wichtiger sind gute Freunde, die zu dir halten.' }] }
];
const TEAMS = ['Team Olive', 'Team Feige'];

const TEACHER = `
<p><b>Zweck:</b> Das Finale sichert und vergleicht, was die Klasse an den drei Stationen untersucht hat. Es dauert etwa 20–25 Minuten und setzt die Stationen voraus.</p>
<p><b>Aufbau:</b> Runde 1 „Wer bin ich?“ (Leben der Philosophen), Runde 2 „Wessen Idee ist das?“ (Kerngedanken), Runde 3 „Drei Ratschläge“ (Anwendung: Zu einer Alltagssituation gibt jeder Philosoph einen anderen Rat). Danach der Glücks-Kompass und die Urkunde.</p>
<p><b>Wertung:</b> Sterne gibt es nur in den drei Runden, also für Wissen und Zuordnung – einen Stern für jede Karte, die beim ersten Versuch richtig liegt. Im Team-Modus wechseln sich zwei Teams Karte für Karte ab. Der Glücks-Kompass fragt nach der eigenen Überzeugung und wird nicht gewertet.</p>
<p><b>Runde 3:</b> Die Ratschläge sind erfundene Anwendungen im Sinn der drei Denker, keine Zitate. Lohnend ist das Anschlussgespräch: Welcher Rat würde wirklich helfen? Widersprechen sich die Ratschläge – oder ergänzen sie sich?</p>
<p><b>Glücks-Kompass:</b> Jedes Kind darf einen Stein legen (am Board tippen oder per Handzeichen zählen). Es gibt keine richtige Antwort; viele Kinder nehmen von jedem etwas mit.</p>
<p>Die Urkunde lässt sich drucken oder als PDF speichern. Nichts wird gespeichert oder versendet.</p>`;


/* ---------- TEIL 2: ABLAUF ---------- */

const zones = () => ORDER.map(id => ({ id, img: WHO[id].img, label: WHO[id].name }));
const total = () => state.stars[0] + state.stars[1];
function scored(st, first) {   // Stern für die erste richtige Zuordnung; im Team-Modus wechselt danach das Team
  if (first) st.stars[st.teams ? st.turn : 0]++;
  if (st.teams) st.turn = 1 - st.turn;
}
function heroes(onTap) {
  wide();
  const row = el('div', 'heroes', '', stage);
  ORDER.forEach(id => {
    const h = onTap ? button('', () => onTap(id), 'hero', row) : el('div', 'hero', '', row);
    const im = el('img', '', '', h); im.src = WHO[id].img; im.alt = WHO[id].name;
    if (onTap) { el('span', 'votes', String(state.votes[id]), h); }
    el('b', '', WHO[id].name, h);
  });
}
function quizRound(key, items, kicker, title, next, nextLabel) {
  wide();
  const r = placer({ key, queue: true, zones: zones(), items, answer: Object.fromEntries(items.map(x => [x.id, x.who])), onPlace: (st, id, first) => scored(st, first), doneText: 'Runde geschafft!' });
  const n = Object.keys(state[key].placed).length, last = items.find(x => x.id === state[key].last);
  heading(`${kicker} · ${Math.min(n + 1, items.length)} / ${items.length}`, r.done ? 'Runde geschafft!' : title);
  if (state.teams && !r.done) note('Am Zug: ' + TEAMS[state.turn]);
  if (r.lastWrong) note('Das passt nicht ganz. Erinnert euch an die Station – und versucht es noch einmal.');
  else if (last) { const o = el('div', 'outcome'); el('strong', '', 'RICHTIG: ' + WHO[last.who].name.toUpperCase(), o); el('p', '', last.why, o); }
  else el('p', '', 'Beratet euch kurz. Zieht die Karte dann zum richtigen Philosophen – oder tippt erst die Karte und dann den Philosophen an.');
  if (r.done) button(nextLabel, next);
}

const STEPS = {

  intro() {
    heroes();
    heading('ABSCHLUSS', 'Das große Glücks-Finale');
    el('p', '', 'Ihr habt drei Philosophen besucht. Jetzt zeigt ihr, was ihr über sie wisst – und überlegt, welche Idee euch selbst am meisten hilft.');
    note('Drei Runden mit Sternen: Wer bin ich? · Wessen Idee ist das? · Drei Ratschläge. Danach: euer Glücks-Kompass und eure Urkunde.');
    button('Gemeinsam als Klasse spielen →', () => go('r1', st => { st.teams = false; }));
    button('In zwei Teams spielen →', () => go('r1', st => { st.teams = true; }), 'secondary');
  },

  r1() { quizRound('r1', ROUND1, 'RUNDE 1', 'Wer bin ich?', () => go('r2'), 'Runde 2: Wessen Idee ist das? →'); },
  r2() { quizRound('r2', ROUND2, 'RUNDE 2', 'Wessen Idee ist das?', () => go('r3'), 'Runde 3: Drei Ratschläge →'); },

  r3() {
    wide();
    const S = ROUND3[state.si], key = 'r3_' + state.si;
    const r = placer({ key, zones: zones(), items: S.tips, answer: Object.fromEntries(S.tips.map(x => [x.id, x.who])), onPlace: (st, id, first) => scored(st, first), doneText: 'Drei Philosophen – drei verschiedene Ratschläge!' });
    heading(`RUNDE 3 · SITUATION ${state.si + 1} / ${ROUND3.length}`, S.title, S.story);
    if (!r.done) {
      el('p', '', 'Jeder Philosoph gibt einen anderen Rat. Welcher Rat stammt von wem?');
      if (state.teams) note('Am Zug: ' + TEAMS[state.turn]);
      if (r.lastWrong) note('Das passt nicht ganz. Welcher Philosoph spricht von Wünschen, welcher vom Üben, welcher von der eigenen Hand?');
    } else {
      talk('Gespräch: Welcher Rat hilft am meisten?', 'Welcher der drei Ratschläge würde in dieser Situation am meisten helfen? Ergänzen sie sich – oder widersprechen sie sich?');
      if (state.si < ROUND3.length - 1) button('Nächste Situation →', () => act(st => { st.si++; }));
      else button('Zum Glücks-Kompass →', () => go('compass'));
    }
  },

  compass() {
    heroes(id => { state.votes[id]++; sfx('step'); render(); });
    const sum = ORDER.reduce((n, id) => n + state.votes[id], 0);
    heading('UNSER GLÜCKS-KOMPASS', 'Welche Idee hilft dir am meisten?', 'Hier gibt es keine Sterne und keine richtige Antwort. Jedes Kind legt einen Stein: Tippt den Philosophen an.');
    ORDER.forEach(id => { const d = el('div', 'outcome'); el('strong', '', WHO[id].name.toUpperCase() + ' · ' + state.votes[id] + (state.votes[id] === 1 ? ' STEIN' : ' STEINE'), d); el('p', '', WHO[id].motto, d); });
    talk('Gespräch: Warum gerade diese Idee?', 'Bei welcher Gelegenheit könnte dir diese Idee helfen? Kann man auch von jedem Philosophen etwas mitnehmen?');
    if (sum) button('Steine zurücksetzen', () => act(st => { st.votes = { epikur: 0, aristoteles: 0, epiktet: 0 }; }), 'secondary');
    button('Zur Urkunde →', () => go('urkunde', st => { st.done = true; }));
  },

  urkunde() {
    wide();
    const u = el('div', 'urkunde', '', stage); u.dataset.read = '1';
    el('small', '', 'AUF DER SUCHE NACH DEM GLÜCK', u);
    el('h2', '', 'Urkunde', u);
    el('p', '', 'Die Glücksforscherinnen und Glücksforscher der Klasse', u);
    el('p', '', '', u).innerHTML = '<span class="line">&nbsp;</span>';
    el('p', '', 'haben Epikur, Aristoteles und Epiktet besucht und ihre Ideen vom Glück untersucht.', u);
    const ul = el('ul', '', '', u);
    ORDER.forEach(id => { const li = el('li', '', '', ul); el('b', '', WHO[id].name + ': ', li); li.append(WHO[id].motto); });
    el('p', 'stars', state.teams ? `${TEAMS[0]}: ${state.stars[0]} ★ · ${TEAMS[1]}: ${state.stars[1]} ★` : `Gesammelte Sterne: ${total()} von 18 ★`, u);
    heading('GESCHAFFT!', 'Ihr seid Glücksforscher!');
    el('p', '', 'Drei Denker, drei Ideen – und eure eigenen Gedanken dazu. Welche Frage zum Glück ist für euch noch offen?');
    talk('Gespräch: Unsere offene Frage', 'Welche Frage zum Glück ist für euch noch offen? Wen würdet ihr dazu gern befragen?');
    button('Urkunde drucken / als PDF speichern', () => window.print());
    button('Finale noch einmal spielen', restart, 'secondary');
    if (prevStep !== 'urkunde') celebrate();
  }
};

setup({
  station: 'finale', title: 'Das große Glücks-Finale', name: 'Finale', speaker: '',
  place: 'ALLE DREI PHILOSOPHEN', bg: '../aristoteles/assets/wandelweg.webp', figure: null,
  teacher: TEACHER, start: 'intro',
  fresh: () => ({ teams: false, turn: 0, stars: [0, 0], r1: freshPlacer(), r2: freshPlacer(), r3_0: freshPlacer(), r3_1: freshPlacer(), si: 0, votes: { epikur: 0, aristoteles: 0, epiktet: 0 } }),
  chapters: [['Start', 'intro'], ['Wer bin ich?', 'r1'], ['Wessen Idee?', 'r2'], ['Drei Ratschläge', 'r3'], ['Kompass', 'compass'], ['Urkunde', 'urkunde']],
  info: { intro: [0, 'Das große Glücks-Finale'], r1: [1, 'Runde 1'], r2: [2, 'Runde 2'], r3: [3, 'Runde 3'], compass: [4, 'Unser Glücks-Kompass'], urkunde: [5, 'Unsere Urkunde'] },
  hud(hud) {
    if (state.step === 'intro') return;
    const box = el('div', 'teams', '', hud);
    (state.teams ? TEAMS : ['Sterne']).forEach((t, i) => {
      const d = el('div', 'team' + (state.teams && state.turn === i && /^r/.test(state.step) ? ' turn' : ''), '', box);
      el('span', 'tok on', '', d).innerHTML = ICONS.stern; d.append(`${t}: ${state.stars[i]}`);
    });
  },
  steps: STEPS
});
