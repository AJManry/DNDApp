import type { StatBlock } from '../types'

export const bestiary: StatBlock[] = [
  {
    id: 'poe',
    name: 'Poe',
    cr: '1/2',
    type: 'Tiny undead',
    ac: 13,
    hp: 10,
    speed: '0 ft., fly 40 ft. (hover)',
    stats: { str: 1, dex: 16, con: 10, int: 6, wis: 12, cha: 14 },
    traits: [
      'Incorporeal Drift. The Poe can move through creatures and objects as difficult terrain. It takes 3 (1d6) force damage if it ends its turn inside an object.',
      'Gloomglow. Dim purple light in a 10-foot radius. In that light, Wisdom (Perception) checks that rely on hearing have disadvantage — the air hums off-key.',
    ],
    actions: [
      {
        name: 'Chill Spark',
        text: 'Ranged Spell Attack: +5 to hit, range 30 ft., one target. Hit: 6 (1d8 + 2) necrotic damage, and the target cannot take reactions until the start of its next turn.',
      },
      {
        name: 'Discordant Chord (Recharge 5–6)',
        text: 'Each creature within 10 feet must succeed on a DC 12 Constitution save or take 7 (2d6) thunder damage and be deafened until the end of its next turn.',
      },
    ],
  },
  {
    id: 'keese',
    name: 'Keese',
    cr: '1/2',
    type: 'Tiny beast',
    ac: 13,
    hp: 7,
    speed: '5 ft., fly 40 ft.',
    stats: { str: 4, dex: 16, con: 10, int: 2, wis: 12, cha: 5 },
    traits: [
      'Echolocation. The Keese cannot use its blindsight while deafened.',
      'Swarm Hunger. Advantage on attack rolls against a creature if at least one allied Keese is within 5 feet of the target and not incapacitated.',
    ],
    actions: [
      {
        name: 'Bite',
        text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) piercing damage.',
      },
      {
        name: 'Fire Burst (Fire Keese only, 1/day)',
        text: 'If this Keese is a Fire Keese (one in four), it sheds dim orange light 10 ft. Its bite deals an extra 2 (1d4) fire damage, and a hit ignites a carried torch or lantern.',
      },
    ],
  },
  {
    id: 'wolfos',
    name: 'Wolfos',
    cr: '2',
    type: 'Medium beast',
    ac: 14,
    hp: 32,
    speed: '40 ft.',
    stats: { str: 15, dex: 16, con: 14, int: 6, wis: 12, cha: 8 },
    traits: [
      'Pack Tactics. Advantage on an attack roll against a creature if at least one allied Wolfos is within 5 feet of the target and not incapacitated.',
      'Gold-Grass Camouflage. While motionless in tall grass, Wisdom (Perception) checks to notice it are made at disadvantage.',
    ],
    actions: [
      {
        name: 'Bite',
        text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) piercing damage. If the target is a creature, it must succeed on a DC 12 Strength save or be knocked prone.',
      },
      {
        name: 'Howl of the Lost (Recharge 5–6)',
        text: 'Each enemy within 30 feet that can hear the Wolfos must succeed on a DC 12 Wisdom save or be frightened until the end of its next turn. A creature that has heard Saria’s Song tonight has advantage.',
      },
    ],
  },
  {
    id: 'lizalfos',
    name: 'Lizalfos',
    cr: '2',
    type: 'Medium humanoid (lizardfolk)',
    ac: 15,
    hp: 33,
    speed: '30 ft., climb 20 ft., swim 30 ft.',
    stats: { str: 14, dex: 16, con: 14, int: 8, wis: 12, cha: 8 },
    traits: [
      'Chameleon Hide. The Lizalfos can take the Hide action as a bonus action if it is next to a wall, vine, or water. Until it moves or attacks, it is lightly obscured.',
      'Amphibious. It can breathe air and water.',
    ],
    actions: [
      {
        name: 'Multiattack',
        text: 'The Lizalfos makes one spear attack and one tongue lash, or two spear attacks.',
      },
      {
        name: 'Spear',
        text: 'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 7 (1d8 + 3) piercing damage.',
      },
      {
        name: 'Tongue Lash',
        text: 'Melee Weapon Attack: +5 to hit, reach 10 ft., one target. Hit: 5 (1d4 + 3) bludgeoning damage, and the target is pulled 5 feet closer.',
      },
    ],
  },
  {
    id: 'wallmaster',
    name: 'Wallmaster',
    cr: '2',
    type: 'Large monstrosity',
    ac: 14,
    hp: 45,
    speed: '20 ft., climb 20 ft., fly 20 ft. (hover)',
    stats: { str: 18, dex: 12, con: 16, int: 4, wis: 10, cha: 6 },
    traits: [
      'Ceiling Drop. While on a ceiling or hovering in gloom, the Wallmaster is lightly obscured. The first time it hits a creature from above, that hit is made with advantage.',
      'False Appearance. While motionless against stone, it is indistinguishable from a carved hand.',
    ],
    actions: [
      {
        name: 'Crushing Grab',
        text: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage, and the target is grappled (escape DC 14). Until the grapple ends, the target is restrained, the Wallmaster cannot grab another creature, and it may fly with the target.',
      },
      {
        name: 'Return to the Dark (Recharge 6)',
        text: 'If it is grappling a creature, the Wallmaster vanishes into twilight with its prize. The grappled creature takes 7 (2d6) necrotic damage, is dropped on a lower gloom platform (or 10 feet down), and the Wallmaster reappears in an unoccupied space it can see within 30 feet.',
      },
    ],
  },
  {
    id: 'bubble',
    name: 'Bubble',
    cr: '1',
    type: 'Small undead',
    ac: 13,
    hp: 18,
    speed: '0 ft., fly 30 ft. (hover)',
    stats: { str: 6, dex: 16, con: 12, int: 4, wis: 10, cha: 12 },
    traits: [
      'Cursed Flame. A creature that hits the Bubble with a melee attack takes 3 (1d6) fire or cold damage (choose when you seed the board: two fire, one ice).',
      'Skull Laugh. The Bubble is immune to being frightened. It is vulnerable to radiant damage.',
    ],
    actions: [
      {
        name: 'Cursed Ram',
        text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning plus 3 (1d6) fire or cold damage, and the target is cursed until the end of its next turn: it has disadvantage on its next attack roll (a true note ends the curse early).',
      },
    ],
  },
  {
    id: 'stalfos',
    name: 'Stalfos',
    cr: '2',
    type: 'Medium undead',
    ac: 15,
    hp: 38,
    speed: '30 ft.',
    stats: { str: 14, dex: 14, con: 14, int: 8, wis: 10, cha: 8 },
    traits: [
      'Parry. The Stalfos adds 2 to its AC against one melee attack that would hit it. To do so, it must see the attacker and be wielding a melee weapon.',
      'Turn Resistance. Advantage on saves against effects that turn undead.',
    ],
    actions: [
      {
        name: 'Multiattack',
        text: 'The Stalfos makes two rusted-sword attacks.',
      },
      {
        name: 'Rusted Sword',
        text: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage.',
      },
      {
        name: 'Shield Bash',
        text: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) bludgeoning damage, and the target must succeed on a DC 12 Strength save or be knocked prone.',
      },
    ],
  },
  {
    id: 'bokoblin',
    name: 'Bokoblin',
    cr: '1',
    type: 'Medium humanoid',
    ac: 14,
    hp: 22,
    speed: '30 ft.',
    stats: { str: 15, dex: 12, con: 14, int: 8, wis: 10, cha: 8 },
    traits: [
      'Pack Howl. Advantage on attack rolls against a creature if at least one allied Bokoblin is within 5 feet of the target and not incapacitated.',
    ],
    actions: [
      {
        name: 'Jagged Club',
        text: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) bludgeoning damage.',
      },
      {
        name: 'Thrown Javelin',
        text: 'Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage.',
      },
    ],
  },
  {
    id: 'deku-baba',
    name: 'Deku Baba',
    cr: '1',
    type: 'Medium plant',
    ac: 13,
    hp: 26,
    speed: '20 ft., burrow 10 ft.',
    stats: { str: 14, dex: 8, con: 16, int: 3, wis: 10, cha: 4 },
    traits: [
      'False Appearance. While motionless among vines, it is indistinguishable from Forest Temple growth.',
    ],
    actions: [
      {
        name: 'Bite',
        text: 'Melee Weapon Attack: +4 to hit, reach 10 ft., one target. Hit: 8 (1d10 + 3) piercing damage, and the target is grappled (escape DC 12). Until the grapple ends, the Baba cannot bite another target.',
      },
    ],
  },
  {
    id: 'heros-shade',
    name: 'The Hero’s Shade',
    cr: '3',
    type: 'Medium undead',
    ac: 16,
    hp: 52,
    speed: '30 ft.',
    stats: { str: 16, dex: 12, con: 14, int: 10, wis: 11, cha: 12 },
    traits: [
      'Turn Resistance. Advantage on saves against effects that turn undead.',
      'Green-Bane Plate. While it has not taken radiant or fire damage this round, melee attacks against it are made at disadvantage.',
    ],
    actions: [
      {
        name: 'Multiattack',
        text: 'The Shade makes two rusted-longsword attacks.',
      },
      {
        name: 'Rusted Longsword',
        text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing plus 3 (1d6) necrotic damage.',
      },
      {
        name: 'Rally the Hollow (1/day)',
        text: 'Two Poes (or skeletal fragments with 6 hp, AC 12, +3/1d6) rise in unoccupied spaces within 20 feet.',
      },
    ],
  },
  {
    id: 'armogohma',
    name: 'Armogohma',
    cr: '4',
    type: 'Large construct',
    ac: 15,
    hp: 76,
    speed: '30 ft., climb 20 ft.',
    stats: { str: 18, dex: 10, con: 16, int: 6, wis: 12, cha: 6 },
    traits: [
      'Vineheart. If a creature plays a note on the Ocarina of Time as an action (DC 12 Performance or a spell slot), Armogohma has disadvantage on its next attack and the vines loosen — its AC drops to 13 until the start of its next turn.',
      'Awakened Wrongly. The first time it is reduced below 30 hp, it slams the floor. Each creature on the ground must succeed on a DC 13 Dexterity save or fall prone.',
    ],
    actions: [
      {
        name: 'Multiattack',
        text: 'Armogohma makes one slam and one vine lash.',
      },
      {
        name: 'Slam',
        text: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.',
      },
      {
        name: 'Vine Lash',
        text: 'Melee Weapon Attack: +6 to hit, reach 15 ft., one target. Hit: 9 (1d10 + 4) slashing damage, and the target is pulled 10 feet closer.',
      },
    ],
  },
  {
    id: 'ganondorf',
    name: 'Ganondorf, King of Twilight',
    cr: '5',
    type: 'Medium humanoid (Gerudo, twilight-touched)',
    ac: 17,
    hp: 95,
    speed: '30 ft., fly 20 ft. (hover, phase 2 only)',
    stats: { str: 18, dex: 14, con: 16, int: 13, wis: 12, cha: 16 },
    traits: [
      'Two Phases. Phase 1 (95–48 hp): armored Gerudo king. Phase 2 (47–0): the plate splits and Ganon, a shadow-beast of living twilight, pours out. He gains fly 20 ft. and resistance to nonmagical bludgeoning, piercing, and slashing.',
      'Triforce Weakness. Attacks empowered by a spent Triforce virtue (see campaign rules) deal an extra 1d8 damage and ignore his resistance.',
      'Lair — The Dais. While he stands on the circular dais, he can use a legendary action.',
    ],
    actions: [
      {
        name: 'Multiattack',
        text: 'Ganondorf makes two Twilight Blade attacks, or one Twilight Blade and one Gloom Grasp.',
      },
      {
        name: 'Twilight Blade',
        text: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (1d10 + 6) slashing plus 4 (1d8) necrotic damage.',
      },
      {
        name: 'Gloom Grasp',
        text: 'Ranged Spell Attack: +6 to hit, range 40 ft., one target. Hit: 10 (2d6 + 3) necrotic damage, and the target’s speed is halved until the end of its next turn.',
      },
      {
        name: 'Unmake the Measure (Recharge 5–6, phase 2)',
        text: 'Twilight crashes across the Sacred Realm. Each enemy within 30 feet must make a DC 14 Constitution save, taking 18 (4d8) necrotic damage on a failure or half on a success. A creature that has sung or played a verse of the Song of Time this encounter has advantage.',
      },
    ],
    legendary: [
      {
        name: 'Step Between Events (1 action)',
        text: 'Ganondorf teleports up to 20 feet to a space he can see. If he leaves the dais, he cannot use this again until he returns.',
      },
    ],
  },
]
