// =====================================================================
// English Leveling — moteur du jeu (onglets, donjons, pouvoirs, XP)
// =====================================================================
import { $, esc, shuffle, pick, norm, lvl, rank, toast, today } from "./util.js";
import { S, save, fresh, replaceState, checkDay } from "./state.js";
import { CATS, GAMES, G, STATNAMES, QUESTS, POWERS } from "./content.js";
import { play, introSeen } from "./cinema.js";
import { cloud, initCloud, renderGuild, renderAccount, renderReviews, pushProgress, announceLevel } from "./cloud.js";

const app = $("#app");
const myLevel = () => lvl(S.xp).l;
const maxMana = () => Math.min(120, 40 + myLevel() * 4);

// ---------- XP, quêtes, série ----------
function gainXp(n) {
  const before = myLevel(); S.xp += n; const after = myLevel();
  if (after <= before) return;
  const r0 = rank(before), r1 = rank(after);
  // Cinématique : réévaluation si le rang change, sinon niveau supérieur
  play(r1[1] !== r0[1] ? "rank" : "levelup", { level: after, rank: r1 }).then(() =>
    POWERS.filter(p => p.lv > before && p.lv <= after)
      .forEach((p, i) => setTimeout(() => toast("Nouvelle compétence", `<b>${p.name}</b> débloquée.`, "mana"), 300 + i * 600)));
  announceLevel(after);
}
function progressQuests() {
  QUESTS.forEach(q => {
    if (!S.daily.claimed.includes(q.id) && (S.daily[q.id] || 0) >= q.goal) {
      S.daily.claimed.push(q.id); gainXp(q.xp);
      toast("Quête journalière", `« ${q.t} » accomplie. +${q.xp} XP`, "gold");
    }
  });
}
function markStreak() {
  if (S.lastDay === today()) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const ys = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
  S.streak = S.lastDay === ys ? S.streak + 1 : 1; S.lastDay = today();
}

// ---------- Lecture à voix haute (si le navigateur le permet) ----------
const canSpeak = "speechSynthesis" in window;
function speak(t) {
  if (!canSpeak) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t.replace(/___/g, "blank")); u.lang = "en-GB"; u.rate = .9; speechSynthesis.speak(u); } catch (e) { }
}

// ---------- Reconnaissance vocale (portes de prononciation) ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let micOff = !SR, recog = null;
function listen() {
  const q = R && R.q; if (!q || q.type !== "speak" || R.answered || recog) return;
  try { if (canSpeak) speechSynthesis.cancel(); } catch (e) { }
  recog = new SR(); recog.lang = "en-GB"; recog.interimResults = false; recog.maxAlternatives = 5;
  let got = false;
  const btn = $("#mic"); if (btn) { btn.disabled = true; btn.textContent = "J'écoute…"; }
  recog.onresult = e => {
    got = true;
    const best = [...e.results[0]].map(a => ({ t: a.transcript, s: q.score(a.transcript) })).sort((a, b) => b.s - a.s)[0];
    heardSpeech(q, best.t, best.s);
  };
  recog.onerror = e => {
    if (e.error === "not-allowed" || e.error === "service-not-allowed") { micOff = true; toast("Micro bloqué", "Autorise le micro dans ton navigateur, ou évalue-toi toi-même pour cette fois.", "mana"); }
  };
  recog.onend = () => {
    recog = null;
    if (!R || R.q !== q || R.answered) return;
    if (!got && !micOff) q.heard = { msg: "Je n'ai rien entendu. Approche-toi du micro et réessaie." };
    render();
  };
  try { recog.start(); } catch (e) { recog = null; micOff = true; render(); }
}
function heardSpeech(q, text, score) {
  q.heard = { text, pct: Math.round(score * 100) };
  const need = q.need - (q.eased ? .15 : 0);
  const done = ok => { q.fix = `Entendu : « ${esc(text)} » · ${q.heard.pct} %<br>` + q.fix; app.querySelectorAll("#mic, .heard").forEach(el => el.remove()); submit(ok); };
  if (score >= need) return done(true);
  q.tries++;
  if (q.tries >= 2) return done(false);
  q.heard.msg = `${q.heard.pct >= 40 ? "Presque !" : "Pas encore."} Il faut ${Math.round(need * 100)} % de mots reconnus. Réécoute le modèle et réessaie.`;
}

// =====================================================================
// ONGLETS
// =====================================================================
const TABS = [["status", "Statut"], ["gates", "Portes"], ["powers", "Pouvoirs"], ["guild", "Guilde"], ["reviews", "Avis"], ["account", "Compte"]];
let R = null, timerId = null;

function shell() {
  checkDay();
  const accountLabel = cloud.profile ? esc(cloud.profile.username) : cloud.session ? "Choisir mon pseudo" : "Se connecter";
  const L = lvl(S.xp), Rk = rank(L.l);
  app.classList.remove("narrow");
  app.innerHTML = `<header class="title-bar"><div><div class="tag">Le Système vous a choisi</div><h1 class="brand">English <span>Leveling</span></h1></div>
    <div class="head-right"><span class="mute">Niv. ${L.l} · Série ${S.streak} j</span>
    <button class="btn sm ${cloud.session ? "" : "main"}" id="accbtn">${accountLabel}</button></div></header>
    <div class="layout"><aside class="side">
      <nav aria-label="Sections">${TABS.map(([k, n]) => `<button data-tab="${k}" ${S.tab === k ? 'aria-current="page"' : ""}>${n}</button>`).join("")}</nav>
      <div class="mini" aria-hidden="true"><div class="mini-rank"><b>${Rk[1]}</b></div>
        <div><div class="lvl-sm">Niveau ${L.l}</div><div class="mute small">${Rk[2]}</div>
        <div class="bar"><i style="width:${L.into / L.need * 100}%"></i></div>
        <div class="mute small" style="margin-top:4px;font-variant-numeric:tabular-nums">${L.into} / ${L.need} XP</div></div></div>
    </aside>
    <div id="view" class="view-${S.tab}"></div></div>`;
  app.querySelectorAll("nav button").forEach(b => b.onclick = () => { S.tab = b.dataset.tab; save(); shell(); });
  $("#accbtn").onclick = () => { S.tab = "account"; save(); shell(); };
  const v = $("#view");
  ({ status: viewStatus, gates: viewGates, powers: viewPowers, guild: () => renderGuild(v), reviews: () => renderReviews(v), account: () => renderAccount(v) })[S.tab]();
}

function viewStatus() {
  const L = lvl(S.xp), Rk = rank(L.l);
  const rec = GAMES.filter(g => !g.boss).find(g => !S.best[g.id]) || pick(GAMES);
  $("#view").innerHTML = `<section class="win" aria-label="Fenêtre de statut"><div class="tag" style="margin-bottom:8px">Statut</div>
    <div class="status"><div class="rank" aria-label="Rang ${Rk[1]}"><b>${Rk[1]}</b></div>
      <div><div class="lvl">Niveau ${L.l}</div><div class="mute">${Rk[2]}</div>
      <div class="bar" aria-label="Expérience"><i style="width:${L.into / L.need * 100}%"></i></div>
      <div class="mute small" style="margin-top:4px;font-variant-numeric:tabular-nums">${L.into} / ${L.need} XP · ${S.total} bonnes réponses au total</div></div></div>
    <div class="stats">${Object.keys(STATNAMES).map(k => `<div class="stat"><span>${STATNAMES[k]}</span><b>${S.stats[k]}</b></div>`).join("")}</div></section>
  <section class="win" aria-label="Quêtes journalières"><div class="tag">Quête journalière · Préparation pour devenir fort</div>
    <div class="quests">${QUESTS.map(q => {
      const val = Math.min(S.daily[q.id] || 0, q.goal), d = S.daily.claimed.includes(q.id);
      return `<div class="quest ${d ? "done" : ""}"><span class="t">${d ? "✓ " : ""}${q.t} <span class="mute">(${val}/${q.goal})</span></span><span class="r">+${q.xp} XP</span><div class="bar"><i style="width:${val / q.goal * 100}%"></i></div></div>`;
    }).join("")}</div>
    <p class="mute small" style="margin-top:12px">Les quêtes se réinitialisent à minuit. Le Système observe.</p></section>
  <section class="win"><div class="tag">Porte conseillée</div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:8px">
    <div style="min-width:0"><h3>${rec.name}</h3><p class="mute small">${rec.cat === "S" ? "Porte rouge" : rec.cat === "SS+" ? "Rang SS+" : "Niveau " + rec.cat} · ${rec.desc}</p></div>
    <button class="btn main" id="rec">Entrer</button></div></section>
  ${S.total >= 20 ? `<section class="win"><div class="tag">Ton avis compte</div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:8px">
    <p class="mute" style="min-width:0;flex:1 1 220px">Le jeu t'aide à progresser ? Dis-nous ce que tu en penses en 30 secondes.</p>
    <button class="btn" id="gorev">Donner mon avis</button></div></section>` : ""}
  ${cloud.session ? "" : `<p class="note">Ta progression est enregistrée dans ce navigateur. Crée un compte (onglet Compte) pour la retrouver sur tous tes appareils et rejoindre une guilde.</p>`}
  <p class="foot"><button class="linkbtn" id="reset">Réinitialiser ma progression</button></p>`;
  $("#rec").onclick = () => start(rec.id);
  if ($("#gorev")) $("#gorev").onclick = () => { S.tab = "reviews"; save(); shell(); };
  $("#reset").onclick = e => {
    if (e.target.dataset.sure) { replaceState(fresh()); pushProgress(); shell(); }
    else { e.target.dataset.sure = 1; e.target.textContent = "Confirmer la remise à zéro ?"; }
  };
}

function viewGates() {
  const v = $("#view");
  v.innerHTML = `<p class="mute">${GAMES.length} portes réparties sur les niveaux du cadre européen (CECR), du rang E au rang SS+. Commence où tu te sens à l'aise : toutes les portes sont ouvertes.</p>` +
    CATS.map(c => `<section aria-label="${c.name}"><div class="cat-head"><span class="cecr ${c.id === "S" ? "boss" : c.id === "SS+" ? "ss" : c.id === "C1" ? "elite" : ""}">${c.id}</span><h2>${c.name}</h2><span class="mute small">${c.id === "S" ? "" : "Portes de rang " + c.rank + " · "}${c.desc}</span></div>
    <div class="gates">${GAMES.filter(g => g.cat === c.id).map(g => {
      const b = S.best[g.id];
      const badge = g.boss ? (S.bestBoss ? "Record " + S.bestBoss : "") : b ? (b.perfect ? "★ Parfait" : "Record " + b.ok + "/10") : "";
      return `<button class="gate ${g.boss ? "boss" : g.cat === "SS+" ? "ss" : g.cat === "C1" ? "elite" : ""}" data-g="${g.id}"><span class="lv"><span>${STATNAMES[g.stat]}</span><em>${badge}</em></span><h3>${g.name}</h3><p>${g.desc}</p></button>`;
    }).join("")}</div></section>`).join("");
  v.querySelectorAll(".gate").forEach(b => b.onclick = () => start(b.dataset.g));
}

function viewPowers() {
  const L = myLevel();
  $("#view").innerHTML = `<section class="win"><div class="tag">Compétences</div>
    <p class="mute" style="margin-top:6px">Chaque donjon commence avec ta réserve de mana pleine (${maxMana()} MP au niveau ${L}). Chaque bonne réponse rend 5 MP. Les pouvoirs se débloquent en montant de niveau.</p></section>
    <div class="powers">${POWERS.map(p => `<div class="power ${L >= p.lv ? "" : "locked"}"><span class="meta">${L >= p.lv ? "Débloqué" : "Niveau " + p.lv + " requis"} · ${p.passive ? "Passif" : p.cost + " MP"}</span><h3>${p.name}</h3><p class="mute small">${p.desc}</p></div>`).join("")}</div>`;
}

// =====================================================================
// DONJON
// =====================================================================
function start(id) {
  markStreak(); const g = G[id];
  R = { g, n: 0, max: g.boss ? Infinity : 10, hp: g.hp || 3, maxHp: g.hp || 3, combo: 0, best: 0, ok: 0, xp: 0, errors: [], end: g.boss ? Date.now() + 75000 : null, mana: maxMana(), shield: false, dom: 0, revived: false };
  next();
  if (g.boss) { clearInterval(timerId); timerId = setInterval(tick, 200); }
}
function tick() {
  if (!R || !R.end) return;
  const left = Math.max(0, R.end - Date.now());
  const t = $("#tbar"); if (t) t.style.width = Math.min(100, left / 75000 * 100) + "%";
  const s = $("#tsec"); if (s) s.textContent = Math.ceil(left / 1000) + " s";
  if (left <= 0) { clearInterval(timerId); finish(true); }
}
const mult = () => 1 + Math.min(Math.floor(R.combo / 3), 4) * 0.5;

function next() {
  if (R.n >= R.max || R.hp <= 0) return finish(R.hp > 0);
  R.q = R.g.gen(); R.n++; R.answered = false; render();
}

function render() {
  const q = R.q, g = R.g, L = myLevel();
  const hud = `<div class="hud"><span class="tag">${g.name}</span>
    ${g.boss ? `<span id="tsec" style="color:var(--red)">${Math.ceil((R.end - Date.now()) / 1000)} s</span>` : `<span class="mute">Vague ${R.n}/${R.max}</span><span class="hp" aria-label="${R.hp} points de vie">${"♥".repeat(R.hp)}${"♡".repeat(Math.max(0, R.maxHp - R.hp))}</span>`}
    <span class="combo">Combo ×${mult()}</span><span style="color:var(--gold)">+${R.xp} XP</span></div>
    ${g.boss ? `<div class="timer"><i id="tbar" style="width:${Math.min(100, (R.end - Date.now()) / 75000 * 100)}%"></i></div>` : ""}`;
  const skills = `<div class="skillbar"><div class="manabox">MP ${R.mana}/${maxMana()}<div class="bar mana"><i style="width:${R.mana / maxMana() * 100}%"></i></div></div>
    ${POWERS.filter(p => !p.passive && L >= p.lv).map(p => {
      const off = R.mana < p.cost || R.answered || (p.id === "heal" && (g.boss || R.hp >= R.maxHp)) || (p.id === "shield" && R.shield);
      return `<button class="skill" data-p="${p.id}" ${off ? "disabled" : ""} title="${esc(p.desc)}">${p.name}<span>${p.cost}</span></button>`;
    }).join("")}
    <span class="buffs">${R.shield ? "Bouclier actif " : ""}${R.dom ? "Domination ×" + R.dom : ""}</span></div>`;
  let body = "";
  if (q.type === "verb") body = `<div class="fields"><div><label for="a1">Prétérit</label><input type="text" id="a1" autocomplete="off" autocapitalize="off" spellcheck="false"></div>
    <div><label for="a2">Participe passé</label><input type="text" id="a2" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
    <div class="actions"><button class="btn main" id="go">Attaquer</button></div>`;
  if (q.type === "input") body = `<div class="fields one"><div><label for="a1">Ta réponse</label><input type="text" id="a1" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
    <div class="actions"><button class="btn main" id="go">Attaquer</button></div>`;
  if (q.type === "choice") body = `<div class="choices">${q.opts.map((o, i) => `<button class="btn choice" data-o="${esc(o)}"><small>${i + 1}</small>${esc(o)}</button>`).join("")}</div>`;
  if (q.type === "speak") {
    const h = q.heard;
    const heard = h ? `<div class="heard">${h.text !== undefined ? `Entendu : « ${esc(h.text)} » · <b>${h.pct} %</b>` : ""}${h.msg ? `<span>${esc(h.msg)}</span>` : ""}</div>` : "";
    body = `<div class="say-tip">${esc(q.tip)}</div>${heard}` + (micOff
      ? `<p class="mute small say-off">${SR ? "Le micro n'est pas autorisé." : "Ton navigateur ne reconnaît pas la voix (essaie Chrome ou Edge)."} Écoute le modèle, répète la phrase à voix haute, puis sois honnête :</p>
        <div class="actions"><button class="btn" id="selfbad">J'ai eu du mal</button><button class="btn main" id="selfok">Je l'ai bien dite</button></div>`
      : `<div class="actions"><button class="btn main" id="mic">${q.tries ? "Réessayer" : "Parler"}</button></div>
        <p class="mute small say-off">Seuil de réussite : ${Math.round((q.need - (q.eased ? .15 : 0)) * 100)} % des mots reconnus · 2 essais par phrase</p>`);
  }
  if (q.type === "order") { q.built = q.built || []; body = `<div class="tiles answer" id="built"></div><div class="tiles" id="pool"></div>
    <div class="actions"><button class="btn" id="clr">Effacer</button><button class="btn main" id="go">Valider</button></div>`; }
  const spk = canSpeak && (q.en || q.speakText) ? `<button class="speak" id="spk" aria-label="Écouter la prononciation">Écouter</button>` : "";
  const prompt = esc(q.prompt).replace("___", '<span class="blank">&nbsp;</span>');
  app.classList.add("narrow");
  app.innerHTML = `${hud}<section class="win" id="qwin">${q.from ? `<div class="tag" style="text-align:center">${esc(q.from)}</div>` : ""}
    <div class="q-prompt ${q.prompt.length > 28 ? "long" : ""}">${prompt}</div><div class="q-sub">${esc(q.sub)} ${spk}</div>${body}<div id="fb"></div></section>
    ${skills}<div class="actions"><button class="linkbtn" id="quit">Fuir le donjon</button></div>`;
  $("#quit").onclick = () => { clearInterval(timerId); if (recog) recog.abort(); R = null; shell(); };
  if (spk) $("#spk").onclick = () => speak(q.speakText || q.prompt);
  app.querySelectorAll(".skill").forEach(b => b.onclick = () => usePower(b.dataset.p));
  if (q.type === "verb") {
    const a1 = $("#a1"), a2 = $("#a2"); a1.focus();
    a1.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); a2.focus(); } };
    a2.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); submit(); } };
    $("#go").onclick = () => submit();
  }
  if (q.type === "input") { const a1 = $("#a1"); a1.focus(); a1.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); submit(); } }; $("#go").onclick = () => submit(); }
  if (q.type === "choice") app.querySelectorAll(".choice").forEach(b => { b.onclick = () => submit(b); if (q.removed && q.removed.includes(b.dataset.o)) b.disabled = true; });
  if (q.type === "speak") {
    if ($("#mic")) $("#mic").onclick = listen;
    if ($("#selfok")) { $("#selfok").onclick = () => { q.heard = { msg: "Auto-évaluation" }; submit(true); }; $("#selfbad").onclick = () => { q.heard = { msg: "Auto-évaluation" }; submit(false); }; }
  }
  if (q.type === "order") { drawTiles(); $("#go").onclick = () => submit(); $("#clr").onclick = () => { if (!R.answered) { q.built = []; drawTiles(); } }; }
}

function drawTiles() {
  const q = R.q;
  $("#built").innerHTML = q.built.map((i, k) => `<button class="tile" data-k="${k}">${esc(q.words[i])}</button>`).join("") || `<span class="mute">Touche les mots dans l'ordre</span>`;
  $("#pool").innerHTML = q.words.map((w, i) => q.built.includes(i) ? "" : `<button class="tile" data-i="${i}">${esc(w)}</button>`).join("");
  $("#built").querySelectorAll(".tile").forEach(t => t.onclick = () => { if (R.answered) return; q.built.splice(+t.dataset.k, 1); drawTiles(); });
  $("#pool").querySelectorAll(".tile").forEach(t => t.onclick = () => { if (R.answered) return; q.built.push(+t.dataset.i); drawTiles(); });
}

function usePower(id) {
  const p = POWERS.find(x => x.id === id);
  if (!R || R.answered || R.mana < p.cost) return;
  const q = R.q;
  const v1 = $("#a1") ? $("#a1").value : "", v2 = $("#a2") ? $("#a2").value : "";
  if (id === "eye") {
    if (q.type === "choice") q.removed = shuffle(q.opts.filter(o => o !== q.ans && !(q.removed || []).includes(o))).slice(0, 2).concat(q.removed || []);
    else if (q.type === "verb") q.ph = [q.hint[0].slice(0, 2) + "…", q.hint[1].slice(0, 2) + "…"];
    else if (q.type === "speak") q.eased = true;
    else if (q.type === "input") q.ph = [q.hint.slice(0, Math.max(2, Math.ceil(q.hint.length / 3))) + "…"];
    else if (q.type === "order") {
      const target = q.ans.split(" "); q.built = [];
      for (let k = 0; k < Math.min(2, target.length); k++) {
        const i = q.words.findIndex((w, ix) => w === target[k] && !q.built.includes(ix));
        if (i >= 0) q.built.push(i);
      }
    }
  }
  if (id === "shield") R.shield = true;
  if (id === "heal") { if (R.g.boss || R.hp >= R.maxHp) return; R.hp++; }
  if (id === "dom") R.dom = 3;
  R.mana -= p.cost; S.daily.powers = (S.daily.powers || 0) + 1; save();
  toast("Compétence", `<b>${p.name}</b> activée.`, "mana");
  if (id === "haste") { if (R.g.boss) { R.end += 15000; render(); } else next(); return; }
  render();
  if ($("#a1")) { $("#a1").value = v1; if (q.ph) $("#a1").placeholder = q.ph[0]; }
  if ($("#a2")) { $("#a2").value = v2; if (q.ph) $("#a2").placeholder = q.ph[1]; }
}

function nudge() { const w = $("#qwin"); w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake"); }

function submit(btn) {
  if (R.answered) return;
  const q = R.q; let ok;
  if (q.type === "verb") { const a = $("#a1").value, b = $("#a2").value; if (!a.trim() || !b.trim()) return nudge(); ok = q.check(a, b); }
  if (q.type === "input") { const a = $("#a1").value; if (!a.trim()) return nudge(); ok = q.check(a); }
  if (q.type === "choice") {
    ok = btn.dataset.o === q.ans;
    app.querySelectorAll(".choice").forEach(b => { b.disabled = true; if (b.dataset.o === q.ans) b.classList.add("good"); else if (b === btn) b.classList.add("bad"); });
  }
  if (q.type === "speak") ok = btn === true;
  if (q.type === "order") { if (!q.built.length) return nudge(); ok = norm(q.built.map(i => q.words[i]).join(" ")) === norm(q.ans); }
  R.answered = true; app.querySelectorAll(".skill").forEach(b => b.disabled = true);
  const stat = R.g.boss ? "agi" : R.g.stat;
  if (ok) {
    R.combo++; R.best = Math.max(R.best, R.combo); R.ok++;
    let gain = Math.round((R.g.boss ? 15 : 10) * (R.g.xp || 1) * mult()); if (R.dom > 0) { gain *= 2; R.dom--; }
    R.xp += gain; R.mana = Math.min(maxMana(), R.mana + 5);
    S.stats[stat]++; S.total++; S.daily.correct++; if (q.key && S.missed[q.key]) S.missed[q.key]--;
    if ([5, 10, 20].includes(R.combo)) toast("Combo", `${R.combo} coups d'affilée. Multiplicateur ×${mult()}`);
  } else {
    R.errors.push({ label: q.label, given: givenAnswer(q, btn), why: q.why || "" }); if (q.key) S.missed[q.key] = (S.missed[q.key] || 0) + 1;
    if (R.shield) { R.shield = false; toast("Bouclier d'Ombre", "L'erreur a été absorbée.", "mana"); }
    else {
      R.combo = 0;
      if (!R.g.boss) {
        R.hp--;
        if (R.hp <= 0 && myLevel() >= 20 && !R.revived) { R.revived = true; R.hp = 1; toast("Extraction d'Ombre", "Relève-toi. Tu reviens avec 1 PV.", "mana"); }
      }
    }
    $("#qwin").classList.add("shake");
  }
  save();
  if (R.g.boss && ok) { setTimeout(() => R && next(), 350); return; }
  const why = !ok && q.why && !q.fix.includes(esc(q.why)) ? `<br><span class="why">${esc(q.why)}</span>` : "";
  $("#fb").innerHTML = `<div class="feedback ${ok ? "" : "bad"}">${ok ? "<b>Coup critique !</b> " : "<b>Raté.</b> "}${q.fix}${why}</div>
    <div class="actions"><button class="btn main" id="nx">${R.hp <= 0 ? "Voir le résultat" : "Continuer"}</button></div>`;
  const nx = $("#nx"); nx.focus(); nx.onclick = () => next();
}

// Ce que le joueur a répondu, pour l'expliquer à la fin du donjon
function givenAnswer(q, btn) {
  if (q.type === "choice") return btn ? btn.dataset.o : "";
  if (q.type === "verb") return `${$("#a1").value.trim()} – ${$("#a2").value.trim()}`;
  if (q.type === "input") return $("#a1").value.trim();
  if (q.type === "order") return q.built.map(i => q.words[i]).join(" ");
  if (q.type === "speak") return q.heard && q.heard.text !== undefined ? `« ${q.heard.text} » (${q.heard.pct} %)` : "(auto-évaluation)";
  return "";
}

// Une erreur par notion, avec le nombre de fois où elle a été faite
function errorReport(errors) {
  const m = new Map();
  for (const e of errors) { const x = m.get(e.label); if (x) { x.n++; x.given = e.given; } else m.set(e.label, { ...e, n: 1 }); }
  return `<div class="list errx" aria-label="Explication des erreurs"><div class="tag">Explication des erreurs</div>
    ${[...m.values()].map(e => `<div class="errx-item">
      <div class="errx-ok">✓ ${esc(e.label)}${e.n > 1 ? ` <span class="mute">×${e.n}</span>` : ""}</div>
      ${e.given ? `<div class="errx-bad">✗ Ta réponse : ${esc(e.given)}</div>` : ""}
      ${e.why ? `<div class="errx-why">${esc(e.why)}</div>` : ""}</div>`).join("")}</div>`;
}

function finish(cleared) {
  clearInterval(timerId); if (!R) return;
  const r = R; R = null; const boss = !!r.g.boss;
  let bonus = 0; if (!boss && cleared) bonus = (50 + (r.errors.length === 0 ? 50 : 0)) * (r.g.xp || 1);
  const total = r.xp + bonus; gainXp(total);
  S.daily.runs++;
  if (boss) { S.daily.boss++; if (r.ok > S.bestBoss) { S.bestBoss = r.ok; setTimeout(() => toast("Nouveau record", `${r.ok} ennemis vaincus au Raid.`, "gold"), 400); } }
  else { const b = S.best[r.g.id] || { ok: 0, perfect: false }; S.best[r.g.id] = { ok: Math.max(b.ok, r.ok), perfect: b.perfect || (cleared && r.errors.length === 0) }; }
  progressQuests(); save(); pushProgress();
  const title = boss ? "Raid terminé" : cleared ? (r.errors.length ? "Donjon nettoyé" : "Donjon nettoyé sans dégât") : "Vous avez été vaincu";
  app.classList.add("narrow");
  app.innerHTML = `<section class="win result"><span class="tag" style="color:${cleared || boss ? "var(--glow)" : "var(--red)"}">[ ${title} ]</span>
    <h2>${r.g.name}</h2><div class="big">+${total} XP</div>
    <div class="mute">${r.ok} bonne${r.ok > 1 ? "s" : ""} réponse${r.ok > 1 ? "s" : ""} · meilleur combo ${r.best}${bonus ? ` · bonus de clear +${bonus}` : ""}</div>
    ${r.errors.length ? errorReport(r.errors) :`<p style="color:var(--ok)">Aucune erreur. Le Système est impressionné.</p>`}
    <div class="actions"><button class="btn" id="hb">Retour</button><button class="btn main" id="ag">Relancer</button></div></section>`;
  $("#hb").onclick = shell; $("#ag").onclick = () => start(r.g.id); $("#ag").focus();
}

document.addEventListener("keydown", e => {
  if (!R || !R.q || R.answered || R.q.type !== "choice") return;
  if (/^[1-6]$/.test(e.key)) { const b = app.querySelectorAll(".choice")[+e.key - 1]; if (b && !b.disabled) submit(b); }
});

// =====================================================================
// Démarrage
// =====================================================================
shell();
// Quand l'état du compte ou des guildes change, on rafraîchit l'écran (sauf en plein donjon)
initCloud(({ full }) => {
  if (R) return;
  if (full || S.tab === "account" || S.tab === "status" || S.tab === "reviews") shell();
  else if (S.tab === "guild") renderGuild($("#view"));
});
if (!introSeen()) setTimeout(() => play("awaken"), 300);

// Annonce de mise à jour, une seule fois par appareil (pas pour un nouveau joueur, qui découvre tout)
const MAJ = "speak-1", MAJ_KEY = "english-leveling-maj";
try {
  if (localStorage.getItem(MAJ_KEY) !== MAJ) {
    if (introSeen()) setTimeout(() => toast("Mise à jour du Système", "Nouvelles portes : parle anglais au micro à chaque niveau pour travailler ta prononciation, et 5 portes de rang S sur la prise de parole en public."), 900);
    localStorage.setItem(MAJ_KEY, MAJ);
  }
} catch (e) { /* stockage indisponible */ }
