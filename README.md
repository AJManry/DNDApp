# Sagekeep

A Dungeon Master’s table for running — and building — a world. Search lore like you would ask Cursor, paint maps from a prompt, track inventory and skills, and play a complete Zelda-inspired 3-hour one-shot.

## The Song That Wakes the Green

Original homage (not Nintendo IP): 3rd-level D&D 5e, 3–5 players, about three hours.

1. **Windfall** — a harvest village that forgot its song  
2. **Forest of Echoes** — three virtue trails, mossfolk, a chime shrine  
3. **Temple of the Green Blade** — keys, puzzles, a bone captain, a sleeping construct  
4. **Sacred Plateau** — twilight duel with Lord Vaelith  
5. **Dawn** — epilogue

Pregenerated adventurers, stat blocks, boxed text, and a Twilight Clock are built into the **Table** tab.

## Features

- **Oracle** — full-text search across the world bible, plus “create a…” worldbuilding that becomes searchable  
- **Maps** — prompt-to-painting (cloud image model) and an offline inked cartographer; campaign art included  
- **Party** — HP, AC, abilities, skills, inventory, conditions, death saves, inspiration  
- **Table** — scene runner with 3-hour pacing, dice, initiative, DM secrets  
- **Chronicle** — notes, recap from completed scenes, custom lore

Table state lives in this browser (`localStorage`). The module itself travels with git.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test
npm run build
```

## Switching machines

Push this repo and clone it elsewhere. Use a Cursor Cloud Agent from any signed-in device at [cursor.com/agents](https://cursor.com/agents) if you want help expanding Eldara.
