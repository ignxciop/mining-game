import { MineralId } from '../game/entities/MineralTypes'

export interface SkillCost {
    resource: MineralId
    amount: number
}

export interface SkillNodeDef {
    id: string
    name: string
    description: string
    icon: string
    maxLevel: number
    costs: SkillCost[]
    requires: string[]
    position: { col: number; row: number }
    branch: 'damage' | 'speed' | 'luck' | 'utility'
    upgradesStat: string
    upgradeValue: number
}

const BRANCH_COLORS: Record<string, string> = {
    damage: 'from-red-700/80 to-red-900/80 border-red-600/50',
    speed: 'from-cyan-700/80 to-cyan-900/80 border-cyan-600/50',
    luck: 'from-emerald-700/80 to-emerald-900/80 border-emerald-600/50',
    utility: 'from-purple-700/80 to-purple-900/80 border-purple-600/50',
}

export function getBranchColor(branch: string): string {
    return BRANCH_COLORS[branch] ?? 'from-gray-700/80 to-gray-900/80 border-gray-600/50'
}

export const SKILL_TREE: SkillNodeDef[] = [
    // ── Root ──
    {
        id: 'sharp_pick',
        name: 'Pico Afilado',
        description: '+1 de daño base',
        icon: '⛏️',
        maxLevel: 1,
        costs: [{ resource: 'dirt', amount: 5 }],
        requires: [],
        position: { col: 2, row: 0 },
        branch: 'damage',
        upgradesStat: 'pickaxe_power',
        upgradeValue: 1,
    },

    // ── Branch: Damage (left) ──
    {
        id: 'strong_swing',
        name: 'Golpe Fuerte',
        description: '+2 de daño base',
        icon: '⚔️',
        maxLevel: 1,
        costs: [{ resource: 'dirt', amount: 20 }, { resource: 'copper', amount: 5 }],
        requires: ['sharp_pick'],
        position: { col: 0, row: 1 },
        branch: 'damage',
        upgradesStat: 'pickaxe_power',
        upgradeValue: 1,
    },
    {
        id: 'giant_strike',
        name: 'Golpe Gigante',
        description: '+5 de daño base',
        icon: '💥',
        maxLevel: 1,
        costs: [{ resource: 'copper', amount: 20 }, { resource: 'iron', amount: 5 }],
        requires: ['strong_swing'],
        position: { col: 0, row: 2 },
        branch: 'damage',
        upgradesStat: 'pickaxe_power',
        upgradeValue: 2,
    },
    {
        id: 'crit_chance',
        name: 'Golpe Crítico',
        description: 'Probabilidad de crítico',
        icon: '🎯',
        maxLevel: 3,
        costs: [{ resource: 'copper', amount: 10 }, { resource: 'iron', amount: 3 }],
        requires: ['strong_swing'],
        position: { col: 0, row: 3 },
        branch: 'damage',
        upgradesStat: 'crit_chance',
        upgradeValue: 5,
    },

    // ── Branch: Speed (center-left) ──
    {
        id: 'quick_hands',
        name: 'Manos Rápidas',
        description: '+1 nivel de velocidad',
        icon: '⚡',
        maxLevel: 1,
        costs: [{ resource: 'dirt', amount: 15 }, { resource: 'copper', amount: 3 }],
        requires: ['sharp_pick'],
        position: { col: 1, row: 1 },
        branch: 'speed',
        upgradesStat: 'speed',
        upgradeValue: 1,
    },
    {
        id: 'swift_miner',
        name: 'Minero Veloz',
        description: '+2 niveles de velocidad',
        icon: '🌪️',
        maxLevel: 1,
        costs: [{ resource: 'copper', amount: 15 }, { resource: 'iron', amount: 5 }],
        requires: ['quick_hands'],
        position: { col: 1, row: 2 },
        branch: 'speed',
        upgradesStat: 'speed',
        upgradeValue: 2,
    },
    {
        id: 'blitz',
        name: 'Ráfaga',
        description: '+3 niveles de velocidad',
        icon: '💨',
        maxLevel: 1,
        costs: [{ resource: 'iron', amount: 15 }, { resource: 'steel', amount: 3 }],
        requires: ['swift_miner'],
        position: { col: 1, row: 3 },
        branch: 'speed',
        upgradesStat: 'speed',
        upgradeValue: 3,
    },

    // ── Branch: Luck (center-right) ──
    {
        id: 'lucky_find',
        name: 'Hallazgo Suerte',
        description: '+1 nivel de suerte',
        icon: '🍀',
        maxLevel: 1,
        costs: [{ resource: 'dirt', amount: 15 }, { resource: 'copper', amount: 3 }],
        requires: ['sharp_pick'],
        position: { col: 3, row: 1 },
        branch: 'luck',
        upgradesStat: 'luck',
        upgradeValue: 1,
    },
    {
        id: 'rare_hunter',
        name: 'Cazador de Rarezas',
        description: '+2 niveles de suerte',
        icon: '💎',
        maxLevel: 1,
        costs: [{ resource: 'copper', amount: 15 }, { resource: 'iron', amount: 5 }],
        requires: ['lucky_find'],
        position: { col: 3, row: 2 },
        branch: 'luck',
        upgradesStat: 'luck',
        upgradeValue: 2,
    },
    {
        id: 'treasure_magnet',
        name: 'Imán de Tesoros',
        description: '+3 niveles de suerte — ¡minerales raros abundan!',
        icon: '🧲',
        maxLevel: 1,
        costs: [{ resource: 'iron', amount: 15 }, { resource: 'steel', amount: 5 }],
        requires: ['rare_hunter'],
        position: { col: 3, row: 3 },
        branch: 'luck',
        upgradesStat: 'luck',
        upgradeValue: 3,
    },

    // ── Branch: Utility (right) ──
    {
        id: 'efficiency',
        name: 'Eficiencia Minera',
        description: 'Cada mineral da +1 recurso extra',
        icon: '🔧',
        maxLevel: 1,
        costs: [{ resource: 'dirt', amount: 25 }, { resource: 'copper', amount: 10 }],
        requires: ['sharp_pick'],
        position: { col: 4, row: 1 },
        branch: 'utility',
        upgradesStat: 'efficiency',
        upgradeValue: 1,
    },
    {
        id: 'magnet',
        name: 'Imán Mineral',
        description: '+20% rango de minería',
        icon: '🧲',
        maxLevel: 2,
        costs: [{ resource: 'copper', amount: 20 }, { resource: 'iron', amount: 8 }],
        requires: ['efficiency'],
        position: { col: 4, row: 2 },
        branch: 'utility',
        upgradesStat: 'mining_range',
        upgradeValue: 10,
    },
    {
        id: 'fortune',
        name: 'Fortuna',
        description: 'Duplica recursos obtenidos',
        icon: '💰',
        maxLevel: 1,
        costs: [{ resource: 'iron', amount: 20 }, { resource: 'steel', amount: 10 }],
        requires: ['efficiency'],
        position: { col: 4, row: 3 },
        branch: 'utility',
        upgradesStat: 'fortune',
        upgradeValue: 1,
    },
]

export function getSkillById(id: string): SkillNodeDef | undefined {
    return SKILL_TREE.find((s) => s.id === id)
}

export function getSkillLevelInStore(upgrades: Record<string, number>, stat: string): number {
    return upgrades[stat] ?? 0
}

export function getMineralSprite(resource: MineralId): string {
    const map: Record<MineralId, string> = {
        dirt: '/assets/ores/dirt_1.png',
        copper: '/assets/ores/copper1.png',
        iron: '/assets/ores/iron1.png',
        steel: '/assets/ores/steel1.png',
    }
    return map[resource]
}
