import { MineralId } from '../game/entities/MineralTypes'

export interface SkillCost { resource: MineralId; amount: number }

export interface SkillNodeDef {
  id: string; name: string; description: string; icon: string
  maxLevel: number; costs: SkillCost[]; requires: string[]
  position: { col: number; row: number }
  branch: 'damage' | 'speed' | 'luck' | 'utility' | 'specialization' | 'legendary'
  upgradesStat: string; upgradeValue: number
}

const BRANCH_COLORS: Record<string, string> = {
  damage: 'from-red-700/80 to-red-900/80 border-red-600/50',
  speed: 'from-cyan-700/80 to-cyan-900/80 border-cyan-600/50',
  luck: 'from-emerald-700/80 to-emerald-900/80 border-emerald-600/50',
  utility: 'from-purple-700/80 to-purple-900/80 border-purple-600/50',
  specialization: 'from-orange-700/80 to-orange-900/80 border-orange-600/50',
  legendary: 'from-yellow-600/80 to-yellow-800/80 border-yellow-500/50',
}

export function getBranchColor(branch: string): string {
  return BRANCH_COLORS[branch] ?? 'from-gray-700/80 to-gray-900/80 border-gray-600/50'
}

export const SKILL_TREE: SkillNodeDef[] = [
  // ═══ ROOT ═══
  { id: 'sharp_pick', name: 'Pico Afilado', description: '+1 daño base', icon: '⛏️', maxLevel: 1, costs: [{ resource: 'clay', amount: 5 }], requires: [], position: { col: 2, row: 0 }, branch: 'damage', upgradesStat: 'pickaxe_power', upgradeValue: 1 },

  // ═══ DAMAGE ═══
  { id: 'strong_swing', name: 'Golpe Fuerte', description: '+1 daño base', icon: '⚔️', maxLevel: 1, costs: [{ resource: 'clay', amount: 20 }, { resource: 'copper', amount: 5 }], requires: ['sharp_pick'], position: { col: 0, row: 1 }, branch: 'damage', upgradesStat: 'pickaxe_power', upgradeValue: 1 },
  { id: 'giant_strike', name: 'Golpe Gigante', description: '+2 daño base', icon: '💥', maxLevel: 1, costs: [{ resource: 'copper', amount: 20 }, { resource: 'iron', amount: 5 }], requires: ['strong_swing'], position: { col: 0, row: 2 }, branch: 'damage', upgradesStat: 'pickaxe_power', upgradeValue: 2 },
  { id: 'crit_chance', name: 'Golpe Crítico', description: '+5% crit por nivel', icon: '🎯', maxLevel: 3, costs: [{ resource: 'copper', amount: 10 }, { resource: 'iron', amount: 3 }], requires: ['strong_swing'], position: { col: 0, row: 3 }, branch: 'damage', upgradesStat: 'crit_chance', upgradeValue: 5 },

  // ═══ SPEED ═══
  { id: 'quick_hands', name: 'Manos Rápidas', description: '+1 speed', icon: '⚡', maxLevel: 1, costs: [{ resource: 'shale', amount: 15 }, { resource: 'copper', amount: 3 }], requires: ['sharp_pick'], position: { col: 1, row: 1 }, branch: 'speed', upgradesStat: 'speed', upgradeValue: 1 },
  { id: 'swift_miner', name: 'Minero Veloz', description: '+2 speed', icon: '🌪️', maxLevel: 1, costs: [{ resource: 'copper', amount: 15 }, { resource: 'iron', amount: 5 }], requires: ['quick_hands'], position: { col: 1, row: 2 }, branch: 'speed', upgradesStat: 'speed', upgradeValue: 2 },
  { id: 'blitz', name: 'Ráfaga', description: '+3 speed', icon: '💨', maxLevel: 1, costs: [{ resource: 'iron', amount: 15 }, { resource: 'silver', amount: 3 }], requires: ['swift_miner'], position: { col: 1, row: 3 }, branch: 'speed', upgradesStat: 'speed', upgradeValue: 3 },

  // ═══ LUCK ═══
  { id: 'lucky_find', name: 'Hallazgo Suerte', description: '+1 luck', icon: '🍀', maxLevel: 1, costs: [{ resource: 'shale', amount: 15 }, { resource: 'copper', amount: 3 }], requires: ['sharp_pick'], position: { col: 3, row: 1 }, branch: 'luck', upgradesStat: 'luck', upgradeValue: 1 },
  { id: 'rare_hunter', name: 'Cazador de Rarezas', description: '+2 luck', icon: '💎', maxLevel: 1, costs: [{ resource: 'copper', amount: 15 }, { resource: 'iron', amount: 5 }], requires: ['lucky_find'], position: { col: 3, row: 2 }, branch: 'luck', upgradesStat: 'luck', upgradeValue: 2 },
  { id: 'treasure_magnet', name: 'Imán de Tesoros', description: '+3 luck', icon: '🧲', maxLevel: 1, costs: [{ resource: 'iron', amount: 15 }, { resource: 'silver', amount: 5 }], requires: ['rare_hunter'], position: { col: 3, row: 3 }, branch: 'luck', upgradesStat: 'luck', upgradeValue: 3 },

  // ═══ UTILITY ═══
  { id: 'efficiency', name: 'Eficiencia Minera', description: '+1 recurso extra por mineral', icon: '🔧', maxLevel: 1, costs: [{ resource: 'clay', amount: 25 }, { resource: 'copper', amount: 10 }], requires: ['sharp_pick'], position: { col: 4, row: 1 }, branch: 'utility', upgradesStat: 'efficiency', upgradeValue: 1 },
  { id: 'magnet', name: 'Imán Mineral', description: '+10px rango por nivel', icon: '🧲', maxLevel: 2, costs: [{ resource: 'copper', amount: 20 }, { resource: 'iron', amount: 8 }], requires: ['efficiency'], position: { col: 4, row: 2 }, branch: 'utility', upgradesStat: 'mining_range', upgradeValue: 10 },
  { id: 'fortune', name: 'Fortuna', description: '+20% duplicar recurso por nivel', icon: '💰', maxLevel: 1, costs: [{ resource: 'iron', amount: 20 }, { resource: 'silver', amount: 10 }], requires: ['efficiency'], position: { col: 4, row: 3 }, branch: 'utility', upgradesStat: 'fortune', upgradeValue: 1 },
  { id: 'explosion_master', name: 'Maestro Explosivo', description: 'Explosiones sulfur ×2 radio', icon: '💣', maxLevel: 1, costs: [{ resource: 'sulfur', amount: 15 }, { resource: 'cinnabar', amount: 5 }], requires: ['fortune'], position: { col: 4, row: 4 }, branch: 'utility', upgradesStat: 'explosion_radius', upgradeValue: 1 },

  // ═══ SPECIALIZATION ═══
  { id: 'coal_affinity', name: 'Afinidad de Carbón', description: '+50% spawn coal_crystal', icon: '🔥', maxLevel: 1, costs: [{ resource: 'coal_crystal', amount: 10 }], requires: ['efficiency'], position: { col: 5, row: 2 }, branch: 'specialization', upgradesStat: 'coal_affinity', upgradeValue: 1 },
  { id: 'obsidian_heart', name: 'Corazón de Obsidiana', description: '+1 daño vs minerales resistentes', icon: '🪨', maxLevel: 1, costs: [{ resource: 'obsidian', amount: 10 }], requires: ['coal_affinity'], position: { col: 5, row: 3 }, branch: 'specialization', upgradesStat: 'obsidian_pierce', upgradeValue: 1 },
  { id: 'jade_chain', name: 'Cadena de Jade', description: 'Chain jade sube a 50%', icon: '⛓️', maxLevel: 1, costs: [{ resource: 'jade', amount: 10 }], requires: ['obsidian_heart'], position: { col: 5, row: 4 }, branch: 'specialization', upgradesStat: 'jade_chain_bonus', upgradeValue: 20 },
  { id: 'void_touched', name: 'Tocado por el Vacío', description: '+1 mineral void siempre', icon: '🌌', maxLevel: 1, costs: [{ resource: 'void', amount: 3 }], requires: ['jade_chain'], position: { col: 6, row: 3 }, branch: 'specialization', upgradesStat: 'void_spawn', upgradeValue: 1 },
  { id: 'sun_chosen', name: 'Elegido Solar', description: 'Sunstone dura 12s', icon: '☀️', maxLevel: 1, costs: [{ resource: 'sunstone', amount: 2 }], requires: ['void_touched'], position: { col: 6, row: 4 }, branch: 'specialization', upgradesStat: 'sun_duration', upgradeValue: 4 },

  // ═══ LEGENDARY (requiere prestige) ═══
  { id: 'eternal_pick', name: 'Pico Eterno', description: '+5 daño permanente (prestige)', icon: '✨', maxLevel: 1, costs: [{ resource: 'void', amount: 1 }], requires: ['sharp_pick'], position: { col: 2, row: 5 }, branch: 'legendary', upgradesStat: 'pickaxe_power', upgradeValue: 5 },
  { id: 'time_warper', name: 'Distorsión Temporal', description: '+3s a todas las runs', icon: '⏳', maxLevel: 1, costs: [{ resource: 'moonstone', amount: 1 }], requires: ['sharp_pick'], position: { col: 3, row: 5 }, branch: 'legendary', upgradesStat: 'time_bonus', upgradeValue: 3 },
  { id: 'rare_magnet', name: 'Imán de Rarezas', description: '+30% spawn minerales raros', icon: '🧿', maxLevel: 1, costs: [{ resource: 'amethyst', amount: 1 }], requires: ['sharp_pick'], position: { col: 1, row: 5 }, branch: 'legendary', upgradesStat: 'rare_magnet', upgradeValue: 30 },
  { id: 'cosmic_miner', name: 'Minero Cósmico', description: 'Efectos de minerales ×1.5 potencia', icon: '🌟', maxLevel: 1, costs: [{ resource: 'emerald', amount: 1 }], requires: ['sharp_pick'], position: { col: 2, row: 6 }, branch: 'legendary', upgradesStat: 'cosmic_power', upgradeValue: 1 },
]

export function getSkillById(id: string): SkillNodeDef | undefined {
  return SKILL_TREE.find((s) => s.id === id)
}

const SPRITE_MAP: Record<string, string> = {
  clay: '/assets/ores/clay1.png', shale: '/assets/ores/shale1.png', sulfur: '/assets/ores/sulfur1.png',
  copper: '/assets/ores/copper1.png', iron: '/assets/ores/iron1.png', silver: '/assets/ores/silver1.png',
  coal_crystal: '/assets/ores/coal_crystal1.png', cinnabar: '/assets/ores/cinnabar1.png',
  obsidian: '/assets/ores/obsidian1.png', jade: '/assets/ores/jade1.png', malachite: '/assets/ores/malachite1.png',
  lapis_lazuli: '/assets/ores/lapis_lazuli1.png', turquoise: '/assets/ores/turquoise1.png',
  rose_quartz: '/assets/ores/rose_quartz1.png', citrine: '/assets/ores/citrine1.png',
  fluorite: '/assets/ores/fluorite1.png', rhodonite: '/assets/ores/rhodonite1.png',
  amber: '/assets/ores/amber1.png', blue_topaz: '/assets/ores/blue_topaz1.png',
  emerald: '/assets/ores/emerald1.png', sapphire: '/assets/ores/sapphire1.png',
  amethyst: '/assets/ores/amethyst1.png', aquamarine: '/assets/ores/aquamarine1.png',
  sunstone: '/assets/ores/sunstone1.png', void: '/assets/ores/void1.png', moonstone: '/assets/ores/moonstone1.png',
}

export function getMineralSprite(resource: string): string {
  return SPRITE_MAP[resource] ?? '/assets/ores/clay1.png'
}
