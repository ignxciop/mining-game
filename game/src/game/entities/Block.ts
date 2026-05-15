import { MineralType, getStageIndex, MineralEffect } from './MineralTypes'
import { ResourceType } from '../../store/gameStore'

export class Block {
  hp: number
  maxHp: number
  mineral: MineralType
  private _extraDamage = 0
  private _shieldActive = false

  constructor(mineral: MineralType) {
    this.mineral = mineral
    this.maxHp = mineral.hp
    this.hp = this.maxHp
  }

  get stageIndex(): number { return getStageIndex(this.hp / this.maxHp) }
  get textureKey(): string { return this.mineral.stages[this.stageIndex].textureKey }
  get color(): number { return this.mineral.color }
  get effect(): MineralEffect | undefined { return this.mineral.effect }
  get extraDamage(): number { return this._extraDamage }
  set extraDamage(v: number) { this._extraDamage = v }
  get shieldActive(): boolean { return this._shieldActive }
  set shieldActive(v: boolean) { this._shieldActive = v }

  get effectiveHp(): number {
    return this.maxHp
  }

  getDamageReduction(): number {
    if (!this._shieldActive) return 0
    const eff = this.mineral.effect
    if (eff?.type === 'shield') return eff.reduction
    if (eff?.type === 'armored') return eff.reduction
    return 0
  }

  takeDamage(amount: number): number {
    const reduction = this.getDamageReduction()
    const finalDmg = Math.max(0, Math.round(amount * (1 - reduction)))
    this.hp = Math.max(0, this.hp - finalDmg)
    return this.hp
  }

  isBroken(): boolean { return this.hp <= 0 }

  breakBlock(): Partial<Record<ResourceType, number>> {
    return { [this.mineral.id]: 1 }
  }
}
