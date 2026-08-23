import type { Scene } from '../types'

export const scenes: Scene[] = [
  {
    id: 's1-festival',
    act: 1,
    title: 'The Festival That Forgot Its Song',
    minuteStart: 0,
    minuteEnd: 10,
    mapId: 'map-kakariko',
    npcs: ['Villagers', 'Miller’s family', 'Cuccos'],
    summary: 'Kakariko’s harvest feast is set and silent. Players arrive, look around, and feel the missing downbeat.',
    boxedText:
      'Kakariko should be loud. Harvest lanterns hang from every eave, but they do not stir. The windmill turns as if it has forgotten the joke. On the dirt square, tables are set for a feast no one is eating: roasted goat gone cold, round breads, a pyramid of red apples that nobody has touched. People speak in the careful voices of a house where a child is sleeping — or dying. A cucco pecks a fallen lantern and makes no sound. Above the old stone well, a single blue fairy hangs in the air, pulsing like a held note. Beyond the last fence, the tree line is the color of a bruise.',
    whatsHappening:
      'The Song of Time is the old measure that tells Hyrule when to be green. Tonight it has gone thin. Villagers almost hum Zelda’s Lullaby, then stop, ashamed they cannot find the next note. This is not grief for a funeral. It is a kingdom holding its breath. Give each player thirty seconds in the square: what did they notice first — the silence, Navi’s spark, the twilight at the trees, or someone they love standing too still? Let them be Hylians, Sheikah, Kokiri, Gorons, Zora, Gerudo, Rito, or dream-called strangers. The miller’s child is not in the square. Nobody wants to be the first to say that out loud.',
    dmNotes:
      'Do not start a fight. Do not explain the plot. Ask, listen, then walk them toward the well. Rumor table (roll or offer): (1) the miller’s child wandered toward the Lost Woods at noon and has not come back; (2) Impa has not slept in three nights; (3) Bokoblin drums last night, far and flat; (4) the well water tastes like old rupees and rain; (5) Sheikah travelers passed through and would not stay; (6) a Gerudo merchant swears the desert wind has started humming. If a PC shops: general store has rations, torches, 50 feet of rope; the tinker can mend an instrument; The Second Note tavern is open but the bard’s lute is in its case. A kind word to a villager now pays off at dawn.',
    options: [
      {
        name: 'Walk the square and listen',
        text: 'Circle the feast tables, the windmill, the well. Name three things that should move and do not.',
        dc: 12,
        ability: 'Insight or Perception',
        success:
          'The silence is not grief. It is a song missing its downbeat. People keep almost humming Zelda’s Lullaby, then stop. Navi’s glow fades in time with the fog at the tree line.',
        failure:
          'Everyone seems merely tired. You miss that Navi is dimming, and you will be surprised when the well goes black.',
      },
      {
        name: 'Ask after the miller’s child',
        text: 'The miller stands by an untouched apple-pyramid. His wife watches the Lost Woods road.',
        dc: 11,
        ability: 'Persuasion',
        success:
          'They admit the child followed a gold spark into the grass at noon. Impa told them not to follow. They will give a PC a warm scarf (advantage on the next save vs fear) if someone promises to look.',
        failure:
          'They shut down. “Impa said wait.” You can still help; you just do not get the scarf or the name (Talo).',
      },
      {
        name: 'Comfort a cucco / tend a stall',
        text: 'Small kindnesses in a frozen festival. A child (not the missing one) has dropped a lantern.',
        success:
          'No roll if sincere. An old woman presses a rice ball into a hand. Later, if the Clock hits 4, this family hides instead of panicking — one fewer scream from the village.',
      },
      {
        name: 'Head straight for the blue fairy',
        text: 'Skip the square. Walk to the well. Navi notices who came first.',
        success:
          'Navi chimes once, bright. Impa looks up a moment sooner. You may ask Navi one extra yes/no tonight.',
      },
    ],
    skillChecks: [
      {
        name: 'Read the village',
        dc: 12,
        ability: 'Insight or Perception',
        success:
          'The silence is not grief — it is a song missing its downbeat. People keep almost humming Zelda’s Lullaby, then stop.',
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
    npcs: ['Impa', 'Navi'],
    summary: 'Impa gives the Ocarina of Time, Navi, and a leaf-map. The quest is a chorus, not a chosen-one speech.',
    boxedText:
      'An elder Sheikah in white and deep red sits on the well’s lip, the Ocarina of Time across her knees like a sleeping animal. The blue fairy darts to your shoulders, rings once like a glass tapped with a fingernail, and settles. “Hey! Listen!” she chimes, smaller than the stories. Impa’s voice is warm and precise, not a riddle. “I am Impa, of the Sheikah. This is Navi. She is the last uncaught measure of the Song of Time. Ganondorf has stolen the rest into twilight. If Hyrule sleeps too long, the kingdom will dream the Demon King’s dream — a still world, where nothing is asked to be a hero, and nothing grows.” She does not stand. Her hands, you notice, shake too badly to cover the ocarina’s holes.',
    whatsHappening:
      'Impa is Princess Zelda’s shadow and Kakariko’s sage. She failed to notice Ganondorf’s despair until the song was already thinning, and she will not hide that. She cannot enter the Forest Temple: shame, age, and a tremor. Navi can answer one yes/no per scene (bright = yes, dull = no, split tone = complicated). The ocarina goes to whoever first offers to help, or to the Wisdom PC (often Sheik). Impa sketches a leaf-map: Lost Woods, Forest Temple, Sacred Realm. She warns: do not rest in the Lost Woods after dusk. If Sheik is at the table, Impa will not unmask Zelda unless the player does. She will answer honest questions; she will not give a lecture if the table wants to move.',
    dmNotes:
      'Let them ask. Good answers: the Song of Time is a practice, not a spell in a book; Ganondorf is Gerudo and young in the face; the Forest Temple still has keys and a living guardian; the miller’s child is a sequel hook unless they insist on a glance (Survival DC 14 on the gold trail finds a wooden horse, not the child). Potions: 3 red (2d4+2). If nobody volunteers, Impa puts the ocarina in the quietest PC’s hands and says “Then you will have to learn to be loud.”',
    treasure: 'Ocarina of Time (story focus). A pouch of 3 red potions (each heals 2d4+2).',
    options: [
      {
        name: 'Take the ocarina and the map',
        text: 'Accept the quest. Ask Impa to mark the three trails and the temple door.',
        success:
          'She does. Courage left, Wisdom ahead, Power right. “The quiet way is the true way. That is Saria’s trick, not mine.”',
      },
      {
        name: 'Press Impa on Ganondorf',
        text: 'Why steal a song instead of a throne? Why twilight?',
        dc: 12,
        ability: 'Insight or History',
        success:
          '“He was born in the desert while we fattened on the Goddess’s gift. He thinks stillness is mercy. It is not. It is a locked room.” She will not call him a pig-demon. Not yet.',
        failure:
          'She only says “He is the King of Twilight now. The rest you will have to see.” You still get the ocarina.',
      },
      {
        name: 'Ask Navi a question',
        text: 'Yes/no, one for this scene. Navi is brave and tired.',
        success:
          'Bright chime = yes. Dull = no. Split = it is more complicated than a fairy can hold. She will not spoil the temple puzzles.',
      },
      {
        name: 'Offer to stay and guard the village',
        text: 'A PC wants to skip the woods.',
        success:
          'Impa refuses gently. “If you stay, you will watch the well die. The village is saved in the Sacred Realm or not at all.” They may leave a token with a villager for the epilogue.',
      },
      {
        name: 'Try to play the ocarina now',
        text: 'A true note in calm air needs no check. In a crowd it is DC 10 Performance.',
        success:
          'Lanterns twitch. Someone weeps once. Impa almost smiles. “That is the downbeat. You will need the rest of the measure.”',
        failure:
          'A flat note. Villagers flinch. Navi dimmed for a breath. No Clock tick — not yet — but Impa takes the ocarina back for a moment and shows the fingering.',
      },
    ],
  },
  {
    id: 's1-poes',
    act: 1,
    title: 'Poes at the Well',
    minuteStart: 20,
    minuteEnd: 30,
    mapId: 'map-kakariko',
    encounterIds: ['poe'],
    npcs: ['Impa', 'Navi', 'Villagers'],
    summary: 'Tutorial fight. Three Poes climb the well to eat the last measure. Protect Navi.',
    boxedText:
      'The well-water goes black, as if someone blew out a color. Three lanterns of bruised-purple light peel out of the shaft, humming a half-step flat — Poes, the hungry dead of twilight, faces like masks held too close to a candle. Villagers stumble back from the feast tables. A dropped apple makes no sound when it hits. Navi’s glow gutters. Impa’s voice is suddenly a commander’s, the tremor gone for ten seconds: “They are eating the measure. Do not let them touch the fairy. Steel is fine. Song is better. Do not follow them down the well.”',
    whatsHappening:
      'This is the tutorial. Open dirt square, well as half cover, feast tables as difficult terrain if flipped. 3 Poes (4 if five PCs). They want Navi, not a TPK. If a Poe hits Navi (treat as AC 15, 8 hp, hovering near a PC of the player’s choice), Twilight Clock +1. Navi can flare once to grant one PC advantage on an attack. After the fight the path to the Lost Woods is obvious: a pale gold trail through the fields. Impa will not fight; she shepherds villagers. A PC who only protects civilians is doing the scene right.',
    dmNotes:
      'Keep it to two rounds if rolls are slow. Poes flee or gutter out at 0 hp — they do not explode. A dusk-bead on one corpse (uncommon, bonus action, dim light 20 ft that reveals invisible twilight creatures once). If the party talks instead of swinging: Performance or the ocarina DC 14 can banish one Poe without a fight; the others still need steel or a second note. Falling in the well is a 10-foot drop and a scare, not a dungeon.',
    treasure:
      'A Poe leaves a bead of condensed dusk (uncommon: once, as a bonus action, dim light 20 ft. that reveals invisible twilight creatures).',
    options: [
      {
        name: 'Fight in the square',
        text: 'Standard combat. Well = half cover. Navi flares once for advantage.',
        success: 'Poes gutter out. Gold trail appears toward the Lost Woods. Villagers cheer once, quietly.',
      },
      {
        name: 'Play a true note at them',
        text: 'Action, Ocarina of Time. DC 12 Performance or Constitution.',
        success: 'One Poe unravels into moths. The others have disadvantage this round.',
        failure: 'The note goes flat. That Poe has advantage on its next attack against the player.',
        clock: 'If Navi is hit during this round, Clock +1 as usual.',
      },
      {
        name: 'Get villagers behind the mill',
        text: 'A PC spends a round being a shepherd instead of a killer.',
        dc: 12,
        ability: 'Persuasion or Athletics',
        success:
          'No civilian is touched. Impa will remember. At dawn, bread is waiting with that PC’s name on it.',
        failure: 'A villager is frightened (not down). Clock does not tick unless Navi is hit.',
      },
      {
        name: 'Lure them away from the well',
        text: 'Dash toward the fields with a light or a song. Poes follow the loudest measure.',
        dc: 13,
        ability: 'Performance or Deception',
        success: 'Fight in the grass. Villagers are safe. One Poe has to spend its first turn catching up.',
        failure: 'They ignore you and dive at Navi. Protect her.',
      },
    ],
    skillChecks: [
      {
        name: 'True note against a Poe',
        dc: 12,
        ability: 'Performance or Constitution',
        success: 'One Poe unravels. Others have disadvantage this round.',
        failure: 'Flat note. That Poe has advantage on you next attack.',
      },
    ],
  },
  {
    id: 's1-keese',
    act: 1,
    title: 'The Mill That Bites',
    minuteStart: 30,
    minuteEnd: 40,
    mapId: 'map-kakariko',
    encounterIds: ['keese'],
    npcs: ['Impa', 'Navi', 'Miller’s family'],
    summary: 'Keese boil out of the silent windmill. A short second fight before the gold trail. Skip if the well already ran long.',
    boxedText:
      'The windmill’s vanes tick once, as if someone remembered a joke and then thought better of it. From the dark throat of the mill, four winged shapes peel out — Keese, leather and tooth, eyes like cheap amethyst. One of them trails a thread of orange, a Fire Keese that has been nesting in the miller’s lamp oil. The miller’s wife makes a sound that is almost a scream and then remembers the village is trying not to wake whatever is sleeping in the well. Impa’s commander-voice is gone; she is an elder again, pointing at the square. “They followed the Poes up. Do not let them into the feast tables. The mill still has to turn at dawn.”',
    whatsHappening:
      'Main-path fight, two rounds. 4 Keese (one Fire Keese). Open square, windmill as three-quarters cover from the ground, feast tables still difficult terrain if flipped. They want lamp oil, livestock, and anything that still hums — Navi included, but they are dumber than Poes. If a Fire Keese hits a lantern or a PC carrying a torch, that light goes out or a 5-foot spark lands (1 fire damage, trivial). After the fight the gold trail to the Lost Woods is obvious. Impa still will not leave the well. A true note (DC 12) drops two ordinary Keese; the Fire Keese needs steel or water.',
    dmNotes:
      'If the Poe fight ate twelve minutes, skip this: the miller’s child left a slammed mill-door, one scorched vane, and the trail is already lit. If you are behind at minute 40, give them the dusk-trail without initiative. Keep it mean and short — this is “Hyrule still bites,” not a second tutorial speech. A Keese corpse can be a sad reagent (advantage on the next Nature check to identify twilight beasts).',
    treasure: 'A scorched mill-vane (improvised torch, 10 minutes). 6 rupees in the mill’s lintel-jar.',
    options: [
      {
        name: 'Fight in the square',
        text: '4 Keese, one Fire. Windmill = high ground if someone climbs (Athletics DC 12).',
        success: 'They drop. The gold trail brightens. The miller mouths thank you and cannot find the note.',
      },
      {
        name: 'Slam the mill door',
        text: 'Trap them in the dark throat. Athletics or a clever bar.',
        dc: 13,
        ability: 'Athletics',
        success: 'Two Keese are shut in. Fight the other two (including the Fire Keese if it already escaped). Clock does not tick.',
        failure: 'The door hangs. All four come. A vane clips a PC for 1d4 bludgeoning.',
      },
      {
        name: 'Play them out of the air',
        text: 'Ocarina or a loud clap. Keese hate a true downbeat.',
        dc: 12,
        ability: 'Performance or Constitution',
        success: 'Two ordinary Keese peel off toward the woods. The Fire Keese and one friend stay.',
        failure: 'They dive at the instrument. The player has disadvantage on the next attack this fight.',
      },
      {
        name: 'Skip if behind',
        text: 'DM: past minute 40, or the well fight ran long. Scorched vane, trail, go.',
        success: 'Keep the 3-hour promise. The mill still owes them a laugh at dawn.',
      },
    ],
    skillChecks: [
      {
        name: 'True note against Keese',
        dc: 12,
        ability: 'Performance or Constitution',
        success: 'Two ordinary Keese flee. Fire Keese stays.',
        failure: 'They dive at the ocarina.',
      },
    ],
  },
  {
    id: 's2-trails',
    act: 2,
    title: 'Three Trails in the Lost Woods',
    minuteStart: 40,
    minuteEnd: 52,
    mapId: 'map-lost-woods',
    npcs: ['Navi'],
    summary: 'The gold trail splits at standing stones: Courage, Wisdom, Power. Two trails if time is tight; three ticks the Clock.',
    boxedText:
      'The Lost Woods do not swallow sound — they return it wrong. Your footsteps arrive a breath late. Birdsong answers in a key you do not know. Moss hangs like curtains that were never woven. The gold trail splits around a ring of standing stones older than Kakariko: a Master Sword shrine to the left (Courage), a Sheikah-eye shrine ahead (Wisdom), a Goron-gauntlet shrine to the right (Power). Somewhere deeper, wooden chimes turn though there is no wind. Navi hovers at the fork and does not choose for you. “Hey… the quiet way is the real way. Loud trails lie.”',
    whatsHappening:
      'Each trail is a five-minute vignette, not a hex crawl. Completing a trail that matches a PC’s Triforce virtue grants that PC inspiration. Taking all three advances the Twilight Clock by 1 — if you are behind, say so and offer two. False trails echo louder; the true path is quieter (Saria’s trick). If they split the party, Navi’s gold trail fades in ten minutes and someone will loop. Koroks watch from the roots and do not yet speak. Howls answer a smashed cedar — Wolfos later, Bokoblins after the meadow.',
    dmNotes:
      'Courage: washed-out bridge over a gully of mist. Athletics DC 13 to leap, or Survival DC 12 to find a fallen trunk used as a plank, or the Courage virtue to just step (the plank appears after the foot is committed). Wisdom: a fork that loops. Investigation DC 13 on moss-arrows, or follow Navi’s dimming (she is quieter on the true way), or close your eyes and walk toward the least echo. Power: a fallen cedar blocking the way. Athletics DC 14 to lift, 8 slashing/bludgeoning to smash, or a spell that moves wood. Smashing is loud: if they smash, a distant Wolfos howl and a Bokoblin horn answer (fights still wait until after Saria’s Song).',
    options: [
      {
        name: 'Courage — the broken bridge',
        text: 'Step, leap, or find another way across mist.',
        dc: 13,
        ability: 'Athletics (or Survival DC 12 for a trunk)',
        success: 'You cross. If this is your virtue, gain inspiration. A faded green tunic thread is caught on the far rail.',
        failure: 'You drop into mist, 1d6 bludgeoning, scramble up the bank. Still on the true path. No Clock.',
      },
      {
        name: 'Wisdom — the looping fork',
        text: 'The loud left path is a lie. Track moss-arrows, Navi, or silence.',
        dc: 13,
        ability: 'Investigation or Survival',
        success: 'You notice late echoes are louder on false trails. The quiet way opens. Inspiration if Wisdom is yours.',
        failure: 'You loop once. Twilight Clock +1, and a distant Bokoblin horn answers your noise.',
        clock: 'Clock +1 on a failure here.',
      },
      {
        name: 'Power — the fallen cedar',
        text: 'Lift, smash, burn, or talk a Goron PC into being a door.',
        dc: 14,
        ability: 'Athletics (or deal 8 damage to the wood)',
        success: 'The way opens. Inspiration if Power is yours. Under the root: 8 rupees and a child’s wooden horse — the miller’s, if they asked.',
        failure: 'The log does not move this round. Try another method. Smashing without a plan is loud; Clock +1 if they keep hacking for more than a minute of table time.',
      },
      {
        name: 'Refuse to split — pick two trails',
        text: 'If the session is behind, Impa’s map still works with two verses.',
        success:
          'Skip the third shrine. No Clock tick for “taking all three.” You will feel the missing virtue at the Sacred Realm stones — still solvable.',
      },
    ],
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
    minuteStart: 52,
    minuteEnd: 60,
    mapId: 'map-lost-woods',
    npcs: ['Korok elder', 'Leaf-masked Koroks'],
    summary: 'Leaf-masked Koroks want a true name, joke, or hunger. Kindness marks a temple alcove; a lie lengthens the woods.',
    boxedText:
      'Faces bloom in the root-tangle: small, leaf-masked, eyes like wet river stones. They smell like crushed mint and damp pockets. A Korok elder no taller than a boot holds up a seed as if it were a lantern. “Yahaha! Lost-song people,” they creak, delighted and grave at once. “Give us a true name, a true joke, or a true hunger, and we show the Forest Meadow. Give us a lie, and we show you the long way, where the fog has teeth. We are not judges. We are gardeners. Gardeners know which stories grow.” Behind them, a dozen more Koroks peek, then hide, then peek.',
    whatsHappening:
      'Social scene, not a riddle with one answer. A sincere offering — a ration, a song, a secret, Saria’s Korok seed, the miller’s child’s name spoken kindly — succeeds without a roll. Deception DC 14 can fake a “true” gift; the Koroks remember and will not mark the Quiet Roots alcove. On a kind success they also mark a secret alcove in the Forest Temple (Room of Quiet Roots — a small key). On a lie or a threat, Twilight Clock +1 and they vanish; the meadow is still findable with DC 14 Survival. Combat against Koroks is possible and ugly: they melt, Clock +1, and Navi will not speak to the attacker until the temple door.',
    dmNotes:
      'If Saria is in the party, the elder already knows her and giggles. If a Goron tells a true hunger (“I miss the mountain’s heat”), that is enough. Do not make them dance for it. If the table freezes, Navi whispers “A name you have not said yet. Even yours.”',
    options: [
      {
        name: 'Give a true thing',
        text: 'A real name, a real joke, a real hunger, a ration, a song, a seed.',
        success:
          'No roll if sincere. They giggle like rain on leaves and point. One tucks a glow-cap mushroom into a pack (advantage on the next Nature or Survival check). They mark Quiet Roots in the temple.',
      },
      {
        name: 'Lie prettily',
        text: 'Invent a tragedy. Fake a secret.',
        dc: 14,
        ability: 'Deception',
        success:
          'They point the short way. They do not mark Quiet Roots. Later, a Korok in the temple will turn their back.',
        failure: 'They melt into moss. Clock +1. Meadow still findable, DC 14 Survival.',
        clock: 'Clock +1 on a failure, or if you threaten them.',
      },
      {
        name: 'Play for them',
        text: 'Ocarina, harp, or voice. They love Saria’s Song if anyone knows it.',
        dc: 12,
        ability: 'Performance',
        success: 'Same as a true gift, plus Navi sings along — advantage on the next ocarina check tonight.',
        failure: 'They are polite. “Almost a song.” Try a name or a ration; no Clock.',
      },
      {
        name: 'Threaten or draw steel',
        text: 'You can. You should not.',
        failure:
          'They vanish. Clock +1. Navi goes dull toward the aggressor until a kindness in the temple. The meadow is still there, longer way.',
        clock: 'Clock +1.',
      },
    ],
    skillChecks: [
      {
        name: 'Speak with the forest',
        dc: 12,
        ability: 'Persuasion or Performance',
        success:
          'They giggle like rain on leaves and point. One tucks a glow-cap mushroom into a pack (advantage on the next Nature or Survival check).',
        failure: 'They melt into moss. You can still find the meadow, but it takes longer.',
      },
    ],
  },
  {
    id: 's2-shrine',
    act: 2,
    title: 'Saria’s Meadow',
    minuteStart: 60,
    minuteEnd: 70,
    mapId: 'map-lost-woods',
    npcs: ['Navi', 'Echo of Saria’s Song'],
    summary: 'Four chimes, one cracked. Strike low → middle → high. The Triforce of Courage writes itself in gold.',
    boxedText:
      'A clearing like a held breath. Four wooden chimes hang from a living arch: low, middle, high, and a cracked fourth that does not belong — its wood is the color of a bruise, and it turns the wrong way in a wind you cannot feel. Stone underfoot is carved with the Kokiri’s emerald. When the wrong chime is struck, the forest answers with a laugh that is not a laugh. Fireflies hold still in the air, waiting to be told they may move. Navi drifts to the lowest living chime and rings a note so small you might miss it. The cracked chime hums flat, hungry for a hand.',
    whatsHappening:
      'Puzzle: the cracked chime is twilight-tainted. Players must strike the three living chimes in rising order — low, middle, high — Saria’s Song as a rising phrase. Clues are generous. Wrong order twice: 2 Poes drift in (or just Clock +1 if the well fight ran long). Success writes gold in the air: COURAGE IS THE STEP YOU TAKE BEFORE THE PATH APPEARS. Any PC can spend this Triforce of Courage once to automatically succeed a save against fear, or to add 1d8 to a heroic movement (jump, dash through gloom, hold a door). The cracked chime can be taken as a sad trophy; it is not a weapon unless a PC insists (then it is a club that hums flat, and Navi hates it).',
    dmNotes:
      'If they smash all four, the verse still appears after a Clock tick — fail forward. If a bard or Saria is present, they may know the phrase and skip the trial with a song (Performance DC 10). Do not let this eat twenty minutes.',
    treasure: 'Triforce of Courage (consumable virtue-sigil).',
    options: [
      {
        name: 'Strike low → middle → high',
        text: 'The intended solve. Navi has already hummed the first note.',
        success: 'Gold verse. Triforce of Courage. Fireflies move again. The gold trail thickens toward the temple.',
      },
      {
        name: 'Study before touching',
        text: 'Look, listen, ask Navi.',
        dc: 12,
        ability: 'Perception (moss on three chimes) or Arcana (the cracked one hums flat)',
        success: 'You know not to strike the bruise-colored chime. Navi confirms with a bright ring.',
        failure: 'You only know one is wrong, not which. Try anyway; first mistake is free.',
      },
      {
        name: 'Play Saria’s Song instead of striking',
        text: 'Harp, ocarina, or voice. The meadow wants a rising phrase more than it wants wood.',
        dc: 10,
        ability: 'Performance',
        success: 'Same as the correct chimes. If Saria is here, no roll.',
        failure: 'The cracked chime answers and laughs. Count this as one wrong strike.',
      },
      {
        name: 'Strike the cracked chime on purpose',
        text: 'Some tables poke the gloom.',
        failure:
          'Two Poes, or Clock +1 if you are behind. The living chimes still work afterward. A PC who apologizes to the meadow gets Navi’s next flare for free.',
        clock: 'Clock +1 if you skip the Poe fight.',
      },
    ],
    skillChecks: [
      {
        name: 'Read the chimes',
        dc: 12,
        ability: 'Perception or Arcana',
        success: 'Moss grows only on the three living chimes. The cracked one hums flat.',
        failure: 'You will have to try notes. First mistake does not summon Poes.',
      },
    ],
  },
  {
    id: 's2-wolfos',
    act: 2,
    title: 'Wolfos in the Gold Grass',
    minuteStart: 70,
    minuteEnd: 80,
    mapId: 'map-lost-woods',
    encounterIds: ['wolfos'],
    npcs: ['Navi'],
    summary: 'Two Wolfos hunt the party after Saria’s Song. Tall grass, a howl, a chase. Skip if the woods already ran long.',
    boxedText:
      'The gold trail thickens after the meadow, waist-high grass going the color of old rupees. For a breath everything is kind — fireflies, crushed mint, Navi humming Saria’s phrase under her breath. Then the grass ahead of you stands up and becomes a wolf the size of a pony, white-grey, eyes like wet amber. A second Wolfos circles left, already low. They do not bark. They howl once, a note that is almost the cracked chime, and the Lost Woods answers by going still. Navi, very small: “Hey. They used to be forest dogs. Twilight taught them that songs are meat.”',
    whatsHappening:
      'Main-path fight. 2 Wolfos (a third if five PCs and they are fresh). Terrain: tall grass is difficult terrain except on the gold trail; two trees as half cover. They use Pack Tactics and try to knock someone prone, then pile on. Howl of the Lost once if the table is enjoying it. They flee at a quarter hp or if Saria (or anyone) plays Saria’s Song as an action (DC 12 Performance) — the song does not kill them; it reminds them they were dogs. Afterward the gold trail tightens toward the Bokoblin camp. A Wolfos pelts as a cloak (advantage on the next save vs fear in the woods).',
    dmNotes:
      'If you are past minute 80, skip: a howl in the grass, torn gold thread, keep walking — still give the pelt if someone searches. Do not combine this with a full Bokoblin fight if both are running long; talk through the camp instead. A PC who only protects Navi is doing it right. They are beasts, not demons; a ranger or Kokiri can Animal Handling DC 14 after a howl to make one Wolfos hesitate a turn.',
    treasure: 'A Wolfos pelt (cloak: advantage on the next save vs fear in the Lost Woods). 4 rupees in a ribcage the pack was guarding.',
    options: [
      {
        name: 'Stand and fight',
        text: 'Two Wolfos. Grass slows anyone who leaves the trail. They flee at a quarter hp.',
        success: 'Pelt, coins, trail. Navi brightens. The woods remember they can be loud.',
      },
      {
        name: 'Play Saria’s Song',
        text: 'Action. The meadow’s rising phrase. They were forest dogs.',
        dc: 12,
        ability: 'Performance',
        success: 'They drop their hackles and melt into grass. No Clock. You may still take a shed pelt from the trail.',
        failure: 'The howl answers instead. Frightened on a failed DC 12 Wisdom save, then initiative.',
      },
      {
        name: 'Draw them off the trail',
        text: 'A runner with a light or a ration. The rest shoot from trees.',
        dc: 13,
        ability: 'Athletics or Animal Handling',
        success: 'One Wolfos spends its first turn chasing. Fight on better ground.',
        failure: 'They ignore the bait and go for the ocarina-carrier.',
      },
      {
        name: 'Skip if behind',
        text: 'DM: a howl, torn grass, keep the 3-hour promise.',
        success: 'Still give the pelt if someone looks down. Bokoblins can be the woods fight instead.',
      },
    ],
    skillChecks: [
      {
        name: 'Remind them they were dogs',
        dc: 12,
        ability: 'Performance or Animal Handling',
        success: 'Saria’s Song: they yield the trail. Animal Handling: one Wolfos hesitates a turn.',
        failure: 'The howl lands. DC 12 Wisdom or frightened until end of next turn.',
      },
    ],
  },
  {
    id: 's2-bokoblins',
    act: 2,
    title: 'Bokoblin Ambush',
    minuteStart: 80,
    minuteEnd: 90,
    mapId: 'map-lost-woods',
    encounterIds: ['bokoblin'],
    npcs: ['Bokoblin leader (chime-necklace)'],
    summary: 'Three Bokoblins paid in silence on the gold trail. They will take a deal. Talk is a way through, not a skip of the scene.',
    boxedText:
      'The gold trail tightens between two nurse-logs. Pig-ivory horns. Three (or four) hunched Bokoblins in scrap-hide step from the ferns, eyes reflecting purple like cheap glass. Their leader wears a necklace of silenced wind-chimes — Kakariko’s, if anyone looks. He holds up a palm, almost polite. “The dusk-king pays for quiet,” he grunts. “You are very loud. We can take your song-toy and let you walk around the long fog. Or we can see if Hylians still bleed green.” Behind him, a stream, two trees, and a fourth Bokoblin who would rather be somewhere else.',
    whatsHappening:
      'Main-path camp. Run it. 3 Bokoblins (4 if the party is fresh and grinning). Terrain: two trees as half cover, a stream as difficult terrain. They flee at half hp if the leader drops. They are twilight-adjacent, not demons: food, a path out of Hyrule, or the chime-necklace returned to “we stole these, we can steal lunch instead” can skip the steel — you still play the scene. The necklace gives advantage on the next ocarina check. A strip of temple-map leather on the leader shows a locked door (Quiet Roots or Gloom Span side-door). If Wolfos already ate ten minutes and you are past minute 90, talk them down in two lines and keep the necklace.',
    dmNotes:
      'Talking is a way through, not a missing scene. If they massacre sleeping Bokoblins later, Navi goes dull. 12 rupees in crude coins either way. Do not skip this and the Wolfos both unless the wall clock is cruel — one woods fight should land.',
    treasure: 'Chime-necklace; 12 rupees in crude coins; a strip of temple-map leather showing a locked door.',
    options: [
      {
        name: 'Fight',
        text: 'They are not a boss. They flee if the leader drops or at half hp.',
        success: 'Necklace, coins, map-strip. Gold trail continues.',
      },
      {
        name: 'Buy the quiet',
        text: 'Rations, rupees, or a promise of a road out of the woods.',
        dc: 13,
        ability: 'Persuasion or offer food without a roll if generous',
        success: 'They take the deal and vanish. You may still steal the necklace with Sleight of Hand DC 14 as they go — that turns it back into a fight.',
        failure: 'The leader decides you are lying. Initiative.',
      },
      {
        name: 'Scare them with twilight they do not own',
        text: 'Intimidate, a Poe-bead, or a Goron’s stand.',
        dc: 14,
        ability: 'Intimidation',
        success: 'They break. Leave the necklace in the ferns as they run.',
        failure: 'They laugh, nervous, and swing.',
      },
      {
        name: 'Talk past the steel',
        text: 'DM: if Wolfos ran long, resolve in two lines. A snapped chime hangs on a thorn — still give the necklace.',
        success: 'You still met them. You just did not bleed. No shame.',
      },
    ],
  },
  {
    id: 's3-door',
    act: 3,
    title: 'The Vine Door',
    minuteStart: 90,
    minuteEnd: 105,
    mapId: 'map-forest-temple',
    encounterIds: ['lizalfos'],
    npcs: ['Navi'],
    summary: 'Two Lizalfos guard the vine door for twilight. A true note still opens the lattice — and can send the lizards home.',
    boxedText:
      'The Forest Temple rises from the Lost Woods like a stone seed that forgot to stop growing. Stairs climb between buttresses of root and masonry. Owls that are not quite owls watch from niches and do not blink. The great door is a lattice of sleeping vines, each as thick as a wrist, breathing so slowly you could mistake it for stone. In the lintel, a leaf-shaped recess the size of an ocarina’s mouth. Two Lizalfos cling to the buttresses like wet jewels — chameleon hide, spears, tongues tasting the gold trail. They were paid in stillness: nothing enters that still sings. The air smells of wet iron, crushed mint, and old incense. Someone has carved, very small, at the foot of the stair: WE WERE A CHORUS. Navi rings once, uncertain. “Hey. Knights used to live here. The lizards did not.”',
    whatsHappening:
      'A true note on the Ocarina of Time opens the vine door with no check in calm air — and the Lizalfos must make a DC 12 Wisdom save or flee into the moss (they were hired to keep songs out; a song that works is above their pay). If the note fails or nobody plays, 2 Lizalfos fight on the stairs: high ground, vine cover, tongues pulling PCs off steps. Alternatives exist because tables poke doors. Inside: dim green light, dust, a mural of three sages offering a song to the Sacred Realm. History DC 13: the “heroes” look like ordinary people — a farmhand, a scholar, a Goron smith. If they already have the Courage sigil, pressing it to the recess also opens the door. Forcing it is possible and loud — the Lizalfos have advantage on their first attacks if the vines scream.',
    dmNotes:
      'This is a door fight, not a second dungeon. Two rounds. If they open with a true note, you may still let one Lizalfos be stubborn (the leader) so steel happens — or honor the skip. Once inside, let them feel the dungeon is a tool for keeping a song in the land. Do not start the hall puzzle until they have looked at the mural — thirty seconds of story pays off at the Shade.',
    options: [
      {
        name: 'Play a true note',
        text: 'Ocarina to the leaf recess. Calm air: no check. Lizalfos DC 12 Wisdom or they quit.',
        success: 'Vines withdraw like a breath released. Lizalfos melt into moss unless one is stubborn (DM: one remaining foe is fine).',
      },
      {
        name: 'Fight the door-guards',
        text: '2 Lizalfos. Stairs, vines, tongues. They flee at half hp if the door is already open.',
        success: 'The lattice still wants a note or a sigil. The fight does not pick the lock.',
      },
      {
        name: 'Press the Courage sigil to the lintel',
        text: 'If they won Saria’s Meadow.',
        success: 'The door opens. The sigil is not spent.',
      },
      {
        name: 'Tear a gap',
        text: 'Brute force. The temple will remember.',
        dc: 18,
        ability: 'Strength (Athletics)',
        success: 'A hole big enough to wriggle. Alarm: Clock +1. Deku Baba spores in the first hall have advantage on their first check.',
        failure: 'The vines squeeze back. 1d4 bludgeoning. Try a note.',
        clock: 'Clock +1 on a success by tearing.',
      },
      {
        name: 'Talk to the vines as if they were asleep',
        text: 'Druid, Kokiri, or anyone sincere. Medicine for plants.',
        dc: 14,
        ability: 'Nature or Persuasion',
        success: 'A gap opens for the kind. No Clock. Navi is delighted.',
        failure: 'They sleep on. The ocarina still works.',
      },
    ],
    skillChecks: [
      {
        name: 'Read the mural of sages',
        dc: 13,
        ability: 'History',
        success:
          'The heroes are ordinary: farmhand, scholar, Goron smith. The gift was a chorus. This matters when the Shade asks for a password.',
        failure: 'It is a pretty mural of important people. You miss the thesis.',
      },
    ],
  },
  {
    id: 's3-torches',
    act: 3,
    title: 'Hall of Kindled Breath',
    minuteStart: 105,
    minuteEnd: 115,
    mapId: 'map-forest-temple',
    encounterIds: ['deku-baba'],
    npcs: ['Navi'],
    summary: 'Four braziers tell a story: wind, fireflies, hearth, dawn. Light them in order for a small key.',
    boxedText:
      'A long hall like a throat. Four unlit braziers stand in a line, each under a mural: Farore’s wind moving through grass; Navi’s kin as fireflies over a well; a hearth in Kakariko with a pot and two bowls; a Hyrule dawn so bright the plaster still looks wet. In the far arch, a portcullis of living wood waits, patient as a held breath. When you step in, the braziers sigh — hungry, not hostile. Dust hangs in still air. Something in the vaulting clicks, like a seed wanting rain. Navi whispers, “Hey. Stories go in order. Even temple stories.”',
    whatsHappening:
      'Puzzle: light the braziers in story order — wind (empty / fan / gust / a PC running past), fireflies (tiny lights, dancing lights, a torch moved quickly, Navi hovering in the bowl), hearth (a real flame), dawn (all three plus the ocarina’s note, or light the last brazier from the entrance as if morning were coming in). Simpler table solve: the murals are numbered in the plaster 1–4 if anyone looks closely (Perception DC 10); light 1-2-3-4. Reverse order drops 2 Deku Babas from the ceiling. Success opens the portcullis and reveals a small key on the last brazier’s rim. Fail forward: after two wrong tries, Navi lights the first for them and the Babas still drop if you want a fight.',
    dmNotes:
      'If nobody has fire, the hearth mural hides a flint in the painted pot (Investigation DC 11). Do not require specific spells. A cook’s tinderbox is a hero item tonight.',
    treasure: 'Small Key of Kindled Breath.',
    options: [
      {
        name: 'Light 1–2–3–4 with the story',
        text: 'Wind, fireflies, hearth, dawn. Ocarina on the last if you like.',
        success: 'Portcullis opens. Small key on the dawn rim. The hall smells like bread for a moment.',
      },
      {
        name: 'Read the plaster numbers',
        text: 'Someone actually looks at the frames.',
        dc: 10,
        ability: 'Perception',
        success: 'Tiny Kokiri numerals. The table can stop guessing.',
        failure: 'Pretty pictures. Try the story anyway.',
      },
      {
        name: 'Light them backward, for science',
        text: 'Dawn first. The temple hates sequels before stories.',
        failure: '2 Deku Babas drop. After the fight the braziers reset. Try again; the key is still there.',
      },
      {
        name: 'Ask Navi to be the fireflies',
        text: 'She can sit in brazier two. She is shy about it and then proud.',
        success: 'Counts as the firefly step. She will remind you of the hearth next.',
      },
    ],
    skillChecks: [
      {
        name: 'Notice the numbered frames',
        dc: 10,
        ability: 'Perception',
        success: 'Kokiri numerals 1–4. Light in that order.',
        failure: 'You will solve it as a story instead of a code.',
      },
    ],
  },
  {
    id: 's3-gloom',
    act: 3,
    title: 'The Gloom Span',
    minuteStart: 115,
    minuteEnd: 128,
    mapId: 'map-forest-temple',
    encounterIds: ['wallmaster'],
    npcs: ['Wallmaster'],
    summary: 'Lily-pad platforms over starless gloom. A Wallmaster hunts shadows. Cross, loot, spend a small key if you want the Heart Container.',
    boxedText:
      'The floor is gone. A pit of slow, starless gloom — twilight leaking up from the well of the world, thick as oil and quiet as a held tongue. Stone platforms drift like lily pads on a black pond, pausing, then sliding, as if something below were breathing. On the far ledge, a chest bound in root-iron. A locked side-door of living wood waits on the right, leaf-shaped keyhole. A huge pale hand clings to the vaulting like a carved boss that learned to hate. Navi will not fly over the center. “Hey. That is a Wallmaster. If it takes you, it takes you back to the dark. Do not look up for too long. Also look up.”',
    whatsHappening:
      'Traversal plus a fight. The Wallmaster drops on the second PC to cross, or on anyone who falls. Each PC describes a crossing: Acrobatics DC 12, Athletics DC 12, or a clever use of rope, misty step, a Goron being a bridge, the Courage sigil (auto). Failure: 1d6 necrotic and they land on a lower platform — one extra check, not death — and the Wallmaster has advantage on its first grab against them. It tries to Crushing Grab and Return to the Dark. Killing it or forcing it to drop its prize (ocarina note as an action, DC 12, it must save DC 12 Wisdom or drop the grapple) clears the span. Chest: 2 red potions, 30 rupees of old temple coins, and — if you want a shorter dungeon — the Boss Key. Otherwise the Boss Key waits after the Hero’s Shade. The locked side-door eats the Kindled Breath key and hides a Heart Container plus 1 potion of healing. If they skip the side-door, Armogohma can still grant the Heart Container later.',
    dmNotes:
      'Do not map every square. Three beats: someone crosses first, the hand drops, someone opens a chest or a door. If they fly or teleport, the Wallmaster still wants a shadow — it can hover. If you are badly behind, the hand slams once (one grab attack) and then clings to the far wall as scenery. Falling twice used to be a Baba; the Wallmaster is the mouth now.',
    treasure: 'Red potions; optional Heart Container behind the locked door.',
    options: [
      {
        name: 'Cross platform by platform',
        text: 'Each PC: Acrobatics or Athletics DC 12, or a clever tool.',
        success: 'Far ledge. Chest. The Wallmaster does not get a name if you never looked up.',
        failure: '1d6 necrotic, lower platform, one more check. The Wallmaster drops with advantage.',
      },
      {
        name: 'Rope, chain, or a Goron bridge',
        text: 'One good plan can carry people with bad dice.',
        success: 'No individual checks if the plan is real. The first across still makes a DC 10 to anchor. The Wallmaster may still drop on the last across.',
      },
      {
        name: 'Cut the hand',
        text: 'Fight the Wallmaster on a pad. Ocarina DC 12 forces it to drop a grabbed ally.',
        success: 'It unravels into twilight-dust. The span is just a pit again.',
      },
      {
        name: 'Spend the Kindled Breath key',
        text: 'Side-door. Heart Container (next 0 hp becomes 1, allies 1d6 temp hp, then gone) and a potion.',
        success: 'Worth it. Describe a green pulse behind the sternum.',
      },
      {
        name: 'Leave the side-door',
        text: 'Save the key for “later.” There is no later keyhole except Quiet Roots (Korok mark) which uses kindness, not this key.',
        success: 'You are not punished. Armogohma can still bless you.',
      },
    ],
    skillChecks: [
      {
        name: 'Cross the span',
        dc: 12,
        ability: 'Acrobatics or Athletics',
        success: 'Far ledge, dry, proud.',
        failure: '1d6 necrotic and a lower pad. One extra check.',
      },
    ],
  },
  {
    id: 's3-statues',
    act: 3,
    title: 'Statues of the Sages',
    minuteStart: 128,
    minuteEnd: 136,
    mapId: 'map-forest-temple',
    npcs: ['Echo of Ganondorf (heard, not seen)'],
    summary: 'Rotate three sage statues toward the Sacred Realm’s true gold — slightly off north. A second small key drops.',
    boxedText:
      'Three greenstone statues stand on a circular floor that was once a compass: a runner with the Master Sword, a listener with a Sheikah harp, a Goron with a hammer like a sunrise. Each can be rotated with a grunt. On the ceiling, a faded fresco of the Sacred Realm — three standing stones, the gold one slightly north of true north, as if the painter knew the world was a little dishonest. The room’s only door south remains shut. In the silence you hear, very faintly, Ganondorf practicing a speech to an empty throne: “When they stop asking anyone to be brave, no one will have to fail.” Navi shivers. “Hey. Don’t listen to the practice. Listen to the moss.”',
    whatsHappening:
      'Puzzle: rotate all three statues to face the “true Green” — the fresco’s gold stone, about 15° east of north. Clues: Survival or Nature DC 12 notices moss on the north wall thicker toward a scuff; the gold stone is Courage; Navi drifts to the correct bearing if asked. When aligned, the south door opens and a second small key (Listening) drops from the listener’s harp. Wrong alignment twice: the Goron statue swings once (+5 to hit, 1d10+2 bludgeoning) then resets. Quiet Roots (if Koroks marked it) is a root-hatch behind the listener; kind parties find a third small key or 2 potions here.',
    dmNotes:
      'If they aim everything at magnetic north, nothing happens — a hint that “true” is a story, not a compass. The overheard speech is for later redemption math; do not start the boss now.',
    treasure: 'Small Key of Listening.',
    options: [
      {
        name: 'Align to the fresco’s gold stone',
        text: 'Slightly east of north. All three faces.',
        success: 'South door. Key from the harp. Ganondorf’s voice stops, annoyed.',
      },
      {
        name: 'Read moss and scuffs',
        text: 'The temple has been telling north wrong for years.',
        dc: 12,
        ability: 'Survival or Nature',
        success: 'You see the 15° lie. Navi confirms.',
        failure: 'You pick magnetic north. First try fails quietly. Second try wakes the hammer.',
      },
      {
        name: 'Ask Navi to be a compass',
        text: 'She hates the speech on the air and is glad to work.',
        success: 'She drifts to the bearing. No roll.',
      },
      {
        name: 'Force the south door',
        text: 'Keys are a suggestion.',
        dc: 16,
        ability: 'Athletics',
        success: 'It opens. No harp-key. Clock +1 from the noise. The Goron statue does not swing — it judges you.',
        failure: 'It stays shut. The hammer swing happens as if you had aligned wrong twice.',
        clock: 'Clock +1 if you smash it open.',
      },
    ],
    skillChecks: [
      {
        name: 'Find true Green',
        dc: 12,
        ability: 'Survival or Nature',
        success: 'Moss and a scuff mark 15° east of north. That is the fresco’s gold stone.',
        failure: 'Magnetic north does nothing. Try the ceiling again.',
      },
    ],
  },
  {
    id: 's3-shade',
    act: 3,
    title: 'The Hero’s Shade',
    minuteStart: 136,
    minuteEnd: 148,
    mapId: 'map-forest-temple',
    encounterIds: ['heros-shade'],
    npcs: ['The Hero’s Shade'],
    summary: 'Mini-boss. An old Hero of Time who kept his post. A song can turn this into a funeral instead of a slaughter.',
    boxedText:
      'The barracks were for living Knights of Hyrule. Bedrolls have become dust. A rack of spears still waits for hands. What remains is a captain in rusted green-gold plate, skull bright as a lantern — the Hero’s Shade, a previous chosen one who never laid down the sword. He salutes with a blade that still remembers courtesy. When he speaks, you hear a young man and a very old one using the same mouth. “The usurper promised we would keep our posts,” he says, almost grateful. “I have been keeping them so long I forgot the password was a song.” He sets his helm. “If you are the chorus, prove it. If you are thieves, I will make you quiet. I was kind, once. Kindness is heavy. I put it down.”',
    whatsHappening:
      'He is honorable. If the party plays a true note before anyone attacks, he has disadvantage on his first turn and will accept a surrender-parley at 15 hp: he yields the Boss Key and asks them to bury his name as a Hero of Time, not a ghost. Otherwise he fights until destroyed and uses Rally the Hollow once. Afterward: Boss Key, and a mural showing Ganondorf as a young Gerudo king who locked himself in the Sacred Realm “to keep the Triforce safe from war” — tragedy, not cartoon evil. Impa trained this man. If they bring his rest home at dawn, she weeps once, then bakes bread. A +1 rusted longsword that sheds green light (10 ft) is a Virtue: Courage weapon; it wants to be laid down eventually.',
    dmNotes:
      'If they only murder him, the mural still shows. The sword still drops. Navi is quieter. Parley is the better story and not a “skip.” The password he forgot is any true note, a Triforce verse, or “we were a chorus” from the stair.',
    treasure:
      'Boss Key; the Shade’s name laid to rest (story); a +1 rusted longsword that sheds green light (10 ft) and is a Virtue: Courage weapon.',
    options: [
      {
        name: 'Play the password first',
        text: 'True note, a Triforce verse, or “we were a chorus.” Then talk or fight with his respect.',
        success: 'Disadvantage on his first turn. Parley available at 15 hp. He remembers his name if someone asks (it can be “the Hero of Time” if you do not want to invent one).',
      },
      {
        name: 'Duel honorably',
        text: 'One champion, the rest hold. He will accept this.',
        success: 'Fight him as a solo with the others aiding by song (Help action = Performance DC 12). At 15 hp he still yields if they offered a note at any point.',
      },
      {
        name: 'Full fight',
        text: 'He uses Rally the Hollow once. He is not evil. He is tired.',
        success: 'Boss Key, sword, mural. The funeral is yours to skip or not.',
      },
      {
        name: 'Name him and ask him to rest',
        text: 'Persuasion after a note, or after he is bloodied.',
        dc: 14,
        ability: 'Persuasion or Religion',
        success: 'He sits. Helm off. Boss Key without the last hit points. Clock does not tick. Impa will feel this at dawn.',
        failure: 'He shakes his head. “Not yet.” Fight continues; parley still open at 15 hp.',
      },
    ],
    skillChecks: [
      {
        name: 'Lay the Shade to rest',
        dc: 14,
        ability: 'Persuasion or Religion',
        success: 'He yields the Boss Key and asks to be remembered as a Hero of Time, not a ghost.',
        failure: 'He will not sit yet. The fight continues; mercy is still available at 15 hp.',
      },
    ],
  },
  {
    id: 's3-gohma',
    act: 3,
    title: 'Armogohma',
    minuteStart: 148,
    minuteEnd: 165,
    mapId: 'map-forest-temple',
    encounterIds: ['armogohma'],
    npcs: ['Armogohma (guardian, not demon)'],
    summary: 'Boss or lullaby. The construct guards a verse. Wisdom blooms when it kneels. Heart Container. Stairs to the Sacred Realm.',
    boxedText:
      'The inner sanctum is a circular garden under a cracked dome, stars showing through like shy rupees. A colossus of vine, temple-stone, and armored spider kneels as if in prayer — Armogohma, a blade of living green fused to its legs, eyes shut. The Boss Key-hole is a flower in the floor. When it turns, the construct’s eyes open the color of old rupees. It was built to guard the Sage of Forest’s verse. Twilight taught it that everything moving is a thief. It does not roar. It inhales, and the garden’s grass leans toward it, as if even the plants want to be still. Navi, very small: “Hey. It used to listen. We can remind it. Or we can break it. Breaking is louder.”',
    whatsHappening:
      'If time is short: skip the fight — an ocarina skill challenge (3 successes before 3 failures, DC 13 Performance, Arcana, or Persuasion; true notes and Triforce virtues count) soothes it to sleep and it offers the verse. Full fight: Armogohma, remind them Vineheart (ocarina gives it disadvantage on its next attack). At 0 hp it does not explode; it kneels again and the Triforce of Wisdom blooms in its chest: WISDOM IS THE LISTENING THAT MAKES A PATH KIND. Heart Container blessing on the party if they do not already have one. A stair of roots opens toward the Sacred Realm. A potion of greater healing in the rib-garden. Killing it and soothing it grant the same treasure; the difference is how Navi looks at them.',
    dmNotes:
      'Do not run a 40-minute boss if you are at minute 160. The skill challenge is the designed skip. If they fight, keep Vineheart loud. Fail the lullaby 3 times: it wakes angry and you fight anyway, but it has already taken 20 damage from doubt.',
    treasure: 'Triforce of Wisdom; Heart Container; 1 potion of greater healing in the construct’s rib-garden.',
    options: [
      {
        name: 'Soothe it with the song',
        text: '3 successes before 3 failures, DC 13 Performance / Arcana / Persuasion. Ocarina auto-counts as a success once.',
        success: 'It kneels. Verse. Wisdom. Stairs. No Clock.',
        failure: 'It fights, already cracked (start at −20 hp). Verse still comes when it kneels at 0.',
      },
      {
        name: 'Fight the guardian',
        text: 'Full stat block. Ocarina = Vineheart. Aim for eyes if you like Zelda.',
        success: 'Same treasure. Navi is sad and loyal.',
      },
      {
        name: 'Offer to take its watch',
        text: 'A PC promises to be the new listener. Paladin, ranger, or anyone exhausted.',
        dc: 15,
        ability: 'Persuasion',
        success:
          'It yields the verse and stays kneeling as a statue. Sequel: someone may have to come back. Wisdom still blooms.',
        failure: 'It does not trust a mortal with a watch this long. Choose fight or lullaby.',
      },
    ],
    skillChecks: [
      {
        name: 'Lullaby skill challenge',
        dc: 13,
        ability: 'Performance, Arcana, or Persuasion',
        success: '3 successes: it sleeps and offers Wisdom.',
        failure: '3 failures: fight, already damaged.',
      },
    ],
  },
  {
    id: 's4-tide',
    act: 4,
    title: 'Twilight Tide',
    minuteStart: 165,
    minuteEnd: 172,
    mapId: 'map-sacred-realm',
    npcs: ['Navi', 'Ganondorf (seen at a distance)'],
    summary: 'Travel beat. The woods are a dark sea. If the Clock is high, Kakariko is already hurting. The stair still has teeth — next scene.',
    boxedText:
      'You climb out of the Forest Temple into a sky the color of a bruise that has decided to keep its job. The Lost Woods below are a dark sea; the gold trail is a single thread someone could cut with two fingers. Kakariko is a handful of lanterns — or fewer, if the Twilight Clock has been cruel. Wind arrives late, like the woods. The Sacred Realm waits on pale stone: three standing stones, a cracked dais, and a figure in antlered gold-black plate who has been practicing how to sit on a throne that is not there. He does not look up yet. He knows you will come. Navi is terrified and brave, a spark in someone’s collar. “Hey. The third verse isn’t in a chest. I figured that out. I wish I hadn’t.”',
    whatsHappening:
      'Travel beat, 5 minutes of table time. If Clock ≥ 4, describe Kakariko’s well gone dark and a distant scream cut short — raise stakes. Sheik or any scholar: the third verse was never in the temple. It is made in the singing. Power is not a relic. It is the choice to spend yourself. Give each PC one look back: who did they leave in the village, what do they hope is still moving. Ganondorf will not climb down this stair; the twilight choir between you and the dais is his idea of courtesy. Rest here advances the Clock.',
    dmNotes:
      'If they try to run back to Kakariko now, Impa’s voice on the wind (or Navi): the well is a symptom. The cure is the dais. A PC who still runs: they arrive at dawn with a scarred village and no verse — play that only if they insist. Do not skip the choir unless the wall clock is already past 3 hours.',
    options: [
      {
        name: 'Look back at Kakariko',
        text: 'Count lanterns. Name someone.',
        success:
          'If Clock < 4, lanterns still move. If Clock ≥ 4, the well is a black coin and one scream has already ended. The choir is still ahead.',
      },
      {
        name: 'Ask what the third verse is',
        text: 'Navi, Sheik, Arcana, or a paladin’s oath.',
        dc: 12,
        ability: 'Arcana or Insight',
        success: 'Power is the note you give away. There is no chest. The stones will ask for a price.',
        failure: 'You only know it is not a key. The stones will still explain themselves.',
      },
      {
        name: 'Call out to Ganondorf from the stair',
        text: 'He will answer once, civilly.',
        success:
          '“Finish it. I am so tired of half-measures.” Then he waits. No initiative yet.',
      },
      {
        name: 'Short rest on the stair',
        text: 'Hit dice, breath, potions.',
        failure: 'Clock +1. The bruise-sky darkens. He does not interrupt; twilight does.',
        clock: 'Clock +1.',
      },
    ],
  },
  {
    id: 's4-choir',
    act: 4,
    title: 'The Uncaught Measures',
    minuteStart: 172,
    minuteEnd: 182,
    mapId: 'map-sacred-realm',
    encounterIds: ['bubble', 'stalfos'],
    npcs: ['Navi'],
    summary: 'Bubbles and a Stalfos on the Sacred Realm stair — leftover notes Ganondorf would not catch. A last fight before the trials.',
    boxedText:
      'The pale stair to the dais is a throat of wind. Three skulls in shells of cursed fire — Bubbles — bounce the steps as if the stone were a drum. Behind them, a Stalfos in rusted Hylian plate plants a shield and waits, courteous as the Shade was, empty as he is not. They hum the Song of Time a half-step flat, the same insult as the Poes, louder because the Sacred Realm has nowhere to hide an echo. Ganondorf, still a silhouette on the gold, does not look down. Navi shakes so hard her light stutters. “Hey. Those are the measures he wouldn’t take. If we don’t catch them, they’ll catch us.”',
    whatsHappening:
      'Main-path fight. 3 Bubbles (two fire, one ice) and 1 Stalfos. Terrain: stairs are difficult terrain going up; a missed melee attack against a Bubble from below has a 1-in-6 chance to send the attacker prone down a step (1d4 bludgeoning, flavor). Bubbles curse on a hit (disadvantage on next attack; a true note clears it). The Stalfos parries once per round and tries to hold the landing. They are leftover verses, not Ganondorf’s honor guard — if the party plays a true note as an action, one Bubble unravels. At 0 hp they pop into moths and a clean note. Afterward the standing stones wake. If you are past minute 185, skip: one Bubble pops on the stair, the Stalfos salutes and sits down like a dropped suit, trials begin.',
    dmNotes:
      'Two or three rounds. Do not turn this into a second boss. The Stalfos will yield if someone names the Shade or says “we were a chorus” (Persuasion DC 12) — it was a knight once. Bubbles do not parley. A Fire Bubble that dies next to a PC can ignite a cloak (1 fire, put out as an action). This fight exists so Ganondorf is not the only steel in Act 4.',
    treasure: 'A Bubble’s cursed shell (once: 1d6 fire or cold on a melee hit, then it cracks). The Stalfos’s dented shield ( +1 AC until the Ganondorf fight ends, then it rusts to story).',
    options: [
      {
        name: 'Fight up the stair',
        text: '3 Bubbles + 1 Stalfos. True notes pop Bubbles. Stalfos holds the landing.',
        success: 'The stones wake. You arrive loud, which Ganondorf prefers.',
      },
      {
        name: 'Name the knight',
        text: 'The Shade’s rest, “we were a chorus,” or a salute.',
        dc: 12,
        ability: 'Persuasion or Religion',
        success: 'The Stalfos sits. You still have the Bubbles. He leaves the shield if you were kind.',
        failure: 'It shakes its skull. Fight. Parley is closed.',
      },
      {
        name: 'Play the missing downbeat',
        text: 'Ocarina as an action. One Bubble per success.',
        dc: 12,
        ability: 'Performance or Constitution',
        success: 'One Bubble unravels. Repeat if you want to spend the fight singing.',
        failure: 'The flat choir gets louder. Bubbles have advantage on their next ram.',
      },
      {
        name: 'Skip if behind',
        text: 'DM: past minute 185, or Armogohma already ate the clock. One pop, one salute, go to the stones.',
        success: 'Keep dawn. Ganondorf is still a fight.',
      },
    ],
    skillChecks: [
      {
        name: 'Pop a Bubble with a true note',
        dc: 12,
        ability: 'Performance or Constitution',
        success: 'One Bubble unravels into moths.',
        failure: 'The choir answers. Advantage on their next ram.',
      },
    ],
  },
  {
    id: 's4-trials',
    act: 4,
    title: 'Three Triforce Trials',
    minuteStart: 182,
    minuteEnd: 192,
    mapId: 'map-sacred-realm',
    npcs: ['The three stones', 'Ganondorf (watching)'],
    summary: 'Courage steps into air. Wisdom answers what cannot be stolen. Power pays a price. Together they are the last verse.',
    boxedText:
      'The standing stones wake without thunder. Gold asks for a step into empty air over the drop — Courage, a path that will not exist until a foot is already falling. Teal asks a riddle in the wind, in Impa’s cadence and a child’s: “What measure cannot be stolen?” — Wisdom. Crimson asks for a price you will feel in the morning: blood, a treasured item, or a promise that will hurt later — Power. Ganondorf does not interrupt. His helm is in his hands. He wants the Song of Time complete so he can take the Triforce whole, the way a drowning man wants the last breath in the room. Navi rings three times, then is quiet, because this part is not a fairy’s.',
    whatsHappening:
      'Fast. Ten minutes, not a second dungeon. Courage: step off; a bridge of light appears after the first foot falls (or Athletics DC 14 to leap to a spur if they refuse faith). Wisdom riddle answers: a gift, a chorus, a name spoken truly, listening, love, the Goddess herself, time given away — reward sincerity. “A lock,” “a king,” “me,” “steel” fail; another PC may try; Navi can hint once (“Hey. Not a thing you keep.”). Power: 1d6 damage, or sacrifice a magic item (the Shade’s sword is a beautiful awful choice), or swear a geas-like promise (DM’s sequel hook: return to Ganon’s Castle, find the child, carry a song to the desert). Completing all three writes the Triforce of Power in the air: POWER IS THE NOTE YOU GIVE AWAY. They now have the full Song of Time. The matching-virtue PC does not have to take their own stone; the table can mix.',
    dmNotes:
      'If they skip a stone, the Song is still playable with disadvantage on the first two song checks in the fight. Do not stop the session here. Ganondorf waits one round of gloating after the last verse, then initiative unless they speak first.',
    options: [
      {
        name: 'Courage — step into air',
        text: 'The bridge exists after the foot, not before.',
        success: 'Gold light. If they use Athletics DC 14 to cheat to a spur, it still counts, less beautifully.',
        failure: 'They freeze. Another PC can step. Clock does not tick for fear; this is the point of Courage.',
      },
      {
        name: 'Wisdom — answer the teal stone',
        text: 'What measure cannot be stolen?',
        dc: 0,
        ability: 'Wisdom (roleplay)',
        success: 'A gift, a chorus, listening, a true name, love, time given. The stone warms.',
        failure: 'A smug answer (“me,” “steel,” “a lock”) makes the stone go dull; another PC may try. Navi hints once.',
      },
      {
        name: 'Power — pay',
        text: '1d6 hp, a magic item, or a promise that binds a sequel.',
        success: 'Crimson writes POWER IS THE NOTE YOU GIVE AWAY. The Song is whole.',
      },
      {
        name: 'Let one PC take all three',
        text: 'Possible. Lonely. The stones accept it and the later song checks are harder (DC 14) because a chorus was refused.',
        success: 'The verses appear. Ganondorf looks almost sorry for them.',
      },
    ],
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
    minuteStart: 192,
    minuteEnd: 210,
    mapId: 'map-sacred-realm',
    encounterIds: ['ganondorf'],
    npcs: ['Ganondorf', 'Navi'],
    summary: 'Climax. Fight and song together. Six successes to finish the measure. He can be killed, spared, or turned into a listener.',
    boxedText:
      'Ganondorf lifts his helm. The Gerudo face beneath is young and exhausted, the desert still in the corners of his eyes. “I was born where the Goddess’s gift was a rumor,” he says, not unkindly. “Every generation treats the Triforce like a prize. So I took the song into twilight, where nothing ages and nothing is asked to be a hero. Play it if you must. I will unmake the measure as you play, and Hyrule will finally be still — no more chosen children, no more failures, no more dawn that demands a sword.” The dais cracks. Purple storm stands up like a second king. Navi does not say hey. She just holds a note, shaking, and waits for you to join it.',
    whatsHappening:
      'Two layers at once. Combat: Ganondorf stat block, phase 1 knight, phase 2 Ganon-beast if the Clock is 6 at start or when he hits half hp. Parallel skill challenge: the Song of Time needs 6 successes before he hits 0 or the table would tick a 7th Clock (it cannot — instead, at 3 song failures he auto-casts Unmake the Measure). Any PC can use an action to sing or play (Performance, the ocarina, a spell slot, a spent Triforce virtue) DC 13 for a success. Combat and song interleave; do not make it “fight then karaoke.” Redeem him: Persuasion DC 15 once when he is below 30 hp and they have at least 3 song successes — he hesitates (skips a turn, drops resistance). Killing him ends the twilight. Sparing him: he becomes the Sacred Realm’s new listener, a tragic NPC — and Ganon’s Castle still waits as a sequel. If they only fight and never sing, the twilight thins but does not heal; dawn is grey and the Clock’s scars stay.',
    dmNotes:
      'Track song successes visibly (six stones, six marks). Remind them of Vineheart-style ocarina tricks and spent virtues ignoring resistance. If the table loves talking, let a whole round be argument; he will answer. He is a thesis, not a pig, until phase 2. Phase 2 can still be redeemed if they already had 3 song successes — harder Persuasion DC 17.',
    treasure:
      'Twilight Blade (rare, +1 longsword, 1d4 necrotic; once/day dim twilight 20 ft). Ganondorf’s helm (story). The Green of Hyrule restored — if the song finished.',
    options: [
      {
        name: 'Interleave steel and song',
        text: 'The designed climax. 6 song successes, DC 13, while he tries to unmake.',
        success: 'Twilight ends. Choose kill, spare, or listener.',
      },
      {
        name: 'Redeem',
        text: 'Below 30 hp (or beast at half) and ≥ 3 song successes. Tell him stillness is a locked room.',
        dc: 15,
        ability: 'Persuasion (DC 17 in phase 2)',
        success: 'He skips a turn, drops resistance. Next song check is DC 11. He may kneel if they offer him the listener’s post.',
        failure: 'He laughs once, not unkindly, and Unmake is still in play.',
      },
      {
        name: 'Only fight',
        text: 'You can win the hp race.',
        success: 'He dies or falls. Dawn is grey. Scars stay. Sequel is colder.',
        failure: 'If they never sing and lose, twilight keeps Kakariko. That is a hard end — offer a last note even in defeat.',
      },
      {
        name: 'Offer him the watch Armogohma had',
        text: 'A listener, not a king. Works best after redeem success.',
        success:
          'He stays on the dais. Helm on the stone. Ganon’s Castle still wears a little shadow — sequel, not tonight.',
      },
    ],
    skillChecks: [
      {
        name: 'Sing a verse of the Song of Time',
        dc: 13,
        ability: 'Performance, ocarina, spell slot, or spent virtue',
        success: 'One of six. The standing stones brighten.',
        failure: 'Toward Unmake. Three failures: he casts it automatically.',
      },
    ],
  },
  {
    id: 's5-dawn',
    act: 5,
    title: 'Dawn Over Hyrule',
    minuteStart: 210,
    minuteEnd: 220,
    mapId: 'map-hyrule',
    npcs: ['Impa', 'Navi', 'Kakariko'],
    summary: 'Coda. Green comes back. Ask each PC what they do with the first quiet morning. Thank the table. End on a note.',
    boxedText:
      'The first color back is green so bright it hurts, like a song you had forgotten was in a major key. Kakariko’s lanterns remember how to move. The windmill laughs — a wooden, ugly, living laugh. Cuccos complain, which is a kind of hymn. Navi becomes, for a moment, a whole chord — then a small tired spark again, curled in someone’s collar, too proud to say thank you. Impa is waiting on the road with bread that is finally warm, and with a look that is not a legend’s look. “You did not save a myth,” she says. “You saved a place that wanted to keep singing.” Far north, Ganon’s Castle still wears a little shadow, like a bruise a body is allowed to keep. Songs end. Choruses do not have to.',
    whatsHappening:
      'Epilogue in 5–10 minutes. Go around the table: what do you do with the first quiet morning? Eat, sleep, look for the miller’s child, refuse the Twilight Blade, give the Shade’s sword to Impa, stay, leave, kiss someone, do not. If Clock hit 6, a grove is gone and a child is still missing — bittersweet, not a gotcha; that child is a sequel, not a failure of tonight. Rewards: 700 XP each (or level 4 if you prefer a hard bump), Heart Container if unused, downtime in Kakariko. Sequel hooks to name out loud: the missing child in twilight; the Twilight Realm itself; Navi growing into a full sage; Ganon’s Castle; a Gerudo desert that still has not been given a gift. If they spared Ganondorf as listener, Impa will not thank them and will not condemn them. Thank the table. End on a note, not a lecture — a hummed lullaby, a cucco, a windmill, a fairy saying hey one last time.',
    dmNotes:
      'Do not start a new dungeon. If someone wants to march on the Castle, Impa blocks the road with bread. “Tomorrow is a chorus too.” Fade out.',
    options: [
      {
        name: 'Go around the table',
        text: 'One image each. No rolls unless someone insists on shopping.',
        success: 'The session has a shape. You can stop talking while it still sounds like music.',
      },
      {
        name: 'Give Impa the Shade’s name',
        text: 'If they laid him down.',
        success: 'She weeps once. Then she bakes. She will never be cute about it.',
      },
      {
        name: 'Look for the miller’s child',
        text: 'If Clock was high.',
        success:
          'A wooden horse at the tree line, a gold thread, no child. Sequel. The parents still feed you. That is Hyrule too.',
      },
      {
        name: 'Refuse to end',
        text: 'Players want Ganon’s Castle now.',
        failure:
          'Impa: “Not tonight.” Offer a date. Do not run a second module on fumes. The shadow on the Castle is a door, not a hallway.',
      },
    ],
  },
]
