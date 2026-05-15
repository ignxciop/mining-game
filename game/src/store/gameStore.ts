import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ResourceType = 'stone' | 'coal' | 'iron' | 'gold' | 'diamond'

export interface Tool {
    name: string
    power: number
}

export interface GameStats {
    totalMined: number
    totalClicks: number
    blocksBroken: number
}

export interface UpgradeDef {
    id: string
    name: string
    description: string
    baseCost: number
    growth: number
}

export const UPGRADES: UpgradeDef[] = [
    { id: 'pickaxe_power', name: 'Fuerza de Pico', description: '+1 daño por golpe', baseCost: 10, growth: 1.5 },
    { id: 'mining_speed', name: 'Velocidad', description: 'Golpeas más rápido', baseCost: 25, growth: 1.8 },
    { id: 'luck', name: 'Suerte', description: '+5% minerales raros', baseCost: 50, growth: 2.0 },
    { id: 'auto_miner', name: 'Auto Miner', description: '+0.5 daño/seg automático', baseCost: 100, growth: 2.2 },
]

export function getUpgradeCost(def: UpgradeDef, level: number): number {
    return Math.floor(def.baseCost * Math.pow(def.growth, level))
}

export interface GameState {
    resources: Record<ResourceType, number>
    tool: Tool
    upgrades: Record<string, number>
    stats: GameStats

    clickMine: () => void
    addResources: (resources: Partial<Record<ResourceType, number>>) => void
    buyUpgrade: (id: string) => void
    reset: () => void
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            resources: { stone: 0, coal: 0, iron: 0, gold: 0, diamond: 0 },
            tool: { name: 'Pico de Madera', power: 1 },
            upgrades: {},
            stats: { totalMined: 0, totalClicks: 0, blocksBroken: 0 },

            clickMine: () => {
                set((s) => ({
                    stats: { ...s.stats, totalClicks: s.stats.totalClicks + 1 },
                }))
            },

            addResources: (resources) => {
                set((s) => {
                    const newResources = { ...s.resources }
                    let totalAdded = 0
                    for (const [key, amount] of Object.entries(resources)) {
                        const r = key as ResourceType
                        newResources[r] = (newResources[r] ?? 0) + (amount ?? 0)
                        totalAdded += amount ?? 0
                    }
                    return {
                        resources: newResources,
                        stats: {
                            ...s.stats,
                            totalMined: s.stats.totalMined + totalAdded,
                            blocksBroken: s.stats.blocksBroken + 1,
                        },
                    }
                })
            },

            buyUpgrade: (id: string) => {
                set((s) => {
                    const def = UPGRADES.find((u) => u.id === id)
                    if (!def) return s

                    const currentLevel = s.upgrades[id] ?? 0
                    const cost = getUpgradeCost(def, currentLevel)

                    if ((s.resources.stone ?? 0) < cost) return s

                    const newUpgrades = { ...s.upgrades, [id]: currentLevel + 1 }
                    const pickaxeLevel = newUpgrades['pickaxe_power'] ?? 0
                    const names = [
                        'Pico de Madera', 'Pico de Piedra', 'Pico de Hierro',
                        'Pico de Oro', 'Pico de Diamante', 'Pico Legendario',
                    ]

                    return {
                        resources: { ...s.resources, stone: s.resources.stone - cost },
                        upgrades: newUpgrades,
                        tool: {
                            name: names[Math.min(pickaxeLevel, names.length - 1)],
                            power: 1 + pickaxeLevel,
                        },
                    }
                })
            },

            reset: () => set({
                resources: { stone: 0, coal: 0, iron: 0, gold: 0, diamond: 0 },
                tool: { name: 'Pico de Madera', power: 1 },
                upgrades: {},
                stats: { totalMined: 0, totalClicks: 0, blocksBroken: 0 },
            }),
        }),
        { name: 'mining-game-save' }
    )
)
