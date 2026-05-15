import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MineralId, getMineralById as _getMineralById } from '../game/entities/MineralTypes'

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
  return Math.floor(Math.pow(1.18, level) + level * 0.8)
}

export function getSpeedInterval(level: number): number {
  return Math.max(0.08, 1 / (1 + 0.16 * level))
}

export function getCritChance(level: number): number {
  return Math.min(75, 4 * level)
}

export function getCritDamage(level: number): number {
  return 2 + 0.5 * level
}

export function getFortuneChance(level: number): number {
  return Math.min(60, 12 * level)
}

export function getTripleDropChance(level: number): number {
  return Math.max(0, (level - 3) * 4)
}

export function getDropMultiplier(level: number): number {
  return 1 + 0.35 * level
}

export function getPrestigePoints(totalValue: number): number {
  return Math.floor(Math.sqrt(totalValue / 5000))
}

export const SESSION_DURATION = 20

const PICKAXE_NAMES = [
  'Pico de Madera', 'Pico de Piedra', 'Pico de Cobre',
  'Pico de Hierro', 'Pico de Acero', 'Pico Legendario',
  'Pico de Vacío', 'Pico Cósmico',
]

export interface GameState {
  resources: Record<string, number>
  tool: Tool
  upgrades: Record<string, number>
  skills: Record<string, number>
  stats: GameStats
  prestigeLevel: number
  prestigePoints: number
  prestigeUpgrades: Record<string, number>
  lifetimeStats: { totalBlocksBroken: number; totalResourceValue: number }
  excludedBranches: string[]
  unlockedMinerals: MineralId[]
  combo: number
  comboTimer: number

  addResources: (resources: Partial<Record<string, number>>) => void
  purchaseSkill: (skillId: string, costResources: Record<string, number>, stat: string, statValue: number) => boolean
  buyPrestigeUpgrade: (id: string, cost: number, effectStat: string, effectValue: number) => boolean
  setExcludedBranch: (branchId: string) => void
  incrementCombo: () => void
  resetCombo: () => void
  doPrestige: () => void
  reset: () => void
}

const STARTING_MINERALS: MineralId[] = ['clay', 'shale']

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      resources: {} as Record<string, number>,
      tool: { name: PICKAXE_NAMES[0], power: 1 },
      upgrades: {},
      skills: {},
      stats: { blocksBroken: 0, totalBlocksBroken: 0 },
      prestigeLevel: 0,
      prestigePoints: 0,
      prestigeUpgrades: {},
      lifetimeStats: { totalBlocksBroken: 0, totalResourceValue: 0 },
      excludedBranches: [],
      unlockedMinerals: [...STARTING_MINERALS],
      combo: 0,
      comboTimer: 0,

      addResources: (resources) => {
        set((s) => {
          const newResources = { ...s.resources }
          let addedValue = 0
          for (const [key, amount] of Object.entries(resources)) {
            const r = key as ResourceType
            const amt = Math.floor(amount ?? 0)
            newResources[r] = (newResources[r] ?? 0) + amt
            addedValue += amt
          }
          return {
            resources: newResources,
            stats: { blocksBroken: s.stats.blocksBroken + 1, totalBlocksBroken: s.stats.totalBlocksBroken + 1 },
            lifetimeStats: {
              totalBlocksBroken: s.lifetimeStats.totalBlocksBroken + 1,
              totalResourceValue: s.lifetimeStats.totalResourceValue + addedValue,
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

          // Check if this skill unlocks a mineral
          const newUnlocked = [...s.unlockedMinerals]
          const allMineralIds: MineralId[] = ['clay', 'shale', 'sulfur', 'copper', 'iron', 'coal_crystal', 'cinnabar', 'silver', 'obsidian', 'jade', 'malachite', 'lapis_lazuli', 'turquoise', 'rose_quartz', 'citrine', 'fluorite', 'rhodonite', 'amber', 'blue_topaz', 'emerald', 'sapphire', 'amethyst', 'aquamarine', 'sunstone', 'void', 'moonstone']
          for (const mid of allMineralIds) {
            const m = _getMineralById(mid)
            if (m && m.unlockSkill === skillId && !newUnlocked.includes(mid)) {
              newUnlocked.push(mid)
            }
          }

          success = true
          return {
            resources: newResources,
            skills: newSkills,
            upgrades: newUpgrades,
            unlockedMinerals: newUnlocked,
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
          const newUpgrades = { ...s.prestigeUpgrades, [id]: (s.prestigeUpgrades[id] ?? 0) + 1 }
          success = true
          return {
            prestigePoints: s.prestigePoints - cost,
            prestigeUpgrades: newUpgrades,
            upgrades: { ...s.upgrades, [effectStat]: (s.upgrades[effectStat] ?? 0) + effectValue },
            tool: {
              ...s.tool,
              power: getPickaxePower((s.upgrades['pickaxe_power'] ?? 0) + (effectStat === 'pickaxe_power' ? effectValue : 0)),
            },
          }
        })
        return success
      },

      setExcludedBranch: (branchId) => {
        set((s) => ({ excludedBranches: [...s.excludedBranches, branchId] }))
      },

      incrementCombo: () => {
        set((s) => ({ combo: s.combo + 1, comboTimer: 0 }))
      },

      resetCombo: () => {
        set({ combo: 0, comboTimer: 0 })
      },

      doPrestige: () => {
        set((s) => {
          const points = getPrestigePoints(s.lifetimeStats.totalResourceValue)
          return {
            resources: {} as Record<string, number>,
            tool: { name: PICKAXE_NAMES[0], power: 1 },
            upgrades: {},
            skills: {},
            stats: { blocksBroken: 0, totalBlocksBroken: s.lifetimeStats.totalBlocksBroken },
            excludedBranches: [],
            unlockedMinerals: [...STARTING_MINERALS],
            combo: 0, comboTimer: 0,
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
        prestigeLevel: 0, prestigePoints: 0,
        prestigeUpgrades: {},
        lifetimeStats: { totalBlocksBroken: 0, totalResourceValue: 0 },
        excludedBranches: [],
        unlockedMinerals: [...STARTING_MINERALS],
        combo: 0, comboTimer: 0,
      }),
    }),
    {
      name: 'mining-game-save',
      version: 6,
      migrate: () => ({
        resources: {} as Record<string, number>,
        tool: { name: PICKAXE_NAMES[0], power: 1 },
        upgrades: {},
        skills: {},
        stats: { blocksBroken: 0, totalBlocksBroken: 0 },
        prestigeLevel: 0, prestigePoints: 0,
        prestigeUpgrades: {},
        lifetimeStats: { totalBlocksBroken: 0, totalResourceValue: 0 },
        excludedBranches: [],
        unlockedMinerals: [...STARTING_MINERALS],
        combo: 0, comboTimer: 0,
      }),
    }
  )
)
