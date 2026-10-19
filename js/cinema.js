// =====================================================================
// Cinématiques du Système : éveil, niveau supérieur, réévaluation de rang.
// Personnages originaux dessinés en SVG (le Chasseur, les soldats d'ombre,
// le Chevalier d'ombre). Toujours passables (bouton, Échap, clic).
// =====================================================================
import { esc } from "./util.js";

const INTRO_KEY = "english-leveling-intro";
export const introSeen = () => { try { return !!localStorage.getItem(INTRO_KEY); } catch (e) { return true; } };
const markIntro = () => { try { localStorage.setItem(INTRO_KEY, "1"); } catch (e) { /* stockage indisponible */ } };

// ---------- Personnages (origine = entre les pieds, hauteur ~160) ----------
const BODY = "M0 -160c-14 0-24 11-24 26c0 10 4 18 10 22l-22 10c-10 5-16 14-18 26l-10 76h18l8-50l6 50h64l6-50l8 50h18l-10-76c-2-12-8-21-18-26l-22-10c6-4 10-12 10-22c0-15-10-26-24-26z";
const HOOD = "M0 -172l-26 30c-2-14 6-26 26-30zM0 -172l26 30c2-14-6-26-26-30z";
const EYES = `<ellipse class="eye" cx="-8" cy="-138" rx="3.4" ry="1.6"/><ellipse class="eye" cx="8" cy="-138" rx="3.4" ry="1.6"/>`;

function hunter(x, y, s, crown) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="c-hunter">
    <ellipse class="c-aura" cx="0" cy="-80" rx="90" ry="120"/>
    <path class="c-body" d="${BODY}"/><path class="c-body" d="${HOOD}"/>
    <path class="c-blade" d="M58 -12l30 40l-5 4z"/>
    ${crown ? `<path class="c-crown" d="M-20 -176l6-22l8 13l6-19l6 19l8-13l6 22z"/>` : ""}
    ${EYES}</g></g>`;
}
function soldier(x, y, s, delay, knight) {
  const extra = knight
    ? `<path class="c-shadow" d="M0 -162c10-22 34-28 50-20c-16 2-30 10-38 24z"/><path class="c-shadow" d="M-74 -150h8v158h-8zM-86 -118h32v6h-32z"/>`
    : `<path class="c-shadow" d="M-18 -150l-12-20l18 10zM18 -150l12-20l-18 10z"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="c-rise" style="animation-delay:${delay}ms">
    <path class="c-shadow" d="${BODY}"/>${extra}
    <ellipse class="eye shadow-eye" cx="-8" cy="-138" rx="3.4" ry="1.6"/><ellipse class="eye shadow-eye" cx="8" cy="-138" rx="3.4" ry="1.6"/></g></g>`;
}
function particles(n) {
  let h = "";
  for (let i = 0; i < n; i++) {
    const x = 120 + Math.random() * 560, y = 300 + Math.random() * 120, r = 1 + Math.random() * 2.2;
    h += `<circle class="c-spark" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" style="animation-delay:${(Math.random() * 3000) | 0}ms;animation-duration:${2400 + (Math.random() * 2400 | 0)}ms"/>`;
  }
  return h;
}
const ground = `<defs><radialGradient id="cHalo" cx="50%" cy="78%" r="60%"><stop offset="0" stop-color="var(--c)" stop-opacity=".35"/><stop offset="1" stop-color="var(--c)" stop-opacity="0"/></radialGradient></defs>
  <rect width="800" height="450" fill="url(#cHalo)"/>
  <ellipse class="c-floor" cx="400" cy="384" rx="330" ry="26"/>`;

// ---------- Rangs ----------
const RANK_SCENES = {
  D: { c: "var(--glow)", army: 0, knight: false, line: "Le chasseur le plus faible de l'humanité… ce n'est plus vous." },
  C: { c: "var(--mana)", army: 2, knight: false, line: "Des ombres se lèvent derrière vous. Elles attendent vos ordres." },
  B: { c: "var(--mana)", army: 4, knight: false, line: "Votre armée d'ombres grandit à chaque porte franchie." },
  A: { c: "var(--gold)", army: 4, knight: true, line: "Un Chevalier d'ombre s'agenouille et vous prête allégeance." },
  S: { c: "var(--red)", army: 6, knight: true, line: "Rang S. Les portes tremblent à votre approche." },
  N: { c: "var(--gold)", army: 8, knight: true, crown: true, line: "Levez-vous, Monarque de l'Anglais." }
};
const SLOTS = [[-150, .62], [150, .62], [-250, .54], [250, .54], [-330, .46], [330, .46], [-200, .4], [200, .4]];

const LEVEL_LINES = ["Vous êtes devenu plus fort.", "Vos réflexes s'aiguisent.", "Le Système a enregistré votre progression.", "Votre mana s'est accrue.", "Aucune porte ne vous résistera longtemps."];

function scene(id, d) {
  if (id === "awaken") return {
    c: "var(--glow)", wait: true, cta: "Accepter",
    svg: `${ground}<ellipse class="c-portal" cx="400" cy="230" rx="96" ry="150"/><ellipse class="c-portal inner" cx="400" cy="230" rx="70" ry="124"/>${particles(26)}${hunter(400, 384, 1.05)}`,
    text: `<div class="tag">[ Alerte ]</div>
      <p class="c-line" style="animation-delay:900ms">Vous avez rempli les conditions secrètes pour devenir un <b>Joueur</b>.</p>
      <p class="c-line mute" style="animation-delay:2300ms">Chaque bonne réponse vous rendra plus fort. Chaque porte franchie vous rapprochera du rang S.</p>
      <p class="c-line" style="animation-delay:3600ms">Acceptez-vous ?</p>`
  };
  if (id === "levelup") return {
    c: "var(--glow)", ms: 3600,
    svg: `${ground}${particles(30)}${hunter(400, 384, 1.05)}`,
    text: `<div class="tag">[ Niveau supérieur ]</div>
      <div class="c-big">Niveau ${esc(d.level)}</div>
      <p class="c-line mute" style="animation-delay:700ms">${LEVEL_LINES[d.level % LEVEL_LINES.length]}</p>`
  };
  // réévaluation de rang
  const k = d.rank[1], cf = RANK_SCENES[k] || RANK_SCENES.D;
  let army = "";
  SLOTS.slice(0, cf.army).forEach(([dx, s], i) => { army += soldier(400 + dx, 372 - s * 10, s, 900 + i * 260, false); });
  if (cf.knight) army = soldier(470, 380, .88, 600, true) + army;
  return {
    c: cf.c, ms: 7200, flash: true,
    svg: `${ground}${particles(40)}${army}${hunter(cf.knight ? 360 : 400, 384, 1.1, cf.crown)}`,
    text: `<div class="tag">[ Réévaluation du rang ]</div>
      <p class="c-line" style="animation-delay:600ms">${cf.line}</p>
      <div class="c-rankrow c-line" style="animation-delay:2600ms"><div class="rank"><b>${esc(k)}</b></div>
        <div><div class="c-big">${esc(d.rank[2])}</div><div class="mute">Niveau ${esc(d.level)}</div></div></div>`
  };
}

let queue = Promise.resolve();
export function play(id, data = {}) {
  queue = queue.then(() => run(id, data)).catch(() => { });
  return queue;
}

function run(id, data) {
  return new Promise(resolve => {
    const sc = scene(id, data), prev = document.activeElement;
    const el = document.createElement("div");
    el.className = "cine" + (sc.flash ? " flash" : "");
    el.style.setProperty("--c", sc.c);
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Cinématique du Système");
    el.innerHTML = `<svg class="cine-stage" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${sc.svg}</svg>
      <div class="cine-text">${sc.text}${sc.cta ? `<div class="actions"><button class="btn main c-line" style="animation-delay:4200ms" id="cine-ok">${sc.cta}</button></div>` : ""}</div>
      <button class="cine-skip" id="cine-skip">Passer ›</button>`;
    document.body.appendChild(el); document.body.classList.add("cine-open");
    let done = false, t = null;
    const close = () => {
      if (done) return; done = true; clearTimeout(t); if (id === "awaken") markIntro(); document.removeEventListener("keydown", onKey);
      el.classList.add("out"); setTimeout(() => { el.remove(); document.body.classList.remove("cine-open"); if (prev && prev.focus) prev.focus(); resolve(); }, 280);
    };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    el.querySelector("#cine-skip").onclick = close;
    if (sc.cta) { const ok = el.querySelector("#cine-ok"); ok.onclick = close; ok.focus(); }
    else { el.querySelector("#cine-skip").focus(); el.querySelector(".cine-stage").onclick = close; }
    if (!sc.wait) t = setTimeout(close, sc.ms);
  });
}
