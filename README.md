# English Leveling

Site gratuit pour apprendre l'anglais façon *Solo Leveling* : 30 donjons du niveau A1 au B2, XP et rangs de E à S, pouvoirs, quêtes journalières, guildes de 7 joueurs avec chat.

- **Front** : HTML, CSS et JavaScript (modules), sans framework ni étape de build. Hébergé gratuitement sur **GitHub Pages**.
- **Back** : **Supabase** (PostgreSQL, authentification, temps réel). La sécurité repose sur les règles RLS du fichier `supabase/schema.sql`.

Sans configuration Supabase, le site fonctionne déjà en **mode solo** : les 30 donjons marchent et la progression est gardée dans le navigateur.

---

## Structure du projet

```
english-leveling/
├── index.html              page principale
├── confidentialite.html    règles du chat + politique de confidentialité (à compléter)
├── css/style.css           tout le style
├── js/
│   ├── app.js              moteur du jeu : onglets, donjons, pouvoirs, XP
│   ├── content.js          le contenu pédagogique des 30 portes  ← pour ajouter des questions
│   ├── cloud.js            comptes, sauvegarde en ligne, guildes, chat
│   ├── state.js            progression du joueur
│   ├── util.js             petites fonctions partagées
│   └── config.js           tes clés Supabase  ← à remplir
└── supabase/schema.sql     base de données à coller dans Supabase
```

---

## Étape 1 — Tester en local avec VS Code

Les modules JavaScript ne marchent pas en double-cliquant sur `index.html` (adresse `file://`). Il faut un petit serveur local.

1. Ouvre le dossier `english-leveling` dans VS Code (Fichier → Ouvrir le dossier).
2. Installe l'extension **Live Server** (de Ritwick Dey).
3. Clic droit sur `index.html` → **Open with Live Server**. Le site s'ouvre sur `http://127.0.0.1:5500`.

Tu dois voir le jeu en mode solo. L'onglet Guilde indique que le mode en ligne n'est pas encore activé : c'est normal.

## Étape 2 — Créer la base de données Supabase

1. Crée un compte sur [supabase.com](https://supabase.com), puis **New project**.
   - Région : choisis **Europe** (Paris ou Frankfurt), c'est plus simple pour le RGPD.
   - Note bien le mot de passe de la base.
2. Dans le menu de gauche : **SQL Editor** → **New query**. Colle tout le contenu de `supabase/schema.sql`, puis clique sur **Run**. Le message doit être *Success*.
3. Va dans **Project Settings → API** (ou bouton **Connect**). Copie :
   - **Project URL** → dans `js/config.js`, à la place de `COLLE_ICI_TON_PROJECT_URL` ;
   - la clé **anon public** → à la place de `COLLE_ICI_TA_CLE_ANON`.

   La clé *anon* est faite pour être publique. **Ne mets jamais la clé `service_role` dans le site.**
4. **Authentication → Sign In / Providers → Email** : laisse *Email* activé. Pour tes premiers tests, **désactive « Confirm email »** (voir l'étape 4 pour la raison).
5. **Authentication → URL Configuration** :
   - *Site URL* : `https://TON-PSEUDO-GITHUB.github.io/english-leveling/`
   - *Redirect URLs* : ajoute la même adresse, plus `http://127.0.0.1:5500/**` pour les tests en local.

Recharge la page Live Server : l'onglet **Compte** permet maintenant de créer un compte. Teste avec deux comptes (un dans une fenêtre de navigation privée) pour essayer les guildes et le chat.

## Étape 3 — Mettre en ligne sur GitHub Pages

1. Crée un dépôt **public** nommé `english-leveling` sur GitHub (sans README, il y en a déjà un).
2. Dans VS Code, onglet **Source Control** (icône des branches) → **Initialize Repository**. Écris un message (« Première version »), puis **Commit**. Clique ensuite sur **Publish Branch** et choisis le dépôt.

   Ou dans le terminal de VS Code :
   ```bash
   git init
   git add .
   git commit -m "Première version"
   git branch -M main
   git remote add origin https://github.com/TON-PSEUDO-GITHUB/english-leveling.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages** → *Source* : **Deploy from a branch** → branche `main`, dossier `/ (root)` → **Save**.
4. Après 1 à 2 minutes, le site est en ligne sur `https://TON-PSEUDO-GITHUB.github.io/english-leveling/`.

Pour chaque mise à jour : modifie, **Commit**, puis **Sync / Push**. GitHub Pages republie tout seul.

## Étape 4 — Avant d'ouvrir le site au public (important)

### Les e-mails
Le service d'e-mail fourni par défaut par Supabase n'envoie qu'aux membres de ton équipe Supabase, et au maximum 2 e-mails par heure. Les inconnus ne recevraient donc ni la confirmation d'inscription, ni le lien « mot de passe oublié ».

1. Crée un compte gratuit chez **Brevo** (300 e-mails par jour gratuits).
2. Dans Brevo, récupère tes identifiants SMTP (*SMTP & API*).
3. Dans Supabase : **Authentication → Emails → SMTP Settings** → active *Custom SMTP* et colle les identifiants Brevo.
4. Réactive **« Confirm email »** (étape 2.4). Les nouveaux joueurs devront confirmer leur adresse.

### La page de confidentialité
Ouvre `confidentialite.html` et remplace les passages marqués `À MODIFIER` : ton nom ou pseudo, une adresse e-mail de contact et la région Supabase.

## Modération

Protections déjà en place :

| Protection | Où |
|---|---|
| Guildes limitées à 7 membres, entrée seulement avec un code | serveur (`join_guild`) |
| 5 messages maximum en 15 secondes | serveur (trigger `limit_messages`) |
| Message masqué dès que 2 membres le signalent | serveur (trigger `auto_hide`) |
| Le chef de guilde peut retirer un membre | serveur (`kick_member`) |
| Insultes courantes, liens, e-mails et numéros de téléphone bloqués | navigateur (`cloud.js`) |
| Chacun peut supprimer son compte et ses données | serveur (`delete_my_account`) |

Pour voir les signalements, dans **SQL Editor** :
```sql
select r.created_at, m.body, p.username as auteur, m.hidden
from reports r
join messages m on m.id = r.message_id
left join profiles p on p.id = m.user_id
order by r.created_at desc;
```
Pour bannir quelqu'un : **Authentication → Users** → le compte → *Delete user*.

Le filtre de mots du navigateur se contourne facilement (fautes volontaires). Ce sont les signalements et ta surveillance qui protègent vraiment le chat.

## Ajouter du contenu

Tout se trouve dans `js/content.js`. Pour les portes à choix, une ligne = une question :
```
question avec ___ à compléter|bonne réponse|piège 1|piège 2#explication affichée après
```
Exemple dans la liste `prep` :
```
I'm afraid ___ spiders|of|from|by#be afraid of = avoir peur de.
```
Pour créer une 31e porte, ajoute une liste dans `D`, puis une entrée dans `GAMES` avec `choiceGen("ta_liste", "consigne")`.

## Limites connues

- L'XP est calculée dans le navigateur, puis envoyée au serveur. Un tricheur qui connaît JavaScript peut gonfler son XP dans le classement. Pour un jeu d'apprentissage, c'est acceptable.
- Le chat garde tous les messages. Le chat affiche les 60 derniers ; la base gratuite (500 Mo) tient très longtemps.
- Un projet Supabase gratuit peut être mis en pause après une longue période sans activité. Il suffit de le relancer depuis le tableau de bord.
- La lecture à voix haute utilise les voix installées sur l'appareil : sa qualité varie selon le navigateur.
