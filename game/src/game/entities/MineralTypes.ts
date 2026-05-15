export type MineralId =
  | 'clay' | 'shale' | 'sulfur'
  | 'copper' | 'iron' | 'coal_crystal' | 'cinnabar'
  | 'silver' | 'obsidian' | 'jade' | 'malachite'
  | 'lapis_lazuli' | 'turquoise' | 'rose_quartz' | 'citrine'
  | 'fluorite' | 'rhodonite' | 'amber' | 'blue_topaz'
  | 'emerald' | 'sapphire' | 'amethyst' | 'aquamarine'
  | 'sunstone' | 'void' | 'moonstone'

export type MineralTier = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface MineralStage { textureKey: string }

export type MineralEffect =
  | { type: 'explosive'; radius: number; damage: number }
  | { type: 'speed_boost'; duration: number; multiplier: number }
  | { type: 'poison'; damage: number }
  | { type: 'bonus_drop'; amount: number }
  | { type: 'armored'; reduction: number }
  | { type: 'chain'; chance: number }
  | { type: 'multiplier'; hits: number; mult: number }
  | { type: 'luck_boost'; chance: number }
  | { type: 'shield'; reduction: number }
  | { type: 'heal'; amount: number }
  | { type: 'gold_rush'; duration: number; mult: number }
  | { type: 'ricochet'; chance: number }
  | { type: 'combo'; comboMult: number }
  | { type: 'fossil'; reviveChance: number }
  | { type: 'guaranteed_crit'; hits: number }
  | { type: 'jackpot'; mult: number }
  | { type: 'time_bonus'; seconds: number }
  | { type: 'prestige_mult'; mult: number }
  | { type: 'tidal_wave'; damage: number }
  | { type: 'sun_blessing'; tickDamage: number; duration: number }
  | { type: 'void_aura'; bonusDamage: number }
  | { type: 'moon_freeze'; seconds: number }
  | { type: 'frenzy'; duration: number }
  | { type: 'radioactive'; duration: number; damage: number }
  | { type: 'meteor'; damage: number; radius: number }
  | { type: 'ghost' }
  | { type: 'corrupt'; hpMult: number; rewardMult: number }

export interface MineralType {
  id: MineralId
  name: string
  stages: [MineralStage, MineralStage, MineralStage]
  color: number
  hp: number
  baseWeight: number
  tier: MineralTier
  unlockSkill: string | null
  effect?: MineralEffect
}

export const MINERALS: MineralType[] = [
  // ═══ TIER 1 — Common (start unlocked) ═══
  { id: 'clay', name: 'Arcilla', stages: [{ textureKey: 'clay1' }, { textureKey: 'clay2' }, { textureKey: 'clay3' }], color: 0xB87333, hp: 3, baseWeight: 25, tier: 1, unlockSkill: null },
  { id: 'shale', name: 'Pizarra', stages: [{ textureKey: 'shale1' }, { textureKey: 'shale2' }, { textureKey: 'shale3' }], color: 0x708090, hp: 4, baseWeight: 22, tier: 1, unlockSkill: null },
  { id: 'sulfur', name: 'Azufre', stages: [{ textureKey: 'sulfur1' }, { textureKey: 'sulfur2' }, { textureKey: 'sulfur3' }], color: 0xFFD700, hp: 6, baseWeight: 12, tier: 1, unlockSkill: 'toxic_mining', effect: { type: 'explosive', radius: 60, damage: 3 } },

  // ═══ TIER 2 — Basic branch ═══
  { id: 'copper', name: 'Cobre', stages: [{ textureKey: 'copper1' }, { textureKey: 'copper2' }, { textureKey: 'copper3' }], color: 0xD97706, hp: 8, baseWeight: 15, tier: 2, unlockSkill: 'copper_tools' },
  { id: 'iron', name: 'Hierro', stages: [{ textureKey: 'iron1' }, { textureKey: 'iron2' }, { textureKey: 'iron3' }], color: 0x9CA3AF, hp: 12, baseWeight: 12, tier: 2, unlockSkill: 'deep_excavation' },
  { id: 'coal_crystal', name: 'Cristal de Carbón', stages: [{ textureKey: 'coal_crystal1' }, { textureKey: 'coal_crystal2' }, { textureKey: 'coal_crystal3' }], color: 0x1F2937, hp: 10, baseWeight: 10, tier: 2, unlockSkill: 'coal_crystals', effect: { type: 'speed_boost', duration: 3, multiplier: 1.5 } },
  { id: 'cinnabar', name: 'Cinabrio', stages: [{ textureKey: 'cinnabar1' }, { textureKey: 'cinnabar2' }, { textureKey: 'cinnabar3' }], color: 0xDC2626, hp: 14, baseWeight: 8, tier: 2, unlockSkill: 'toxic_mining', effect: { type: 'poison', damage: 3 } },

  // ═══ TIER 3 — Gems branch ═══
  { id: 'silver', name: 'Plata', stages: [{ textureKey: 'silver1' }, { textureKey: 'silver2' }, { textureKey: 'silver3' }], color: 0xC0C0C0, hp: 16, baseWeight: 10, tier: 3, unlockSkill: 'mineral_polish', effect: { type: 'bonus_drop', amount: 1 } },
  { id: 'obsidian', name: 'Obsidiana', stages: [{ textureKey: 'obsidian1' }, { textureKey: 'obsidian2' }, { textureKey: 'obsidian3' }], color: 0x0F0F0F, hp: 25, baseWeight: 6, tier: 3, unlockSkill: 'ancient_rocks', effect: { type: 'armored', reduction: 1 } },
  { id: 'jade', name: 'Jade', stages: [{ textureKey: 'jade1' }, { textureKey: 'jade2' }, { textureKey: 'jade3' }], color: 0x00A86B, hp: 18, baseWeight: 7, tier: 3, unlockSkill: 'natural_energy', effect: { type: 'chain', chance: 0.3 } },
  { id: 'malachite', name: 'Malaquita', stages: [{ textureKey: 'malachite1' }, { textureKey: 'malachite2' }, { textureKey: 'malachite3' }], color: 0x0BDA51, hp: 15, baseWeight: 8, tier: 3, unlockSkill: 'green_veins', effect: { type: 'multiplier', hits: 3, mult: 2 } },

  // ═══ TIER 4 — Crystals branch ═══
  { id: 'lapis_lazuli', name: 'Lapislázuli', stages: [{ textureKey: 'lapis_lazuli1' }, { textureKey: 'lapis_lazuli2' }, { textureKey: 'lapis_lazuli3' }], color: 0x26619C, hp: 20, baseWeight: 5, tier: 4, unlockSkill: 'blue_resonance', effect: { type: 'luck_boost', chance: 0.2 } },
  { id: 'turquoise', name: 'Turquesa', stages: [{ textureKey: 'turquoise1' }, { textureKey: 'turquoise2' }, { textureKey: 'turquoise3' }], color: 0x40E0D0, hp: 22, baseWeight: 4, tier: 4, unlockSkill: 'turquoise_core', effect: { type: 'shield', reduction: 0.3 } },
  { id: 'rose_quartz', name: 'Cuarzo Rosa', stages: [{ textureKey: 'rose_quartz1' }, { textureKey: 'rose_quartz2' }, { textureKey: 'rose_quartz3' }], color: 0xF4C2C2, hp: 18, baseWeight: 5, tier: 4, unlockSkill: 'vital_crystals', effect: { type: 'heal', amount: 1 } },
  { id: 'citrine', name: 'Citrino', stages: [{ textureKey: 'citrine1' }, { textureKey: 'citrine2' }, { textureKey: 'citrine3' }], color: 0xE4D00A, hp: 18, baseWeight: 4, tier: 4, unlockSkill: 'golden_prosperity', effect: { type: 'gold_rush', duration: 5, mult: 2 } },

  // ═══ TIER 5 — Rarezas branch ═══
  { id: 'fluorite', name: 'Fluorita', stages: [{ textureKey: 'fluorite1' }, { textureKey: 'fluorite2' }, { textureKey: 'fluorite3' }], color: 0x00BFFF, hp: 24, baseWeight: 3, tier: 5, unlockSkill: 'resonant_caverns', effect: { type: 'ricochet', chance: 0.25 } },
  { id: 'rhodonite', name: 'Rodonita', stages: [{ textureKey: 'rhodonite1' }, { textureKey: 'rhodonite2' }, { textureKey: 'rhodonite3' }], color: 0xC08080, hp: 28, baseWeight: 2, tier: 5, unlockSkill: 'berserker_core', effect: { type: 'combo', comboMult: 1 } },
  { id: 'amber', name: 'Ámbar', stages: [{ textureKey: 'amber1' }, { textureKey: 'amber2' }, { textureKey: 'amber3' }], color: 0xFFBF00, hp: 20, baseWeight: 3, tier: 5, unlockSkill: 'ancient_fossils', effect: { type: 'fossil', reviveChance: 0.1 } },
  { id: 'blue_topaz', name: 'Topacio Azul', stages: [{ textureKey: 'blue_topaz1' }, { textureKey: 'blue_topaz2' }, { textureKey: 'blue_topaz3' }], color: 0x00BFFF, hp: 26, baseWeight: 2, tier: 5, unlockSkill: 'miner_eye', effect: { type: 'guaranteed_crit', hits: 2 } },

  // ═══ TIER 6 — Prestige branch ═══
  { id: 'emerald', name: 'Esmeralda', stages: [{ textureKey: 'emerald1' }, { textureKey: 'emerald2' }, { textureKey: 'emerald3' }], color: 0x50C878, hp: 30, baseWeight: 1.5, tier: 6, unlockSkill: 'emerald_garden', effect: { type: 'jackpot', mult: 3 } },
  { id: 'sapphire', name: 'Zafiro', stages: [{ textureKey: 'sapphire1' }, { textureKey: 'sapphire2' }, { textureKey: 'sapphire3' }], color: 0x0F52BA, hp: 35, baseWeight: 1, tier: 6, unlockSkill: 'crystalized_time', effect: { type: 'time_bonus', seconds: 2 } },
  { id: 'amethyst', name: 'Amatista', stages: [{ textureKey: 'amethyst1' }, { textureKey: 'amethyst2' }, { textureKey: 'amethyst3' }], color: 0x9966CC, hp: 32, baseWeight: 1.2, tier: 6, unlockSkill: 'arcane_ritual', effect: { type: 'prestige_mult', mult: 1.5 } },
  { id: 'aquamarine', name: 'Aguamarina', stages: [{ textureKey: 'aquamarine1' }, { textureKey: 'aquamarine2' }, { textureKey: 'aquamarine3' }], color: 0x7FFFD4, hp: 28, baseWeight: 1, tier: 6, unlockSkill: 'oceanic_crown', effect: { type: 'tidal_wave', damage: 5 } },

  // ═══ TIER 7 — Legendary branch ═══
  { id: 'sunstone', name: 'Piedra Solar', stages: [{ textureKey: 'sunstone1' }, { textureKey: 'sunstone2' }, { textureKey: 'sunstone3' }], color: 0xFF4500, hp: 40, baseWeight: 0.5, tier: 7, unlockSkill: 'solar_heart', effect: { type: 'sun_blessing', tickDamage: 2, duration: 8 } },
  { id: 'void', name: 'Vacío', stages: [{ textureKey: 'void1' }, { textureKey: 'void2' }, { textureKey: 'void3' }], color: 0x4B0082, hp: 50, baseWeight: 0.3, tier: 7, unlockSkill: 'void_portal', effect: { type: 'void_aura', bonusDamage: 1 } },
  { id: 'moonstone', name: 'Piedra Lunar', stages: [{ textureKey: 'moonstone1' }, { textureKey: 'moonstone2' }, { textureKey: 'moonstone3' }], color: 0xFFFFF0, hp: 45, baseWeight: 0.4, tier: 7, unlockSkill: 'lunar_eclipse', effect: { type: 'moon_freeze', seconds: 5 } },
]

export function getRandomMineralByWeight(luckLevel = 0, prestigeLevel = 0, allowedIds?: MineralId[]): MineralType {
  const filtered = allowedIds
    ? MINERALS.filter((m) => allowedIds.includes(m.id))
    : MINERALS

  const tierBonuses: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 6, 7: 8 }

  const weights = filtered.map((m) => {
    let w = m.baseWeight
    const tierBonus = tierBonuses[m.tier] ?? 0
    w = w * Math.exp(tierBonus * luckLevel * 0.04)
    if (m.id === 'clay' || m.id === 'shale') w = Math.max(3, w * Math.exp(-luckLevel * 0.06))
    if (m.tier >= 6 && prestigeLevel < 1) w = 0
    if (m.tier === 7 && prestigeLevel < 2) w = 0
    if (prestigeLevel >= 2 && m.tier >= 6) w = Math.max(w, 0.5)
    if (prestigeLevel >= 3 && m.tier === 7) w = Math.max(w, 0.3)
    return Math.max(0, w)
  })

  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return filtered[0] ?? MINERALS[0]

  let roll = Math.random() * total
  for (let i = 0; i < filtered.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return filtered[i]
  }
  return filtered[filtered.length - 1] ?? MINERALS[0]
}

export function getStageIndex(hpPct: number): number {
  if (hpPct >= 0.75) return 0
  if (hpPct >= 0.25) return 1
  return 2
}

export function getMineralById(id: MineralId): MineralType | undefined {
  return MINERALS.find((m) => m.id === id)
}
