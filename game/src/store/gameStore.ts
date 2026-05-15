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
  totalBlocksBroken: number
}

export function getPickaxePower(level: number): number {
  return 1 + (level * (level + 1)) / 2
}

export function getSpeedInterval(level: number): number {
  return 1 / (1 + level * 0.18)
}

export function getUpgradeCost(_baseCost: number, _growth: number, _level: number): number {
  return Math.floor(_baseCost * Math.pow(_growth, _level))
}

export function getPrestigePoints(steelAccumulated: number): number {
  return Math.floor(Math.pow(steelAccumulated, 0.6))
}

export const SESSION_DURATION = 20

const PICKAXE_NAMES = [
  'Pico de Madera', 'Pico de Piedra', 'Pico de Cobre',
  'Pico de Hierro', 'Pico de Acero', 'Pico Legendario',
  'Pico de Vacío', 'Pico Cósmico',
]

export interface GameState {
  resources: Record<ResourceType, number>
  tool: Tool
  upgrades: Record<string, number>
  skills: Record<string, number>
  stats: GameStats
  prestigeLevel: number
  prestigePoints: number
  prestigeUpgrades: Record<string, number>
  lifetimeStats: {
    totalBlocksBroken: number
    steelAccumulated: number
  }

  addResources: (resources: Partial<Record<string, number>>) => void
  purchaseSkill: (skillId: string, costResources: Record<string, number>, stat: string, statValue: number) => boolean
  buyPrestigeUpgrade: (id: string, cost: number, effectStat: string, effectValue: number) => boolean
  doPrestige: () => void
  reset: () => void
}



export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      resources: {} as Record<ResourceType, number>,
      tool: { name: PICKAXE_NAMES[0], power: 1 },
      upgrades: {},
      skills: {},
      stats: { blocksBroken: 0, totalBlocksBroken: 0 },
      prestigeLevel: 0,
      prestigePoints: 0,
      prestigeUpgrades: {},
      lifetimeStats: { totalBlocksBroken: 0, steelAccumulated: 0 },

      addResources: (resources) => {
        set((s) => {
          const newResources = { ...s.resources }
          let steelAdded = 0
          for (const [key, amount] of Object.entries(resources)) {
            const r = key as ResourceType
            const amt = Math.floor(amount ?? 0)
            newResources[r] = (newResources[r] ?? 0) + amt
            if (r === 'void') steelAdded += amt
          }
          const newTotalBlocks = s.stats.totalBlocksBroken + 1
          return {
            resources: newResources,
            stats: { blocksBroken: s.stats.blocksBroken + 1, totalBlocksBroken: newTotalBlocks },
            lifetimeStats: {
              totalBlocksBroken: s.lifetimeStats.totalBlocksBroken + 1,
              steelAccumulated: s.lifetimeStats.steelAccumulated + (resources['void'] ?? 0),
            },
          }
        })
      },

      purchaseSkill: (skillId, costResources, stat, statValue): boolean => {
        let success = false
        set((s) => {
          const affordable = Object.entries(costResources).every(
            ([res, amt]) => (s.resources[res as ResourceType] ?? 0) >= amt
          )
          if (!affordable) return s

          const newResources = { ...s.resources }
          for (const [res, amt] of Object.entries(costResources))
            newResources[res as ResourceType] = (newResources[res as ResourceType] ?? 0) - amt

          const newSkills = { ...s.skills, [skillId]: (s.skills[skillId] ?? 0) + 1 }
          const newUpgrades = { ...s.upgrades, [stat]: (s.upgrades[stat] ?? 0) + statValue }
          const pickLevel = newUpgrades['pickaxe_power'] ?? 0

          success = true
          return {
            resources: newResources,
            skills: newSkills,
            upgrades: newUpgrades,
            tool: {
              name: PICKAXE_NAMES[Math.min(pickLevel, PICKAXE_NAMES.length - 1)],
              power: getPickaxePower(pickLevel),
            },
          }
        })
        return success
      },

      buyPrestigeUpgrade: (id, cost, effectStat, effectValue): boolean => {
        let success = false
        set((s) => {
          if ((s.prestigePoints ?? 0) < cost) return s
          const newUpgrades = {
            ...s.prestigeUpgrades,
            [id]: (s.prestigeUpgrades[id] ?? 0) + 1,
          }
          success = true
          return {
            prestigePoints: s.prestigePoints - cost,
            prestigeUpgrades: newUpgrades,
            upgrades: {
              ...s.upgrades,
              [effectStat]: (s.upgrades[effectStat] ?? 0) + effectValue,
            },
            tool: {
              ...s.tool,
              power: getPickaxePower((s.upgrades['pickaxe_power'] ?? 0) + effectValue),
            },
          }
        })
        return success
      },

      doPrestige: () => {
        set((s) => {
          const points = getPrestigePoints(s.lifetimeStats.steelAccumulated)
          return {
      resources: {} as Record<string, number>,
            tool: { name: PICKAXE_NAMES[0], power: 1 },
            upgrades: {},
            skills: {},
            stats: { blocksBroken: 0, totalBlocksBroken: s.lifetimeStats.totalBlocksBroken },
            prestigeLevel: s.prestigeLevel + 1,
            prestigePoints: (s.prestigePoints ?? 0) + points,
          }
        })
      },

      reset: () => set({
        resources: {} as Record<string, number>,
        tool: { name: PICKAXE_NAMES[0], power: 1 },
        upgrades: {},
        skills: {},
        stats: { blocksBroken: 0, totalBlocksBroken: 0 },
        prestigeLevel: 0,
        prestigePoints: 0,
        prestigeUpgrades: {},
        lifetimeStats: { totalBlocksBroken: 0, steelAccumulated: 0 },
      }),
    }),
    {
      name: 'mining-game-save',
      version: 4,
      migrate: () => ({
        resources: {} as Record<string, number>,
        tool: { name: PICKAXE_NAMES[0], power: 1 },
        upgrades: {},
        skills: {},
        stats: { blocksBroken: 0, totalBlocksBroken: 0 },
        prestigeLevel: 0,
        prestigePoints: 0,
        prestigeUpgrades: {},
        lifetimeStats: { totalBlocksBroken: 0, steelAccumulated: 0 },
      }),
    }
  )
)
