import { MineralId } from '../game/entities/MineralTypes'

export interface SkillCost { resource: MineralId; amount: number }

export interface SkillNodeDef {
  id: string; name: string; description: string; icon: string
  maxLevel: number; costs: SkillCost[]; requires: string[]
  position: { col: number; row: number }
  branch: 'basic' | 'gems' | 'crystals' | 'rares' | 'prestige' | 'legendary' | 'damage' | 'speed' | 'luck' | 'utility' | 'specialization'
  upgradesStat: string; upgradeValue: number
  unlocksMineral?: MineralId
  excludes?: string[]
  isTransformative?: boolean
}

const BRANCH_COLORS: Record<string, string> = {
  basic: 'from-stone-600/80 to-stone-800/80 border-stone-500/50',
  gems: 'from-pink-700/80 to-pink-900/80 border-pink-600/50',
  crystals: 'from-sky-700/80 to-sky-900/80 border-sky-600/50',
  rares: 'from-fuchsia-700/80 to-fuchsia-900/80 border-fuchsia-600/50',
  prestige: 'from-violet-700/80 to-violet-900/80 border-violet-600/50',
  legendary: 'from-yellow-600/80 to-yellow-800/80 border-yellow-500/50',
  damage: 'from-red-700/80 to-red-900/80 border-red-600/50',
  speed: 'from-cyan-700/80 to-cyan-900/80 border-cyan-600/50',
  luck: 'from-emerald-700/80 to-emerald-900/80 border-emerald-600/50',
  utility: 'from-purple-700/80 to-purple-900/80 border-purple-600/50',
  specialization: 'from-orange-700/80 to-orange-900/80 border-orange-600/50',
}

export function getBranchColor(branch: string): string {
  return BRANCH_COLORS[branch] ?? 'from-gray-700/80 to-gray-900/80 border-gray-600/50'
}

export const SKILL_TREE: SkillNodeDef[] = [
  // ═══ ROOT ═══
  { id: 'sharp_pick', name: 'Pico Afilado', description: '+1 daño. Todo comienza aquí', icon: '⛏️', maxLevel: 1, costs: [{ resource: 'clay', amount: 3 }], requires: [], position: { col: 3, row: 0 }, branch: 'basic', upgradesStat: 'pickaxe_power', upgradeValue: 1 },

  // ═══ BASIC (col 0) ═══
  { id: 'copper_tools', name: 'Herramientas de Cobre', description: 'Desbloquea el Cobre', icon: '🥉', maxLevel: 1, costs: [{ resource: 'clay', amount: 15 }, { resource: 'shale', amount: 10 }], requires: ['sharp_pick'], position: { col: 0, row: 1 }, branch: 'basic', upgradesStat: 'pickaxe_power', upgradeValue: 1, unlocksMineral: 'copper' },
  { id: 'deep_excavation', name: 'Excavación Profunda', description: 'Desbloquea el Hierro', icon: '⛏️', maxLevel: 1, costs: [{ resource: 'clay', amount: 25 }, { resource: 'copper', amount: 5 }], requires: ['copper_tools'], position: { col: 0, row: 2 }, branch: 'basic', upgradesStat: 'pickaxe_power', upgradeValue: 1, unlocksMineral: 'iron' },
  { id: 'coal_crystals_node', name: 'Cristales de Carbón', description: 'Desbloquea Cristal de Carbón', icon: '💎', maxLevel: 1, costs: [{ resource: 'copper', amount: 10 }, { resource: 'iron', amount: 3 }], requires: ['deep_excavation'], position: { col: 0, row: 3 }, branch: 'basic', upgradesStat: 'speed', upgradeValue: 1, unlocksMineral: 'coal_crystal' },
  { id: 'toxic_mining', name: 'Minería Tóxica', description: 'Desbloquea Azufre y Cinabrio', icon: '☠️', maxLevel: 1, costs: [{ resource: 'iron', amount: 8 }, { resource: 'copper', amount: 10 }], requires: ['deep_excavation'], position: { col: 0, row: 4 }, branch: 'basic', upgradesStat: 'luck', upgradeValue: 1, unlocksMineral: 'sulfur' },

  // ═══ GEMS (col 1) ═══
  { id: 'mineral_polish', name: 'Pulido Mineral', description: 'Desbloquea la Plata', icon: '✨', maxLevel: 1, costs: [{ resource: 'copper', amount: 12 }, { resource: 'iron', amount: 5 }], requires: ['sharp_pick'], position: { col: 1, row: 1 }, branch: 'gems', upgradesStat: 'fortune', upgradeValue: 1, unlocksMineral: 'silver' },
  { id: 'ancient_rocks', name: 'Rocas Antiguas', description: 'Desbloquea Obsidiana', icon: '🪨', maxLevel: 1, costs: [{ resource: 'silver', amount: 8 }, { resource: 'iron', amount: 8 }], requires: ['mineral_polish'], position: { col: 1, row: 2 }, branch: 'gems', upgradesStat: 'pickaxe_power', upgradeValue: 2, unlocksMineral: 'obsidian' },
  { id: 'natural_energy', name: 'Energía Natural', description: 'Desbloquea Jade', icon: '🌿', maxLevel: 1, costs: [{ resource: 'silver', amount: 10 }, { resource: 'obsidian', amount: 5 }], requires: ['ancient_rocks'], position: { col: 1, row: 3 }, branch: 'gems', upgradesStat: 'luck', upgradeValue: 1, unlocksMineral: 'jade' },
  { id: 'green_veins', name: 'Vetas Verdes', description: 'Desbloquea Malaquita', icon: '🟢', maxLevel: 1, costs: [{ resource: 'jade', amount: 5 }, { resource: 'silver', amount: 8 }], requires: ['natural_energy'], position: { col: 1, row: 4 }, branch: 'gems', upgradesStat: 'fortune', upgradeValue: 1, unlocksMineral: 'malachite' },

  // ═══ CRYSTALS (col 2) ═══
  { id: 'blue_resonance', name: 'Resonancia Azul', description: 'Desbloquea Lapislázuli', icon: '🔵', maxLevel: 1, costs: [{ resource: 'silver', amount: 10 }, { resource: 'iron', amount: 10 }], requires: ['sharp_pick'], position: { col: 2, row: 1 }, branch: 'crystals', upgradesStat: 'luck', upgradeValue: 2, unlocksMineral: 'lapis_lazuli' },
  { id: 'turquoise_core', name: 'Núcleo Turquesa', description: 'Desbloquea Turquesa', icon: '🟦', maxLevel: 1, costs: [{ resource: 'lapis_lazuli', amount: 5 }, { resource: 'silver', amount: 10 }], requires: ['blue_resonance'], position: { col: 2, row: 2 }, branch: 'crystals', upgradesStat: 'mining_range', upgradeValue: 10, unlocksMineral: 'turquoise' },
  { id: 'vital_crystals', name: 'Cristales Vitales', description: 'Desbloquea Cuarzo Rosa', icon: '🩷', maxLevel: 1, costs: [{ resource: 'turquoise', amount: 5 }, { resource: 'lapis_lazuli', amount: 5 }], requires: ['turquoise_core'], position: { col: 2, row: 3 }, branch: 'crystals', upgradesStat: 'efficiency', upgradeValue: 1, unlocksMineral: 'rose_quartz' },
  { id: 'golden_prosperity', name: 'Prosperidad Dorada', description: 'Desbloquea Citrino', icon: '🟡', maxLevel: 1, costs: [{ resource: 'lapis_lazuli', amount: 5 }, { resource: 'rose_quartz', amount: 5 }], requires: ['vital_crystals'], position: { col: 2, row: 4 }, branch: 'crystals', upgradesStat: 'fortune', upgradeValue: 2, unlocksMineral: 'citrine' },

  // ═══ DAMAGE (col 3 rows 1-3) + CRIT (col 3 rows 4-5) + COSMIC (col 3 row 6) ═══
  { id: 'strong_swing', name: 'Golpe Fuerte', description: '+2 daño base', icon: '⚔️', maxLevel: 1, costs: [{ resource: 'iron', amount: 10 }, { resource: 'copper', amount: 15 }], requires: ['copper_tools'], position: { col: 3, row: 1 }, branch: 'damage', upgradesStat: 'pickaxe_power', upgradeValue: 2 },
  { id: 'giant_strike', name: 'Golpe Gigante', description: '+5 daño base', icon: '💥', maxLevel: 1, costs: [{ resource: 'obsidian', amount: 8 }, { resource: 'iron', amount: 20 }], requires: ['strong_swing'], position: { col: 3, row: 2 }, branch: 'damage', upgradesStat: 'pickaxe_power', upgradeValue: 5 },
  { id: 'titan_strike', name: 'Golpe del Titán', description: '+12 daño base', icon: '🗿', maxLevel: 1, costs: [{ resource: 'jade', amount: 8 }, { resource: 'obsidian', amount: 12 }], requires: ['giant_strike'], position: { col: 3, row: 3 }, branch: 'damage', upgradesStat: 'pickaxe_power', upgradeValue: 12 },
  { id: 'crit_chance_base', name: 'Ojo Crítico', description: '+10% prob. crítico', icon: '🎯', maxLevel: 1, costs: [{ resource: 'silver', amount: 10 }, { resource: 'iron', amount: 15 }], requires: ['strong_swing'], position: { col: 3, row: 4 }, branch: 'damage', upgradesStat: 'crit_chance', upgradeValue: 10, excludes: ['quick_hands'] },
  { id: 'crit_damage_up', name: 'Potencia Crítica', description: '+0.5 daño crítico por nivel', icon: '💢', maxLevel: 5, costs: [{ resource: 'blue_topaz', amount: 2 }, { resource: 'iron', amount: 10 }], requires: ['crit_chance_base'], position: { col: 3, row: 5 }, branch: 'damage', upgradesStat: 'crit_damage', upgradeValue: 1 },
  { id: 'cosmic_miner', name: 'Minero Cósmico', description: 'Todos los efectos ×2', icon: '🌟', maxLevel: 1, costs: [{ resource: 'sunstone', amount: 8 }, { resource: 'void', amount: 3 }], requires: ['eternal_pick'], position: { col: 3, row: 6 }, branch: 'legendary', upgradesStat: 'cosmic_power', upgradeValue: 1, isTransformative: true },

  // ═══ SPEED (col 4 rows 1-3) + VOID TOUCHED (col 4 row 4) + VOID EMPOWER (col 4 row 5) ═══
  { id: 'quick_hands', name: 'Manos Rápidas', description: '+2 speed', icon: '⚡', maxLevel: 1, costs: [{ resource: 'copper', amount: 10 }, { resource: 'shale', amount: 20 }], requires: ['copper_tools'], position: { col: 4, row: 1 }, branch: 'speed', upgradesStat: 'speed', upgradeValue: 2, excludes: ['crit_chance_base'] },
  { id: 'swift_miner', name: 'Minero Veloz', description: '+4 speed', icon: '🌪️', maxLevel: 1, costs: [{ resource: 'silver', amount: 8 }, { resource: 'copper', amount: 25 }], requires: ['quick_hands'], position: { col: 4, row: 2 }, branch: 'speed', upgradesStat: 'speed', upgradeValue: 4 },
  { id: 'blitz', name: 'Ráfaga', description: '+7 speed', icon: '💨', maxLevel: 1, costs: [{ resource: 'jade', amount: 8 }, { resource: 'silver', amount: 12 }], requires: ['swift_miner'], position: { col: 4, row: 3 }, branch: 'speed', upgradesStat: 'speed', upgradeValue: 7 },
  { id: 'void_touched', name: 'Tocado por el Vacío', description: '+50% daño -30% velocidad', icon: '🌌', maxLevel: 1, costs: [{ resource: 'void', amount: 5 }], requires: ['titan_strike', 'blitz', 'treasure_magnet', 'magnet_node'], position: { col: 4, row: 4 }, branch: 'specialization', upgradesStat: 'void_pact', upgradeValue: 1, isTransformative: true, excludes: ['sun_chosen'] },
  { id: 'void_empower', name: 'Empoderamiento Vacío', description: '+100% daño', icon: '🕳️', maxLevel: 1, costs: [{ resource: 'void', amount: 10 }], requires: ['void_touched'], position: { col: 4, row: 5 }, branch: 'specialization', upgradesStat: 'pickaxe_power', upgradeValue: 10 },

  // ═══ RARES (col 5 rows 1-4) + SUN CHOSEN (col 5 row 5) + SUN EMPOWER (col 5 row 6) ═══
  { id: 'resonant_caverns', name: 'Cavernas Resonantes', description: 'Desbloquea Fluorita', icon: '🟣', maxLevel: 1, costs: [{ resource: 'obsidian', amount: 8 }, { resource: 'jade', amount: 5 }], requires: ['sharp_pick'], position: { col: 5, row: 1 }, branch: 'rares', upgradesStat: 'luck', upgradeValue: 1, unlocksMineral: 'fluorite' },
  { id: 'berserker_core', name: 'Núcleo Berserker', description: 'Desbloquea Rodonita', icon: '❤️‍🔥', maxLevel: 1, costs: [{ resource: 'fluorite', amount: 5 }, { resource: 'obsidian', amount: 8 }], requires: ['resonant_caverns'], position: { col: 5, row: 2 }, branch: 'rares', upgradesStat: 'crit_chance', upgradeValue: 5, unlocksMineral: 'rhodonite' },
  { id: 'ancient_fossils', name: 'Fósiles Antiguos', description: 'Desbloquea Ámbar', icon: '🦴', maxLevel: 1, costs: [{ resource: 'rhodonite', amount: 3 }, { resource: 'fluorite', amount: 5 }], requires: ['berserker_core'], position: { col: 5, row: 3 }, branch: 'rares', upgradesStat: 'efficiency', upgradeValue: 1, unlocksMineral: 'amber' },
  { id: 'miner_eye', name: 'Ojo del Minero', description: 'Desbloquea Topacio Azul', icon: '👁️', maxLevel: 1, costs: [{ resource: 'amber', amount: 3 }, { resource: 'rhodonite', amount: 3 }], requires: ['ancient_fossils'], position: { col: 5, row: 4 }, branch: 'rares', upgradesStat: 'crit_damage', upgradeValue: 2, unlocksMineral: 'blue_topaz' },
  { id: 'sun_chosen', name: 'Elegido Solar', description: '+50% velocidad -20% daño', icon: '☀️', maxLevel: 1, costs: [{ resource: 'sunstone', amount: 3 }], requires: ['titan_strike', 'blitz', 'treasure_magnet', 'magnet_node'], position: { col: 5, row: 5 }, branch: 'specialization', upgradesStat: 'sun_pact', upgradeValue: 1, isTransformative: true, excludes: ['void_touched'] },
  { id: 'sun_empower', name: 'Empoderamiento Solar', description: '+100% velocidad', icon: '✨', maxLevel: 1, costs: [{ resource: 'sunstone', amount: 6 }], requires: ['sun_chosen'], position: { col: 5, row: 6 }, branch: 'specialization', upgradesStat: 'speed', upgradeValue: 10 },

  // ═══ LUCK (col 6 rows 1-3) + UTILITY (col 6 rows 4-5) + ETERNAL (col 6 row 6) ═══
  { id: 'lucky_find', name: 'Hallazgo Suerte', description: '+2 luck', icon: '🍀', maxLevel: 1, costs: [{ resource: 'lapis_lazuli', amount: 5 }, { resource: 'copper', amount: 15 }], requires: ['blue_resonance'], position: { col: 6, row: 1 }, branch: 'luck', upgradesStat: 'luck', upgradeValue: 2 },
  { id: 'rare_hunter', name: 'Cazador de Rarezas', description: '+4 luck', icon: '💎', maxLevel: 1, costs: [{ resource: 'turquoise', amount: 5 }, { resource: 'lapis_lazuli', amount: 8 }], requires: ['lucky_find'], position: { col: 6, row: 2 }, branch: 'luck', upgradesStat: 'luck', upgradeValue: 4 },
  { id: 'treasure_magnet', name: 'Imán de Tesoros', description: '+7 luck', icon: '🧲', maxLevel: 1, costs: [{ resource: 'emerald', amount: 3 }, { resource: 'turquoise', amount: 5 }], requires: ['rare_hunter'], position: { col: 6, row: 3 }, branch: 'luck', upgradesStat: 'luck', upgradeValue: 7 },
  { id: 'efficiency_node', name: 'Eficiencia Minera', description: '×1.35 recursos', icon: '🔧', maxLevel: 1, costs: [{ resource: 'rose_quartz', amount: 5 }, { resource: 'turquoise', amount: 5 }], requires: ['vital_crystals'], position: { col: 6, row: 4 }, branch: 'utility', upgradesStat: 'efficiency', upgradeValue: 1 },
  { id: 'magnet_node', name: 'Imán Mineral', description: '+15px rango x2 niveles', icon: '🧲', maxLevel: 2, costs: [{ resource: 'citrine', amount: 3 }, { resource: 'rose_quartz', amount: 5 }], requires: ['efficiency_node'], position: { col: 6, row: 5 }, branch: 'utility', upgradesStat: 'mining_range', upgradeValue: 15 },
  { id: 'eternal_pick', name: 'Pico Eterno', description: '+15 daño permanente', icon: '✨', maxLevel: 1, costs: [{ resource: 'void', amount: 3 }], requires: ['void_portal'], position: { col: 6, row: 6 }, branch: 'legendary', upgradesStat: 'pickaxe_power', upgradeValue: 15 },

  // ═══ PRESTIGE (col 7 rows 1-4) + LEGENDARY (col 7 rows 5-7) ═══
  { id: 'emerald_garden', name: 'Jardín Esmeralda', description: 'Desbloquea Esmeralda', icon: '💚', maxLevel: 1, costs: [{ resource: 'blue_topaz', amount: 5 }, { resource: 'amber', amount: 5 }], requires: ['sharp_pick'], position: { col: 7, row: 1 }, branch: 'prestige', upgradesStat: 'fortune', upgradeValue: 1, unlocksMineral: 'emerald' },
  { id: 'oceanic_crown', name: 'Corona Oceánica', description: 'Desbloquea Aguamarina', icon: '🌊', maxLevel: 1, costs: [{ resource: 'emerald', amount: 5 }, { resource: 'rose_quartz', amount: 5 }], requires: ['emerald_garden'], position: { col: 7, row: 2 }, branch: 'prestige', upgradesStat: 'mining_range', upgradeValue: 15, unlocksMineral: 'aquamarine' },
  { id: 'crystalized_time', name: 'Tiempo Cristalizado', description: 'Desbloquea Zafiro', icon: '⏳', maxLevel: 1, costs: [{ resource: 'aquamarine', amount: 3 }, { resource: 'emerald', amount: 3 }], requires: ['oceanic_crown'], position: { col: 7, row: 3 }, branch: 'prestige', upgradesStat: 'time_bonus', upgradeValue: 2, unlocksMineral: 'sapphire' },
  { id: 'arcane_ritual', name: 'Ritual Arcano', description: 'Desbloquea Amatista', icon: '🔮', maxLevel: 1, costs: [{ resource: 'sapphire', amount: 3 }, { resource: 'aquamarine', amount: 3 }], requires: ['crystalized_time'], position: { col: 7, row: 4 }, branch: 'prestige', upgradesStat: 'luck', upgradeValue: 2, unlocksMineral: 'amethyst' },
  { id: 'solar_heart', name: 'Corazón Solar', description: 'Desbloquea Piedra Solar', icon: '☀️', maxLevel: 1, costs: [{ resource: 'emerald', amount: 5 }, { resource: 'aquamarine', amount: 5 }], requires: ['arcane_ritual'], position: { col: 7, row: 5 }, branch: 'legendary', upgradesStat: 'pickaxe_power', upgradeValue: 5, unlocksMineral: 'sunstone' },
  { id: 'void_portal', name: 'Portal del Vacío', description: 'Desbloquea Vacío', icon: '🕳️', maxLevel: 1, costs: [{ resource: 'sunstone', amount: 3 }, { resource: 'sapphire', amount: 5 }], requires: ['solar_heart'], position: { col: 7, row: 6 }, branch: 'legendary', upgradesStat: 'pickaxe_power', upgradeValue: 5, unlocksMineral: 'void' },

  // ═══ TIME BONUSES (5 skills across progression) ═══
  { id: 'time_boost_1', name: 'Más Tiempo I', description: '+5s de sesión — temprano', icon: '⏱️', maxLevel: 1, costs: [{ resource: 'iron', amount: 5 }, { resource: 'copper', amount: 8 }], requires: ['coal_crystals_node'], position: { col: 0, row: 5 }, branch: 'basic', upgradesStat: 'time_bonus', upgradeValue: 5 },
  { id: 'time_boost_2', name: 'Más Tiempo II', description: '+5s de sesión — más tiempo para brillar', icon: '⏱️', maxLevel: 1, costs: [{ resource: 'jade', amount: 5 }, { resource: 'silver', amount: 8 }], requires: ['natural_energy'], position: { col: 1, row: 5 }, branch: 'gems', upgradesStat: 'time_bonus', upgradeValue: 5 },
  { id: 'time_boost_3', name: 'Más Tiempo III', description: '+5s de sesión — el tiempo es oro', icon: '⏱️', maxLevel: 1, costs: [{ resource: 'rose_quartz', amount: 5 }, { resource: 'lapis_lazuli', amount: 5 }], requires: ['turquoise_core'], position: { col: 2, row: 5 }, branch: 'crystals', upgradesStat: 'time_bonus', upgradeValue: 5 },
  { id: 'time_boost_4', name: 'Más Tiempo IV', description: '+5s de sesión — maestro del tiempo', icon: '⏱️', maxLevel: 1, costs: [{ resource: 'blue_topaz', amount: 3 }, { resource: 'amber', amount: 3 }], requires: ['miner_eye'], position: { col: 5, row: 7 }, branch: 'rares', upgradesStat: 'time_bonus', upgradeValue: 5 },
  { id: 'time_boost_5', name: 'Más Tiempo V', description: '+5s de sesión — distorsión temporal', icon: '⏱️', maxLevel: 1, costs: [{ resource: 'void', amount: 5 }], requires: ['void_portal'], position: { col: 6, row: 7 }, branch: 'legendary', upgradesStat: 'time_bonus', upgradeValue: 5 },
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
  sunstone: '/assets/ores/sunstone1.png', void: '/assets/ores/void1.png',
}

export function getMineralSprite(resource: string): string {
  return SPRITE_MAP[resource] ?? '/assets/ores/clay1.png'
}
