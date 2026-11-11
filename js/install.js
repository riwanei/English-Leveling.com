// =====================================================================
// Installation sur téléphone (application web) : service worker, bouton
// « Installer » sur Android/ordinateur, mode d'emploi sur iPhone.
// =====================================================================
const HIDE_KEY = "english-leveling-install-hide";
let deferred = null, onChange = () => { };

const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const hidden = () => { try { return !!localStorage.getItem(HIDE_KEY); } catch (e) { return false; } };

export function initInstall(cb) {
  onChange = cb;
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(() => { /* hors ligne impossible, le site marche quand même */ });
  }
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; onChange(); });
  addEventListener("appinstalled", () => { deferred = null; onChange("installed"); });
}

// Fenêtre à afficher dans le Statut (vide si déjà installé ou masqué)
export function installCard() {
  if (standalone() || hidden()) return "";
  const how = deferred
    ? `<button class="btn main" id="install-go">Installer l'appli</button>`
    : isIOS()
      ? `<ol class="install-steps"><li>Dans Safari, touche <b>Partager</b> <span class="share-glyph" aria-hidden="true">⬆</span> en bas de l'écran.</li><li>Choisis <b>Sur l'écran d'accueil</b>, puis <b>Ajouter</b>.</li></ol>`
      : `<p class="mute small">Ouvre le menu de ton navigateur (⋮) et choisis <b>Installer l'application</b> ou <b>Ajouter à l'écran d'accueil</b>.</p>`;
  return `<section class="win install-card" aria-label="Installer le jeu"><div class="tag">Emporte le Système avec toi</div>
    <div class="install-row"><img src="img/icon-192.png" alt="" width="56" height="56">
      <div><h3>Installe English Leveling sur ton téléphone</h3><p class="mute small">Une icône sur ton écran d'accueil, le jeu en plein écran, et les donjons même sans connexion.</p></div></div>
    <div class="actions left">${how}<button class="linkbtn" id="install-hide">Plus tard</button></div></section>`;
}

export function bindInstall() {
  const go = document.querySelector("#install-go"), later = document.querySelector("#install-hide");
  if (go) go.onclick = async () => { const p = deferred; deferred = null; p.prompt(); await p.userChoice.catch(() => { }); onChange(); };
  if (later) later.onclick = () => { try { localStorage.setItem(HIDE_KEY, "1"); } catch (e) { } onChange(); };
}
