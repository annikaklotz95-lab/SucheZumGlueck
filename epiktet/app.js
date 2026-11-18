'use strict';
/* =====================================================================
   WAS LIEGT IN MEINER HAND? · EPIKTET
   Teil 1: Inhalte – hier kannst du Texte, Fälle und Karten anpassen.
   Teil 2: Ablauf der Station. Die Technik steht in ../spiel.js.
   ===================================================================== */

/* ---------- TEIL 1: INHALTE ---------- */

const TOKENS = [   // sechs Lampen, je eine für einen untersuchten Gedanken
  { id: 'kennen', name: 'Epiktet kennen', where: 'Kapitel „Kennenlernen“', text: 'Vom Sklaven zum Lehrer: Epiktet suchte, was ihm niemand wegnehmen konnte.' },
  { id: 'lampe',  name: 'Zwei Bereiche',  where: 'Kapitel „Die Lampe“', text: 'Manches liegt in meiner Hand, manches nicht.' },
  { id: 'regen',  name: 'Enttäuschung',   where: 'Fall „Der Ausflug fällt aus!“', text: 'Den Regen bestimme ich nicht – meinen nächsten Schritt schon.' },
  { id: 'spiel',  name: 'Niederlage',     where: 'Fall „Ich habe verloren!“', text: 'Ein Ergebnis ist kein Urteil über mich.' },
  { id: 'aus',    name: 'Ausgrenzung',    where: 'Fall „Du darfst nicht mitspielen!“', text: 'Was andere tun, bestimme ich nicht. Stopp sagen und Hilfe holen liegt in meiner Hand.' },
  { id: 'ordnen', name: 'Unterscheiden',  where: 'Kapitel „Ordnen“', text: 'Erst prüfen: Liegt das in meiner Hand?' }
];

const PROFILE = [
  ['Gelebt', 'ungefähr 50 bis 135 nach Christus – etwa 400 Jahre nach Aristoteles und Epikur'],
  ['Heimat', 'Hierapolis in der heutigen Türkei. Als Kind kam er als Sklave nach Rom.'],
  ['Besonderes', 'Er hinkte sein Leben lang. Sein Herr erlaubte ihm, Philosophie zu lernen, und ließ ihn später frei.'],
  ['Eigene Schule', 'in Nikopolis in Griechenland. Ein Kaiser hatte alle Philosophen aus Rom fortgeschickt.'],
  ['Bücher', 'Er schrieb selbst nichts auf. Sein Schüler Arrian schrieb mit – daraus wurde das „Handbüchlein“.'],
  ['Denkrichtung', 'die Stoa. Der Name kommt von einer Säulenhalle in Athen.'],
  ['Idee vom Glück', 'Ruhig und frei wird, wer unterscheidet: Was liegt in meiner Hand – und was nicht?']
];

const FACTS = [
  { text: 'Als Kind war ich ein Sklave. Ich gehörte einem reichen Mann in Rom.', truth: true,
    why: 'Epiktet wurde in der heutigen Türkei geboren und kam als Sklave nach Rom. Sogar sein Name bedeutet „der Hinzuerworbene“. Später wurde er freigelassen.' },
  { text: 'Ich habe viele dicke Bücher geschrieben.', truth: false,
    why: 'Epiktet schrieb selbst nichts auf. Sein Schüler Arrian schrieb mit, was er sagte. So entstand das berühmte „Handbüchlein“.' },
  { text: 'Ein Kaiser hat mich aus Rom fortgeschickt.', truth: true,
    why: 'Kaiser Domitian mochte keine Philosophen und verbannte sie alle aus Rom. Epiktet ging nach Griechenland und gründete dort seine eigene Schule.' },
  { text: 'Ich finde: Wer sich genug anstrengt, kann alles bestimmen.', truth: false,
    why: 'Im Gegenteil! Epiktet hatte als Sklave erlebt, wie wenig man manchmal bestimmen kann. Gerade deshalb fragte er: Was liegt wirklich in meiner Hand?' }
];

const LAMP = [   // Was dachte Epiktet, als seine Lampe gestohlen wurde?
  { label: '„Ohne meine Lampe ist alles verdorben!“', ok: false, reply: 'Nein. Eine Lampe ist nur eine Lampe. Mein Leben ist dadurch nicht schlechter geworden.' },
  { label: '„Ich finde keine Ruhe, bis der Dieb bestraft ist!“', ok: false, reply: 'Dann würde der Dieb auch noch über meine Ruhe bestimmen. Die gebe ich ihm nicht dazu.' },
  { label: '„Schade um die Lampe. Morgen kaufe ich mir eine einfache aus Ton.“', ok: true, reply: 'Genau so war es! Ob jemand stiehlt, liegt nicht in meiner Hand. Was ich darüber denke und was ich dann tue – das schon.' }
];

const ZONES = [   // „versuchen“ ist eine moderne Lernhilfe, keine Kategorie Epiktets
  { id: 'me',  icon: '✋', label: 'Das entscheide ich', sub: 'mein Denken und mein nächster Schritt', cls: 'mid' },
  { id: 'try', icon: '🤝', label: 'Das kann ich versuchen', sub: 'Ich kann etwas dafür tun. Andere oder der Zufall entscheiden mit.' },
  { id: 'out', icon: '☁️', label: 'Das bestimme ich nicht', sub: 'Daran kann ich nichts ändern.' }
];

const CASES = [
  { id: 'regen', kind: 'Mit Enttäuschung umgehen', title: 'Der Ausflug fällt aus!', img: 'assets/regen.webp',
    alt: 'Zwei Kinder schauen enttäuscht aus dem Klassenfenster in einen regnerischen Schulhof.',
    story: 'Ihr habt euch so auf den Ausflug gefreut. Jetzt regnet es in Strömen, und er wird abgesagt.',
    fact: 'Es regnet. Der Ausflug fällt heute aus.',
    feeling: 'Enttäuschung ist verständlich. Du musst nicht so tun, als wäre dir der Ausflug egal.',
    thoughts: [
      { label: '„Jetzt ist der ganze Tag verdorben!“', w: '⛈️', feel: 'wütend und traurig – den ganzen Tag',
        then: 'Du sitzt mit verschränkten Armen da. Auch das Spiel in der Klasse macht dir keinen Spaß.', ask: 'Woher weiß man schon am Morgen, wie der ganze Tag wird?' },
      { label: '„Schade! Ich bin enttäuscht. Aber vielleicht fällt uns für drinnen etwas ein.“', w: '🌦️', feel: 'enttäuscht – und ein bisschen neugierig',
        then: 'Du sagst, dass du traurig bist. Dann schlägst du ein Spiel für die Klasse vor.', ask: 'Die Enttäuschung ist noch da. Was ist trotzdem anders?' },
      { label: '„Ist mir doch völlig egal.“', w: '🌫️', feel: 'außen ruhig – innen noch enttäuscht',
        then: 'Du tust so, als wäre nichts. Aber die Enttäuschung ist nicht weg. Sie versteckt sich nur.', ask: 'Muss man ein Gefühl verstecken, um gut damit umzugehen?' }],
    cards: [{ id: 'a', zone: 'out', text: 'Ob es heute regnet.' }, { id: 'b', zone: 'me', text: 'Ob ich sage, dass ich enttäuscht bin.' }, { id: 'c', zone: 'try', text: 'Ob die Klasse stattdessen mein Lieblingsspiel spielt.' }],
    advice: 'Den Regen kann niemand wegzaubern. Aber du entscheidest, was du als Nächstes tust. Traurig sein darfst du trotzdem.' },

  { id: 'spiel', kind: 'Mit einer Niederlage umgehen', title: 'Ich habe verloren!', img: '../aristoteles/assets/fairness.webp',
    alt: 'Vier Kinder sitzen an einem Brettspiel. Ein Kind hält den Würfel.',
    story: 'Stellt euch vor, wie dieses Spiel weitergeht: Du gibst dir große Mühe – und verlierst trotzdem.',
    fact: 'Du hast diese Runde verloren.',
    feeling: 'Ärger nach einer Niederlage ist normal. Er sagt nichts über deinen Wert.',
    thoughts: [
      { label: '„Ich bin einfach schlecht!“', w: '⛈️', feel: 'traurig und mutlos',
        then: 'Du willst nie wieder mitspielen. Aus einer verlorenen Runde ist ein Urteil über dich selbst geworden.', ask: 'Stimmt dieses Urteil? Was sagt eine verlorene Runde wirklich?' },
      { label: '„Diese Runde habe ich verloren. Das ärgert mich! Nächstes Mal probiere ich etwas anderes.“', w: '🌦️', feel: 'verärgert – aber bereit für die nächste Runde',
        then: 'Du atmest durch, gratulierst und überlegst, was du üben könntest.', ask: 'Was liegt bei der nächsten Runde in deiner Hand – und was nicht?' },
      { label: '„Der blöde Würfel ist schuld! Und die anderen sowieso!“', w: '🌩️', feel: 'wütend auf alle',
        then: 'Du schimpfst los. Jetzt sind auch die anderen sauer, und das Spiel ist vorbei.', ask: 'Was könnte dir helfen, kurz innezuhalten, bevor du etwas sagst?' }],
    cards: [{ id: 'a', zone: 'out', text: 'Welche Zahl der Würfel zeigt.' }, { id: 'b', zone: 'me', text: 'Ob ich fair bleibe, wenn ich verliere.' }, { id: 'c', zone: 'try', text: 'Ob ich in diesem Spiel besser werde.' }],
    advice: 'Den Würfel bestimmst du nicht. Ob du gewinnst, auch nicht ganz. Aber wie du spielst und wie du mit dem Verlieren umgehst – das gehört dir.' },

  { id: 'aus', kind: 'Unterstützung statt Schuld', title: 'Du darfst nicht mitspielen!', img: '../aristoteles/assets/mut.webp',
    alt: 'Ein Kind wird beim Ballspiel ausgeschlossen, während ein anderes die Situation beobachtet.',
    story: 'Diesmal bist DU das Kind, das mitspielen möchte. Ein anderes Kind sagt: „Du darfst nicht!“ Das tut weh.',
    fact: 'Ein Kind hat gesagt, dass du nicht mitspielen darfst.',
    feeling: 'Verletzt zu sein ist verständlich. Du bist nicht schuld daran, dass andere dich ausschließen.',
    thoughts: [
      { label: '„Niemand mag mich. Mit mir stimmt etwas nicht.“', w: '⛈️', feel: 'sehr traurig und allein',
        then: 'Du ziehst dich zurück und traust dich nicht mehr, jemanden zu fragen.', ask: 'Ein Kind hat Nein gesagt. Was wissen wir wirklich – und was nicht?' },
      { label: '„Das tut weh. Aber ein Nein von einem Kind heißt nicht, dass mich niemand mag. Ich hole mir Unterstützung.“', w: '🌦️', feel: 'verletzt – aber nicht allein',
        then: 'Du sagst: „Stopp, das ist unfair.“ Dann gehst du zu einem Freund oder zu einer Lehrerin.', ask: 'Wer könnte dir in so einem Moment helfen?' },
      { label: '„Da kann man nichts machen. Ich muss das hinnehmen.“', w: '🌧️', feel: 'traurig und hilflos',
        then: 'Du sagst nichts. Morgen passiert vielleicht dasselbe.', ask: 'Stimmt es, dass man nichts machen kann? Was liegt hier in deiner Hand?' }],
    cards: [{ id: 'a', zone: 'out', text: 'Was das andere Kind gerade gesagt hat.' }, { id: 'b', zone: 'me', text: 'Ob ich „Stopp“ sage und mir Hilfe hole.' }, { id: 'c', zone: 'try', text: 'Ob wir zusammen eine faire Regel finden.' }],
    advice: 'Was andere tun, bestimmst du nicht. Aber hinnehmen musst du Ausgrenzung nicht: Stopp sagen und Hilfe holen liegt in deiner Hand. Und dein Wert hängt nicht davon ab, ob dich alle mögen.' }
];

const SORT = [   // Meisterrunde: acht Karten nacheinander
  { id: 's1', zone: 'me',  text: 'Ob ich um Hilfe bitte.', why: 'Die Bitte ist deine eigene Handlung. Wenn sie schwerfällt, darf dir jemand dabei helfen.' },
  { id: 's2', zone: 'out', text: 'Ob es morgen regnet.', why: 'Am Wetter kann niemand etwas ändern. Du kannst aber überlegen, wie du dich vorbereitest.' },
  { id: 's3', zone: 'try', text: 'Ob unsere Gruppe eine faire Regel vereinbart.', why: 'Du kannst eine Regel vorschlagen und zuhören. Für die Vereinbarung braucht es auch die anderen.' },
  { id: 's4', zone: 'out', text: 'Was gestern passiert ist.', why: 'Das Vergangene kann niemand ändern. In deiner Hand liegt, was du heute daraus machst.' },
  { id: 's5', zone: 'me',  text: 'Ob ich nach einer Niederlage gratuliere.', why: 'Das ist dein eigener Schritt. Der Ärger darf trotzdem noch da sein.' },
  { id: 's6', zone: 'try', text: 'Ob jemand meinen Vorschlag annimmt.', why: 'Du kannst deinen Vorschlag gut erklären. Die andere Person entscheidet selbst.' },
  { id: 's7', zone: 'try', text: 'Ob ich im Diktat null Fehler habe.', why: 'Üben hilft sehr. Sicher ist das Ergebnis trotzdem nicht. Dein Üben liegt in deiner Hand – die Note nicht ganz.' },
  { id: 's8', zone: 'me',  text: 'Ob ich erst durchatme, bevor ich antworte.', why: 'Innehalten ist dein eigener Schritt. Man kann ihn üben.' }
];

const PLAN = [
  ['1 · STOPP: Mein Gefühl und mein erster Gedanke', 'Ich bin … / Ich denke zuerst …'],
  ['2 · PRÜFEN: Was liegt nicht in meiner Hand?', 'Ich kann nicht bestimmen, ob …'],
  ['3 · HANDELN: Mein nächster Schritt – und wer mir hilft', 'Ich könnte … / Hilfe bekomme ich bei …']
];

const TEACHER = `
<p><b>Kern:</b> Epiktet unterscheidet, was in unserer Hand liegt (unser Urteilen, Wollen und beabsichtigtes Handeln) und was nicht (Körper, Besitz, Ansehen, äußere Ereignisse, andere Menschen). Dazu kommt sein Satz: Nicht die Dinge selbst beunruhigen uns, sondern unsere Urteile über die Dinge.</p>
<p><b>Ablauf (2 bis 3 Abschnitte von je 20–30 Minuten):</b> 1. Kennenlernen mit „Wahr oder erfunden?“. 2. Die Geschichte von der gestohlenen Lampe und die zwei Bereiche. 3. Drei Alltagsfälle, jeweils mit Gedanken-Wetter und Hand-Prüfung. 4. Meisterrunde: acht Karten ordnen. 5. Drei-Schritte-Plan zum Ausdrucken.</p>
<p><b>Gedanken-Wetter:</b> Das Ereignis bleibt gleich, der Gedanke ändert sich – und damit Stimmung und nächster Schritt. Das ist eine Übung, kein Schalter: Erste Gefühle und spontane Gedanken lassen sich nicht einfach abstellen. Innere Ruhe ist keine Pflicht zur Fröhlichkeit.</p>
<p><b>Lernhilfe:</b> Das mittlere Feld „Das kann ich versuchen“ ist eine moderne Ergänzung, keine Kategorie Epiktets. Sie verhindert, dass Zusammenarbeit und Einfluss übersehen werden. Regel für die Karten: „versuchen“, wenn ich etwas dafür tun kann und andere oder der Zufall mitentscheiden; „bestimme ich nicht“, wenn ich nichts daran ändern kann. Abweichende, gut begründete Zuordnungen sind ein Gesprächsanlass.</p>
<p><b>Ungerechtigkeit:</b> Ausgrenzung muss nicht hingenommen werden. Ein Kind ist nicht dafür verantwortlich, wie andere es behandeln. Schutz und Hilfe durch Erwachsene gehören ausdrücklich zu den Handlungsmöglichkeiten. Hier geht der Unterricht bewusst über einen strengen Stoizismus hinaus.</p>
<p><b>Sammelstücke:</b> Für jeden untersuchten Gedanken gibt es eine Lampe – nie für eine Meinung. Die Lampen-Geschichte ist überliefert: Epiktet ersetzte seine gestohlene Eisenlampe durch eine aus Ton.</p>
<p>Epiktets Sätze sind vereinfachte, sinngemäße Darstellungen. Nichts wird gespeichert oder versendet. Keine Namen oder vertraulichen Daten in den Plan schreiben.</p>`;


/* ---------- TEIL 2: ABLAUF ---------- */

const theCase = () => CASES[state.ci];

const STEPS = {

  intro() {
    figure(true);
    heading('STATION EPIKTET', 'Was liegt in meiner Hand?');
    say('Setzt euch zu mir in den Hof. Bei mir lernt ihr etwas für Tage, an denen nichts so läuft, wie ihr es wollt.');
    note('Eure Aufgabe: Untersucht Epiktets Gedanken und sammelt dabei sechs Lampen. Was es mit der Lampe auf sich hat, erzählt er euch gleich.');
    button('Wer ist Epiktet? →', () => go('facts'));
  },

  facts() {
    figure(true);
    truthGame(FACTS, 'facts', 'EPIKTET ERZÄHLT', () => go('lamp', () => award('kennen')));
  },

  lamp() {
    figure(true);
    const pick = state.lamp === null ? null : LAMP[state.lamp];
    const card = el('div', 'bigcard', '', stage); card.dataset.read = '1';
    el('small', '', 'EINE WAHRE GESCHICHTE', card);
    el('span', '', 'Eines Nachts hörte ich ein Geräusch. Am Morgen war meine schöne Lampe aus Eisen fort. Gestohlen!', card);
    heading('EPIKTETS LAMPE', 'Was habe ich wohl gedacht?', pick ? '' : 'Ratet gemeinsam und begründet.');
    LAMP.forEach((l, i) => { const b = button(l.label, () => { sfx(l.ok ? 'good' : 'tap'); act(st => { st.lamp = i; }); }, 'choice'); b.setAttribute('aria-pressed', state.lamp === i); });
    if (pick) {
      say(pick.reply);
      if (pick.ok) button('Epiktets große Idee →', () => go('idea'));
      else note('Probiert einen anderen Gedanken aus!');
    }
  },

  idea() {
    figure(true);
    const box = el('div', 'realms', '', stage); box.dataset.read = '1';
    [['✋', 'Liegt in meiner Hand', 'was ich denke · was ich will · was ich als Nächstes tue'], ['☁️', 'Liegt nicht in meiner Hand', 'das Wetter · was andere sagen und tun · ob ich gewinne · was schon passiert ist']]
      .forEach(([i, b, t]) => { const d = el('div', 'realm', '', box); el('i', '', i, d); el('b', '', b, d); el('span', '', t, d); });
    heading('EPIKTETS GROSSE IDEE', 'Zwei Bereiche');
    say('Manches liegt in unserer Hand, anderes nicht. Unruhig wird, wer bestimmen will, was er nicht bestimmen kann. Und merkt euch: Nicht die Dinge selbst machen uns unruhig – sondern das, was wir über sie denken.');
    note('Gefühle dürfen da sein. Epiktets Idee ist eine Übung, kein Schalter zum Abstellen.');
    talk('Gespräch: Stimmt das?', 'Kann derselbe Regen für ein Kind schlimm und für ein anderes schön sein? Woran liegt das?');
    button('An Alltagsfällen ausprobieren →', () => go('hub', () => award('lampe')));
  },

  hub() {
    figure(true);
    heading('UNSER ALLTAG', 'Drei Tage, an denen etwas schiefgeht');
    say('Wählt einen Fall. Wir prüfen jedes Mal zwei Dinge: Was denke ich darüber? Und was liegt in meiner Hand?');
    CASES.forEach((c, i) => {
      const seen = state.seen.includes(c.id), b = button('', () => go('case', st => { st.ci = i; st.phase = 'story'; st.t = null; st.seenT = []; st.hand = freshPlacer(); }), 'casecard' + (seen ? ' seen' : ''));
      const im = el('img', '', '', b); im.src = c.img; im.alt = '';
      const d = el('div', '', '', b); el('strong', '', c.title, d); el('small', '', c.kind + (seen ? ' · untersucht ✓' : ''), d);
    });
    button('Weiter: Die Meisterrunde →', () => go('sort', st => { st.sort = freshPlacer(); }), state.seen.length ? 'primary' : 'secondary');
  },

  case() {
    const c = theCase();
    if (state.phase === 'story') {
      picture(c.img, c.alt);
      heading('DIE SITUATION', c.title, c.story);
      note(c.feeling);
      talk('Gespräch: Was ist passiert? Was fühlen die Kinder?', 'Was ist passiert? Was könnten die Beteiligten fühlen? Was wissen wir noch nicht?');
      button('Zum Gedanken-Wetter →', () => act(st => { st.phase = 'weather'; }));
    }
    if (state.phase === 'weather') {
      picture(c.img, c.alt);
      const th = state.t === null ? null : c.thoughts[state.t];
      if (state.seenT.length === 3) el('div', 'alldone', 'Das Ereignis war dreimal dasselbe. Anders war nur der Gedanke.', stage);
      const chain = el('div', 'chain', '', stage); chain.dataset.read = '1';
      const f = el('div', 'fact', '', chain); el('small', '', 'DAS IST PASSIERT', f); f.append(c.fact);
      el('div', 'arrow', '→', chain);
      const m = el('div', 'mood' + (th ? '' : ' empty'), '', chain);
      if (th) { el('span', 'w', th.w, m); const x = el('div', '', '', m); el('small', '', 'STIMMUNGS-WETTER', x); x.append(th.feel); }
      else m.append('Welcher Gedanke kommt dazu?');
      heading('GEDANKEN-WETTER', 'Ein Ereignis – drei Gedanken', th ? '' : 'Tippt einen Gedanken an. Beobachtet das Stimmungs-Wetter im Bild.');
      c.thoughts.forEach((x, i) => {
        const b = button(x.label, () => { sfx('step'); act(st => { st.t = i; if (!st.seenT.includes(i)) st.seenT.push(i); }); }, 'choice' + (state.seenT.includes(i) ? ' seen' : ''));
        b.setAttribute('aria-pressed', state.t === i);
      });
      if (th) { const o = el('div', 'outcome'); el('strong', '', 'DANN PASSIERT VIELLEICHT', o); el('p', '', th.then, o); talk('Gespräch: ' + th.ask, th.ask); }
      if (state.seenT.length >= 2) button('Was liegt in meiner Hand? →', () => act(st => { st.phase = 'hand'; }));
    }
    if (state.phase === 'hand') {
      wide();
      const r = placer({ key: 'hand', zones: ZONES, items: c.cards, answer: Object.fromEntries(c.cards.map(x => [x.id, x.zone])), doneText: 'Geordnet! Wo würdet ihr eure Kraft einsetzen?' });
      heading('DIE HAND-PRÜFUNG', r.done ? 'Alles geordnet!' : 'Was liegt in meiner Hand?');
      if (!r.done) {
        el('p', '', 'Begründet erst. Tippt dann eine Karte und ihr Feld an – oder zieht die Karte hinüber.');
        if (r.lastWrong) note('Prüft noch einmal: Kannst du das ganz allein entscheiden? Kannst du etwas dafür tun? Oder gar nichts daran ändern?');
      } else {
        say('Seht ihr? Für das rechte Feld lohnt sich kein Grübeln. Die Kraft gehört nach links.');
        button('Epiktets Rat →', () => act(st => { st.phase = 'advice'; }));
      }
    }
    if (state.phase === 'advice') {
      picture(c.img, c.alt);
      heading('EPIKTETS RAT', c.title);
      say(c.advice);
      note(c.feeling);
      talk('Gespräch: Hilft euch dieser Rat?', 'Würde euch Epiktets Rat in dieser Situation helfen? Was fehlt euch daran?');
      button('Fall abschließen →', () => go('hub', st => { if (!st.seen.includes(c.id)) st.seen.push(c.id); award(c.id); }));
    }
  },

  sort() {
    wide();
    const r = placer({ key: 'sort', queue: true, zones: ZONES, items: SORT, answer: Object.fromEntries(SORT.map(x => [x.id, x.zone])), doneText: 'Alle acht Karten sind geordnet!' });
    const n = Object.keys(state.sort.placed).length, last = SORT.find(x => x.id === state.sort.last);
    heading(`MEISTERRUNDE · ${Math.min(n + 1, SORT.length)} / ${SORT.length}`, r.done ? 'Geschafft!' : 'Liegt das in meiner Hand?');
    if (r.lastWrong) note('Prüft noch einmal: Ganz allein entscheiden? Etwas dafür tun? Oder nichts daran ändern?');
    else if (last) { const o = el('div', 'outcome'); el('strong', '', 'ZULETZT: ' + last.text.toUpperCase(), o); el('p', '', last.why, o); }
    else el('p', '', 'Begründet erst. Zieht die Karte dann in ein Feld – oder tippt erst die Karte und dann das Feld an.');
    talk('Andere Meinung? Darüber sprechen', 'Welche andere Zuordnung ließe sich begründen? Was müsste man dafür genauer wissen?');
    if (r.done) button('Unser Drei-Schritte-Plan →', () => go('plan', () => award('ordnen')));
  },

  plan() {
    figure(true);
    heading('UNSER PLAN', 'Stopp. Prüfen. Handeln.', 'Denkt an einen Ärger aus dem Alltag. Schreibt einen gemeinsamen Plan – ohne Namen.');
    PLAN.forEach(([t, ph], i) => { const l = el('label', '', t), input = el('textarea', '', '', l); input.value = state.plan[i]; input.placeholder = ph; input.oninput = () => { state.plan[i] = input.value; }; });
    button('Plan festhalten →', () => go('end', st => { st.done = true; }));
  },

  end() {
    figure(true);
    heading('STATION GESCHAFFT · UNSER GEDANKE', 'Nicht alles bestimmen – den nächsten Schritt finden.');
    say('Ruhe wächst, wenn ihr eure Kraft auf das richtet, was in eurer Hand liegt. Was überzeugt euch daran – und was nicht?');
    PLAN.forEach(([t], i) => { const o = el('div', 'outcome'); el('strong', '', t, o); el('p', '', state.plan[i] || 'Das überlegen wir noch gemeinsam.', o); });
    tokenBoard('Unsere Lampen');
    button('Plan drucken / als PDF speichern', () => window.print());
    button('Plan überarbeiten', () => go('plan'), 'secondary');
    button('Später: Was hat geholfen?', () => go('review'), 'secondary');
    if (prevStep !== 'end') celebrate();
  },

  review() {
    figure(true);
    heading('NACH DEM AUSPROBIEREN', 'Was hat euch geholfen?', 'Niemand muss Persönliches erzählen. Ihr könnt auch ein erfundenes Beispiel besprechen.');
    ['Welches Gefühl war da?', 'Was konntet ihr entscheiden oder versuchen?', 'Was lag nicht in eurer Hand?', 'Welche Hilfe hat genützt oder gefehlt?'].forEach(t => button(t, () => openPause(t), 'choice'));
    button('Zurück zum Plan', () => go('end'), 'secondary');
  }
};

setup({
  station: 'epiktet', title: 'Was liegt in meiner Hand? · Epiktet', name: 'Epiktet', speaker: 'EPIKTET',
  place: 'EPIKTETS LEHRHOF', bg: 'assets/hof.webp', figure: 'assets/epiktet.webp',
  tokens: TOKENS, tokenIcon: 'lampe', tokenName: 'Lampen', tokenToast: 'NEUE LAMPE',
  profile: PROFILE, teacher: TEACHER, start: 'intro',
  fresh: () => ({ facts: { i: 0, answer: null }, lamp: null, ci: 0, phase: 'story', t: null, seenT: [], hand: freshPlacer(), seen: [], sort: freshPlacer(), plan: ['', '', ''] }),
  chapters: [['Kennenlernen', 'intro'], ['Die Lampe', 'lamp'], ['Alltag', 'hub'], ['Ordnen', 'sort'], ['Mein Plan', 'plan']],
  info: { intro: [0, 'Ankommen'], facts: [0, 'Wahr oder erfunden?'], lamp: [1, 'Epiktets Lampe'], idea: [1, 'Zwei Bereiche'], hub: [2, 'Drei Alltagsfälle'], case: [2, 'Gedanken-Wetter und Hand-Prüfung'],
    sort: [3, 'Meisterrunde'], plan: [4, 'Stopp · Prüfen · Handeln'], end: [4, 'Unser Plan'], review: [4, 'Nach dem Ausprobieren'] },
  steps: STEPS
});
