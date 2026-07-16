# Roster Dataslate — Electron App

Compagnon Warhammer 40K 11e édition (Space Marines, Blood Angels, Orks) : analyse de listes hors jeu, et aide à la décision en partie. Desktop Windows/Mac/Linux + PWA mobile.

## Fonctionnalités

Deux modes :

### 📋 Lists — préparation hors jeu
- **Library** — coller un export BattleScribe / Warhammer App (ou importer par URL) ; les listes analysées rejoignent la bibliothèque (tri, comparaison par palier de points, notes, import/export JSON)
- **Units / Statistics** — détail des unités (profils, armes, règles tappables) et scores agrégés de la liste
- **Combat Sim** — simulateur théorique contre des profils de référence
- **Detachments** — référentiel des détachements SM/BA/Orks 11e édition

### ☁ Sync multi-appareils (optionnel)
La Library peut se synchroniser entre appareils (desktop Electron, Chrome, Firefox) via le dépôt GitHub : fichier `library.json` sur la branche `library-data`, tiré au lancement et poussé après chaque modification (débouncé), fusion par entrée avec propagation des suppressions, plafond 100 listes. Nécessite un token GitHub à granularité fine (Contents Read&Write sur ce seul repo), collé une fois par appareil dans la carte « ☁ Sync » de la Library — guide inclus dans l'app. **Le repo étant public, les listes synchronisées sont publiques.** Sans token ou hors-ligne, l'app fonctionne exactement comme avant.

### ⚔ Battle — en partie
- **Setup** — ta liste + la liste adverse (collée depuis WhatsApp/mail) en 3 étapes
- **Plan** — toutes les confrontations calculées d'avance, dans les deux sens : meilleures cibles de chaque unité, menaces adverses, pression subie par tes unités, suggestion de cible Oath of Moment ; un tap ouvre le duel détaillé
- **Tracker** — PV/figurines restants (steppers + pavé de saisie rapide + micro en ligne), CP/round, score par round (primaire/secondaire), journal des pertes, annulation, barres de vie, badges Battle-shock, portées de menace
- **Duel** — distribution des dégâts ("chances de faire au moins X"), évaluation d'échange en points, probabilité de kill par round
- **Tools** — stratagèmes avec décompte de CP (liste par détachement), probabilité de charge, grenade, checklist de tour

À l'analyse d'une liste, des avertissements signalent les incohérences (total de points ≠ somme des unités, warlord manquant, armes inconnues du simulateur). La Library superpose les listes d'un même palier de points sur un radar et trace l'évolution du score d'une liste au fil de ses versions (sparkline).

Le parseur reconnaît le format texte du Warhammer App/BattleScribe et fait correspondre les noms d'unités/armes aux bases de données internes (`UDB`, `WDB`, `DETACHMENT_DB`, `LEADER_DB`) pour déduire les profils de combat et simuler les jets de dés.

## Prérequis

- **Node.js v18+** : https://nodejs.org (choisir LTS)
- **npm** : inclus avec Node.js

## Installation et lancement (développement)

```bash
# 1. Ouvrir un terminal dans ce dossier
cd 40k-analyzer-electron

# 2. Installer les dépendances (~200 MB, une seule fois)
npm install

# 3. Lancer l'application
npm start
```

L'application s'ouvre immédiatement. `localStorage` est persistant entre les sessions.

## Compiler un .exe Windows

```bash
# Depuis le dossier du projet
npm run build:win
```

Le résultat est dans le dossier `dist/` :
- `Roster Dataslate Setup 1.0.0.exe` — installateur NSIS (recommandé)
- `Roster Dataslate 1.0.0.exe` — version portable (pas d'installation)

> **Note** : la compilation Windows depuis un Mac ou Linux nécessite Wine ou une CI.
> Depuis un PC Windows, ça fonctionne directement.

## Compiler pour Mac ou Linux

```bash
npm run build:mac    # → .dmg
npm run build:linux  # → .AppImage
```

## Structure du projet

```
40k-analyzer-electron/
├── main.js          ← Process principal Electron (fenêtre, menus)
├── package.json     ← Config npm + electron-builder
├── src/
│   └── index.html   ← L'application complète (HTML + JS + CSS)
├── assets/
│   ├── icon.png     ← Icône 256×256 (à remplacer)
│   ├── icon.ico     ← Icône Windows (à remplacer)
│   └── icon.icns    ← Icône Mac (à remplacer)
└── dist/            ← Généré par npm run build:win
    └── *.exe
```

## Icônes (optionnel)

Le projet inclut des icônes placeholder. Pour les remplacer :
- `icon.png` : 256×256 pixels, fond transparent
- `icon.ico` : convertir depuis le PNG avec https://convertio.co
- `icon.icns` : Mac uniquement, avec `iconutil` (macOS)

## Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl+N` | Nouvelle analyse |
| `Ctrl+E` | Exporter la bibliothèque |
| `Ctrl+I` | Importer une bibliothèque |
| `Ctrl+=` | Zoom + |
| `Ctrl+-` | Zoom − |
| `Ctrl+0` | Zoom normal |
| `F11` | Plein écran |
| `F12` | DevTools |

## Différences vs la version HTML

- `localStorage` **persiste entre sessions** sans aucun problème
- L'import/export JSON fonctionne nativement
- Les fenêtres externes (liens) s'ouvrent dans le navigateur système
- Menu natif Windows avec raccourcis clavier
