import { MineralType, getStageIndex } from './MineralTypes'
import { ResourceType } from '../../store/gameStore'

export class Block {
    hp: number
    maxHp: number
    mineral: MineralType

    constructor(mineral: MineralType) {
        this.mineral = mineral
        this.maxHp = mineral.hp
        this.hp = this.maxHp
    }

    get stageIndex(): number {
        return getStageIndex(this.hp / this.maxHp)
    }

    get textureKey(): string {
        return this.mineral.stages[this.stageIndex].textureKey
    }

    get color(): number {
        return this.mineral.color
    }

    takeDamage(amount: number): number {
        this.hp = Math.max(0, this.hp - amount)
        return this.hp
    }

    isBroken(): boolean {
        return this.hp <= 0
    }

    breakBlock(): Partial<Record<ResourceType, number>> {
        return { [this.mineral.id]: 1 }
    }
}
