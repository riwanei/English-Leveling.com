// =====================================================================
// La Chambre Hors du Temps : un autre univers pour s'entraîner dur.
// Une journée dehors = une année dedans. Quatre entraînements par niveau :
// écoute, lecture, dictée, traduction, ou les quatre à la suite.
// =====================================================================
import { $, esc, shuffle, pick } from "./util.js";
import { S, save } from "./state.js";
import { play } from "./cinema.js";
import { LEVELS, TRAIN } from "./chamber-content.js";

const RATIO = 365;   // 1 jour dehors = 1 an dedans
const XP_OK = 20;    // XP par bonne réponse (le double d'un donjon)
const MODES = {
  listen: { name: "Compréhension orale", short: "Écoute", stat: "per", desc: "Un texte lu à voix haute, puis des questions. Le texte reste caché." },
  read: { name: "Compréhension écrite", short: "Lecture", stat: "lex", desc: "Un texte à lire attentivement, puis des questions." },
  dict: { name: "Dictée", short: "Dictée", stat: "mem", desc: "Écoute une phrase et écris-la mot pour mot." },
  write: { name: "Expression écrite", short: "Traduction", stat: "syn", desc: "Traduis une phrase française en anglais." }
};

const canSpeak = "speechSynthesis" in window;
function say(t, slow) {
  if (!canSpeak) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "en-GB"; u.rate = slow ? .7 : .9; speechSynthesis.speak(u); } catch (e) { }
}
// Compare deux phrases : casse, ponctuation, apostrophes et espaces ignorés
const clean = s => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:"«»()]/g, " ").replace(/\s+/g, " ").trim();

let api = null, room = null, clock = null;
export const inRoom = () => !!room;

function chamberState() {
  S.chamber = Object.assign({ lvl: "A1", runs: 0, days: 0, best: {} }, S.chamber || {});
  return S.chamber;
}
function insideTime(ms) {
  const m = Math.floor(ms * RATIO / 60000), d = Math.floor(m / 1440);
  return { d, h: Math.floor(m % 1440 / 60), m: m % 60 };
}
const fmtClock = t => `Jour ${t.d + 1} · ${String(t.h).padStart(2, "0")}:${String(t.m).padStart(2, "0")}`;
function fmtSpan(ms) {
  const d = ms * RATIO / 86400000;
  if (d < 1) return Math.max(1, Math.round(d * 24)) + " h";
  if (d < 60) return Math.round(d) + " jour" + (Math.round(d) > 1 ? "s" : "");
  return Math.round(d / 30) + " mois";
}

// ---------- Onglet (dans le monde réel) ----------
export function viewChamber(v, a) {
  api = a; const C = chamberState();
  v.innerHTML = `<section class="win chamber-door"><div class="tag">Porte scellée</div>
    <h2 style="margin-top:6px">La Chambre Hors du Temps</h2>
    <p class="mute" style="margin-top:8px">Un monde blanc et sans fin, coupé du reste. Ici, <b>une journée dehors dure une année</b>. Pas de pouvoirs, pas de vies : seulement l'entraînement, deux fois plus d'XP par bonne réponse.</p>
    <div class="chamber-modes">${Object.values(MODES).map(m => `<div><b>${m.name}</b><span class="mute small">${m.desc}</span></div>`).join("")}</div>
    <div class="actions left"><button class="btn main" id="enter">Entrer dans la Chambre</button>
    <span class="mute small">${C.runs ? `${C.runs} entraînement${C.runs > 1 ? "s" : ""} · ${C.days} jour${C.days > 1 ? "s" : ""} passés à l'intérieur` : "Personne ne t'y attend."}</span></div></section>`;
  $("#enter").onclick = enter;
}

function enter() {
  play("chamber-in").then(() => {
    room = { since: Date.now(), run: null };
    document.body.classList.add("world-chamber");
    hub();
    clearInterval(clock); clock = setInterval(tickClock, 1000);
  });
}
function leave() {
  const spent = Date.now() - room.since;
  const C = chamberState(); C.days += Math.floor(spent * RATIO / 86400000); save();
  clearInterval(clock); try { speechSynthesis.cancel(); } catch (e) { }
  play("chamber-out", { outside: Math.max(1, Math.round(spent / 60000)), inside: fmtSpan(spent) }).then(() => {
    room = null; document.body.classList.remove("world-chamber"); api.pushProgress(); api.shell();
  });
  // le décor revient au monde réel pendant la cinématique
  setTimeout(() => document.body.classList.remove("world-chamber"), 400);
}
function tickClock() { const c = $("#clock"); if (c && room) c.textContent = fmtClock(insideTime(Date.now() - room.since)); }

// ---------- Le hall de la Chambre ----------
function frame(inner) {
  const app = $("#app"); app.classList.add("narrow");
  app.innerHTML = `<header class="chamber-head"><div><div class="tag">Univers : Chambre Hors du Temps</div><h1 class="chamber-title">La Chambre</h1></div>
    <div class="chamber-clock"><span class="mute small">Temps écoulé ici</span><b id="clock">${fmtClock(insideTime(Date.now() - room.since))}</b></div></header>${inner}`;
}
function hub() {
  room.run = null; const C = chamberState();
  frame(`<section class="win"><div class="tag">Intensité</div>
      <div class="glist" style="margin-top:10px" role="group" aria-label="Niveau">${LEVELS.map(l => `<button class="gchip" data-l="${l.id}" aria-pressed="${C.lvl === l.id}">${l.id} · ${l.name}</button>`).join("")}</div>
      <p class="mute small" style="margin-top:8px">${LEVELS.find(l => l.id === C.lvl).desc}</p></section>
    <section class="win"><div class="tag">Programme complet</div>
      <p style="margin-top:6px">Les quatre épreuves à la suite : écoute, lecture, dictée, traduction. Bonus de +60 XP si tu vas au bout.</p>
      <div class="actions left"><button class="btn main" data-m="full">Commencer l'entraînement complet</button></div></section>
    <div class="gates chamber-grid">${Object.entries(MODES).map(([k, m]) => `<button class="gate" data-m="${k}"><span class="lv"><span>${m.short}</span><em>${C.best[C.lvl + k] != null ? "Record " + C.best[C.lvl + k] + " %" : ""}</em></span><h3>${m.name}</h3><p>${m.desc}</p></button>`).join("")}</div>
    ${canSpeak ? "" : `<p class="note">Ton navigateur ne sait pas lire à voix haute : l'écoute affichera le texte et la dictée sera remplacée par de la traduction.</p>`}
    <div class="actions"><button class="btn danger" id="leave">Quitter la Chambre</button></div>`);
  document.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { C.lvl = b.dataset.l; save(); hub(); });
  document.querySelectorAll("[data-m]").forEach(b => b.onclick = () => startRun(b.dataset.m));
  $("#leave").onclick = leave;
}

// ---------- Construction d'une séance ----------
function passageSteps(kind, p) {
  return p.qs.map((q, i) => ({ kind, p, i, q: q[0], ans: q[1], opts: shuffle(q.slice(1)) }));
}
function buildRun(mode, lvl) {
  const T = TRAIN[lvl]; let steps = [];
  const dictKind = canSpeak ? "dict" : "write";
  const dict = n => shuffle(T.dict).slice(0, n).map(s => ({ kind: "dict", text: s }));
  const write = n => shuffle(T.write).slice(0, n).map(l => { const [fr, ...en] = l.split("|"); return { kind: "write", fr, en }; });
  if (mode === "listen") T.listen.forEach(p => steps.push(...passageSteps("listen", p)));
  if (mode === "read") T.read.forEach(p => steps.push(...passageSteps("read", p)));
  if (mode === "dict") steps = canSpeak ? dict(6) : write(6);
  if (mode === "write") steps = write(6);
  if (mode === "full") steps = [...passageSteps("listen", pick(T.listen)), ...passageSteps("read", pick(T.read)), ...(dictKind === "dict" ? dict(3) : write(3)), ...write(3)];
  return steps;
}
function startRun(mode) {
  const lvl = chamberState().lvl;
  room.run = { mode, lvl, steps: buildRun(mode, lvl), n: 0, ok: 0, done: false, byKind: {} };
  step();
}

// ---------- Une épreuve ----------
function step() {
  const r = room.run, s = r.steps[r.n]; s.answered = false;
  const m = MODES[s.kind];
  const head = `<div class="hud"><span class="tag">${m.name} · ${r.lvl}</span><span class="mute">Épreuve ${r.n + 1}/${r.steps.length}</span><span style="color:var(--gold)">+${r.ok * XP_OK} XP</span></div>
    <div class="bar"><i style="width:${r.n / r.steps.length * 100}%"></i></div>`;
  let body = "";
  if (s.kind === "listen") body = `<div class="passage listen"><div class="tag">${esc(s.p.title)}</div>
      ${canSpeak ? `<div class="actions left"><button class="btn" id="play">Écouter</button><button class="btn sm" id="slow">Plus lentement</button></div>
      <details class="small mute" style="margin-top:10px"><summary>Afficher le texte (seulement en dernier recours)</summary><p style="margin-top:6px">${esc(s.p.text)}</p></details>`
      : `<p>${esc(s.p.text)}</p>`}</div>`;
  if (s.kind === "read") body = `<div class="passage"><div class="tag">${esc(s.p.title)}</div><p>${esc(s.p.text)}</p></div>`;
  if (s.kind === "listen" || s.kind === "read") body += `<p class="q-ask">${esc(s.q)}</p>
      <div class="choices">${s.opts.map((o, i) => `<button class="btn choice" data-o="${esc(o)}"><small>${i + 1}</small>${esc(o)}</button>`).join("")}</div>`;
  if (s.kind === "dict") body = `<div class="passage listen"><div class="actions left"><button class="btn" id="play">Écouter la phrase</button><button class="btn sm" id="slow">Plus lentement</button></div></div>
      <div class="fields one"><div><label for="a1">Ce que tu entends</label><input type="text" id="a1" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
      <div class="actions"><button class="btn main" id="go">Valider</button></div>`;
  if (s.kind === "write") body = `<p class="q-ask">« ${esc(s.fr)} »</p>
      <div class="fields one"><div><label for="a1">En anglais</label><input type="text" id="a1" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
      <div class="actions"><button class="btn main" id="go">Valider</button></div>`;
  frame(`${head}<section class="win" id="qwin">${body}<div id="fb"></div></section>
    <div class="actions"><button class="linkbtn" id="stop">Arrêter et revenir au hall</button></div>`);
  $("#stop").onclick = () => { try { speechSynthesis.cancel(); } catch (e) { } hub(); };
  const audio = s.kind === "listen" ? s.p.text : s.text;
  if ($("#play")) { $("#play").onclick = () => say(audio); $("#slow").onclick = () => say(audio, true); }
  // lecture automatique : chaque phrase de dictée, et le texte d'écoute à sa première question
  if (s.kind === "dict" || (s.kind === "listen" && s.i === 0 && canSpeak)) setTimeout(() => say(audio), 350);
  document.querySelectorAll(".choice").forEach(b => b.onclick = () => answerChoice(b));
  const a1 = $("#a1");
  if (a1) { a1.focus(); a1.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); answerText(); } }; $("#go").onclick = answerText; }
}

function answerChoice(btn) {
  const r = room.run, s = r.steps[r.n]; if (s.answered) return;
  const ok = btn.dataset.o === s.ans;
  document.querySelectorAll(".choice").forEach(b => { b.disabled = true; if (b.dataset.o === s.ans) b.classList.add("good"); else if (b === btn) b.classList.add("bad"); });
  result(ok, ok ? "" : `La bonne réponse était : <b>${esc(s.ans)}</b>.`);
}
function answerText() {
  const r = room.run, s = r.steps[r.n]; if (s.answered) return;
  const v = $("#a1").value; if (!v.trim()) { const w = $("#qwin"); w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake"); return; }
  $("#a1").disabled = true;
  if (s.kind === "dict") {
    const ok = clean(v) === clean(s.text);
    result(ok, ok ? `« ${esc(s.text)} »` : `Phrase exacte : « ${esc(s.text)} »<br>${wordDiff(v, s.text)}`);
  } else {
    const ok = s.en.some(e => clean(e) === clean(v));
    result(ok, ok ? (clean(s.en[0]) !== clean(v) ? `Autre façon de le dire : « ${esc(s.en[0])} ».` : "") : `Réponse attendue : « ${esc(s.en[0])} »${s.en.length > 1 ? `<br><span class="mute">Aussi accepté : ${s.en.slice(1, 3).map(e => "« " + esc(e) + " »").join(", ")}</span>` : ""}`);
  }
}
// Montre les mots manquants ou faux de la dictée
function wordDiff(given, target) {
  const g = clean(given).split(" "), t = clean(target).split(" ");
  const miss = t.filter((w, i) => g[i] !== w);
  return miss.length ? `<span class="mute">À revoir : ${[...new Set(miss)].map(w => `<b>${esc(w)}</b>`).join(", ")}</span>` : "";
}

function result(ok, detail) {
  const r = room.run, s = r.steps[r.n]; s.answered = true;
  const k = r.byKind[s.kind] = r.byKind[s.kind] || { ok: 0, n: 0 }; k.n++;
  if (ok) { r.ok++; k.ok++; S.stats[MODES[s.kind].stat]++; S.total++; S.daily.correct++; }
  else $("#qwin").classList.add("shake");
  save();
  const last = r.n + 1 >= r.steps.length;
  $("#fb").innerHTML = `<div class="feedback ${ok ? "" : "bad"}"><b>${ok ? "Juste." : "Raté."}</b> ${detail}</div>
    <div class="actions"><button class="btn main" id="nx">${last ? "Voir le bilan" : "Continuer"}</button></div>`;
  const nx = $("#nx"); nx.focus(); nx.onclick = () => { r.n++; last ? finishRun() : step(); };
}

function finishRun() {
  const r = room.run, C = chamberState();
  const pct = Math.round(r.ok / r.steps.length * 100);
  const bonus = r.mode === "full" ? 60 : 0, xp = r.ok * XP_OK + bonus;
  C.runs++; const key = r.lvl + r.mode;
  if (r.mode !== "full") C.best[key] = Math.max(C.best[key] || 0, pct);
  S.daily.runs++; save();
  frame(`<section class="win result"><span class="tag">[ Entraînement terminé ]</span>
    <h2>${r.mode === "full" ? "Programme complet" : MODES[r.mode].name} · ${r.lvl}</h2>
    <div class="big">+${xp} XP</div>
    <div class="mute">${r.ok} / ${r.steps.length} réussies (${pct} %)${bonus ? ` · bonus +${bonus}` : ""}</div>
    <div class="list">${Object.entries(r.byKind).map(([k, v]) => `<div>${MODES[k].name} : <b>${v.ok} / ${v.n}</b></div>`).join("")}</div>
    <p class="mute small">${pct >= 80 ? "Ton corps s'habitue à la gravité de la Chambre. Monte d'intensité." : pct >= 50 ? "Le Système note des progrès. Recommence pour les ancrer." : "La Chambre est impitoyable. Recommence au même niveau."}</p>
    <div class="actions"><button class="btn" id="back">Retour au hall</button><button class="btn main" id="again">Recommencer</button></div></section>`);
  $("#back").onclick = hub; $("#again").onclick = () => startRun(r.mode); $("#again").focus();
  api.gainXp(xp); api.progressQuests(); save(); api.pushProgress();
}
