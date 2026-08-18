import type { Scene } from '../types'

export const CAMPAIGN = {
  title: 'The Song of Time',
  subtitle: 'A Legend of Zelda D&D 5e one-shot for 3–5 adventurers of 3rd level',
  duration: 'About 3 hours',
  tone: 'Lyrical adventure across Hyrule: exploration, shrine puzzles, a temple with keys, and a twilight duel in the Sacred Realm.',
  premise:
    'In the kingdom of Hyrule the harvest banners hang still. The Song of Time — the old measure that keeps the Lost Woods green and the Triforce in balance — has gone thin as a held breath. Twilight fog drinks color from the leaves. Impa of Kakariko has heard the last true note fade. Someone must walk the three trails, wake the Forest Temple, and play the song in the Sacred Realm before Ganondorf unmakes the Goddess’s gift.',
  inspiration:
    'A fan-made tabletop campaign set in Hyrule, using the names and places of The Legend of Zelda. Overworld paths, a fairy companion, a temple with keys and a living guardian, the Triforce virtues, and a usurper in twilight. Play it at your table as a love letter — not an official Nintendo product.',
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

export const scenes: Scene[] = [
  {
    id: 's1-festival',
    act: 1,
    title: 'The Festival That Forgot Its Song',
    minuteStart: 0,
    minuteEnd: 10,
    mapId: 'map-kakariko',
    boxedText:
      'Kakariko should be loud. Harvest lanterns hang from every eave, but they do not stir. The windmill turns half-heartedly. On the dirt square, tables are set for a feast no one is eating. People speak in the careful voices of a house where a child is sleeping — or dying. Above the old stone well, a single blue fairy hangs in the air, pulsing like a held note.',
    dmNotes:
      'Let players introduce themselves as Hylians, Sheikah, Kokiri, Gorons, Zora, or dream-called strangers. Ask each: what did you notice first — the silence, Navi’s spark, or the twilight at the tree line? Rumor table: (1) the miller’s child wandered toward the Lost Woods; (2) Impa has not slept; (3) Bokoblin drums last night; (4) the well water tastes like old rupees and rain.',
    skillChecks: [
      {
        name: 'Read the village',
        dc: 12,
        ability: 'Insight or Perception',
        success: 'The silence is not grief — it is a song missing its downbeat. People keep almost humming Zelda’s Lullaby, then stop.',
        failure: 'Everyone seems merely tired. You miss that Navi’s glow is fading in time with the distant fog.',
      },
    ],
  },
  {
    id: 's1-impa',
    act: 1,
    title: 'Impa and Navi',
    minuteStart: 10,
    minuteEnd: 20,
    mapId: 'map-kakariko',
    boxedText:
      'An elder Sheikah in white and deep red sits on the well’s lip, the Ocarina of Time across her knees. The blue fairy darts to your shoulders, rings once like a glass tapped with a fingernail, and settles. “Hey! Listen!” she chimes. Impa’s voice is warm and precise. “I am Impa, of the Sheikah. This is Navi. She is the last uncaught measure of the Song of Time. Ganondorf has stolen the rest into twilight. If Hyrule sleeps too long, the kingdom will dream the Demon King’s dream.”',
    dmNotes:
      'Impa is kind, tired, and unwilling to enter the Forest Temple — her hands shake too badly to play a true note. Navi can answer one yes/no question per scene by chiming (bright = yes, dull = no, split tone = complicated). Impa gives the Ocarina of Time to whoever first offers to help, or to the PC with Virtue: Wisdom (often Sheik). She sketches a leaf-map: Lost Woods, Forest Temple, Sacred Realm. She warns: do not rest in the Lost Woods after dusk. If Sheik is at the table, Impa does not unmask her unless the player does.',
    treasure: 'Ocarina of Time (story focus). A pouch of 3 red potions (each heals 2d4+2).',
  },
  {
    id: 's1-poes',
    act: 1,
    title: 'Poes at the Well',
    minuteStart: 20,
    minuteEnd: 30,
    mapId: 'map-kakariko',
    encounterIds: ['poe'],
    boxedText:
      'The well-water goes black. Three lanterns of bruised-purple light peel out of the shaft, humming a half-step flat — Poes, the hungry dead of twilight. Villagers stumble back. Navi’s glow gutters. Impa’s voice is suddenly a commander’s: “They are eating the measure. Do not let them touch the fairy.”',
    dmNotes:
      '3 Poes (4 if 5 PCs). Tutorial fight: open terrain, well as half cover, Navi can grant one PC advantage once by flaring. If a Poe hits Navi (AC 15, 8 hp), the Twilight Clock advances 1. After the fight, the path to the Lost Woods is obvious — a pale gold trail through the fields toward the trees.',
    treasure: 'A Poe leaves a bead of condensed dusk (uncommon: once, as a bonus action, dim light 20 ft. that reveals invisible twilight creatures).',
  },
  {
    id: 's2-trails',
    act: 2,
    title: 'Three Trails in the Lost Woods',
    minuteStart: 30,
    minuteEnd: 45,
    mapId: 'map-lost-woods',
    boxedText:
      'The Lost Woods do not swallow sound — they return it wrong. Your footsteps arrive a breath late. Birdsong answers in a key you do not know. The gold trail splits around a ring of standing stones: a Master Sword shrine to the left (Courage), a Sheikah-eye shrine ahead (Wisdom), a Goron-gauntlet shrine to the right (Power). Moss hangs like curtains. Somewhere deeper, wooden chimes turn though there is no wind.',
    dmNotes:
      'Each trail is a short vignette (5 minutes). Courage: a washed-out bridge, Athletics DC 13 or find a fallen trunk (Survival DC 12). Wisdom: a fork that loops unless someone tracks Navi’s glow or succeeds DC 13 Investigation on moss-arrows (the classic Lost Woods trick: the quiet way is the true way). Power: a fallen cedar to lift or smash (Athletics DC 14, or 8 damage to the wood). Completing a trail matching a PC’s virtue grants inspiration. Taking all three advances the Twilight Clock by 1 — pick two if time is tight.',
    skillChecks: [
      {
        name: 'Stay on the true path',
        dc: 13,
        ability: 'Survival or Investigation',
        success: 'You notice the late echoes are louder on false trails. The quiet way is the real way — Saria’s trick.',
        failure: 'You loop once. Twilight Clock +1, and a distant Bokoblin horn answers your noise.',
      },
    ],
  },
  {
    id: 's2-koroks',
    act: 2,
    title: 'The Korok Bargain',
    minuteStart: 45,
    minuteEnd: 55,
    mapId: 'map-lost-woods',
    boxedText:
      'Faces bloom in the root-tangle: small, leaf-masked, eyes like wet river stones. A Korok elder no taller than a boot holds up a seed. “Yahaha! Lost-song people,” they creak. “Give us a true name, a true joke, or a true hunger, and we show the Forest Meadow. Give us a lie, and we show you the long way, where the fog has teeth.”',
    dmNotes:
      'Social scene. A sincere offering (a ration, a song, a secret, Saria’s Korok seed) succeeds automatically. Deception DC 14 can fake a “true” gift but the Koroks remember. On a kind success they also mark a secret alcove in the Forest Temple (Room of Quiet Roots — a small key). On a lie or a threat, Twilight Clock +1 and they vanish; the shrine is still findable with DC 14 Survival.',
    skillChecks: [
      {
        name: 'Speak with the forest',
        dc: 12,
        ability: 'Persuasion or Performance',
        success: 'They giggle like rain on leaves and point. One tucks a glow-cap mushroom into a pack (advantage on the next Nature or Survival check).',
        failure: 'They melt into moss. You can still find the meadow, but it takes longer.',
      },
    ],
  },
  {
    id: 's2-shrine',
    act: 2,
    title: 'Saria’s Meadow',
    minuteStart: 55,
    minuteEnd: 70,
    mapId: 'map-lost-woods',
    boxedText:
      'A clearing. Four wooden chimes hang from a living arch: low, middle, high, and a cracked fourth that does not belong. Stone underfoot is carved with the Kokiri’s emerald. When the wrong chime is struck, the forest answers with a laugh that is not a laugh. When the right three sound in rising order, gold light writes a verse in the air: COURAGE IS THE STEP YOU TAKE BEFORE THE PATH APPEARS.',
    dmNotes:
      'Puzzle: the cracked chime is twilight-tainted. Players must strike low → middle → high (Saria’s Song as a rising phrase). Clues: Navi chimes the first note; a Perception DC 12 spots moss growing only on the three living chimes; Arcana DC 13 feels the cracked one hum flat. Wrong order twice: 2 Poes drift in (or just Clock +1 if the first fight ran long). Success: Triforce of Courage (a glowing sigil). Any PC can spend it once to automatically succeed a save against fear or to add 1d8 to a heroic movement (jump, dash through gloom, hold a door).',
    treasure: 'Triforce of Courage (consumable virtue-sigil).',
  },
  {
    id: 's2-bokoblins',
    act: 2,
    title: 'Bokoblin Ambush',
    minuteStart: 70,
    minuteEnd: 80,
    mapId: 'map-lost-woods',
    optional: true,
    encounterIds: ['bokoblin'],
    boxedText:
      'The gold trail tightens. Pig-ivory horns. Three (or four) hunched Bokoblins in scrap-hide step from the ferns, eyes reflecting purple. Their leader wears a necklace of silenced wind-chimes. “The dusk-king pays for quiet,” he grunts. “You are very loud.”',
    dmNotes:
      'Skip if the session is behind. 3 Bokoblins (4 if the party is fresh). The chime-necklace can be recovered: advantage on the next ocarina check. Terrain: two trees as half cover, a stream as difficult terrain. They flee at half hp if the leader drops.',
    treasure: 'Chime-necklace; 12 rupees in crude coins; a strip of temple-map leather showing a locked door.',
  },
  {
    id: 's3-door',
    act: 3,
    title: 'The Vine Door',
    minuteStart: 80,
    minuteEnd: 90,
    mapId: 'map-forest-temple',
    boxedText:
      'The Forest Temple rises from the Lost Woods like a stone seed that forgot to stop growing. Stairs climb between buttresses of root and masonry. The great door is a lattice of sleeping vines. In the lintel, a leaf-shaped recess the size of an ocarina’s mouth. The air smells of wet iron and crushed mint.',
    dmNotes:
      'A true note on the Ocarina of Time opens the door. Alternatives: Strength DC 18 to tear a gap (Clock +1, alarm), or the Courage sigil pressed to the recess. Inside: dim green light, dust, a mural of three sages offering a song to the Sacred Realm. History DC 13: the “heroes” look like ordinary people — a farmhand, a scholar, a Goron smith. The Goddess’s gift was never only a chosen-one story. It was a chorus.',
  },
  {
    id: 's3-torches',
    act: 3,
    title: 'Hall of Kindled Breath',
    minuteStart: 90,
    minuteEnd: 100,
    mapId: 'map-forest-temple',
    boxedText:
      'A long hall. Four unlit braziers. Murals show Farore’s wind moving through grass, then Navi’s kin as fireflies, then a hearth in Kakariko, then a Hyrule dawn. In the far arch, a portcullis of living wood waits, patient as a held breath. When you step in, the braziers sigh — hungry.',
    dmNotes:
      'Puzzle: light the braziers in story order — wind (empty / fan / gust), fireflies (tiny lights / dancing lights / a torch moved quickly), hearth (a real flame), dawn (all three plus the ocarina’s note, or the last brazier faces the entrance so morning-logic = light it from the doorway). Simpler table solve: numbered 1–4 on the mural; light 1-2-3-4. Deku Babas (2) drop from the ceiling if they light them in reverse. Success opens the portcullis and reveals a small key on the last brazier’s rim.',
    treasure: 'Small Key of Kindled Breath.',
    encounterIds: ['deku-baba'],
  },
  {
    id: 's3-gloom',
    act: 3,
    title: 'The Gloom Span',
    minuteStart: 100,
    minuteEnd: 110,
    mapId: 'map-forest-temple',
    boxedText:
      'The floor is gone. A pit of slow, starless gloom — twilight leaking up from the well of the world. Stone platforms drift like lily pads on a black pond, pausing, then sliding. On the far ledge, a chest bound in root-iron. Something in the dark below follows your shadows the way a fish follows crumbs.',
    dmNotes:
      'Traversal, not a slog. Each PC describes a crossing: Acrobatics DC 12, Athletics DC 12, or a clever use of rope/spells (auto). Failure: 1d6 necrotic and they land on a lower platform — one extra check. The thing below is flavor unless someone falls in twice (then one Deku Baba). Chest: 2 red potions, 30 rupees of old temple coins, and the Boss Key if you want a shorter dungeon — otherwise the Boss Key is after the Hero’s Shade. Locked side-door here eats the Kindled Breath key and hides a Heart Container (see table rules) plus 1 potion of healing.',
    treasure: 'Red potions; optional Heart Container behind the locked door.',
  },
  {
    id: 's3-statues',
    act: 3,
    title: 'Statues of the Sages',
    minuteStart: 110,
    minuteEnd: 120,
    mapId: 'map-forest-temple',
    boxedText:
      'Three greenstone statues stand on a circular floor: a runner with the Master Sword, a listener with a Sheikah harp, a Goron with a hammer like a sunrise. Each can be rotated. On the ceiling, a faded fresco of the Sacred Realm — three standing stones, the gold one slightly north of true north. The room’s only door south remains shut. In the silence you hear, very faintly, Ganondorf practicing a speech to an empty throne.',
    dmNotes:
      'Puzzle: rotate statues to face the “true Green” — the Sacred Realm’s gold stone, slightly off north. Clues: Survival or Nature DC 12 notices moss on the north wall is thicker toward a scuff 15° east of north; the fresco’s gold stone is the Courage stone; Navi drifts to the correct bearing. When aligned, the south door opens and a second small key drops from the listener’s harp. Wrong alignment twice: the Goron statue swings (one attack, +5/1d10+2) then resets.',
    treasure: 'Small Key of Listening.',
  },
  {
    id: 's3-shade',
    act: 3,
    title: 'The Hero’s Shade',
    minuteStart: 120,
    minuteEnd: 135,
    mapId: 'map-forest-temple',
    encounterIds: ['heros-shade'],
    boxedText:
      'The barracks were for living Knights of Hyrule. What remains is a captain in rusted green-gold plate, skull bright as a lantern — the Hero’s Shade, a previous chosen one who never laid down the sword. He salutes with a blade that still remembers courtesy. “The usurper promised we would keep our posts,” he says, almost grateful. “I have been keeping them so long I forgot the password was a song.” He sets his helm. “If you are the chorus, prove it. If you are thieves, I will make you quiet.”',
    dmNotes:
      'Mini-boss. Hero’s Shade. He is honorable: if the party plays a true note before attacking, he has disadvantage on his first turn and will accept a surrender-parley at 15 hp (he yields the Boss Key and asks them to bury his name as a Hero of Time, not a ghost). Otherwise he fights until destroyed. Rally the Hollow once. Afterward: Boss Key, and a mural showing Ganondorf as a young Gerudo king who locked himself in the Sacred Realm “to keep the Triforce safe from war” — tragedy, not cartoon evil.',
    treasure: 'Boss Key; the Shade’s name laid to rest (story); a +1 rusted longsword that sheds green light (10 ft) and is a Virtue: Courage weapon.',
  },
  {
    id: 's3-gohma',
    act: 3,
    title: 'Armogohma',
    minuteStart: 135,
    minuteEnd: 155,
    mapId: 'map-forest-temple',
    encounterIds: ['armogohma'],
    boxedText:
      'The inner sanctum is a circular garden under a cracked dome. A colossus of vine, temple-stone, and armored spider kneels as if in prayer — Armogohma, a blade of living green fused to its legs. The Boss Key-hole is a flower. When it turns, the construct’s eyes open the color of old rupees. It was built to guard the Sage of Forest’s verse. Twilight taught it that everything moving is a thief.',
    dmNotes:
      'If time is short: skip the fight — an ocarina skill challenge (3 successes before 3 failures, DC 13 Performance/Arcana/Persuasion) soothes it to sleep and it offers the verse. Full fight: Armogohma. Remind them of Vineheart (ocarina). At 0 hp it does not explode; it kneels again and the Triforce of Wisdom blooms in its chest: WISDOM IS THE LISTENING THAT MAKES A PATH KIND. Heart Container blessing on the party. A stair of roots opens toward the Sacred Realm.',
    treasure: 'Triforce of Wisdom; Heart Container; 1 potion of greater healing in the construct’s rib-garden.',
  },
  {
    id: 's4-tide',
    act: 4,
    title: 'Twilight Tide',
    minuteStart: 155,
    minuteEnd: 165,
    mapId: 'map-sacred-realm',
    boxedText:
      'You climb out of the Forest Temple into a sky the color of a bruise. The Lost Woods below are a dark sea. Kakariko is a handful of lanterns — or fewer, if the Clock is high. The Sacred Realm waits: three standing stones, a cracked dais, and a figure in antlered gold-black plate who has been practicing how to sit on a throne that is not there.',
    dmNotes:
      'Travel beat. If Clock ≥ 4, describe Kakariko’s well gone dark and a distant scream cut short — raise stakes, do not punish with a random fight. Navi is terrified and brave. Sheik or any scholar: the third verse was never in the temple. It is made in the singing. Power is not a relic. It is the choice to spend yourself.',
  },
  {
    id: 's4-trials',
    act: 4,
    title: 'Three Triforce Trials',
    minuteStart: 165,
    minuteEnd: 175,
    mapId: 'map-sacred-realm',
    boxedText:
      'The standing stones wake. Gold asks for a step into empty air over the drop — Courage. Teal asks a riddle in the wind: “What measure cannot be stolen?” — Wisdom. Crimson asks for a price: blood, a treasured item, or a promise that will hurt later — Power. Ganondorf does not interrupt. He wants the Song of Time complete so he can take the Triforce whole.',
    dmNotes:
      'Fast. Courage: step off; a bridge of light appears after the first foot falls (or Athletics DC 14 to leap to a spur). Wisdom riddle answers: a gift, a chorus, a name spoken truly, listening, love, the Goddess herself — reward sincerity. “A lock” or “a king” fails; Navi can hint once. Power: 1d6 damage, or sacrifice a magic item, or swear a geas-like promise (DM’s sequel hook). Completing all three writes the Triforce of Power in the air: POWER IS THE NOTE YOU GIVE AWAY. They now have the full Song of Time.',
    skillChecks: [
      {
        name: 'Answer the teal stone',
        dc: 0,
        ability: 'Wisdom (roleplay)',
        success: 'The stone accepts a true answer about gifts, chorus, listening, or names.',
        failure: 'A smug answer (“me,” “steel”) makes the stone go dull; another PC may try.',
      },
    ],
  },
  {
    id: 's4-ganondorf',
    act: 4,
    title: 'Ganondorf, King of Twilight',
    minuteStart: 175,
    minuteEnd: 195,
    mapId: 'map-sacred-realm',
    encounterIds: ['ganondorf'],
    boxedText:
      'Ganondorf lifts his helm. The Gerudo face beneath is young and exhausted. “I was born in the desert,” he says, “while Hyrule fattened on the Goddess’s gift. Every generation treats the Triforce like a prize. So I took the song into twilight, where nothing ages and nothing is asked to be a hero. Play it if you must. I will unmake the measure as you play, and Hyrule will finally be still.” The dais cracks. Purple storm stands up like a second king.',
    dmNotes:
      'Climax. Ganondorf stat block, two phases (knight, then Ganon-beast). Parallel skill challenge: the Song of Time needs 6 successes before he hits 0 or the Clock would tick a 7th (it cannot — instead at 3 song failures he auto-casts Unmake). Any PC can use an action to sing/play (Performance, the ocarina, a spell slot, or a Triforce virtue) DC 13 for a success. Combat and song interleave. If they try to redeem him: Persuasion DC 15 once when he is below 30 hp and they have at least 3 song successes — he hesitates (skips a turn, drops resistance). Killing him ends the twilight. Sparing him: he becomes the Sacred Realm’s new listener, a tragic NPC — and Ganon’s Castle still waits as a sequel.',
    treasure: 'Twilight Blade (rare, +1 longsword, 1d4 necrotic; once/day dim twilight 20 ft). Ganondorf’s helm (story). The Green of Hyrule restored.',
  },
  {
    id: 's5-dawn',
    act: 5,
    title: 'Dawn Over Hyrule',
    minuteStart: 195,
    minuteEnd: 210,
    mapId: 'map-hyrule',
    boxedText:
      'The first color back is green so bright it hurts. Kakariko’s lanterns remember how to move. The windmill laughs. Navi becomes, for a moment, a whole chord — then a small tired spark again, curled in someone’s collar. Impa is waiting on the road with bread that is finally warm. “You did not save a legend,” she says. “You saved a place that wanted to keep singing.” Far north, Ganon’s Castle still wears a little shadow. Songs end. Choruses do not have to.',
    dmNotes:
      'Epilogue in 5–10 minutes. Ask each PC: what do you do with the first quiet morning? If Clock hit 6, a grove is gone and a child is missing — bittersweet. Rewards: 700 XP each (or level 4 if you prefer a hard bump), Heart Container if unused, downtime in Kakariko. Sequel hooks: the missing child in twilight; the Twilight Realm itself; Navi growing into a full sage; Ganon’s Castle. Thank the table. End on a note, not a lecture.',
  },
]

export const acts = [
  { act: 1 as const, title: 'Kakariko Village', minutes: '0:00–0:30', color: 'gold' },
  { act: 2 as const, title: 'Lost Woods', minutes: '0:30–1:20', color: 'green' },
  { act: 3 as const, title: 'Forest Temple', minutes: '1:20–2:35', color: 'moss' },
  { act: 4 as const, title: 'Sacred Realm', minutes: '2:35–3:15', color: 'twilight' },
  { act: 5 as const, title: 'Dawn over Hyrule', minutes: 'coda', color: 'dawn' },
]
