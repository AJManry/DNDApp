import type { Scene } from '../types'
import { scenes as sceneList } from './scenes'

export const scenes: Scene[] = sceneList

export const CAMPAIGN = {
  title: 'The Song of Time',
  subtitle: 'A Legend of Zelda D&D 5e one-shot for 3–5 adventurers of 3rd level',
  duration: 'About 3 hours',
  players: '3–5 player characters, 3rd level, 5e',
  tone: 'Lyrical adventure across Hyrule: a frozen harvest, shrine trails, a temple with keys, and a twilight duel in the Sacred Realm.',
  premise:
    'In the kingdom of Hyrule the harvest banners hang still. The Song of Time — the old measure that keeps the Lost Woods green and the Triforce in balance — has gone thin as a held breath. Twilight fog drinks color from the leaves. Impa of Kakariko has heard the last true note fade. Someone must walk the three trails, wake the Forest Temple, and play the song in the Sacred Realm before Ganondorf unmakes the Goddess’s gift.',
  story: [
    'Hyrule is not dying in fire. It is dying in stillness. Lanterns hang and do not sway. People almost hum Zelda’s Lullaby, then stop, ashamed they cannot find the next note. The Song of Time is not a spell in a book. It is a practice: Courage to step before the path appears, Wisdom to listen until a path is kind, Power to give a note away. When it thins, harvests stall, animals go quiet, and twilight fog drinks color from the leaves. The dead keep their posts because nobody told them the password was a song.',
    'Ganondorf, Gerudo king, stole the rest of the measure into twilight. He is not a pig-demon yet. He is tired of chosen children and of a kingdom that fattened on a Goddess’s gift while the desert went without. His thesis: if nothing is asked to be a hero, nobody has to fail. Stillness is a locked room. Impa of the Sheikah knows this and cannot walk into the Forest Temple to prove it — her hands shake too badly to play a true note. She has Navi, last uncaught spark of the song, and the Ocarina of Time, and a village that has set a feast it cannot eat.',
    'The adventurers are a chorus, not a single chosen one. They take the ocarina, walk the Lost Woods’ three shrine trails, bargain with Koroks, open a vine door, spend keys, lay a previous Hero of Time to rest or to the sword, wake or soothe Armogohma, and finish the song on the Sacred Realm’s dais while Ganondorf tries to unmake it. Dawn comes back green — or scarred, if they lingered. Ganon’s Castle still wears a little shadow. That is tomorrow. Tonight is Kakariko’s windmill remembering how to laugh.',
  ],
  howToRun: [
    'Read Home before you sit down; run Table during play. Boxed text is read-aloud. “What’s happening” is the situation. Options are ways through — not a menu the players must see.',
    'Keep the 3-hour clock honest. Skip the Bokoblin ambush first. Armogohma can be a lullaby skill challenge. Do not start Ganon’s Castle tonight.',
    'The Twilight Clock has six segments. Advance it for detours, noisy shrine failures, Lost Woods rests, and lingering past a scene window. At 4, Kakariko’s well goes dark. At 6, Ganondorf starts in phase 2 and dawn is bittersweet.',
    'Each PC claims Courage, Wisdom, or Power. Once per session, when they act in that spirit, add 1d8 after seeing a roll. Spent against Ganondorf, it also ignores his resistance and deals +1d8.',
    'A creature holding the Ocarina of Time can spend an action on a true note (no check in calm air; DC 12 Performance or Constitution in combat or wind). A true note opens vine-sealed Kokiri doors, gives Armogohma disadvantage on its next attack, and counts as singing a verse against Unmake the Measure.',
  ],
  skipIfBehind: [
    'Bokoblin Ambush (Act 2, optional) — leave a chime-necklace on a thorn.',
    'Armogohma — 3 successes before 3 failures, DC 13, instead of the stat block.',
    'Third Lost Woods trail — two virtues still finish a song; the missing stone is harder, not impossible.',
    'Gloom Span side-door — Armogohma can still grant the Heart Container.',
  ],
  villain:
    'Ganondorf wants the Song finished so he can take the Triforce whole, then still the world. He will talk. He will fight. He can be killed, spared, or asked to become the Sacred Realm’s listener. Play him as a thesis with a young, exhausted Gerudo face until phase 2.',
  ending:
    'Go around the table. One image each of the first quiet morning. Thank them. End on a note — a cucco, a windmill, a fairy saying hey — not a lecture. If the Clock hit 6, the miller’s child is a sequel, not a failed session.',
  inspiration:
    'A fan-made tabletop campaign set in Hyrule, using the names and places of The Legend of Zelda. Play it at your table as a love letter — not an official Nintendo product.',
}

export const virtueRules = [
  {
    name: 'The Ocarina of Time',
    text: 'Story focus. A creature holding it can spend an action to play a single true note (no check in calm air; DC 12 Performance or Constitution in combat or high wind). A true note: opens vine-sealed doors marked with the Kokiri leaf, gives Armogohma disadvantage on its next attack, and counts as “singing a verse” against Ganondorf’s Unmake the Measure.',
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
    text: 'Six segments. Advance one when the party takes a long detour, fails a shrine in a noisy way, rests in the Lost Woods, or lingers more than 15 minutes past a scene’s end window. At 4, Kakariko’s well goes dark (NPCs frightened). At 6, Ganondorf begins the fight already in phase 2 and the village suffers a lasting scar in the epilogue.',
  },
]

export const acts = [
  {
    act: 1 as const,
    title: 'Kakariko Village',
    minutes: '0:00–0:30',
    color: 'gold',
    hook: 'A harvest that cannot start. Impa, Navi, and Poes at the well.',
  },
  {
    act: 2 as const,
    title: 'Lost Woods',
    minutes: '0:30–1:20',
    color: 'green',
    hook: 'Three shrine trails, Koroks, Saria’s Meadow, optional Bokoblins.',
  },
  {
    act: 3 as const,
    title: 'Forest Temple',
    minutes: '1:20–2:35',
    color: 'moss',
    hook: 'Vine door, keys, puzzles, the Hero’s Shade, Armogohma.',
  },
  {
    act: 4 as const,
    title: 'Sacred Realm',
    minutes: '2:35–3:15',
    color: 'twilight',
    hook: 'Triforce trials and a duel-and-song with Ganondorf.',
  },
  {
    act: 5 as const,
    title: 'Dawn over Hyrule',
    minutes: 'coda',
    color: 'dawn',
    hook: 'Green comes back. Go around the table. Stop while it still sounds like music.',
  },
]
