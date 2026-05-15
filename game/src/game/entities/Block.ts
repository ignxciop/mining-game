import { ResourceType } from '../../store/gameStore'

export interface DropEntry {
    resource: ResourceType
    min: number
    max: number
    chance: number
}

const BLOCK_COLORS = [
    0x808080, 0x606060, 0x4a4a4a, 0x8B5E3C, 0xCD853F,
    0xC0C0C0, 0xB8860B, 0xDAA520, 0xFFD700, 0x00CED1,
    0x00BFFF, 0x4169E1, 0x9370DB, 0x8A2BE2, 0xBA55D3,
]

export class Block {
    hp: number
    maxHp: number
    color: number
    tier: number
    drops: DropEntry[]

    constructor(tier: number) {
        this.tier = tier
        this.maxHp = 5 + tier * 2
        this.hp = this.maxHp
        this.color = BLOCK_COLORS[tier % BLOCK_COLORS.length]
        this.drops = this.generateDrops()
    }

    private generateDrops(): DropEntry[] {
        const t = this.tier
        const base: DropEntry[] = [
            { resource: 'stone', min: 1, max: 3, chance: 1 },
        ]
        if (t >= 2) base.push({ resource: 'coal', min: 1, max: 2, chance: Math.min(0.3 + t * 0.03, 0.9) })
        if (t >= 5) base.push({ resource: 'iron', min: 1, max: 2, chance: Math.min(0.2 + t * 0.02, 0.7) })
        if (t >= 10) base.push({ resource: 'gold', min: 1, max: 1, chance: Math.min(0.1 + t * 0.01, 0.5) })
        if (t >= 20) base.push({ resource: 'diamond', min: 1, max: 1, chance: Math.min(0.05 + t * 0.005, 0.3) })
        return base
    }

    takeDamage(amount: number): number {
        this.hp = Math.max(0, this.hp - amount)
        return this.hp
    }

    isBroken(): boolean {
        return this.hp <= 0
    }

    breakBlock(luckMultiplier = 1): Partial<Record<ResourceType, number>> {
        const rewards: Partial<Record<ResourceType, number>> = {}
        for (const drop of this.drops) {
            if (Math.random() < drop.chance * luckMultiplier) {
                const amount = drop.min + Math.floor(Math.random() * (drop.max - drop.min + 1))
                rewards[drop.resource] = (rewards[drop.resource] ?? 0) + amount
            }
        }
        return rewards
    }
}
