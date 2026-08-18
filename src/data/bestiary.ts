import type { StatBlock } from '../types'

export const bestiary: StatBlock[] = [
  {
    id: 'twilight-wisp',
    name: 'Twilight Wisp',
    cr: '1/2',
    type: 'Tiny undead',
    ac: 13,
    hp: 10,
    speed: '0 ft., fly 40 ft. (hover)',
    stats: { str: 1, dex: 16, con: 10, int: 6, wis: 12, cha: 14 },
    traits: [
      'Incorporeal Drift. The wisp can move through creatures and objects as difficult terrain. It takes 3 (1d6) force damage if it ends its turn inside an object.',
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
    id: 'tusker-raider',
    name: 'Tusker Raider',
    cr: '1',
    type: 'Medium humanoid',
    ac: 14,
    hp: 22,
    speed: '30 ft.',
    stats: { str: 15, dex: 12, con: 14, int: 8, wis: 10, cha: 8 },
    traits: [
      'Pack Howl. Advantage on attack rolls against a creature if at least one allied tusker is within 5 feet of the target and not incapacitated.',
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
    id: 'root-snapper',
    name: 'Root Snapper',
    cr: '1',
    type: 'Medium plant',
    ac: 13,
    hp: 26,
    speed: '20 ft., burrow 10 ft.',
    stats: { str: 14, dex: 8, con: 16, int: 3, wis: 10, cha: 4 },
    traits: [
      'False Appearance. While motionless among vines, it is indistinguishable from temple growth.',
    ],
    actions: [
      {
        name: 'Bite',
        text: 'Melee Weapon Attack: +4 to hit, reach 10 ft., one target. Hit: 8 (1d10 + 3) piercing damage, and the target is grappled (escape DC 12). Until the grapple ends, the snapper cannot bite another target.',
      },
    ],
  },
  {
    id: 'captain-of-bone',
    name: 'Captain of Bone',
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
        text: 'The captain makes two rusted-longsword attacks.',
      },
      {
        name: 'Rusted Longsword',
        text: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing plus 3 (1d6) necrotic damage.',
      },
      {
        name: 'Rally the Hollow (1/day)',
        text: 'Two twilight wisps (or skeletal fragments with 6 hp, AC 12, +3/1d6) rise in unoccupied spaces within 20 feet.',
      },
    ],
  },
  {
    id: 'sleeping-construct',
    name: 'The Sleeping Construct',
    cr: '4',
    type: 'Large construct',
    ac: 15,
    hp: 76,
    speed: '30 ft., climb 20 ft.',
    stats: { str: 18, dex: 10, con: 16, int: 6, wis: 12, cha: 6 },
    traits: [
      'Vineheart. If a creature plays a note on the Echo Flute as an action (DC 12 Performance or a spell slot), the construct has disadvantage on its next attack and the vines loosen — its AC drops to 13 until the start of its next turn.',
      'Awakened Wrongly. The first time it is reduced below 30 hp, it slams the floor. Each creature on the ground must succeed on a DC 13 Dexterity save or fall prone.',
    ],
    actions: [
      {
        name: 'Multiattack',
        text: 'The construct makes one slam and one vine lash.',
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
    id: 'lord-vaelith',
    name: 'Lord Vaelith the Usurper',
    cr: '5',
    type: 'Medium humanoid (twilight-touched)',
    ac: 17,
    hp: 95,
    speed: '30 ft., fly 20 ft. (hover, phase 2 only)',
    stats: { str: 18, dex: 14, con: 16, int: 13, wis: 12, cha: 16 },
    traits: [
      'Two Phases. Phase 1 (95–48 hp): armored knight. Phase 2 (47–0): the plate splits and a shadow-beast of living twilight pours out. He gains fly 20 ft. and resistance to nonmagical bludgeoning, piercing, and slashing.',
      'Virtue Weakness. Attacks empowered by a spent Virtue (see campaign rules) deal an extra 1d8 damage and ignore his resistance.',
      'Lair — The Dais. While he stands on the circular dais, he can use a legendary action.',
    ],
    actions: [
      {
        name: 'Multiattack',
        text: 'Vaelith makes two duskblade attacks, or one duskblade and one Gloom Grasp.',
      },
      {
        name: 'Duskblade',
        text: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (1d10 + 6) slashing plus 4 (1d8) necrotic damage.',
      },
      {
        name: 'Gloom Grasp',
        text: 'Ranged Spell Attack: +6 to hit, range 40 ft., one target. Hit: 10 (2d6 + 3) necrotic damage, and the target’s speed is halved until the end of its next turn.',
      },
      {
        name: 'Unmake the Measure (Recharge 5–6, phase 2)',
        text: 'Twilight crashes across the plateau. Each enemy within 30 feet must make a DC 14 Constitution save, taking 18 (4d8) necrotic damage on a failure or half on a success. A creature that has sung or played a verse of the Waking Song this encounter has advantage.',
      },
    ],
    legendary: [
      {
        name: 'Step Between Events (1 action)',
        text: 'Vaelith teleports up to 20 feet to a space he can see. If he leaves the dais, he cannot use this again until he returns.',
      },
    ],
  },
]
