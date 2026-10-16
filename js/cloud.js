// =====================================================================
// Mode en ligne : comptes, sauvegarde de la progression, guildes, chat.
// Tout passe par Supabase. Si la configuration est absente ou si le
// serveur ne répond pas, le site continue de marcher en mode solo.
// =====================================================================
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
import { $, esc, lvl, rank, toast } from "./util.js";
import { S, save, fresh, replaceState, exportState } from "./state.js";

// Dernière version 2.x : nécessaire pour les nouvelles clés "sb_publishable_…"
const SUPABASE_JS = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const GMAX = 7;

export const cloud = {
  configured: /^https:\/\/.+/.test(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 20,
  status: "off",          // off | loading | ready | error
  sb: null, session: null, profile: null,
  guilds: [], messages: [], leaders: null, leadersAt: 0,
  recovery: false         // true quand on arrive par un lien "mot de passe oublié"
};

let notify = () => { };
let channel = null, channelGid = null;

// Modération côté site (le serveur ajoute l'anti-spam et les signalements)
const BAD_WORDS = /\b(fuck\w*|shit|bitch|asshole|connard|connasse|salope|pute|encul\w*|fdp|ntm|batard|bâtard)\b/i;
const CONTACT = /(https?:\/\/|www\.|\S+@\S+\.\S+|(\+33|\b0)[1-9]([\s.-]?\d{2}){4})/i;

const ERRORS = {
  GUILD_FULL: `Cette guilde est complète (${GMAX}/${GMAX}).`,
  NOT_FOUND: "Aucune guilde avec ce code.",
  TOO_MANY_GUILDS: "Tu fais déjà partie de 5 guildes. Quittes-en une d'abord.",
  SLOW_DOWN: "Doucement ! Attends quelques secondes avant d'envoyer un autre message.",
  NO_PROFILE: "Choisis d'abord ton pseudo dans l'onglet Compte.",
  NOT_AUTH: "Ta session a expiré. Reconnecte-toi.",
  NOT_OWNER: "Seul le chef de guilde peut faire ça."
};
function explain(err) {
  const m = (err && err.message) || "";
  for (const k in ERRORS) if (m.includes(k)) return ERRORS[k];
  if (m.includes("Invalid login credentials")) return "E-mail ou mot de passe incorrect.";
  if (m.includes("Email not confirmed")) return "Confirme d'abord ton adresse grâce à l'e-mail reçu.";
  if (m.includes("User already registered")) return "Un compte existe déjà avec cette adresse. Connecte-toi.";
  if (m.includes("Password should be")) return "Le mot de passe doit faire au moins 8 caractères.";
  if (m.toLowerCase().includes("rate limit")) return "Trop de tentatives. Réessaie dans quelques minutes.";
  if (err && err.code === "23505") return "Ce pseudo est déjà pris.";
  return "Le Système ne répond pas. Vérifie ta connexion et réessaie.";
}

// =====================================================================
// Démarrage et session
// =====================================================================
export async function initCloud(cb) {
  notify = cb;
  if (!cloud.configured) return;
  cloud.status = "loading";
  try {
    const { createClient } = await import(SUPABASE_JS);
    cloud.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await cloud.sb.auth.getSession();
    await onSession(data.session);
    cloud.status = "ready";
  } catch (e) {
    console.warn("Mode en ligne indisponible", e);
    cloud.status = "error";
  }
  notify({ full: true });
  if (!cloud.sb) return;
  cloud.sb.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") cloud.recovery = true;
    // setTimeout : Supabase déconseille d'appeler la base directement dans ce callback
    setTimeout(async () => {
      const changed = (session?.user?.id || null) !== (cloud.session?.user?.id || null);
      if (changed) await onSession(session); else cloud.session = session;
      notify({ full: true });
    }, 0);
  });
}

async function onSession(session) {
  cloud.session = session; cloud.profile = null; cloud.guilds = []; cloud.messages = [];
  stopChannel();
  if (!session) return;
  const { data } = await cloud.sb.from("profiles").select("id,username,xp").eq("id", session.user.id).maybeSingle();
  cloud.profile = data || null;
  await syncOnLogin();
  if (cloud.profile) await loadGuilds();
}

// À la connexion : on garde la progression la plus avancée (navigateur ou compte)
async function syncOnLogin() {
  const uid = cloud.session.user.id;
  const { data, error } = await cloud.sb.from("progress").select("data").eq("user_id", uid).maybeSingle();
  if (error) return;
  const remote = data && data.data;
  if (S.uid && S.uid !== uid) {
    // Ce navigateur contenait la progression d'un autre compte
    replaceState(remote || fresh());
  } else if (remote && (remote.xp || 0) > S.xp) {
    replaceState(remote);
    toast("Synchronisation", "Progression récupérée depuis ton compte.");
  }
  S.uid = uid; save();
  await pushProgress();
}

export async function pushProgress() {
  if (!cloud.session || !cloud.sb) return;
  const uid = cloud.session.user.id;
  const r1 = await cloud.sb.from("progress").upsert({ user_id: uid, data: exportState(), updated_at: new Date().toISOString() });
  if (r1.error) console.warn("Sauvegarde impossible", r1.error);
  if (cloud.profile) {
    const r2 = await cloud.sb.from("profiles").update({ xp: S.xp }).eq("id", uid);
    if (!r2.error) cloud.profile.xp = S.xp;
  }
}

export function announceLevel(level) {
  if (!cloud.profile || !cloud.sb) return;
  cloud.sb.rpc("announce_level", { p_level: level }).then(() => { }, () => { });
}

// =====================================================================
// Guildes et chat
// =====================================================================
async function loadGuilds() {
  const { data, error } = await cloud.sb.from("guilds")
    .select("id,name,code,owner,created_at,guild_members(user_id,joined_at,profiles(username,xp))")
    .order("created_at");
  if (error) { console.warn(error); return; }
  cloud.guilds = data || [];
  if (!cloud.guilds.find(g => g.id === S.gid)) { S.gid = cloud.guilds[0] ? cloud.guilds[0].id : null; save(); }
  await watchGuild();
}

async function refreshGuilds() { await loadGuilds(); notify({ full: false }); }

function stopChannel() {
  if (channel && cloud.sb) cloud.sb.removeChannel(channel);
  channel = null; channelGid = null;
}

// Abonnement temps réel au chat et aux membres de la guilde affichée
async function watchGuild() {
  const gid = S.gid;
  if (gid === channelGid) return;
  stopChannel(); cloud.messages = [];
  if (!gid) return;
  channelGid = gid;
  await loadMessages();
  channel = cloud.sb.channel("guild-" + gid)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `guild_id=eq.${gid}` },
      () => loadMessages().then(drawChat))
    .on("postgres_changes", { event: "*", schema: "public", table: "guild_members", filter: `guild_id=eq.${gid}` },
      () => refreshGuilds())
    .subscribe();
}

async function loadMessages() {
  if (!channelGid) return;
  const gid = channelGid;
  const { data, error } = await cloud.sb.from("messages")
    .select("id,body,kind,created_at,user_id,profiles(username)")
    .eq("guild_id", gid).order("created_at", { ascending: false }).limit(60);
  if (!error && gid === channelGid) cloud.messages = (data || []).reverse();
}

async function loadLeaders() {
  if (Date.now() - cloud.leadersAt < 60000 && cloud.leaders) return;
  const { data } = await cloud.sb.from("profiles").select("id,username,xp").order("xp", { ascending: false }).limit(20);
  cloud.leaders = data || []; cloud.leadersAt = Date.now();
}

// ---------- Écran Guilde ----------
export function renderGuild(box) {
  if (!box) return;
  const draft = $("#msg") ? $("#msg").value : "";
  const gate = gateMessage();
  if (gate) { box.innerHTML = gate; bindGate(box); return; }

  const g = cloud.guilds.find(x => x.id === S.gid) || null;
  const me = cloud.session.user.id;
  box.innerHTML = `
  <section class="win"><div class="tag">Tes guildes</div>
    <div class="glist" style="margin-top:10px">${cloud.guilds.length ? cloud.guilds.map(x => `<button class="gchip" data-gid="${x.id}" aria-pressed="${x.id === S.gid}">${esc(x.name)} · ${x.guild_members.length}/${GMAX}</button>`).join("")
      : `<span class="mute">Tu n'as pas encore de guilde. Crée la tienne ou rejoins celle d'un ami avec son code.</span>`}</div>
    <form class="row" id="fcreate" style="margin-top:14px"><input type="text" id="gname" maxlength="30" minlength="2" placeholder="Nom de la nouvelle guilde" aria-label="Nom de la nouvelle guilde" required><button class="btn sm main" type="submit">Créer</button></form>
    <form class="row" id="fjoin" style="margin-top:8px"><input type="text" id="gcode" maxlength="6" placeholder="Code d'invitation (6 caractères)" aria-label="Code d'invitation" style="text-transform:uppercase" required><button class="btn sm" type="submit">Rejoindre</button></form>
    <div class="err" id="gerr" role="alert"></div></section>
  ${g ? `
  <section class="win"><div class="title-bar"><div style="min-width:0"><div class="tag">Guilde</div><h2 style="overflow-wrap:anywhere">${esc(g.name)}</h2></div>
    <div style="text-align:right"><div class="mute small">Code d'invitation</div><div class="code" id="codetxt">${esc(g.code)}</div><button class="linkbtn" id="gcopy">Copier le code</button></div></div>
    <div class="tag" style="margin-top:14px">Membres · ${g.guild_members.length}/${GMAX}</div>
    <div class="members" style="margin-top:8px">${g.guild_members.slice().sort((a, b) => (b.profiles?.xp || 0) - (a.profiles?.xp || 0)).map(m => {
      const L = lvl(m.profiles?.xp || 0).l;
      const tags = (m.user_id === me ? " (toi)" : "") + (m.user_id === g.owner ? " · chef" : "");
      const kick = g.owner === me && m.user_id !== me ? `<button class="linkbtn" data-kick="${m.user_id}">Retirer</button>` : "<span></span>";
      return `<div class="member"><span>${esc(m.profiles?.username || "Chasseur")}${tags}</span><b>Rang ${rank(L)[1]} · Niv. ${L}</b>${kick}</div>`;
    }).join("")}</div>
    <div class="actions left"><button class="linkbtn" id="gleave">Quitter la guilde</button></div></section>
  <section class="win"><div class="tag">Canal de la guilde</div>
    <div class="chat" id="chat" style="margin-top:10px" aria-live="polite"></div>
    <form class="row" id="chatform" style="margin-top:10px"><input type="text" id="msg" maxlength="400" placeholder="Écris en anglais si tu peux, c'est l'entraînement !" aria-label="Message" autocomplete="off"><button class="btn sm main" type="submit">Envoyer</button></form>
    <div class="err" id="cerr" role="alert"></div>
    <p class="mute small" style="margin-top:6px">Liens, e-mails et numéros de téléphone sont bloqués. Un message signalé par 2 membres est masqué.</p></section>` : ""}
  <section class="win"><div class="tag">Classement des chasseurs</div><div id="leaders" style="margin-top:10px"><p class="mute small">Chargement…</p></div></section>`;

  box.querySelectorAll(".gchip").forEach(b => b.onclick = async () => { S.gid = b.dataset.gid; save(); await watchGuild(); renderGuild(box); });
  $("#fcreate").onsubmit = e => { e.preventDefault(); createGuild(); };
  $("#fjoin").onsubmit = e => { e.preventDefault(); joinGuild(); };
  if (g) {
    $("#gcopy").onclick = e => {
      const done = () => { e.target.textContent = "Code copié"; };
      if (navigator.clipboard) navigator.clipboard.writeText(g.code).then(done, selectCode); else selectCode();
    };
    $("#gleave").onclick = e => {
      if (e.target.dataset.sure) leaveGuild(g.id);
      else { e.target.dataset.sure = 1; e.target.textContent = "Confirmer : quitter la guilde"; }
    };
    box.querySelectorAll("[data-kick]").forEach(b => b.onclick = () => {
      if (b.dataset.sure) kick(g.id, b.dataset.kick);
      else { b.dataset.sure = 1; b.textContent = "Confirmer"; }
    });
    $("#chatform").onsubmit = e => { e.preventDefault(); sendMsg(g.id); };
    if (draft) $("#msg").value = draft;
    drawChat();
  }
  loadLeaders().then(drawLeaders);
}

function gateMessage() {
  if (!cloud.configured) return `<section class="win"><div class="tag">Guildes</div><p style="margin-top:8px">Le mode en ligne n'est pas encore activé sur ce site.</p><p class="mute small" style="margin-top:6px">Les 30 donjons fonctionnent quand même : ta progression est gardée dans ce navigateur.</p></section>`;
  if (cloud.status === "loading") return `<section class="win"><p class="mute">Connexion au registre des guildes…</p></section>`;
  if (cloud.status === "error") return `<section class="win"><div class="tag">Guildes</div><p style="margin-top:8px">Impossible de joindre le serveur pour le moment.</p><p class="mute small" style="margin-top:6px">Vérifie ta connexion puis recharge la page. Les donjons restent jouables.</p></section>`;
  if (!cloud.session) return `<section class="win"><div class="tag">Guildes</div><p style="margin-top:8px">Connecte-toi pour créer une guilde ou rejoindre celle de tes amis (7 chasseurs maximum).</p><div class="actions left"><button class="btn main" data-goto="account">Se connecter ou créer un compte</button></div></section>`;
  if (!cloud.profile) return `<section class="win"><div class="tag">Guildes</div><p style="margin-top:8px">Choisis d'abord ton pseudo de chasseur.</p><div class="actions left"><button class="btn main" data-goto="account">Choisir mon pseudo</button></div></section>`;
  return "";
}
function bindGate(box) {
  box.querySelectorAll("[data-goto]").forEach(b => b.onclick = () => { S.tab = b.dataset.goto; save(); notify({ full: true }); });
}
function selectCode() {
  const el = $("#codetxt"); if (!el) return;
  const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
}
const setErr = (sel, t) => { const e = $(sel); if (e) e.textContent = t; };

function drawChat() {
  const box = $("#chat"); if (!box) return;
  if (!cloud.messages.length) { box.innerHTML = `<p class="mute small">Le canal est vide. Lance la conversation : présente-toi en anglais !</p>`; return; }
  const me = cloud.session.user.id;
  const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 40 || box.dataset.init !== "1";
  box.innerHTML = "";
  cloud.messages.forEach(m => {
    const who = (m.profiles?.username || "Chasseur") + (m.user_id === me ? " (toi)" : "");
    const el = document.createElement("div");
    if (m.kind !== "chat") {
      el.className = "msg sys";
      el.textContent = m.kind === "level" ? `[ SYSTÈME ] ${who} a atteint le niveau ${m.body}.`
        : m.kind === "join" ? `[ SYSTÈME ] ${who} a rejoint la guilde.` : `[ SYSTÈME ] ${who} a quitté la guilde.`;
    } else {
      el.className = "msg";
      const w = document.createElement("span"); w.className = "who" + (m.user_id === me ? " me" : ""); w.textContent = who;
      const t = document.createElement("span"); t.textContent = m.body;
      const tm = document.createElement("span"); tm.className = "when";
      tm.textContent = new Date(m.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      el.append(w, t, tm);
      if (m.user_id !== me) {
        const rp = document.createElement("button"); rp.className = "report"; rp.textContent = "Signaler";
        rp.onclick = () => report(m.id, rp);
        el.append(rp);
      }
    }
    box.appendChild(el);
  });
  if (atBottom) { box.scrollTop = box.scrollHeight; box.dataset.init = "1"; }
}

function drawLeaders() {
  const box = $("#leaders"); if (!box || !cloud.leaders) return;
  const me = cloud.session.user.id;
  box.innerHTML = "";
  cloud.leaders.forEach((p, i) => {
    const L = lvl(p.xp).l;
    const row = document.createElement("div"); row.className = "lead" + (p.id === me ? " me" : "");
    const pos = document.createElement("span"); pos.className = "pos"; pos.textContent = "#" + (i + 1);
    const name = document.createElement("span"); name.textContent = p.username;
    const lv = document.createElement("span"); lv.textContent = `Rang ${rank(L)[1]} · Niv. ${L}`;
    row.append(pos, name, lv); box.appendChild(row);
  });
  if (!cloud.leaders.length) box.innerHTML = `<p class="mute small">Aucun chasseur classé pour l'instant.</p>`;
}

async function createGuild() {
  const name = $("#gname").value.trim();
  if (name.length < 2) return setErr("#gerr", "Le nom doit faire au moins 2 caractères.");
  if (BAD_WORDS.test(name)) return setErr("#gerr", "Choisis un nom de guilde respectueux.");
  const { data, error } = await cloud.sb.rpc("create_guild", { p_name: name });
  if (error) return setErr("#gerr", explain(error));
  S.gid = data; save(); await loadGuilds();
  const g = cloud.guilds.find(x => x.id === data);
  toast("Guilde fondée", `« ${esc(name)} » est prête. Partage le code <b>${esc(g ? g.code : "")}</b> à tes amis (${GMAX} chasseurs max).`, "gold");
  notify({ full: false });
}

async function joinGuild() {
  const code = $("#gcode").value.trim().toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(code)) return setErr("#gerr", "Le code fait 6 caractères (lettres et chiffres).");
  const { data, error } = await cloud.sb.rpc("join_guild", { p_code: code });
  if (error) return setErr("#gerr", explain(error));
  S.gid = data; save(); await loadGuilds();
  toast("Guilde", "Bienvenue dans ta nouvelle guilde !", "gold");
  notify({ full: false });
}

async function leaveGuild(gid) {
  const { error } = await cloud.sb.rpc("leave_guild", { p_guild: gid });
  if (error) return setErr("#gerr", explain(error));
  S.gid = null; save(); await loadGuilds(); notify({ full: false });
}

async function kick(gid, uid) {
  const { error } = await cloud.sb.rpc("kick_member", { p_guild: gid, p_user: uid });
  if (error) return setErr("#gerr", explain(error));
  await refreshGuilds();
}

async function sendMsg(gid) {
  const inp = $("#msg"); const text = inp.value.trim();
  if (!text) return;
  if (BAD_WORDS.test(text)) return setErr("#cerr", "Message bloqué : reste respectueux, le Système veille.");
  if (CONTACT.test(text)) return setErr("#cerr", "Les liens, e-mails et numéros de téléphone ne sont pas autorisés dans le chat.");
  inp.value = "";
  const { error } = await cloud.sb.from("messages").insert({ guild_id: gid, user_id: cloud.session.user.id, body: text.slice(0, 400) });
  if (error) { inp.value = text; return setErr("#cerr", explain(error)); }
  setErr("#cerr", "");
  await loadMessages(); drawChat();
}

async function report(id, btn) {
  btn.disabled = true;
  const { error } = await cloud.sb.from("reports").insert({ message_id: id, reporter: cloud.session.user.id });
  if (error && error.code !== "23505") { btn.disabled = false; return toast("Signalement", explain(error)); }
  btn.textContent = "Signalé";
  toast("Signalement", "Merci. Le message sera masqué s'il est signalé par un deuxième membre.");
  await loadMessages(); drawChat();
}

// =====================================================================
// Écran Compte
// =====================================================================
let accountMode = "login"; // login | signup | forgot

export function renderAccount(box) {
  if (!box) return;
  if (!cloud.configured) {
    box.innerHTML = `<section class="win stack"><div class="tag">Compte de chasseur</div>
      <h2>Les comptes arrivent bientôt</h2>
      <p>Avec un compte, ta progression sera sauvegardée en ligne : tu la retrouveras sur ton téléphone, ton ordinateur ou au lycée, et tu pourras rejoindre une guilde.</p>
      <p class="mute small">En attendant, tu peux jouer normalement : ta progression est gardée dans ce navigateur et sera reprise automatiquement quand tu créeras ton compte.</p>
      <p class="note">Tu es l'administrateur du site ? Remplis <b>js/config.js</b> avec l'URL et la clé « anon » de ton projet Supabase (voir README.md, étape 2) pour activer les comptes.</p></section>`;
    return;
  }
  if (cloud.status !== "ready") {
    const g = cloud.status === "error"
      ? `<section class="win"><div class="tag">Compte</div><p style="margin-top:8px">Impossible de joindre le serveur pour le moment.</p><p class="mute small" style="margin-top:6px">Vérifie ta connexion puis recharge la page. Tu peux continuer à jouer : ta progression sera envoyée sur ton compte à ta prochaine connexion.</p></section>` : "";
    box.innerHTML = g || `<section class="win"><p class="mute">Connexion…</p></section>`;
    return;
  }
  // Retour depuis un e-mail "mot de passe oublié"
  if (cloud.recovery && cloud.session) {
    box.innerHTML = `<section class="win stack"><div class="tag">Nouveau mot de passe</div>
      <form class="stack" id="fnewpw"><div><label for="npw">Nouveau mot de passe (8 caractères minimum)</label><input type="password" id="npw" minlength="8" autocomplete="new-password" required></div>
      <button class="btn main" type="submit">Enregistrer</button></form><div class="err" id="aerr" role="alert"></div></section>`;
    $("#fnewpw").onsubmit = async e => {
      e.preventDefault();
      const { error } = await cloud.sb.auth.updateUser({ password: $("#npw").value });
      if (error) return setErr("#aerr", explain(error));
      cloud.recovery = false; toast("Compte", "Mot de passe modifié."); notify({ full: true });
    };
    return;
  }
  if (!cloud.session) return renderAuthForms(box);
  if (!cloud.profile) return renderPseudoForm(box);

  const L = lvl(S.xp).l;
  box.innerHTML = `<section class="win stack"><div class="tag">Ton compte</div>
    <h2>${esc(cloud.profile.username)}</h2>
    <p class="mute">${esc(cloud.session.user.email || "")} · ${rank(L)[2]} · niveau ${L}</p>
    <p class="small mute">Ta progression est sauvegardée sur ton compte à la fin de chaque donjon.</p>
    <div class="actions left"><button class="btn" id="logout">Se déconnecter</button></div></section>
  <section class="win stack"><div class="tag">Zone dangereuse</div>
    <p class="small mute">Supprimer ton compte efface ton profil, ta progression en ligne et ta place dans tes guildes. C'est définitif.</p>
    <div class="actions left"><button class="btn danger" id="delacc">Supprimer mon compte</button></div><div class="err" id="aerr" role="alert"></div></section>`;
  $("#logout").onclick = async () => { await cloud.sb.auth.signOut(); toast("Compte", "Tu es déconnecté."); };
  $("#delacc").onclick = async e => {
    if (!e.target.dataset.sure) { e.target.dataset.sure = 1; e.target.textContent = "Confirmer la suppression définitive"; return; }
    const { error } = await cloud.sb.rpc("delete_my_account");
    if (error) return setErr("#aerr", explain(error));
    replaceState(fresh()); S.uid = null; S.gid = null; save();
    await cloud.sb.auth.signOut();
    toast("Compte", "Ton compte et tes données ont été supprimés.");
  };
}

function renderAuthForms(box) {
  const tabs = `<div class="row" role="tablist">
    <button class="gchip" data-mode="login" aria-pressed="${accountMode === "login"}">Connexion</button>
    <button class="gchip" data-mode="signup" aria-pressed="${accountMode === "signup"}">Créer un compte</button></div>`;
  let form = "";
  if (accountMode === "login") form = `<form class="stack" id="fauth">
      <div><label for="em">E-mail</label><input type="email" id="em" autocomplete="email" required></div>
      <div><label for="pw">Mot de passe</label><input type="password" id="pw" autocomplete="current-password" required></div>
      <button class="btn main" type="submit">Se connecter</button></form>
      <button class="linkbtn" data-mode="forgot">Mot de passe oublié ?</button>`;
  if (accountMode === "signup") form = `<form class="stack" id="fauth">
      <div><label for="em">E-mail</label><input type="email" id="em" autocomplete="email" required></div>
      <div><label for="pw">Mot de passe (8 caractères minimum)</label><input type="password" id="pw" minlength="8" autocomplete="new-password" required></div>
      <label class="check"><input type="checkbox" id="rules" required><span>J'ai lu <a href="confidentialite.html" target="_blank" rel="noopener">les règles et la politique de confidentialité</a>. J'ai 15 ans ou plus, ou l'accord d'un parent.</span></label>
      <button class="btn main" type="submit">Créer mon compte</button></form>`;
  if (accountMode === "forgot") form = `<form class="stack" id="fauth">
      <div><label for="em">E-mail du compte</label><input type="email" id="em" autocomplete="email" required></div>
      <button class="btn main" type="submit">Recevoir un lien</button></form>
      <button class="linkbtn" data-mode="login">Retour à la connexion</button>`;
  box.innerHTML = `<section class="win stack"><div class="tag">Compte de chasseur</div>
    <p class="mute small">Un compte garde ta progression sur tous tes appareils et te permet de rejoindre une guilde. Sans compte, tu peux jouer quand même.</p>
    ${tabs}${form}<div class="err" id="aerr" role="alert"></div><div class="okmsg" id="aok"></div></section>`;
  box.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => { accountMode = b.dataset.mode; renderAuthForms(box); });
  $("#fauth").onsubmit = async e => {
    e.preventDefault(); setErr("#aerr", "");
    const email = $("#em").value.trim(), btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      if (accountMode === "login") {
        const { error } = await cloud.sb.auth.signInWithPassword({ email, password: $("#pw").value });
        if (error) setErr("#aerr", explain(error));
      } else if (accountMode === "signup") {
        const { data, error } = await cloud.sb.auth.signUp({ email, password: $("#pw").value, options: { emailRedirectTo: location.origin + location.pathname } });
        if (error) setErr("#aerr", explain(error));
        else if (!data.session) $("#aok").textContent = "Compte créé ! Ouvre l'e-mail de confirmation, puis reviens te connecter.";
      } else {
        const { error } = await cloud.sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
        if (error) setErr("#aerr", explain(error)); else $("#aok").textContent = "Si un compte existe avec cette adresse, un lien vient d'être envoyé.";
      }
    } finally { btn.disabled = false; }
  };
}

function renderPseudoForm(box) {
  box.innerHTML = `<section class="win stack"><div class="tag">Éveil</div><h2>Choisis ton nom de chasseur</h2>
    <p class="mute small">3 à 20 caractères : lettres, chiffres ou _. Il sera visible par les autres joueurs. N'utilise pas ton vrai nom complet.</p>
    <form class="row" id="fpseudo"><input type="text" id="pseudo" maxlength="20" pattern="[A-Za-z0-9_]{3,20}" autocomplete="nickname" required aria-label="Pseudo"><button class="btn main" type="submit">Valider</button></form>
    <div class="err" id="aerr" role="alert"></div>
    <div class="actions left"><button class="linkbtn" id="logout">Se déconnecter</button></div></section>`;
  $("#logout").onclick = () => cloud.sb.auth.signOut();
  $("#fpseudo").onsubmit = async e => {
    e.preventDefault();
    const username = $("#pseudo").value.trim();
    if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) return setErr("#aerr", "3 à 20 caractères : lettres, chiffres ou _.");
    if (BAD_WORDS.test(username)) return setErr("#aerr", "Choisis un pseudo respectueux.");
    const { data, error } = await cloud.sb.from("profiles").insert({ id: cloud.session.user.id, username, xp: S.xp }).select("id,username,xp").single();
    if (error) return setErr("#aerr", explain(error));
    cloud.profile = data;
    toast("Système", `Bienvenue, ${esc(username)}. Ton éveil est terminé.`, "gold");
    await pushProgress(); await loadGuilds();
    notify({ full: true });
  };
}
