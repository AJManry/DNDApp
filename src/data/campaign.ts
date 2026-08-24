import type { Scene } from '../types'
import { scenes as sceneList } from './scenes'

export const scenes: Scene[] = sceneList

export const CAMPAIGN = {
  title: 'The Song of Time',
  subtitle: 'A Legend of Zelda D&D 5e one-shot for 3–5 adventurers of 3rd level',
  duration: 'About 3 hours (3½ if you run every fight)',
  players: '3–5 player characters, 3rd level, 5e',
  tone: 'Adventure across Hyrule: a harvest stalled by a demon melody, shrine trails that charge an ocarina, a temple with keys, steel in the woods, and a twilight duel in the Sacred Realm.',
  premise:
    'Ganondorf played a demon melody in the Sacred Realm. Twilight fog drinks color from the leaves. Harvests stall. Only the Ocarina of Time can break that melody — but the instrument is empty until the heroes imbue it with power from the temples: the Lost Woods shrines, the Forest Temple, and the last gifts at the Sacred Realm stones. Impa of Kakariko cannot play it. Someone has to walk the trails, wake the temple, charge the ocarina, and use it on the dais before the melody finishes the kingdom.',
  story: [
    'Ganondorf, Gerudo king, stood in the Sacred Realm and played a demon melody. The tune is a weapon, not a poem. It spreads as twilight fog, stalls mills and fields, and teaches beasts and dead things to serve the dusk-king. Kakariko set a harvest feast and cannot start it. People work in short, careful bursts, then stop, because the air itself is humming something wrong. The miller’s child is missing. Far north, Ganon’s Castle drinks the same fog.',
    'Impa of the Sheikah knows the only answer: the Ocarina of Time. Played after it has taken power from the temples, it can shatter the demon melody. Without those charges it is still a key — vine doors, temple locks, a focus in a fight — but it cannot save Hyrule. Her hands shake too badly to cover the holes. She has Navi, a blue fairy who still cuts through the fog, and a leaf-map of the Lost Woods, the Forest Temple, and the Sacred Realm.',
    'The adventurers take the ocarina, walk the Lost Woods’ three shrine trails, bargain with Koroks, cut through Wolfos and Bokoblins, open a vine door past Lizalfos, spend keys, survive a Wallmaster over the gloom, lay a previous Hero of Time to rest or to the sword, wake or soothe Armogohma, catch leftover twilight on the Sacred Realm stair, charge the last temple-gifts into the ocarina, and play it on the dais while Ganondorf tries to drown it with the same demon melody. Dawn comes back green — or scarred, if they lingered. Ganon’s Castle still wears a little shadow. That is tomorrow. Tonight is Kakariko’s windmill turning because someone charged an ocarina and used it.',
  ],
  howToRun: [
    'Read Home before you sit down; run Table during play. Boxed text is read-aloud. “What’s happening” is the situation. Options are ways through — not a menu the players must see.',
    'Keep the 3-hour clock honest. If you must cut fights, skip Keese at the mill, Wolfos in the gold grass, and the twilight choir on the stair — in that order. Armogohma can be an ocarina skill challenge. Talk can still walk through Bokoblins and Lizalfos. Do not start Ganon’s Castle tonight.',
    'The Twilight Clock has six segments. Advance it for detours, noisy shrine failures, Lost Woods rests, and lingering past a scene window. At 4, Kakariko’s well goes dark. At 6, Ganondorf starts in phase 2 and dawn is bittersweet. The Clock is the demon melody spreading.',
    'Each PC claims Courage, Wisdom, or Power. Once per session, when they act in that spirit, add 1d8 after seeing a roll. Spent against Ganondorf, it also ignores his resistance and deals +1d8.',
    'A creature holding the Ocarina of Time can spend an action to play it (no check in calm air; DC 12 Performance or Constitution in combat or wind). Playing it opens vine-sealed Kokiri doors, gives Armogohma disadvantage on its next attack, and — once the temples have charged it — counts as a success against the demon melody. The three shrine trails, the Forest Temple, and the Sacred Realm stones each imbue it with power.',
  ],
  skipIfBehind: [
    'The Mill That Bites (Act 1) — scorched vane, gold trail, go.',
    'Wolfos in the Gold Grass (Act 2) — a howl, torn grass, keep walking.',
    'The Uncaught Measures (Act 4 choir) — one Bubble pops, the Stalfos salutes, trials begin.',
    'Armogohma — 3 successes before 3 failures, DC 13, instead of the stat block.',
    'Third Lost Woods trail — two shrine charges still finish the ocarina; the missing stone is harder, not impossible.',
    'Gloom Span side-door — Armogohma can still grant the Heart Container.',
  ],
  villain:
    'Ganondorf played the demon melody to take the Triforce whole and bind Hyrule. He will talk. He will fight. He can be killed, spared, or asked to become the Sacred Realm’s warden. Play him as a thesis with a young, exhausted Gerudo face until phase 2.',
  ending:
    'Go around the table. One image each of the first morning the fog lifts. Thank them. End on something small — a cucco, a windmill, a fairy saying hey — not a lecture. If the Clock hit 6, the miller’s child is a sequel, not a failed session.',
  inspiration:
    'A fan-made tabletop campaign set in Hyrule, using the names and places of The Legend of Zelda. Play it at your table as a love letter — not an official Nintendo product.',
}

export const virtueRules = [
  {
    name: 'The Ocarina of Time',
    text: 'Story focus. A creature holding it can spend an action to play it (no check in calm air; DC 12 Performance or Constitution in combat or high wind). Playing it: opens vine-sealed doors marked with the Kokiri leaf, gives Armogohma disadvantage on its next attack, and — once charged at the temples — counts as a success against Ganondorf’s demon melody. Each shrine trail, the Forest Temple, and the Sacred Realm stones imbue it with power. Without those charges it still opens doors; it cannot break the melody.',
  },
  {
    name: 'The Triforce (Courage, Wisdom, Power)',
    text: 'Each PC may declare one piece of the Triforce at the start (or inherit a pregen’s). Once per session, when they act in that virtue’s spirit, they may add 1d8 to an attack, check, or save after seeing the roll. Against Ganondorf, a spent virtue also ignores his resistance and deals +1d8 damage.',
  },
  {
    name: 'Heart Container',
    text: 'The temple’s blessing. One character (or the party, shared) gains a Heart Container: the next time they would drop to 0 hp, they drop to 1 hp instead and each ally within 30 feet gains 1d6 temp hp. Then the container is spent.',
  },
  {
    name: 'Twilight Clock',
    text: 'Six segments. The demon melody spreading. Advance one when the party takes a long detour, fails a shrine in a noisy way, rests in the Lost Woods, or lingers more than 15 minutes past a scene’s end window. At 4, Kakariko’s well goes dark (NPCs frightened). At 6, Ganondorf begins the fight already in phase 2 and the village suffers a lasting scar in the epilogue.',
  },
]

export const acts = [
  {
    act: 1 as const,
    title: 'Kakariko Village',
    minutes: '0:00–0:40',
    color: 'gold',
    hook: 'A harvest that cannot start. Impa, Navi, Poes at the well, Keese at the mill.',
  },
  {
    act: 2 as const,
    title: 'Lost Woods',
    minutes: '0:40–1:30',
    color: 'green',
    hook: 'Three shrine trails that charge the ocarina, Koroks, Saria’s Meadow, Wolfos, then Bokoblins.',
  },
  {
    act: 3 as const,
    title: 'Forest Temple',
    minutes: '1:30–2:45',
    color: 'moss',
    hook: 'Lizalfos at the vine door, keys, a Wallmaster over the gloom, the Hero’s Shade, Armogohma’s temple charge.',
  },
  {
    act: 4 as const,
    title: 'Sacred Realm',
    minutes: '2:45–3:30',
    color: 'twilight',
    hook: 'Twilight stair, Bubbles and a Stalfos, Triforce stones that finish charging the ocarina, a duel with Ganondorf.',
  },
  {
    act: 5 as const,
    title: 'Dawn over Hyrule',
    minutes: 'coda',
    color: 'dawn',
    hook: 'Green comes back. Go around the table. Stop while the fog is still lifting.',
  },
]
