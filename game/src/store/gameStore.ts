import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MineralId } from '../game/entities/MineralTypes'

export type ResourceType = MineralId

export interface Tool {
    name: string
    power: number
}

export interface GameStats {
    blocksBroken: number
}

export interface UpgradeDef {
    id: string
    name: string
    description: string
    baseCost: number
    growth: number
    currency: ResourceType
    icon: string
}

export const UPGRADES: UpgradeDef[] = [
    {
        id: 'pickaxe_power',
        name: 'Fuerza de Pico',
        description: 'Daño exponencial',
        baseCost: 10,
        growth: 1.5,
        currency: 'dirt',
        icon: '⛏️',
    },
    {
        id: 'speed',
        name: 'Velocidad',
        description: 'Golpes por segundo',
        baseCost: 5,
        growth: 1.6,
        currency: 'copper',
        icon: '⚡',
    },
    {
        id: 'luck',
        name: 'Suerte',
        description: 'Minerales raros',
        baseCost: 3,
        growth: 1.7,
        currency: 'iron',
        icon: '🍀',
    },
]

export function getUpgradeCost(def: UpgradeDef, level: number): number {
    return Math.floor(def.baseCost * Math.pow(def.growth, level))
}

export function getPickaxePower(level: number): number {
    return 1 + (level * (level + 1)) / 2
}

export function getSpeedInterval(level: number): number {
    return 0.15 / (1 + level * 0.15)
}

export const SESSION_DURATION = 20

const PICKAXE_NAMES = [
    'Pico de Madera', 'Pico de Piedra', 'Pico de Cobre',
    'Pico de Hierro', 'Pico de Acero', 'Pico Legendario',
]

export interface GameState {
    resources: Record<ResourceType, number>
    tool: Tool
    upgrades: Record<string, number>
    stats: GameStats

    addResources: (resources: Partial<Record<ResourceType, number>>) => void
    buyUpgrade: (id: string) => void
    reset: () => void
}

const INITIAL_RESOURCES: Record<ResourceType, number> = {
    dirt: 0,
    copper: 0,
    iron: 0,
    steel: 0,
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            resources: { ...INITIAL_RESOURCES },
            tool: { name: PICKAXE_NAMES[0], power: 1 },
            upgrades: {},
            stats: { blocksBroken: 0 },

            addResources: (resources) => {
                set((s) => {
                    const newResources = { ...s.resources }
                    for (const [key, amount] of Object.entries(resources)) {
                        const r = key as ResourceType
                        newResources[r] = (newResources[r] ?? 0) + Math.floor(amount ?? 0)
                    }
                    return {
                        resources: newResources,
                        stats: {
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
                    const currency = def.currency

                    if ((s.resources[currency] ?? 0) < cost) return s

                    const newUpgrades = { ...s.upgrades, [id]: currentLevel + 1 }
                    const pickLevel = newUpgrades['pickaxe_power'] ?? 0

                    return {
                        resources: {
                            ...s.resources,
                            [currency]: (s.resources[currency] ?? 0) - cost,
                        },
                        upgrades: newUpgrades,
                        tool: {
                            name: PICKAXE_NAMES[Math.min(pickLevel, PICKAXE_NAMES.length - 1)],
                            power: getPickaxePower(pickLevel),
                        },
                    }
                })
            },

            reset: () => set({
                resources: { ...INITIAL_RESOURCES },
                tool: { name: PICKAXE_NAMES[0], power: 1 },
                upgrades: {},
                stats: { blocksBroken: 0 },
            }),
        }),
        {
            name: 'mining-game-save',
            version: 2,
            migrate: () => ({
                resources: { ...INITIAL_RESOURCES },
                tool: { name: PICKAXE_NAMES[0], power: 1 },
                upgrades: {},
                stats: { blocksBroken: 0 },
            }),
        }
    )
)
