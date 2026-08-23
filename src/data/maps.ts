import { asset } from '../lib/assets'
import type { GeneratedMap } from '../types'

export const campaignMaps: GeneratedMap[] = [
  {
    id: 'map-hyrule',
    prompt: 'Regional map of the kingdom of Hyrule',
    enhancedPrompt: 'Hand-painted parchment regional map of Hyrule',
    imageUrl: asset('art/map-hyrule-region.jpg'),
    artSrc: asset('art/map-hyrule-region.jpg'),
    biome: 'region',
    createdAt: 0,
    campaign: true,
    title: 'Hyrule',
  },
  {
    id: 'map-kakariko',
    prompt: 'Kakariko Village at dusk with a fairy well and windmill',
    enhancedPrompt: 'Kakariko Village harvest dusk',
    imageUrl: asset('art/map-kakariko.jpg'),
    artSrc: asset('art/map-kakariko.jpg'),
    biome: 'village',
    createdAt: 0,
    campaign: true,
    title: 'Kakariko Village',
  },
  {
    id: 'map-lost-woods',
    prompt: 'Lost Woods with three Triforce shrine trails',
    enhancedPrompt: 'Mystical Lost Woods adventure map',
    imageUrl: asset('art/map-lost-woods.jpg'),
    artSrc: asset('art/map-lost-woods.jpg'),
    biome: 'forest',
    createdAt: 0,
    campaign: true,
    title: 'Lost Woods',
  },
  {
    id: 'map-forest-temple',
    prompt: 'Dungeon map of the Forest Temple',
    enhancedPrompt: 'Classic Forest Temple dungeon cartography',
    imageUrl: asset('art/map-forest-temple.jpg'),
    artSrc: asset('art/map-forest-temple.jpg'),
    biome: 'dungeon',
    createdAt: 0,
    campaign: true,
    title: 'Forest Temple',
  },
  {
    id: 'map-sacred-realm',
    prompt: 'Sacred Realm plateau and Ganondorf’s twilight dais',
    enhancedPrompt: 'High mesa climax landscape of the Sacred Realm',
    imageUrl: asset('art/map-sacred-realm.jpg'),
    artSrc: asset('art/map-sacred-realm.jpg'),
    biome: 'mountain',
    createdAt: 0,
    campaign: true,
    title: 'The Sacred Realm',
  },
]

export interface BattleMap {
  id: string
  title: string
  src: string
  locationId: string
  prompt: string
}

export const battleMaps: BattleMap[] = [
  {
    id: 'battle-kakariko',
    title: 'Kakariko square',
    locationId: 'map-kakariko',
    src: asset('art/battle-kakariko.jpg'),
    prompt: 'Top-down Kakariko festival square, well, windmill, feast tables',
  },
  {
    id: 'battle-lost-woods',
    title: 'Lost Woods shrines',
    locationId: 'map-lost-woods',
    src: asset('art/battle-lost-woods.jpg'),
    prompt: 'Top-down Lost Woods clearing with three shrine trails',
  },
  {
    id: 'battle-woods-path',
    title: 'Gold trail ambush',
    locationId: 'map-lost-woods',
    src: asset('art/battle-woods-path.jpg'),
    prompt: 'Top-down Lost Woods path, stream, and cover trees',
  },
  {
    id: 'battle-temple-door',
    title: 'Vine door courtyard',
    locationId: 'map-forest-temple',
    src: asset('art/battle-temple-door.jpg'),
    prompt: 'Top-down Forest Temple stairs and vine door',
  },
  {
    id: 'battle-temple-hall',
    title: 'Hall of Kindled Breath',
    locationId: 'map-forest-temple',
    src: asset('art/battle-temple-hall.jpg'),
    prompt: 'Top-down temple hall with four braziers',
  },
  {
    id: 'battle-gloom-span',
    title: 'Gloom Span',
    locationId: 'map-forest-temple',
    src: asset('art/battle-gloom-span.jpg'),
    prompt: 'Top-down gloom pit with floating platforms',
  },
  {
    id: 'battle-statues',
    title: 'Statues of the Sages',
    locationId: 'map-forest-temple',
    src: asset('art/battle-statues.jpg'),
    prompt: 'Top-down circular sage statue chamber',
  },
  {
    id: 'battle-barracks',
    title: 'Hero’s barracks',
    locationId: 'map-forest-temple',
    src: asset('art/battle-barracks.jpg'),
    prompt: 'Top-down Forest Temple barracks',
  },
  {
    id: 'battle-armogohma',
    title: 'Inner sanctum',
    locationId: 'map-forest-temple',
    src: asset('art/battle-armogohma.jpg'),
    prompt: 'Top-down circular Armogohma garden',
  },
  {
    id: 'battle-sacred-realm',
    title: 'Sacred Realm dais',
    locationId: 'map-sacred-realm',
    src: asset('art/battle-sacred-realm.jpg'),
    prompt: 'Top-down Sacred Realm Triforce dais',
  },
  {
    id: 'battle-hyrule-field',
    title: 'Road to Kakariko',
    locationId: 'map-hyrule',
    src: asset('art/battle-hyrule-field.jpg'),
    prompt: 'Top-down Hyrule Field road at dawn',
  },
]

const SCENE_BATTLE: Record<string, string> = {
  's1-festival': 'battle-kakariko',
  's1-impa': 'battle-kakariko',
  's1-poes': 'battle-kakariko',
  's2-trails': 'battle-lost-woods',
  's2-koroks': 'battle-lost-woods',
  's2-shrine': 'battle-lost-woods',
  's2-bokoblins': 'battle-woods-path',
  's3-door': 'battle-temple-door',
  's3-torches': 'battle-temple-hall',
  's3-gloom': 'battle-gloom-span',
  's3-statues': 'battle-statues',
  's3-shade': 'battle-barracks',
  's3-gohma': 'battle-armogohma',
  's4-tide': 'battle-sacred-realm',
  's4-trials': 'battle-sacred-realm',
  's4-ganondorf': 'battle-sacred-realm',
  's5-dawn': 'battle-hyrule-field',
}

export function battleMapForScene(sceneId: string): BattleMap | undefined {
  const id = SCENE_BATTLE[sceneId]
  return battleMaps.find((b) => b.id === id)
}

export function battleMapsForLocation(locationId: string): BattleMap[] {
  return battleMaps.filter((b) => b.locationId === locationId)
}

export function isSceneBattleBoard(mapId: string, sceneId?: string): boolean {
  if (!sceneId) return false
  return SCENE_BATTLE[sceneId] === mapId
}
