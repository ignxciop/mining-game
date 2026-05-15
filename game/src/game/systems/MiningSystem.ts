import { Block } from '../entities/Block'

export interface MineResult {
    damage: number
    rewards: Partial<Record<string, number>> | null
    broken: boolean
}

export class MiningSystem {
    currentBlock: Block
    private _blockTier: number

    constructor(startTier = 0) {
        this._blockTier = startTier
        this.currentBlock = new Block(this._blockTier)
    }

    get blockTier(): number {
        return this._blockTier
    }

    mine(damage: number): MineResult {
        this.currentBlock.takeDamage(damage)

        if (this.currentBlock.isBroken()) {
            const rewards = this.currentBlock.breakBlock()
            this._blockTier++
            this.currentBlock = new Block(this._blockTier)
            return { damage, rewards, broken: true }
        }

        return { damage, rewards: null, broken: false }
    }

    reset(): void {
        this._blockTier = 0
        this.currentBlock = new Block(this._blockTier)
    }
}
