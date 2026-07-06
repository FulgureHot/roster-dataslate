# 40K Roster Analyzer — Electron App

Application desktop Windows/Mac/Linux pour analyser les listes Warhammer 40K 11e édition (Space Marines, Blood Angels, Orks).

## Fonctionnalités

- **Paste Roster** — coller un export BattleScribe / Warhammer App, ou importer directement depuis une URL (Goonhammer, New Recruit, etc.)
- **Units** — détail des unités parsées : profils, armes, mots-clés
- **Statistics** — scores agrégés de la liste
- **Detachments** — base de données des détachements SM/BA/Orks 11e édition (règles, dispositions de force, matrice de missions)
- **Combat Sim** — simulateur de combat probabiliste (touche/blessure/sauvegarde/dégâts, probabilité de kill)
- **Library** — bibliothèque de listes sauvegardées (`localStorage`), avec tri, comparaison, import/export JSON

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
- `40K Roster Analyzer Setup 1.0.0.exe` — installateur NSIS (recommandé)
- `40K Roster Analyzer 1.0.0.exe` — version portable (pas d'installation)

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
