import type { Scene } from '../types'

export const CAMPAIGN = {
  title: 'The Song That Wakes the Green',
  subtitle: 'A Zelda-inspired D&D 5e one-shot for 3–5 adventurers of 3rd level',
  duration: 'About 3 hours',
  tone: 'Lyrical adventure: exploration, shrine puzzles, a dungeon with a key, and a twilight duel on a high mesa.',
  premise:
    'In the border kingdom of Eldara the harvest banners hang still. The Waking Song — the old measure that keeps the Forest of Echoes green — has gone thin as a held breath. Twilight fog drinks color from the leaves. Sage Nerin of Windfall has heard the last true note fade. Someone must walk the three trails, wake the Temple of the Green Blade, and sing the song on the Sacred Plateau before Lord Vaelith unmakes the Green.',
  inspiration:
    'Built as an original homage to The Legend of Zelda: overworld paths, a fairy companion, a temple with keys and a living guardian, three virtues, and a usurper in twilight. Names, places, and the Waking Song are new. Play it as a love letter, not a licensed Hyrule.',
}

export const virtueRules = [
  {
    name: 'The Echo Flute',
    text: 'Story focus. A creature holding it can spend an action to play a single true note (no check in calm air; DC 12 Performance or Constitution in combat or high wind). A true note: opens vine-sealed doors marked with a leaf, gives the Sleeping Construct disadvantage on its next attack, and counts as “singing a verse” against Vaelith’s Unmake the Measure.',
  },
  {
    name: 'Virtues (Courage, Wisdom, Power)',
    text: 'Each PC may declare one Virtue at the start (or inherit a pregen’s). Once per session, when they act in that Virtue’s spirit, they may add 1d8 to an attack, check, or save after seeing the roll. Against Vaelith, a spent Virtue also ignores his resistance and deals +1d8 damage.',
  },
  {
    name: 'Heart Bloom',
    text: 'The temple’s blessing. One character (or the party, shared) gains a Heart Bloom: the next time they would drop to 0 hp, they drop to 1 hp instead and each ally within 30 feet gains 1d6 temp hp. Then the bloom fades.',
  },
  {
    name: 'Twilight Clock',
    text: 'Six segments. Advance one when the party takes a long detour, fails a shrine in a noisy way, rests in the forest, or lingers more than 15 minutes past a scene’s end window. At 4, Windfall’s well goes dark (NPCs frightened). At 6, Vaelith begins the fight already in phase 2 and the village suffers a lasting scar in the epilogue.',
  },
]

export const scenes: Scene[] = [
  {
    id: 's1-festival',
    act: 1,
    title: 'The Festival That Forgot Its Song',
    minuteStart: 0,
    minuteEnd: 10,
    mapId: 'map-windfall',
    boxedText:
      'Windfall should be loud. Harvest pennants hang from every eave, but they do not stir. The mill wheel turns half-heartedly. On the green, tables are set for a feast no one is eating. People speak in the careful voices of a house where a child is sleeping — or dying. Above the old stone well, a single teal spark hangs in the air, pulsing like a held note.',
    dmNotes:
      'Let players introduce themselves as travelers, locals, or dream-called strangers. Ask each: what did you notice first — the silence, the spark, or the twilight at the tree line? Rumor table: (1) the miller’s child wandered toward the Forest; (2) the sage has not slept; (3) tusker drums last night; (4) the well water tastes like old coins and rain.',
    skillChecks: [
      {
        name: 'Read the village',
        dc: 12,
        ability: 'Insight or Perception',
        success: 'The silence is not grief — it is a song missing its downbeat. People keep almost humming, then stop.',
        failure: 'Everyone seems merely tired. You miss that the well’s fairy-light is fading in time with the distant fog.',
      },
    ],
  },
  {
    id: 's1-nerin',
    act: 1,
    title: 'Sage Nerin and Luma',
    minuteStart: 10,
    minuteEnd: 20,
    mapId: 'map-windfall',
    boxedText:
      'An elder in travel-green robes sits on the well’s lip, a wooden flute across their knees. The teal spark darts to your shoulders, rings once like a glass tapped with a fingernail, and settles. “I am Nerin,” the sage says. “This is Luma. She is the last uncaught measure of the Waking Song. The rest has been stolen into twilight. If the Green sleeps too long, Eldara will dream someone else’s dream.”',
    dmNotes:
      'Nerin is kind, tired, and unwilling to go into the temple — their hands shake too badly to play a true note. Luma can answer one yes/no question per scene by chiming (bright = yes, dull = no, split tone = complicated). Nerin gives the Echo Flute to whoever first offers to help, or to the PC with Virtue: Wisdom. They sketch a leaf-map: Forest, Temple, Plateau. They warn: do not rest in the Echoes after dusk.',
    treasure: 'Echo Flute (story focus). A pouch of 3 “green drops” (each heals 2d4+2).',
  },
  {
    id: 's1-wisps',
    act: 1,
    title: 'Wisps at the Well',
    minuteStart: 20,
    minuteEnd: 30,
    mapId: 'map-windfall',
    encounterIds: ['twilight-wisp'],
    boxedText:
      'The well-water goes black. Three motes of bruised-purple light peel out of the shaft, humming a half-step flat. Villagers stumble back. Luma’s glow gutters. Nerin’s voice is suddenly a commander’s: “They are eating the measure. Do not let them touch the spark.”',
    dmNotes:
      '3 twilight wisps (4 if 5 PCs). Tutorial fight: open terrain, well as half cover, Luma can grant one PC advantage once by flaring. If a wisp hits Luma (AC 15, 8 hp), the Twilight Clock advances 1. After the fight, the path to the Forest of Echoes is obvious — a pale gold trail through the fields.',
    treasure: 'A wisp leaves a bead of condensed dusk (uncommon: once, as a bonus action, dim light 20 ft. that reveals invisible twilight creatures).',
  },
  {
    id: 's2-trails',
    act: 2,
    title: 'Three Trails in the Echoes',
    minuteStart: 30,
    minuteEnd: 45,
    mapId: 'map-forest',
    boxedText:
      'The Forest of Echoes does not swallow sound — it returns it wrong. Your footsteps arrive a breath late. Birdsong answers in a key you do not know. The gold trail splits around a ring of standing stones: a sword-shrine to the left (Courage), an eye-shrine ahead (Wisdom), a gauntlet-shrine to the right (Power). Moss hangs like curtains. Somewhere deeper, wooden chimes turn though there is no wind.',
    dmNotes:
      'Each trail is a short vignette (5 minutes). Courage: a washed-out bridge, Athletics DC 13 or find a fallen trunk (Survival DC 12). Wisdom: a fork that loops unless someone tracks Luma’s glow or succeeds DC 13 Investigation on moss-arrows. Power: a fallen cedar to lift or smash (Athletics DC 14, or 8 damage to the wood). Completing a trail matching a PC’s Virtue grants inspiration. Taking all three advances the Twilight Clock by 1 — pick two if time is tight.',
    skillChecks: [
      {
        name: 'Stay on the true path',
        dc: 13,
        ability: 'Survival or Investigation',
        success: 'You notice the late echoes are louder on false trails. The quiet way is the real way.',
        failure: 'You loop once. Twilight Clock +1, and a distant tusker horn answers your noise.',
      },
    ],
  },
  {
    id: 's2-mossfolk',
    act: 2,
    title: 'The Mossfolk Bargain',
    minuteStart: 45,
    minuteEnd: 55,
    mapId: 'map-forest',
    boxedText:
      'Faces bloom in the root-tangle: small, leaf-crowned, eyes like wet river stones. A mossfolk elder no taller than a boot holds up a seed. “Lost-song people,” they creak. “Give us a true name, a true joke, or a true hunger, and we show the chime-clearing. Give us a lie, and we show you the long way, where the fog has teeth.”',
    dmNotes:
      'Social scene. A sincere offering (a ration, a song, a secret, Thorn’s bead) succeeds automatically. Deception DC 14 can fake a “true” gift but the mossfolk remember. On a kind success they also mark a secret alcove in the temple (Room of Quiet Roots — a small key). On a lie or a threat, Twilight Clock +1 and they vanish; the shrine is still findable with DC 14 Survival.',
    skillChecks: [
      {
        name: 'Speak with the forest',
        dc: 12,
        ability: 'Persuasion or Performance',
        success: 'They giggle like rain on leaves and point. One tucks a glow-cap mushroom into a pack (advantage on the next Nature or Survival check).',
        failure: 'They melt into moss. You can still find the shrine, but it takes longer.',
      },
    ],
  },
  {
    id: 's2-shrine',
    act: 2,
    title: 'Shrine of the First Verse',
    minuteStart: 55,
    minuteEnd: 70,
    mapId: 'map-forest',
    boxedText:
      'A clearing. Four wooden chimes hang from a living arch: low, middle, high, and a cracked fourth that does not belong. Stone underfoot is carved with a spiral of leaves. When the wrong chime is struck, the forest answers with a laugh that is not a laugh. When the right three sound in rising order, gold light writes a verse in the air: COURAGE IS THE STEP YOU TAKE BEFORE THE PATH APPEARS.',
    dmNotes:
      'Puzzle: the cracked chime is twilight-tainted. Players must strike low → middle → high. Clues: Luma chimes the first note; a Perception DC 12 spots moss growing only on the three living chimes; Arcana DC 13 feels the cracked one hum flat. Wrong order twice: 2 twilight wisps drift in (or just Clock +1 if the first fight ran long). Success: Verse of Courage (a glowing sigil). Any PC can spend it once to automatically succeed a save against fear or to add 1d8 to a heroic movement (jump, dash through gloom, hold a door).',
    treasure: 'Verse of Courage (consumable virtue-sigil).',
  },
  {
    id: 's2-tuskers',
    act: 2,
    title: 'Tusker Ambush',
    minuteStart: 70,
    minuteEnd: 80,
    mapId: 'map-forest',
    optional: true,
    encounterIds: ['tusker-raider'],
    boxedText:
      'The gold trail tightens. Pig-ivory horns. Three (or four) hunched raiders in scrap-hide step from the ferns, eyes reflecting purple. Their leader wears a necklace of silenced wind-chimes. “The dusk-lord pays for quiet,” he grunts. “You are very loud.”',
    dmNotes:
      'Skip if the session is behind. 3 tusker raiders (4 if the party is fresh). The chime-necklace can be recovered: advantage on the next flute check. Terrain: two trees as half cover, a stream as difficult terrain. They flee at half hp if the leader drops.',
    treasure: 'Chime-necklace; 12 gp in crude coins; a strip of temple-map leather showing a locked door.',
  },
  {
    id: 's3-door',
    act: 3,
    title: 'The Vine Door',
    minuteStart: 80,
    minuteEnd: 90,
    mapId: 'map-temple',
    boxedText:
      'The Temple of the Green Blade rises from the forest floor like a stone seed that forgot to stop growing. Stairs climb between buttresses of root and masonry. The great door is a lattice of sleeping vines. In the lintel, a leaf-shaped recess the size of a flute’s mouth. The air smells of wet iron and crushed mint.',
    dmNotes:
      'A true note on the Echo Flute opens the door. Alternatives: Strength DC 18 to tear a gap (Clock +1, alarm), or a leaf from the Courage verse pressed to the recess. Inside: dim green light, dust, a mural of three heroes offering a song to a plateau. History DC 13: the “heroes” look like ordinary people — a farmer, a scholar, a smith. The Green was never a chosen-one story. It was a chorus.',
  },
  {
    id: 's3-torches',
    act: 3,
    title: 'Hall of Kindled Breath',
    minuteStart: 90,
    minuteEnd: 100,
    mapId: 'map-temple',
    boxedText:
      'A long hall. Four unlit braziers. Murals show wind moving through grass, then fireflies, then a hearth, then a dawn. In the far arch, a portcullis of living wood waits, patient as a held breath. When you step in, the braziers sigh — hungry.',
    dmNotes:
      'Puzzle: light the braziers in story order — wind (empty / fan / gust), fireflies (tiny lights / dancing lights / a torch moved quickly), hearth (a real flame), dawn (all three plus the flute’s note, or the last brazier faces the entrance so morning-logic = light it from the doorway). Simpler table solve: numbered 1–4 on the mural; light 1-2-3-4. Root snappers (2) drop from the ceiling if they light them in reverse. Success opens the portcullis and reveals a small key on the last brazier’s rim.',
    treasure: 'Small Key of Kindled Breath.',
    encounterIds: ['root-snapper'],
  },
  {
    id: 's3-gloom',
    act: 3,
    title: 'The Gloom Span',
    minuteStart: 100,
    minuteEnd: 110,
    mapId: 'map-temple',
    boxedText:
      'The floor is gone. A pit of slow, starless gloom. Stone platforms drift like lily pads on a black pond, pausing, then sliding. On the far ledge, a chest bound in root-iron. Something in the dark below follows your shadows the way a fish follows crumbs.',
    dmNotes:
      'Traversal, not a slog. Each PC describes a crossing: Acrobatics DC 12, Athletics DC 12, or a clever use of rope/spells (auto). Failure: 1d6 necrotic and they land on a lower platform — one extra check. The thing below is flavor unless someone falls in twice (then one root snapper). Chest: 2 green drops, 30 gp of old temple coins, and the Boss Key if you want a shorter dungeon — otherwise the Boss Key is after the Captain. Locked side-door here eats the Kindled Breath key and hides a Heart Bloom seed (see virtue rules) plus 1 potion of healing.',
    treasure: 'Green drops; optional Heart Bloom behind the locked door.',
  },
  {
    id: 's3-statues',
    act: 3,
    title: 'Statues of True Green',
    minuteStart: 110,
    minuteEnd: 120,
    mapId: 'map-temple',
    boxedText:
      'Three greenstone statues stand on a circular floor: a runner with a bare blade, a listener with a book of leaves, a smith with a hammer like a sunrise. Each can be rotated. On the ceiling, a faded fresco of the Sacred Plateau — three standing stones, the gold one slightly north of true north. The room’s only door south remains shut. In the silence you hear, very faintly, Vaelith practicing a speech to an empty throne.',
    dmNotes:
      'Puzzle: rotate statues to face the “true Green” — the plateau’s gold stone, slightly off north. Clues: Survival or Nature DC 12 notices moss on the north wall is thicker toward a scuff 15° east of north; the fresco’s gold stone is the Courage stone; Luma drifts to the correct bearing. When aligned, the south door opens and a second small key drops from the listener’s book. Wrong alignment twice: the smith statue swings (one attack, +5/1d10+2) then resets.',
    treasure: 'Small Key of Listening.',
  },
  {
    id: 's3-captain',
    act: 3,
    title: 'Captain of Bone',
    minuteStart: 120,
    minuteEnd: 135,
    mapId: 'map-temple',
    encounterIds: ['captain-of-bone'],
    boxedText:
      'The barracks were for living wardens. What remains is a captain in rusted green-enameled plate, skull bright as a lantern. He salutes with a sword that still remembers courtesy. “The usurper promised we would keep our posts,” he says, almost grateful. “I have been keeping them so long I forgot the password was a song.” He sets his helm. “If you are the chorus, prove it. If you are thieves, I will make you quiet.”',
    dmNotes:
      'Mini-boss. Captain of Bone. He is honorable: if the party plays a true note before attacking, he has disadvantage on his first turn and will accept a surrender-parley at 15 hp (he yields the Boss Key and asks them to bury his name: Captain Sera Valen). Otherwise he fights until destroyed. Rally the Hollow once. Afterward: Boss Key, and a mural showing Vaelith as a young warden who locked himself in the plateau “to keep the song safe from war” — tragedy, not cartoon evil.',
    treasure: 'Boss Key; Captain Sera’s name (story); a +1 rusted longsword that sheds green light (10 ft) and is a Virtue: Courage weapon.',
  },
  {
    id: 's3-construct',
    act: 3,
    title: 'The Sleeping Construct',
    minuteStart: 135,
    minuteEnd: 155,
    mapId: 'map-temple',
    encounterIds: ['sleeping-construct'],
    boxedText:
      'The inner sanctum is a circular garden under a cracked dome. A colossus of vine and temple-stone kneels as if in prayer, a blade of living green fused to its arms. The Boss Key-hole is a flower. When it turns, the construct’s eyes open the color of old coins. It was built to guard the second verse. Twilight taught it that everything moving is a thief.',
    dmNotes:
      'If time is short: skip the fight — a flute skill challenge (3 successes before 3 failures, DC 13 Performance/Arcana/Persuasion) soothes it to sleep and it offers the verse. Full fight: Sleeping Construct. Remind them of Vineheart (flute). At 0 hp it does not explode; it kneels again and the Verse of Wisdom blooms in its chest: WISDOM IS THE LISTENING THAT MAKES A PATH KIND. Heart Bloom blessing on the party. A stair of roots opens toward the plateau.',
    treasure: 'Verse of Wisdom; Heart Bloom; 1 potion of greater healing in the construct’s rib-garden.',
  },
  {
    id: 's4-tide',
    act: 4,
    title: 'Twilight Tide',
    minuteStart: 155,
    minuteEnd: 165,
    mapId: 'map-plateau',
    boxedText:
      'You climb out of the temple into a sky the color of a bruise. The Forest of Echoes below is a dark sea. Windfall is a handful of lanterns — or fewer, if the Clock is high. The Sacred Plateau waits: three standing stones, a cracked dais, and a figure in antlered gold-black plate who has been practicing how to sit on a throne that is not there.',
    dmNotes:
      'Travel beat. If Clock ≥ 4, describe Windfall’s well gone dark and a distant scream cut short — raise stakes, do not punish with a random fight. Luma is terrified and brave. Mira or any scholar: the third verse was never in the temple. It is made in the singing. Power is not a relic. It is the choice to spend yourself.',
  },
  {
    id: 's4-trials',
    act: 4,
    title: 'Three Virtue Trials',
    minuteStart: 165,
    minuteEnd: 175,
    mapId: 'map-plateau',
    boxedText:
      'The standing stones wake. Gold asks for a step into empty air over the drop — Courage. Teal asks a riddle in the wind: “What measure cannot be stolen?” — Wisdom. Crimson asks for a price: blood, a treasured item, or a promise that will hurt later — Power. Vaelith does not interrupt. He wants the song complete so he can take it whole.',
    dmNotes:
      'Fast. Courage: step off; a bridge of light appears after the first foot falls (or Athletics DC 14 to leap to a spur). Wisdom riddle answers: a gift, a chorus, a name spoken truly, listening, love, the Green itself — reward sincerity. “A lock” or “a king” fails; Luma can hint once. Power: 1d6 damage, or sacrifice a magic item, or swear a geas-like promise (DM’s sequel hook). Completing all three writes the Verse of Power in the air: POWER IS THE NOTE YOU GIVE AWAY. They now have the full Waking Song.',
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
    id: 's4-vaelith',
    act: 4,
    title: 'Lord Vaelith the Usurper',
    minuteStart: 175,
    minuteEnd: 195,
    mapId: 'map-plateau',
    encounterIds: ['lord-vaelith'],
    boxedText:
      'Vaelith lifts his helm. The face beneath is young and exhausted. “I was a warden,” he says. “I watched the Green fail every generation that treated it like a prize. So I took the song into twilight, where nothing ages and nothing is asked to be brave. Sing it if you must. I will unmake the measure as you play, and Eldara will finally be still.” The dais cracks. Purple storm stands up like a second king.',
    dmNotes:
      'Climax. Vaelith stat block, two phases. Parallel skill challenge: the Waking Song needs 6 successes before he hits 0 or the Clock would tick a 7th (it cannot — instead at 3 song failures he auto-casts Unmake). Any PC can use an action to sing/play (Performance, the flute, a spell slot, or a Virtue) DC 13 for a success. Combat and song interleave. If they try to redeem him: Persuasion DC 15 once when he is below 30 hp and they have at least 3 song successes — he hesitates (skips a turn, drops resistance). Killing him ends the twilight. Sparing him: he becomes the plateau’s new listener, a tragic NPC.',
    treasure: 'Duskblade (rare, +1 longsword, 1d4 necrotic; once/day dim twilight 20 ft). Vaelith’s helm (story). The Green restored.',
  },
  {
    id: 's5-dawn',
    act: 5,
    title: 'Dawn Over Eldara',
    minuteStart: 195,
    minuteEnd: 210,
    mapId: 'map-eldara',
    boxedText:
      'The first color back is green so bright it hurts. Windfall’s pennants remember how to move. The mill laughs. Luma becomes, for a moment, a whole chord — then a small tired spark again, curled in someone’s collar. Nerin is waiting on the road with bread that is finally warm. “You did not save a legend,” they say. “You saved a place that wanted to keep singing.” Far north, Vaelith’s Crown still wears a little shadow. Songs end. Choruses do not have to.',
    dmNotes:
      'Epilogue in 5–10 minutes. Ask each PC: what do you do with the first quiet morning? If Clock hit 6, a grove is gone and a child is missing — bittersweet. Rewards: 700 XP each (or level 4 if you prefer a hard bump), Heart Bloom if unused, downtime in Windfall. Sequel hooks: the missing child in twilight; a second kingdom whose song was always a lie; Luma growing into a full sage. Thank the table. End on a note, not a lecture.',
  },
]

export const acts = [
  { act: 1 as const, title: 'Windfall', minutes: '0:00–0:30', color: 'gold' },
  { act: 2 as const, title: 'Forest of Echoes', minutes: '0:30–1:20', color: 'green' },
  { act: 3 as const, title: 'Temple of the Green Blade', minutes: '1:20–2:35', color: 'moss' },
  { act: 4 as const, title: 'Sacred Plateau', minutes: '2:35–3:15', color: 'twilight' },
  { act: 5 as const, title: 'Dawn', minutes: 'coda', color: 'dawn' },
]
