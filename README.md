# Sagekeep

A Dungeon Master’s table for running — and building — a world. Search lore like you would ask Cursor, paint maps from a prompt, track inventory and skills, and play a complete Zelda-inspired 3-hour one-shot.

## Play in a browser

The built site is published on the `gh-pages` branch. After you enable GitHub Pages once, it stays live for any machine:

1. Open [DNDApp Pages settings](https://github.com/AJManry/DNDApp/settings/pages)
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Set the branch to **gh-pages** / **/ (root)** and click **Save**
4. Wait a minute, then play at **https://ajmanry.github.io/DNDApp/**

## The Song That Wakes the Green

Original homage (not Nintendo IP): 3rd-level D&D 5e, 3–5 players, about three hours.

1. **Windfall** — a harvest village that forgot its song  
2. **Forest of Echoes** — three virtue trails, mossfolk, a chime shrine  
3. **Temple of the Green Blade** — keys, puzzles, a bone captain, a sleeping construct  
4. **Sacred Plateau** — twilight duel with Lord Vaelith  
5. **Dawn** — epilogue

Pregenerated adventurers, stat blocks, boxed text, and a Twilight Clock are built into the **Table** tab.

## Features

- **Oracle** — a live language model answers as Sage Nerin, grounded in the campaign bible. Default is Puter.js in the browser (no app key). Optional Groq / OpenRouter / OpenAI keys stay in the browser.  
- **Maps** — prompt-to-painting (cloud image model) and an offline inked cartographer; campaign art included  
- **Party** — HP, AC, abilities, skills, inventory, conditions, death saves, inspiration  
- **Table** — scene runner with 3-hour pacing, dice, initiative, DM secrets  
- **Chronicle** — notes, recap from completed scenes, custom lore

Table state lives in this browser (`localStorage`). You can play from any machine at the public URL above.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test
npm run build
```
