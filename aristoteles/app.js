'use strict';
/* =====================================================================
   EIN GUTER TAG MIT ARISTOTELES
   Teil 1: Inhalte – hier kannst du Texte, Fälle und Karten anpassen.
   Teil 2: Ablauf der Station. Die Technik steht in ../spiel.js.
   ===================================================================== */

/* ---------- TEIL 1: INHALTE ---------- */

const TOKENS = [   // sechs Schwalben, je eine für einen untersuchten Gedanken
  { id: 'kennen',  name: 'Aristoteles kennen', where: 'Kapitel „Kennenlernen“', text: 'Forscher, Lehrer und Spaziergänger: Aristoteles wollte alles verstehen.' },
  { id: 'ziel',    name: 'Das höchste Ziel',   where: 'Kapitel „Das höchste Ziel“', text: 'Fast alles wollen wir für etwas anderes. Das Glück wollen wir einfach so.' },
  { id: 'mut',     name: 'Mut',                where: 'Fall „Du darfst nicht mitspielen!“', text: 'Mut liegt in der Mitte zwischen Feigheit und Tollkühnheit.' },
  { id: 'wahr',    name: 'Wahrhaftigkeit',     where: 'Fall „Das war ich nicht!“', text: 'Sagen, wie es wirklich war: nicht schöner und nicht schlimmer.' },
  { id: 'gerecht', name: 'Gerechtigkeit',      where: 'Fall „Ich will noch mal!“', text: 'Nicht zu viel für mich und nicht zu wenig. Jeder bekommt, was ihm zusteht.' },
  { id: 'ueben',   name: 'Übung',              where: 'Kapitel „Üben“', text: 'Eine Schwalbe macht noch keinen Sommer: Gut handeln wird durch Üben zur Gewohnheit.' }
];

const PROFILE = [
  ['Gelebt', '384 bis 322 vor Christus – vor über 2300 Jahren'],
  ['Heimat', 'Stageira im Norden Griechenlands. Sein Vater war Arzt.'],
  ['Gelernt bei', 'Platon in Athen – zwanzig Jahre lang'],
  ['Berühmter Schüler', 'Prinz Alexander, der später „Alexander der Große“ genannt wurde'],
  ['Eigene Schule', 'das Lykeion in Athen. Dort lehrte er oft beim Gehen in der Wandelhalle.'],
  ['Forschte über', 'Tiere, Pflanzen, Sterne, Sprache, Politik – und das gute Leben'],
  ['Idee vom Glück', 'Glück ist ein gelungenes Leben: nachdenken, gut handeln und Freunde haben. Gut handeln kann man üben.']
];

const FACTS = [
  { text: 'Ich war der Lehrer eines Prinzen, der später ein berühmter König wurde.', truth: true,
    why: 'Der Prinz hieß Alexander. Später nannte man ihn „Alexander der Große“. Aristoteles unterrichtete ihn, als Alexander 13 Jahre alt war.' },
  { text: 'Beim Unterrichten bin ich am liebsten mit meinen Schülern spazieren gegangen.', truth: true,
    why: 'In seiner Schule, dem Lykeion, gab es eine Wandelhalle. Dort ging er beim Lehren auf und ab. Deshalb heißt dieser Ort hier „Wandelweg“.' },
  { text: 'Ich habe mich nur für das Glück interessiert – für sonst nichts.', truth: false,
    why: 'Aristoteles wollte alles verstehen: Er beschrieb Hunderte von Tieren, erforschte Pflanzen, Sterne, Sprache und Politik. Das gute Leben war nur eine seiner großen Fragen.' },
  { text: 'Ich habe vor ungefähr 200 Jahren gelebt.', truth: false,
    why: 'Es ist viel länger her: über 2300 Jahre! Aristoteles lebte in Griechenland und lernte zwanzig Jahre lang bei dem Philosophen Platon.' }
];

const IDEAS = [   // Vermutung am Anfang und Vergleich am Ende
  ['joy', '🎉', 'Viele schöne Momente erleben'], ['friends', '👫', 'Verlässliche Freunde haben'],
  ['good', '🤝', 'Gut mit anderen umgehen'], ['win', '🏆', 'Oft gewinnen und bewundert werden'],
  ['learn', '📚', 'Etwas lernen und üben'], ['rich', '💰', 'Viel Geld haben']
];

const LADDER = [   // Die Wozu-Leiter: Jede endet bei „glücklich sein“.
  { id: 'ball',  label: '⚽ Ich übe jeden Tag Fußball.', rungs: ['Damit ich besser spiele.', 'Damit meine Mannschaft und ich mehr Freude am Spiel haben.', 'Weil es mich froh macht, etwas mit anderen gut zu können.'] },
  { id: 'mathe', label: '✏️ Ich lerne für die Mathearbeit.', rungs: ['Damit ich die Aufgaben verstehe.', 'Damit ich später einen Beruf lernen kann, der mir gefällt.', 'Damit ich gut und zufrieden leben kann.'] },
  { id: 'spar',  label: '🐷 Ich spare mein Taschengeld.', rungs: ['Damit ich mir ein Fahrrad kaufen kann.', 'Damit ich mit meinen Freunden Ausflüge machen kann.', 'Weil mir die Zeit mit Freunden Freude macht.'] }
];
const LADDER_END = ['Weil ich glücklich sein möchte.', 'Einfach so! Dahinter kommt nichts mehr.'];

const CANDS = [   // Drei Kandidaten für das Glück – Aristoteles prüft sie.
  { id: 'spass', icon: '🎉', name: 'Immer Spaß haben',
    check: 'Spaß gehört zu einem guten Leben dazu. Aber wer nur dem Spaß nachläuft, lebt nicht anders als eine Kuh auf der Weide. Menschen können mehr: nachdenken und gut handeln.' },
  { id: 'ruhm',  icon: '🏆', name: 'Berühmt sein',
    check: 'Ob dich andere bewundern, entscheiden die anderen. Sie können es dir jederzeit wieder wegnehmen. Das Glück soll aber etwas sein, das wirklich dir gehört.' },
  { id: 'geld',  icon: '💰', name: 'Reich sein',
    check: 'Denkt an die Wozu-Leiter: Geld will man immer für etwas anderes. Es ist ein Hilfsmittel – kein Ziel.' }
];

const CASES = [
  { id: 'mut', token: 'mut', virtue: 'Mut', title: 'Du darfst nicht mitspielen!', img: 'assets/mut.webp',
    alt: 'Ein Kind wird beim Ballspiel ausgeschlossen. Ein weiteres Kind beobachtet die Situation.',
    intro: 'In der Pause möchte ein Kind beim Ballspiel mitmachen. Ein anderes sagt: „Du darfst nicht!“ Du stehst daneben. Dein Herz klopft.',
    notice: 'Was fällt euch an den Blicken und Gesten auf? Was wissen wir noch nicht?',
    scale: ['zu wenig Mut', 'MUT', 'zu viel Wagemut'],
    zones: [{ id: 'less', label: 'Feige', sub: 'Die Angst bestimmt alles.' }, { id: 'mid', label: 'Mutig', sub: 'Trotz Angst überlegt handeln.', cls: 'mid' }, { id: 'more', label: 'Tollkühn', sub: 'Losstürmen, ohne nachzudenken.' }],
    actions: [
      { id: 'a', zone: 'less', label: 'Ich gehe weg und sage nichts.',
        now: 'Du vermeidest einen Streit und bist vielleicht erleichtert. Das ausgeschlossene Kind bleibt allein.',
        later: 'Wenn niemand etwas sagt, wird das Kind vielleicht wieder ausgeschlossen. Und dich beschäftigt, dass du helfen wolltest.' },
      { id: 'b', zone: 'more', label: 'Ich stürme hin und schreie die anderen an.',
        now: 'Alle merken, dass du den Ausschluss schlimm findest. Aber jetzt gibt es einen neuen Streit.',
        later: 'Die anderen fühlen sich angegriffen. Dem ausgeschlossenen Kind ist damit noch nicht geholfen.' },
      { id: 'c', zone: 'mid', label: 'Ich sage ruhig: „Das finde ich unfair.“ Und ich lade das Kind zu mir ein.',
        now: 'Das kostet Überwindung. Das Kind merkt: Jemand steht zu mir.',
        later: 'Vielleicht denkt die Gruppe um. Wenn nicht oder wenn es gefährlich wird, holst du Hilfe.' }],
    insight: 'Mutig ist nicht, wer keine Angst hat. Mutig ist, wer trotz Angst überlegt das Richtige tut. Und die Mitte ist nicht für alle gleich: Für ein schüchternes Kind ist schon ein leises „Stopp“ sehr mutig.',
    link: 'Wer anderen beisteht, gewinnt Vertrauen und Freunde. Das gehört zu einem gelungenen Leben – auch wenn der erste Schritt schwerfällt.',
    ask: 'Was wäre für DICH in dieser Situation mutig? Wann holt man besser Hilfe?' },

  { id: 'wahr', token: 'wahr', virtue: 'Wahrhaftigkeit', title: 'Das war ich nicht!', img: 'assets/verantwortung.webp',
    alt: 'Ein Kind steht besorgt neben einem zerbrochenen Blumentopf. Ein Ball liegt daneben.',
    intro: 'Beim Spielen mit dem Ball ist dir ein Blumentopf heruntergefallen. Niemand hat es gesehen. Du hast Angst vor Ärger.',
    notice: 'Was könnte das Kind gerade denken? Was zeigt das Bild – und was vermuten wir nur?',
    scale: ['sich schlechter machen', 'DIE WAHRHEIT', 'sich besser machen'],
    zones: [{ id: 'less', label: 'Schlechtreden', sub: 'Ich mache mich kleiner, als ich bin.' }, { id: 'mid', label: 'Wahrhaftig', sub: 'Ich sage, wie es wirklich war.', cls: 'mid' }, { id: 'more', label: 'Schönreden', sub: 'Ich stelle mich besser hin, als es stimmt.' },
            { id: 'none', label: '🚫 Hat keine gute Mitte', sub: 'Das ist nie in Ordnung.', cls: 'none' }],
    actions: [
      { id: 'a', zone: 'more', label: '„Der Topf stand sowieso ganz wackelig. Ich kann nichts dafür.“',
        now: 'Du stehst besser da, als es stimmt. Vielleicht gibt es weniger Ärger.',
        later: 'Du weißt selbst, dass es nicht die ganze Wahrheit war. Und beim nächsten Mal glaubt man dir vielleicht weniger.' },
      { id: 'b', zone: 'less', label: '„Ich bin so ein Tollpatsch! Ich mache immer alles kaputt.“',
        now: 'Du gibst den Fehler zu. Aber du machst dich viel schlechter, als du bist.',
        later: 'Ein Missgeschick macht dich nicht zu einem schlechten Menschen. Und die Scherben sind davon auch noch nicht weg.' },
      { id: 'c', zone: 'mid', label: '„Mir ist der Topf heruntergefallen. Das war ein Versehen. Ich helfe, es in Ordnung zu bringen.“',
        now: 'Das fällt schwer. Aber jetzt kann ein Erwachsener helfen, die Scherben sicher wegzuräumen.',
        later: 'Andere erleben: Auf dein Wort kann man sich verlassen. Eine freundliche Antwort ist trotzdem nicht sicher.' },
      { id: 'd', zone: 'none', label: '„Das war mein Banknachbar!“',
        now: 'Du entgehst vielleicht dem Ärger. Ein anderes Kind wird zu Unrecht beschuldigt.',
        later: 'Das verletzt das andere Kind und zerstört Vertrauen. Später ist alles noch schwerer zu klären.' }],
    insight: 'Wahrhaftig ist, wer sagt, wie es wirklich war: nicht schöner und nicht schlimmer. Und merkt euch: Nicht alles hat eine gute Mitte. Einem anderen die Schuld zu geben ist immer falsch – auch „nur ein bisschen“.',
    link: 'Wem man glauben kann, dem vertraut man. Ohne Vertrauen gibt es keine Freundschaft – und ohne Freunde kein gelungenes Leben.',
    ask: 'Warum ist Ehrlichkeit wertvoll, auch wenn man dafür nicht belohnt wird? Was sollten Erwachsene tun, damit Kinder ehrlich sein können?' },

  { id: 'gerecht', token: 'gerecht', virtue: 'Gerechtigkeit', title: 'Ich will noch mal!', img: 'assets/fairness.webp',
    alt: 'Vier Kinder sitzen bei einem Brettspiel. Ein Kind hält den Würfel, ein anderes wartet mit offener Hand.',
    intro: 'Du hast gerade gewürfelt. Es macht so viel Spaß, dass du gleich noch einmal dran sein möchtest. Die anderen warten schon.',
    notice: 'Was könnten die Kinder jeweils wollen? Welche Spielregel müssten wir kennen?',
    scale: ['zu wenig für mich', 'GERECHT', 'zu viel für mich'],
    zones: [{ id: 'less', label: 'Zu wenig', sub: 'Ich gebe meinen Wunsch ganz auf.' }, { id: 'mid', label: 'Gerecht', sub: 'Jeder bekommt, was ihm zusteht.', cls: 'mid' }, { id: 'more', label: 'Zu viel', sub: 'Ich nehme mir mehr als die anderen.' }],
    actions: [
      { id: 'a', zone: 'more', label: 'Ich würfle einfach noch einmal.',
        now: 'Du hast sofort Spaß. Die anderen fühlen sich übergangen.',
        later: 'Es gibt Streit, oder jemand hört auf mitzuspielen. Anders wäre es, wenn eure Regel einen zweiten Wurf erlaubt.' },
      { id: 'b', zone: 'less', label: 'Ich sage nichts mehr und spiele nicht weiter.',
        now: 'Du ziehst dich zurück. Die anderen wissen gar nicht, was du möchtest.',
        later: 'Dir entgeht der gemeinsame Spaß. Dabei hätte dein Wunsch vielleicht in eine faire Regel gepasst.' },
      { id: 'c', zone: 'mid', label: 'Ich gebe den Würfel weiter und schlage vor: „Wer eine Sechs hat, darf noch mal.“',
        now: 'Warten fällt schwer. Aber du sagst deinen Wunsch – und die Regel gilt für alle gleich.',
        later: 'Mit Regeln, die für alle gelten, spielen alle gern weiter. Gewinnen wirst du trotzdem nicht immer.' }],
    insight: 'Gerecht ist, wer sich nicht mehr nimmt, als ihm zusteht – aber auch nicht weniger. Du musst deine Wünsche nicht aufgeben. Du sollst sie nur nicht über die der anderen stellen.',
    link: 'Wo es gerecht zugeht, sind Menschen gern zusammen. Gemeinsame Freude kann wichtiger sein als ein zusätzlicher Wurf.',
    ask: 'Welche Regel wäre bei eurem Lieblingsspiel gerecht? Würde sie auch gelten, wenn jemand anderes gewinnt?' }
];

const GOALS = [
  'Ich lade jemanden zum Mitspielen ein oder stehe einem Kind bei.',
  'Ich sage ehrlich, wenn mir ein Fehler passiert ist.',
  'Ich achte beim Spielen darauf, dass alle drankommen.'
];
const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const TEACHER = `
<p><b>Ziel:</b> Die Kinder lernen Aristoteles kennen und untersuchen drei seiner Gedanken: Glück als höchstes Ziel und gelungenes Leben, die gute Mitte, und dass gutes Handeln durch Üben zur Haltung wird.</p>
<p><b>Ablauf (2 bis 3 Abschnitte von je 20–30 Minuten):</b> 1. Kennenlernen mit „Wahr oder erfunden?“ und Vermutung. 2. Wozu-Leiter und drei Glücks-Kandidaten. 3. Drei Alltagsfälle am Mitte-Messer, einzeln anwählbar. 4. Schwalben-Woche mit Wochenübung. 5. Rückblick. Alle Kapitel sind oben direkt erreichbar.</p>
<p><b>Sammelstücke:</b> Für jeden untersuchten Gedanken gibt es eine Schwalbe – nie für eine Meinung. Keine ist versteckt; die Übersicht steht am Ende. Es gibt keinen Glücks- oder Tugend-Punktestand.</p>
<p><b>Fachlicher Kern:</b> Die Wozu-Leiter folgt dem Anfang der Nikomachischen Ethik: Glück wird als Einziges um seiner selbst willen erstrebt. Die Prüfung von Lust, Ehre und Reichtum stammt ebenfalls von dort. „Tugend“ meint eine eingeübte Haltung, die Mitte ist situations- und personenabhängig, kein rechnerischer Durchschnitt.</p>
<p><b>Zur Treffsicherheit der Fälle:</b> Mut (Feigheit – Mut – Tollkühnheit) und Gerechtigkeit (zu wenig – gerecht – zu viel für mich) entsprechen Aristoteles’ eigenen Beispielen. Beim Blumentopf wird seine Tugend der Wahrhaftigkeit (sich weder größer noch kleiner machen, als man ist) auf den Umgang mit einem Fehler übertragen; das ist eine didaktische Übertragung. Die Karte „Das war mein Banknachbar!“ zeigt seinen Gedanken, dass manche Handlungen gar keine Mitte haben.</p>
<p><b>Grenzen:</b> Gutes Handeln garantiert weder Belohnung noch ein gutes Gefühl. Aristoteles betont auch äußere Bedingungen wie Gesundheit, Auskommen und Freunde. Kinder sollen Ausgrenzung nicht allein lösen; bei Gefahr Hilfe holen.</p>
<p>Aristoteles’ Sätze sind vereinfachte, sinngemäße Darstellungen. Das Schwalben-Sprichwort geht tatsächlich auf ihn zurück (bei ihm: „… macht noch keinen Frühling“). Nichts wird gespeichert oder versendet; der Stand bleibt bis zum Neuladen erhalten.</p>`;


/* ---------- TEIL 2: ABLAUF ---------- */

const theCase = () => CASES[state.ci];
const weekCount = () => state.week.filter(Boolean).length;

const STEPS = {

  intro() {
    figure(true);
    heading('STATION ARISTOTELES', 'Ein guter Tag mit Aristoteles');
    say('Willkommen auf meinem Wandelweg! Geht ein Stück mit mir – beim Gehen denkt es sich am besten. Meine Frage: Was ist ein gutes Leben?');
    note('Eure Aufgabe: Untersucht Aristoteles’ Gedanken und sammelt dabei sechs Schwalben. Warum Schwalben? Das verrät er euch später.');
    button('Wer ist Aristoteles? →', () => go('facts'));
  },

  facts() {
    figure(true);
    truthGame(FACTS, 'facts', 'ARISTOTELES ERZÄHLT', () => go('guess', () => award('kennen')));
  },

  guess() {
    figure(true);
    heading('EURE VERMUTUNG', 'Was gehört zu einem guten Leben?', 'Wählt zwei Gedanken. Am Ende schauen wir, ob ihr dabei bleibt.');
    pickGrid(IDEAS, 'guess', 2);
    button('Vermutung festhalten →', () => go('ladder')).disabled = state.guess.length !== 2;
  },

  ladder() {
    figure(true);
    const L = state.ladder, topic = LADDER.find(x => x.id === L.topic);
    if (!topic) {
      heading('DIE WOZU-LEITER', 'Wozu tun wir, was wir tun?');
      say('Ich stelle gern eine einfache Frage: Wozu? Und dann frage ich noch einmal. Probiert es aus!');
      LADDER.forEach(t => button(t.label, () => { sfx('step'); act(st => { st.ladder = { topic: t.id, n: 0 }; }); }, 'choice'));
      return;
    }
    const all = topic.rungs.concat(LADDER_END), box = el('div', 'ladder', '', stage);
    box.dataset.read = '1';
    el('div', 'rung start', topic.label, box);
    all.slice(0, L.n).forEach((r, i) => { const d = el('div', 'rung' + (i === all.length - 1 ? ' top' : ''), '', box); if (i < all.length - 1) el('small', '', 'WOZU?', d); d.append(i === all.length - 1 ? '⭐ ' + r : r); });
    if (L.n < all.length) {
      heading('DIE WOZU-LEITER', L.n === all.length - 1 ? 'Und wozu willst du glücklich sein?' : 'Wozu?', 'Überlegt erst selbst eine Antwort. Tippt dann.');
      button(L.n === all.length - 1 ? 'Wozu glücklich sein? ↑' : 'Wozu? ↑', () => { sfx('step'); act(st => { st.ladder.n++; }); });
    } else {
      heading('DIE WOZU-LEITER', 'Ganz oben: das Glück');
      say('Fast alles tun wir für etwas anderes. Nur beim Glück gibt es kein „Wozu“ mehr. Deshalb nenne ich das Glück das höchste Ziel.');
      talk('Gespräch: Endet jede Leiter beim Glück?', 'Denkt euch eine eigene Wozu-Leiter aus. Wo endet sie?');
      button('Eine andere Leiter ausprobieren', () => act(st => { st.ladder = { topic: null, n: 0 }; }), 'secondary');
      button('Aber was ist Glück? →', () => go('cands'));
    }
  },

  cands() {
    figure(true);
    const C = state.cands, open = CANDS.find(c => c.id === C.open), allDone = CANDS.every(c => C.checked.includes(c.id));
    const row = el('div', 'trio', '', stage);
    CANDS.forEach(c => {
      const b = button('', () => act(st => { st.cands.open = c.id; st.cands.vote = null; }), 'tile' + (C.open === c.id ? ' open' : '') + (C.checked.includes(c.id) ? ' checked' : ''), row);
      el('i', '', c.icon, b); el('span', '', c.name, b);
    });
    if (!open) {
      heading('DREI KANDIDATEN', 'Ist das schon das Glück?');
      say(allDone ? 'Alle drei gehören vielleicht dazu. Aber keiner reicht allein. Wollt ihr meine Antwort hören?' : 'Viele Menschen sagen: Glück ist Spaß, Ruhm oder Reichtum. Prüfen wir das! Tippt einen Kandidaten an.');
      if (allDone) button('Aristoteles’ Antwort →', () => go('answer'));
      return;
    }
    heading('KANDIDAT: ' + open.name.toUpperCase(), 'Reicht das für ein glückliches Leben?', C.vote === null ? 'Stimmt ab und begründet. Tippt dann eure Mehrheit an.' : '');
    if (C.vote === null) {
      const r = el('div', 'tworow');
      button('Ja, das reicht!', () => act(st => { st.cands.vote = true; }), 'choice big', r);
      button('Nein, da fehlt etwas!', () => act(st => { st.cands.vote = false; }), 'choice big', r);
    } else {
      say(open.check);
      note('Eure Abstimmung: ' + (C.vote ? '„Das reicht.“' : '„Da fehlt etwas.“') + ' Überzeugt euch Aristoteles’ Grund?');
      button('Nächsten Kandidaten prüfen →', () => act(st => { if (!st.cands.checked.includes(open.id)) st.cands.checked.push(open.id); st.cands.open = null; }));
    }
  },

  answer() {
    figure(true);
    const col = el('div', 'trio col', '', stage);
    [['🧠', 'Nachdenken und lernen', 'Das können Menschen besonders gut.'], ['🤝', 'Gut handeln', 'Mutig, ehrlich und gerecht sein – das kann man üben.'], ['👫', 'Freunde haben', 'Ohne Freunde möchte niemand leben, auch wenn er sonst alles hätte.']]
      .forEach(([i, b, t]) => { const d = el('div', 'tile', '', col); el('i', '', i, d); const x = el('div', '', '', d); el('span', '', b, x); el('small', '', t, x); });
    heading('ARISTOTELES’ ANTWORT', 'Glück ist ein gelungenes Leben');
    say('Glück ist für mich kein kurzer Moment. Es ist ein ganzes Leben, das gelingt. Dazu gehören drei Dinge – und ein wenig Glück von außen: Gesundheit, genug zum Leben und Menschen, die helfen.');
    talk('Gespräch: Glücksmoment oder gelungenes Leben?', 'Was ist der Unterschied zwischen einem glücklichen Moment und einem gelungenen Leben? Findet Beispiele.');
    button('Gut handeln – aber wie? →', () => go('hub', () => award('ziel')));
  },

  hub() {
    figure(true);
    heading('DIE GUTE MITTE', 'Drei Fälle aus eurem Alltag');
    say('Gut handeln heißt für mich: die gute Mitte finden – zwischen zu wenig und zu viel. Probiert es am Mitte-Messer aus!');
    CASES.forEach((c, i) => {
      const seen = state.seen.includes(c.id), b = button('', () => go('case', st => { st.ci = i; st.phase = 'observe'; st.gauge = freshPlacer(); st.look = null; st.time = 'now'; }), 'casecard' + (seen ? ' seen' : ''));
      const im = el('img', '', '', b); im.src = c.img; im.alt = '';
      const d = el('div', '', '', b); el('strong', '', c.title, d); el('small', '', c.virtue + (seen ? ' · untersucht ✓' : ''), d);
    });
    button('Weiter: Gut handeln üben →', () => go('week'), state.seen.length ? 'primary' : 'secondary');
  },

  case() {
    const c = theCase(), acts = c.actions;
    if (state.phase === 'observe') {
      picture(c.img, c.alt);
      heading('ERST GENAU HINSEHEN', c.title, c.intro);
      talk('Gespräch: Was sehen und vermuten wir?', c.notice);
      button('Zum Mitte-Messer →', () => act(st => { st.phase = 'place'; }));
    }
    if (state.phase === 'place') {
      wide();
      const r = placer({ key: 'gauge', scale: c.scale, zones: c.zones, items: acts.map(a => ({ id: a.id, text: a.label })),
        answer: Object.fromEntries(acts.map(a => [a.id, a.zone])), doneText: 'Alle Karten liegen richtig. Welche würdet ihr wählen?' });
      heading('DER MITTE-MESSER · ' + c.virtue.toUpperCase(), r.done ? 'Die Mitte ist gefunden!' : 'Wohin gehört jede Karte?');
      if (!r.done) {
        el('p', '', 'Begründet erst. Tippt dann eine Karte und ihr Feld an – oder zieht die Karte hinüber.');
        if (r.lastWrong) note('Noch nicht ganz. Prüft noch einmal: Ist das zu wenig, zu viel – oder genau richtig?' + (c.zones.length > 3 ? ' Oder passt es gar nicht auf den Mitte-Messer?' : ''));
      } else {
        say(c.zones.length > 3 ? 'Habt ihr es bemerkt? Eine Karte passt gar nicht auf den Messer. Für manches gibt es keine gute Mitte.' : 'Zu wenig, zu viel – und dazwischen die gute Mitte. Aber was folgt aus jeder Handlung?');
        button('Folgen untersuchen: jetzt und später →', () => act(st => { st.phase = 'effects'; st.look = acts[0].id; st.time = 'now'; }));
      }
    }
    if (state.phase === 'effects') {
      picture(c.img, c.alt);
      const a = acts.find(x => x.id === state.look) || acts[0];
      heading('MÖGLICHE FOLGEN', 'Jetzt – und vielleicht später');
      acts.forEach(x => { const b = button(x.label, () => act(st => { st.look = x.id; st.time = 'now'; }), 'choice'); b.setAttribute('aria-pressed', x.id === a.id); });
      const tabs = el('div', 'tabs');
      [['now', 'Jetzt'], ['later', 'Später']].forEach(([id, t]) => button(t, () => act(st => { st.time = id; }), state.time === id ? 'active' : '', tabs));
      const out = el('div', 'outcome'); el('strong', '', state.time === 'now' ? 'IN DIESEM MOMENT' : 'AUF LÄNGERE SICHT', out); el('p', '', a[state.time], out);
      talk('Wir haben eine eigene Idee', 'Wie würdet ihr handeln? Liegt eure Idee eher bei „zu wenig“, „zu viel“ oder in der Mitte?');
      button('Aristoteles’ Gedanke dazu →', () => act(st => { st.phase = 'insight'; }));
    }
    if (state.phase === 'insight') {
      picture(c.img, c.alt);
      heading('ARISTOTELES’ GEDANKE', c.virtue);
      say(c.insight);
      const d = el('div', 'outcome'); el('strong', '', 'UND DAS GLÜCK?', d); el('p', '', c.link, d);
      talk('Gespräch: Überzeugt euch das?', c.ask);
      button('Fall abschließen →', () => go('hub', st => { if (!st.seen.includes(c.id)) st.seen.push(c.id); award(c.token); }));
    }
  },

  week() {
    figure(true);
    const n = weekCount(), level = n >= 4 ? 3 : n >= 2 ? 2 : n;
    const sky = el('div', 'sky w' + level, '', stage), cap = el('div', 'cap', '', sky);
    el('i', 'sun', '', cap);
    el('span', '', ['Noch ist Winter. Wann wollt ihr üben?', 'Eine Schwalbe! Aber eine allein macht noch keinen Sommer.', 'Es wird wärmer …', 'Sommer! Was man oft tut, wird zur Gewohnheit.'][level], cap);
    const days = el('div', 'days', '', sky);
    DAYS.forEach((d, i) => {
      const b = button('', () => { state.week[i] = !state.week[i]; sfx(state.week[i] ? 'step' : 'tap'); if (weekCount() >= 4) award('ueben'); render(); }, 'day' + (state.week[i] ? ' on' : ''), days);
      b.setAttribute('aria-pressed', !!state.week[i]); el('span', '', d, b); el('span', 'tok on', '', b).innerHTML = ICONS.schwalbe;
    });
    el('div', 'alldone', 'Das Sprichwort stammt wirklich von Aristoteles. Bei ihm hieß es: „Eine Schwalbe macht noch keinen Frühling.“', stage).style.fontWeight = '400';
    heading('GUT HANDELN ÜBEN', 'Eine Schwalbe macht noch keinen Sommer');
    say('Mutig wird man, indem man mutig handelt. Gerecht wird man, indem man gerecht handelt. Immer wieder – wie beim Fahrradfahren.');
    el('p', '', 'Wählt eine kleine Übung. Tippt dann links die Tage an, an denen ihr üben wollt.');
    GOALS.forEach((t, i) => { const b = button(t, () => act(st => { st.goal = i; }), 'choice'); b.setAttribute('aria-pressed', state.goal === i); });
    button('Unsere Gedanken vergleichen →', () => go('after')).disabled = state.goal === null;
  },

  after() {
    figure(true);
    heading('VORHER UND JETZT', 'Was gehört zu einem guten Leben?', 'Wählt noch einmal zwei Gedanken. Ihr dürft bei eurer ersten Wahl bleiben.');
    pickGrid(IDEAS, 'after', 2);
    button('Unser Rückblick →', () => go('end', st => { st.done = true; })).disabled = state.after.length !== 2;
  },

  end() {
    figure(true);
    heading('STATION GESCHAFFT · UNSER GEDANKE', 'Gut handeln kann man üben.');
    say('Das Glück ist ein ganzes Leben, das gelingt: mit Nachdenken, guten Gewohnheiten und Freunden. Was überzeugt euch daran – und was nicht?');
    compare(IDEAS, state.guess, state.after);
    if (state.goal !== null) { el('h2', '', 'Unsere Übung für die Woche'); el('div', 'goal', GOALS[state.goal]); }
    tokenBoard('Unsere Schwalben');
    button('Gespräch: Was hat sich verändert – und warum?', () => openPause('Vergleicht eure Vermutung mit eurer Wahl von jetzt. Was hat sich verändert – und warum?'));
    button('Rückblick drucken / als PDF speichern', () => window.print(), 'secondary');
    button('Nach einer Woche: Wie war das Üben?', () => go('review'), 'secondary');
    if (prevStep !== 'end') celebrate();
  },

  review() {
    figure(true);
    heading('NACH EINER WOCHE', 'Wie ist es euch ergangen?', 'Erzählt freiwillig. Niemand muss etwas Persönliches berichten.');
    say('Nicht alles gelingt sofort. Auch ich musste üben.');
    ['Welche Gelegenheit gab es zum Üben?', 'Wie ging es euch dabei – und den anderen?', 'Was war schwierig? Welche Hilfe hätte genützt?', 'Was wollt ihr beim nächsten Mal anders versuchen?'].forEach(q => button(q, () => openPause(q), 'choice'));
    button('Zurück zum Rückblick', () => go('end'), 'secondary');
  }
};

setup({
  station: 'aristoteles', title: 'Ein guter Tag mit Aristoteles', name: 'Aristoteles', speaker: 'ARISTOTELES',
  place: 'ARISTOTELES’ WANDELWEG', bg: 'assets/wandelweg.webp', figure: 'assets/aristoteles.webp',
  tokens: TOKENS, tokenIcon: 'schwalbe', tokenName: 'Schwalben', tokenToast: 'NEUE SCHWALBE',
  profile: PROFILE, teacher: TEACHER, start: 'intro',
  fresh: () => ({ guess: [], after: [], facts: { i: 0, answer: null }, ladder: { topic: null, n: 0 }, cands: { open: null, vote: null, checked: [] },
    ci: 0, phase: 'observe', gauge: freshPlacer(), look: null, time: 'now', seen: [], week: [false, false, false, false, false, false, false], goal: null }),
  chapters: [['Kennenlernen', 'intro'], ['Das höchste Ziel', 'ladder'], ['Die gute Mitte', 'hub'], ['Üben', 'week'], ['Rückblick', 'after']],
  info: { intro: [0, 'Ankommen'], facts: [0, 'Wahr oder erfunden?'], guess: [0, 'Unsere Vermutung'], ladder: [1, 'Die Wozu-Leiter'], cands: [1, 'Drei Kandidaten'], answer: [1, 'Aristoteles’ Antwort'],
    hub: [2, 'Drei Alltagsfälle'], case: [2, 'Der Mitte-Messer'], week: [3, 'Die Schwalben-Woche'], after: [4, 'Vorher und jetzt'], end: [4, 'Unser Gedanke'], review: [4, 'Nach einer Woche'] },
  steps: STEPS
});
