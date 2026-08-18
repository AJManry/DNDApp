import type { LoreEntry } from '../types'
import { bestiary } from './bestiary'
import { scenes } from './campaign'
import { lore } from './lore'
import { campaignMaps } from './maps'

function sceneToLore(scene: (typeof scenes)[number]): LoreEntry {
  return {
    id: `scene-${scene.id}`,
    title: scene.title,
    kind: 'scene',
    tags: [
      'scene',
      `act-${scene.act}`,
      ...(scene.optional ? ['optional'] : []),
      ...(scene.encounterIds ?? []),
    ],
    summary: `${scene.minuteStart}–${scene.minuteEnd} min. ${scene.boxedText.slice(0, 140)}…`,
    body: `${scene.boxedText}\n\nDM: ${scene.dmNotes}${scene.treasure ? `\n\nTreasure: ${scene.treasure}` : ''}`,
    secrets: scene.dmNotes,
    relatedIds: scene.encounterIds,
    image: campaignMaps.find((m) => m.id === scene.mapId)?.artSrc,
  }
}

function monsterToLore(m: (typeof bestiary)[number]): LoreEntry {
  return {
    id: `monster-${m.id}`,
    title: m.name,
    kind: 'creature',
    tags: ['statblock', 'combat', m.type, `cr-${m.cr}`],
    summary: `${m.type}, CR ${m.cr}. AC ${m.ac}, HP ${m.hp}, Speed ${m.speed}.`,
    body: `STR ${m.stats.str} DEX ${m.stats.dex} CON ${m.stats.con} INT ${m.stats.int} WIS ${m.stats.wis} CHA ${m.stats.cha}.\n\nTraits:\n${m.traits.join('\n')}\n\nActions:\n${m.actions.map((a) => `${a.name}. ${a.text}`).join('\n')}${
      m.legendary?.length
        ? `\n\nLegendary:\n${m.legendary.map((a) => `${a.name}. ${a.text}`).join('\n')}`
        : ''
    }`,
  }
}

export function allLore(custom: LoreEntry[] = []): LoreEntry[] {
  return [...lore, ...scenes.map(sceneToLore), ...bestiary.map(monsterToLore), ...custom]
}
