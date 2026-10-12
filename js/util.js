// Petites fonctions partagées par tous les modules

export const $ = s => document.querySelector(s);

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const shuffle = a => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export const pick = a => a[Math.random() * a.length | 0];

// Normalise une réponse tapée (casse, espaces, apostrophes, ponctuation finale)
export const norm = s => String(s).toLowerCase().trim().replace(/[’']/g, "'").replace(/[.!?]+$/, "").replace(/\s+/g, " ");

export const fillQ = (q, a) => q.includes("___") ? q.replace("___", a) : q + " → " + a;

export const today = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };

// Niveaux : 100 XP pour le niveau 2, puis +40 XP de plus à chaque niveau
export function lvl(xp) {
  let l = 1, need = 100;
  while (xp >= need) { xp -= need; l++; need = 100 + (l - 1) * 40; }
  return { l, into: xp, need };
}

export const RANKS = [
  [1, "E", "Chasseur de rang E"], [5, "D", "Chasseur de rang D"], [10, "C", "Chasseur de rang C"],
  [18, "B", "Chasseur de rang B"], [28, "A", "Chasseur de rang A"], [40, "S", "Chasseur de rang S"],
  [60, "N", "Monarque de l'Anglais"]
];
export function rank(l) { let r = RANKS[0]; for (const x of RANKS) if (l >= x[0]) r = x; return r; }

export function toast(title, msg, kind) {
  const t = document.createElement("div");
  t.className = "toast" + (kind ? " " + kind : "");
  t.innerHTML = `<span class="tag">[ ${esc(title)} ]</span>${msg}`;
  $("#toasts").appendChild(t);
  setTimeout(() => t.remove(), 3800);
}
