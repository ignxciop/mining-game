import { Block } from '../entities/Block'
import { getRandomMineralByWeight } from '../entities/MineralTypes'

export interface MineResult {
    damage: number
    rewards: Partial<Record<string, number>> | null
    broken: boolean
}

export class MiningSystem {
    currentBlock: Block

    constructor() {
        this.currentBlock = new Block(getRandomMineralByWeight())
    }

    mine(damage: number): MineResult {
        this.currentBlock.takeDamage(damage)

        if (this.currentBlock.isBroken()) {
            const rewards = this.currentBlock.breakBlock()
            this.currentBlock = new Block(getRandomMineralByWeight())
            return { damage, rewards, broken: true }
        }

        return { damage, rewards: null, broken: false }
    }

    reset(): void {
        this.currentBlock = new Block(getRandomMineralByWeight())
    }
}
