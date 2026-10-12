// Progression du joueur : toujours gardée dans le navigateur,
// et copiée sur Supabase quand le joueur est connecté (voir cloud.js).
import { today } from "./util.js";

const KEY = "english-leveling-v1";

export function fresh() {
  return {
    xp: 0, total: 0, streak: 0, lastDay: null, bestBoss: 0,
    stats: { mem: 0, lex: 0, per: 0, syn: 0, agi: 0 },
    daily: { date: today(), runs: 0, correct: 0, boss: 0, powers: 0, claimed: [] },
    missed: {}, best: {}, tab: "status", gid: null,
    uid: null // compte auquel appartient cette progression
  };
}

function load() {
  let s;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
  const f = fresh();
  s = Object.assign(f, s || {});
  s.stats = Object.assign(fresh().stats, s.stats);
  s.best = s.best || {};
  s.missed = s.missed || {};
  return s;
}

// Objet unique, modifié sur place pour que tous les modules voient la même progression
export const S = load();

export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* stockage indisponible */ } }

export function replaceState(obj) {
  const keep = { tab: S.tab, gid: S.gid, uid: S.uid };
  Object.keys(S).forEach(k => delete S[k]);
  Object.assign(S, fresh(), obj, keep);
  S.stats = Object.assign(fresh().stats, S.stats);
  checkDay();
  save();
}

export function checkDay() {
  if (!S.daily || S.daily.date !== today()) S.daily = { date: today(), runs: 0, correct: 0, boss: 0, powers: 0, claimed: [] };
  S.daily.powers = S.daily.powers || 0;
}

// Données envoyées sur Supabase (sans les préférences d'affichage)
export function exportState() { const { tab, gid, uid, ...rest } = S; return rest; }

checkDay();
