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

// ---------- Tempête, Gardien, rois des ombres ----------
const sky = (top) => `<defs><linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}" stop-opacity=".9"/><stop offset=".7" stop-color="${top}" stop-opacity="0"/></linearGradient></defs><rect width="800" height="450" fill="url(#cSky)"/>`;
function bolts(n) {
  let h = "";
  for (let i = 0; i < n; i++) {
    let x = 60 + Math.random() * 680, y = 0, d = `M${x | 0} 0`;
    while (y < 150 + Math.random() * 120) { x += Math.random() * 40 - 20; y += 18 + Math.random() * 22; d += `L${x | 0} ${y | 0}`; }
    h += `<path class="c-bolt" d="${d}" style="animation-delay:${(Math.random() * 2600) | 0}ms;animation-duration:${2200 + (Math.random() * 1800 | 0)}ms"/>`;
  }
  return h;
}
// Géant en armure à couronne de pointes, entouré de vrilles d'ombre (origine = pieds)
function giant(x, y, s, color, delay) {
  return `<g transform="translate(${x} ${y}) scale(${s})" style="--k:${color}"><g class="c-giant" style="animation-delay:${delay}ms">
    <path class="c-tendril" d="M-58 -100C-120 -130 -110 -190 -160 -225M58 -100C120 -130 110 -190 160 -225M-40 -60C-100 -40 -130 -80 -170 -60M40 -60C100 -40 130 -80 170 -60"/>
    <g transform="scale(1.3 1)"><path class="c-giant-body" d="${BODY}"/></g>
    <path class="c-giant-body" d="M-26 -176l-8-42l16 24l8-48l10 42l10-42l8 48l16-24l-8 42z"/>
    <path class="c-giant-body" d="M-60 -98l-44-34l28 46zM60 -98l44-34l-28 46z"/>
    <path class="giant-eye" d="M-16 -140l12 3l-12 3zM16 -140l-12 3l12 3z"/></g></g>`;
}

// ---------- Rangs ----------
const RANK_SCENES = {
  D: { c: "var(--glow)", army: 0, knight: false, sky: "#071a3a", bolts: 3, line: "Le chasseur le plus faible de l'humanité… ce n'est plus vous." },
  C: { c: "var(--mana)", army: 2, knight: false, sky: "#1a0838", bolts: 5, line: "Des ombres se lèvent derrière vous. Elles attendent vos ordres." },
  B: { c: "var(--mana)", army: 4, knight: false, sky: "#1a0838", bolts: 6, line: "Votre armée d'ombres grandit à chaque porte franchie." },
  A: { c: "var(--gold)", army: 4, knight: true, sky: "#22093f", bolts: 7, guardian: true, line: "Un Chevalier d'ombre vous prête allégeance. Derrière lui, le Gardien s'éveille." },
  S: { c: "var(--red)", army: 6, knight: true, sky: "#2a0730", bolts: 9, guardian: true, kings: true, line: "Rang S. Les rois des ombres tournent les yeux vers vous." },
  N: { c: "var(--gold)", army: 8, knight: true, crown: true, sky: "#24073f", bolts: 12, guardian: true, kings: true, line: "Les rois des ombres s'inclinent. Levez-vous, Monarque de l'Anglais." }
};
// rois des ombres en arrière-plan (rang S et Monarque) : position et couleur d'aura
const KINGS = [[110, "#ff4d5e"], [230, "#6fd3ff"], [570, "#b18cff"], [690, "#ffb347"]];
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
    c: "#7cc8ff", ms: 4200, dark: true,
    svg: `<defs><radialGradient id="cIris" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#e9fbff"/><stop offset=".45" stop-color="#5fc4ff"/><stop offset="1" stop-color="#0a3d8f"/></radialGradient>
        <linearGradient id="cSteel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#b8c6dc"/><stop offset=".6" stop-color="#f4f8ff"/><stop offset="1" stop-color="#7d8ba3"/></linearGradient></defs>
      <rect width="800" height="450" fill="#000"/>
      <g class="c-eye"><path d="M322 176Q398 124 478 170Q402 204 322 176Z" fill="#dff1ff"/><circle cx="402" cy="168" r="19" fill="url(#cIris)"/><circle cx="402" cy="168" r="7" fill="#02060f"/><circle cx="409" cy="161" r="3.5" fill="#fff"/></g>
      <path class="c-brow" d="M310 150Q396 108 490 140"/>
      <path class="c-cheek" d="M512 118C540 170 540 222 512 262"/>
      <text class="c-sigil" x="400" y="306" text-anchor="middle">${esc(d.rank ? d.rank[1] : "E")}</text>
      <path class="c-rule" d="M300 330H500M400 324l6 6l-6 6l-6-6z"/>
      <text class="c-lu" x="400" y="364" text-anchor="middle">LEVEL <tspan>UP.</tspan></text>`,
    text: `<div class="c-big">Niveau ${esc(d.level)}</div>
      <p class="c-line mute" style="animation-delay:900ms">${LEVEL_LINES[d.level % LEVEL_LINES.length]}</p>`
  };
  if (id === "chamber-in") return {
    c: "#eaf2ff", ms: 6200, whiteout: true,
    svg: `${ground}<polygon class="c-beam" points="350,384 450,384 640,450 160,450"/><rect class="c-door" x="350" y="110" width="100" height="274"/>${particles(30)}${hunter(400, 446, .78)}`,
    text: `<div class="tag">[ Changement d'univers ]</div>
      <p class="c-line" style="animation-delay:600ms">Une porte scellée s'ouvre devant vous.</p>
      <p class="c-line mute" style="animation-delay:1900ms">Derrière : un monde blanc et sans fin. Une journée dehors y dure une année.</p>
      <p class="c-line" style="animation-delay:3300ms">Entraînez-vous jusqu'à vos limites.</p>`
  };
  if (id === "chamber-out") return {
    c: "var(--glow)", ms: 4400,
    svg: `${ground}${particles(24)}${hunter(400, 384, 1.05)}`,
    text: `<div class="tag">[ Retour au monde réel ]</div>
      <p class="c-line" style="animation-delay:500ms">Vous avez passé <b>${esc(d.inside)}</b> dans la Chambre.</p>
      <p class="c-line mute" style="animation-delay:1500ms">Dehors, à peine ${esc(d.outside)} minute${d.outside > 1 ? "s" : ""} se ${d.outside > 1 ? "sont écoulées" : "est écoulée"}.</p>`
  };
  // réévaluation de rang
  const k = d.rank[1], cf = RANK_SCENES[k] || RANK_SCENES.D;
  let army = "";
  SLOTS.slice(0, cf.army).forEach(([dx, s], i) => { army += soldier(400 + dx, 372 - s * 10, s, 900 + i * 260, false); });
  if (cf.knight) army = soldier(470, 380, .88, 600, true) + army;
  return {
    c: cf.c, ms: 7200, flash: true,
    svg: `${sky(cf.sky)}${bolts(cf.bolts)}${cf.kings ? KINGS.map(([x, c], i) => giant(x, 330, .62, c, 1400 + i * 350)).join("") : ""}${cf.guardian ? giant(400, 384, 1.55, "var(--mana)", 300) : ""}${ground}${particles(40)}${army}${hunter(cf.knight ? 360 : 400, 384, 1.1, cf.crown)}`,
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
    el.className = "cine" + (sc.flash ? " flash" : "") + (sc.whiteout ? " whiteout" : "") + (sc.dark ? " dark" : "");
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
