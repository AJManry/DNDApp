# Hyrule

A Dungeon Master’s table set in **The Legend of Zelda**. Search lore like you would ask Cursor, paint maps from a prompt, track inventory and skills, and play a complete 3-hour one-shot in the kingdom of Hyrule.

This is a fan-made tabletop campaign for your table — not an official Nintendo product.

## Play in a browser

The built site is published on the `gh-pages` branch. After you enable GitHub Pages once, it stays live for any machine:

1. Open [DNDApp Pages settings](https://github.com/AJManry/DNDApp/settings/pages)
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Set the branch to **gh-pages** / **/ (root)** and click **Save**
4. Wait a minute, then play at **https://ajmanry.github.io/DNDApp/**

## The Song of Time

3rd-level D&D 5e, 3–5 players, about three hours, using Zelda names and places.

1. **Kakariko Village** — a harvest village that forgot its song; Impa and Navi  
2. **Lost Woods** — three Triforce trails, Koroks, Saria’s Meadow  
3. **Forest Temple** — keys, puzzles, the Hero’s Shade, Armogohma  
4. **Sacred Realm** — twilight duel with Ganondorf  
5. **Dawn over Hyrule** — epilogue

Pregenerated adventurers (Link, Sheik, Saria, Darunia), stat blocks, boxed text, and a Twilight Clock are built into the **Table** tab.

## Oracle via Cursor

1. Open **Oracle → Model settings**
2. Create a user API key at [cursor.com/dashboard/api](https://cursor.com/dashboard/api) and paste it
3. Leave **Search this GitHub repo** on so the agent can read `src/data/`
4. Ask a question. The first reply starts a read-only Cloud Agent (it can take a minute); later questions reuse that session

Local `npm run dev` proxies `/cursor-api` to Cursor so the browser is not blocked by CORS. The hosted GitHub Pages app talks to `api.cursor.com` directly.

## Features

- **Oracle** — Impa answers through your [Cursor Cloud Agent](https://cursor.com/dashboard/api): questions bill your Cursor tokens and can search this repo (`src/data/`). Puter / Groq / OpenAI remain optional fallbacks. The key stays in this browser.  
- **Maps** — prompt-to-painting (cloud image model) and an offline inked cartographer; campaign art of Hyrule included  
- **Party** — HP, AC, abilities, skills, inventory, conditions, death saves, inspiration  
- **Table** — scene runner with 3-hour pacing, dice, initiative, DM secrets  
- **Chronicle** — notes, recap from completed scenes, custom lore

Table state lives in this browser (`localStorage`). You can play from any machine at the public URL above.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Local Vite proxies `/cursor-api` to `https://api.cursor.com` so the Oracle can use your Cursor key without browser CORS issues.

On the GitHub Pages host, the Oracle talks to the Cursor API directly. If the browser blocks that, run Hyrule locally as above.

```bash
npm test
npm run build
```
