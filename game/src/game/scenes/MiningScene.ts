import { Scene, GameObjects } from 'phaser'
import { Block } from '../entities/Block'
import {
  MINERALS, getRandomMineralByWeight, getMineralById,
  MineralEffect, MineralType,
} from '../entities/MineralTypes'
import { useGameStore, getSpeedInterval, SESSION_DURATION } from '../../store/gameStore'
import { EventBus } from '../EventBus'

const BASE_RANGE = 80
const MINERAL_COUNT = 8
const MINERAL_SIZE = 64
const MIN_SPACING = 90

function getAreaDimensions(w: number, h: number) {
  const maxW = Math.min(520, w * 0.85)
  const maxH = Math.min(380, h * 0.55)
  const aspect = 520 / 380
  let aw = maxW; let ah = maxW / aspect
  if (ah > maxH) { ah = maxH; aw = maxH * aspect }
  return { w: Math.round(aw), h: Math.round(ah) }
}

function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }

interface MineralNode {
  block: Block; sprite: GameObjects.Image; x: number; y: number
  damageTimer: number; isTargeted: boolean
  activeEffects: ActiveEffect[]
}

interface ActiveEffect {
  type: string; remaining: number; value: number
}

function generateGrassTexture(scene: Scene, w: number, h: number): void {
  const key = 'bg_grass'
  if (scene.textures.exists(key)) return
  const gfx = scene.add.graphics()
  gfx.fillStyle(0x4a7c3f, 1); gfx.fillRect(0, 0, w, h)
  for (let i = 0; i < 40; i++) {
    gfx.fillStyle(0x3d6b34, 0.3 + Math.random() * 0.2)
    gfx.fillCircle(Math.random() * w, Math.random() * h, 3 + Math.random() * 8)
  }
  for (let i = 0; i < 14; i++) {
    gfx.fillStyle(0x5a4a3a, 0.15 + Math.random() * 0.1)
    gfx.fillEllipse(Math.random() * w, Math.random() * h, 10 + Math.random() * 20, 6 + Math.random() * 8)
  }
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * w; const y = Math.random() * h; const r = 2 + Math.random() * 4
    gfx.fillStyle(0x6b5b4b, 0.2 + Math.random() * 0.15); gfx.fillCircle(x, y, r)
    gfx.fillStyle(0x8b7b6b, 0.15); gfx.fillCircle(x - 1, y - 1, r * 0.7)
  }
  gfx.generateTexture(key, w, h); gfx.destroy()
}

export class MiningScene extends Scene {
  private nodes: MineralNode[] = []
  private mouseX = 0; private mouseY = 0
  private circleGfx!: GameObjects.Graphics
  private areaGfx!: GameObjects.Graphics
  private areaCX = 0; private areaCY = 0
  private areaW = 520; private areaH = 380
  private timeLeft = SESSION_DURATION
  private timerText!: GameObjects.Text
  private ended = false
  private globalEffects: ActiveEffect[] = []
  private timeBonus = 0

  constructor() { super('MiningScene') }

  preload(): void {
    for (const m of MINERALS)
      for (const stage of m.stages)
        this.load.image(stage.textureKey, `assets/ores/${stage.textureKey}.png`)
  }

  create(): void {
    this.ended = false; this.timeLeft = SESSION_DURATION; this.nodes = []
    this.areaCX = this.scale.width / 2; this.areaCY = this.scale.height / 2
    const dims = getAreaDimensions(this.scale.width, this.scale.height)
    this.areaW = dims.w; this.areaH = dims.h
    generateGrassTexture(this, this.areaW, this.areaH)

    const store = useGameStore.getState()
    this.timeBonus = store.upgrades['time_bonus'] ?? 0
    this.timeLeft = SESSION_DURATION + this.timeBonus

    this.areaGfx = this.add.graphics(); this.circleGfx = this.add.graphics()
    this.timerText = this.add.text(this.areaCX, this.areaCY - this.areaH / 2 - 50, '', {
      fontSize: '32px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5)

    this.drawArea()
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => { if (!this.ended) { this.mouseX = p.x; this.mouseY = p.y } })
    this.spawnAllNodes()
    this.updateTimerDisplay()
    EventBus.on('session-start', this.resetSession, this)
    EventBus.emit('current-scene-ready', this)
  }

  update(_time: number, delta: number): void {
    if (this.ended) return
    this.timeLeft -= delta / 1000
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.endSession(); return }
    this.updateGlobalEffects(delta)
    this.updateNodes(delta)
    this.drawCircle()
    this.updateTimerDisplay()
  }

  private updateGlobalEffects(delta: number): void {
    const dt = delta / 1000
    for (let i = this.globalEffects.length - 1; i >= 0; i--) {
      this.globalEffects[i].remaining -= dt
      if (this.globalEffects[i].remaining <= 0) this.globalEffects.splice(i, 1)
    }
  }

  private getMiningRange(): number {
    const store = useGameStore.getState()
    const rangeBonus = (store.upgrades['mining_range'] ?? 0)
    return BASE_RANGE + rangeBonus
  }

  private updateTimerDisplay(): void {
    const secs = Math.ceil(this.timeLeft)
    const color = this.timeLeft <= 5 ? '#ef4444' : this.timeLeft <= 10 ? '#f59e0b' : '#ffffff'
    this.timerText.setText(`${secs}s`)
    this.timerText.setColor(color)
    if (this.timeLeft <= 5) this.timerText.setScale(1 + Math.sin(this.timeLeft * 20) * 0.03)
    else this.timerText.setScale(1)
  }

  private endSession(): void {
    this.ended = true; this.circleGfx.clear()
    EventBus.emit('session-ended')
  }

  private resetSession(): void {
    for (const n of this.nodes) n.sprite.destroy()
    this.nodes = []; this.globalEffects = []
    this.ended = false
    const store = useGameStore.getState()
    this.timeBonus = store.upgrades['time_bonus'] ?? 0
    this.timeLeft = SESSION_DURATION + this.timeBonus
    this.mouseX = 0; this.mouseY = 0
    this.spawnAllNodes(); this.updateTimerDisplay()
  }

  private drawArea(): void {
    const cx = this.areaCX; const cy = this.areaCY
    const hw = this.areaW / 2; const hh = this.areaH / 2
    this.areaGfx.clear()
    this.areaGfx.fillStyle(0x000000, 0.3)
    this.areaGfx.fillRoundedRect(cx - hw + 4, cy - hh + 4, this.areaW, this.areaH, 16)
    this.areaGfx.fillStyle(0x3d6b34, 0.5)
    this.areaGfx.fillRoundedRect(cx - hw, cy - hh, this.areaW, this.areaH, 16)
    this.areaGfx.lineStyle(2, 0x5a4a3a, 0.5)
    this.areaGfx.strokeRoundedRect(cx - hw, cy - hh, this.areaW, this.areaH, 16)
    this.areaGfx.lineStyle(1, 0x6b5b4b, 0.2)
    this.areaGfx.strokeRoundedRect(cx - hw + 3, cy - hh + 3, this.areaW - 6, this.areaH - 6, 14)
  }

  private spawnAllNodes(): void { for (let i = 0; i < MINERAL_COUNT; i++) this.spawnNode() }

  private spawnNode(): MineralNode {
    const store = useGameStore.getState()
    const luckLevel = store.upgrades['luck'] ?? 0
    const prestigeLv = store.prestigeLevel ?? 0
    const voidBonus = store.upgrades['void_spawn'] ?? 0

    let mineral: MineralType
    if (voidBonus > 0 && Math.random() < 0.15) {
      mineral = getMineralById('void') ?? getRandomMineralByWeight(luckLevel, prestigeLv)
    } else {
      mineral = getRandomMineralByWeight(luckLevel, prestigeLv)
    }

    const block = new Block(mineral)
    const pos = this.findSpawnPosition()
    const sprite = this.add.image(pos.x, pos.y, block.textureKey).setOrigin(0.5).setDisplaySize(MINERAL_SIZE, MINERAL_SIZE)
    const node: MineralNode = { block, sprite, x: pos.x, y: pos.y, damageTimer: 0, isTargeted: false, activeEffects: [] }
    this.nodes.push(node)

    this.showSpawnEffect(node)
    return node
  }

  private findSpawnPosition(): { x: number; y: number } {
    const pad = 50; const maxAttempts = 50
    const hw = this.areaW / 2 - pad; const hh = this.areaH / 2 - pad
    const cx = this.areaCX; const cy = this.areaCY
    for (let a = 0; a < maxAttempts; a++) {
      const x = cx - hw + Math.random() * hw * 2; const y = cy - hh + Math.random() * hh * 2
      let valid = true
      for (const node of this.nodes) { if (Math.hypot(node.x - x, node.y - y) < MIN_SPACING) { valid = false; break } }
      if (valid) return { x, y }
    }
    return { x: cx + randInt(-hw, hw), y: cy + randInt(-hh, hh) }
  }

  private updateNodes(delta: number): void {
    const store = useGameStore.getState()
    const baseDamage = Math.max(1, Math.round(store.tool.power))
    const speedLevel = (store.upgrades['speed'] ?? 0) as number
    const interval = getSpeedInterval(speedLevel)
    const dt = delta / 1000
    const range = this.getMiningRange()
    const critChance = store.upgrades['crit_chance'] ?? 0
    const fortuneChance = (store.upgrades['fortune'] ?? 0) * 20
    const efficiency = store.upgrades['efficiency'] ?? 0
    const cosmic = store.upgrades['cosmic_power'] ?? 0
    const cosmicMult = 1 + cosmic * 0.5

    for (const node of this.nodes) {
      const inRange = Math.hypot(node.x - this.mouseX, node.y - this.mouseY) < range
      node.isTargeted = inRange

      if (inRange) {
        node.damageTimer += dt

        while (node.damageTimer >= interval) {
          node.damageTimer -= interval
          let dmg = baseDamage
          const prevStage = node.block.stageIndex

          const obsidianPierce = store.upgrades['obsidian_pierce'] ?? 0
          if (node.block.mineral.tier >= 5) dmg += obsidianPierce

          const hasSunBlessing = this.globalEffects.some((e) => e.type === 'sun_blessing')
          if (hasSunBlessing) dmg += 2

          const hasVoidAura = node.block.effect?.type === 'void_aura'
          if (hasVoidAura) dmg += 1

          dmg = Math.round(dmg * cosmicMult)

          let isCrit = false
          if (critChance > 0 && Math.random() < critChance / 100) {
            dmg = Math.round(dmg * 3)
            isCrit = true
          }

          node.block.takeDamage(dmg)

          if (node.block.stageIndex !== prevStage) node.sprite.setTexture(node.block.textureKey)

          this.showHitEffect(node, isCrit)
          this.showDamageNumber(node.x, node.y - 30, dmg, isCrit)

          if (node.block.isBroken()) {
            const rewards = node.block.breakBlock()
            let totalAmount = 1

            if (efficiency > 0) {
              totalAmount += efficiency
            }

            if (fortuneChance > 0 && Math.random() < fortuneChance / 100) {
              totalAmount *= 2
              this.showFortunePopup(node.x, node.y - 60)
            }

            const mineralEffect = node.block.effect
            if (mineralEffect) this.applyMineralEffect(node, mineralEffect)

            if (rewards) {
              const enriched: Record<string, number> = {}
              for (const [key] of Object.entries(rewards)) {
                enriched[key] = totalAmount
              }
              useGameStore.getState().addResources(enriched)
            }

            this.showBreakEffect(node, isCrit)
            this.respawnNode(node)
            break
          }
        }
      } else {
        node.damageTimer = 0
      }
    }
  }

  private applyMineralEffect(node: MineralNode, effect: MineralEffect): void {
    const store = useGameStore.getState()

    switch (effect.type) {
      case 'explosive': {
        const radiusMult = (store.upgrades['explosion_radius'] ?? 0) * 60
        const radius = effect.radius + radiusMult
        for (const other of this.nodes) {
          if (other === node) continue
          if (Math.hypot(other.x - node.x, other.y - node.y) < radius) {
            other.block.takeDamage(effect.damage)
            this.showHitEffect(other, false)
          }
        }
        this.cameras.main.shake(100, 0.005)
        break
      }
      case 'speed_boost':
        this.globalEffects.push({ type: 'speed_boost', remaining: effect.duration, value: effect.multiplier })
        break
      case 'poison':
        for (const other of this.nodes) {
          if (other === node) continue
          if (Math.hypot(other.x - node.x, other.y - node.y) < 80) {
            other.block.extraDamage += effect.damage
          }
        }
        break
      case 'time_bonus':
        this.timeLeft += effect.seconds
        break
      case 'tidal_wave':
        for (const other of this.nodes) {
          if (other === node) continue
          other.block.takeDamage(effect.damage)
          this.showHitEffect(other, false)
        }
        this.cameras.main.shake(150, 0.008)
        break
      case 'sun_blessing':
        this.globalEffects.push({ type: 'sun_blessing', remaining: effect.duration, value: effect.tickDamage })
        break
      case 'moon_freeze':
        this.timeLeft += effect.seconds
        this.showLargeText('🌙 Tiempo congelado!')
        break
      case 'chain': {
        const bonus = store.upgrades['jade_chain_bonus'] ?? 0
        const finalChance = effect.chance + bonus / 100
        if (Math.random() < finalChance) {
          const targets = this.nodes.filter((n) => n !== node)
          if (targets.length > 0) {
            const target = targets[randInt(0, targets.length - 1)]
            target.block.takeDamage(5)
            this.showHitEffect(target, false)
          }
        }
        break
      }
    }
  }

  private showSpawnEffect(node: MineralNode): void {
    const tier = node.block.mineral.tier
    if (tier >= 6) {
      this.cameras.main.shake(80, 0.003)
      this.showLargeText(`✨ ${node.block.mineral.name} ha aparecido!`)
    } else if (tier >= 4) {
      this.showLargeText(`${node.block.mineral.name}`)
    }
  }

  private showLargeText(text: string): void {
    const txt = this.add.text(this.areaCX, this.areaCY - 40, text, {
      fontSize: '20px', color: '#ffd700', fontStyle: 'bold', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: txt, alpha: 1, y: txt.y - 20, duration: 300, yoyo: true, hold: 800, onComplete: () => txt.destroy() })
  }

  private showFortunePopup(x: number, y: number): void {
    const txt = this.add.text(x, y, '✨ FORTUNA x2!', {
      fontSize: '14px', color: '#ffd700', fontStyle: 'bold', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5)
    this.tweens.add({ targets: txt, y: y - 40, alpha: 0, duration: 800, ease: 'Quad.easeOut', onComplete: () => txt.destroy() })
  }

  private respawnNode(node: MineralNode): void {
    const idx = this.nodes.indexOf(node)
    if (idx === -1) return
    node.sprite.destroy()
    this.nodes.splice(idx, 1)
    this.spawnNode()
  }

  private drawCircle(): void {
    const range = this.getMiningRange()
    this.circleGfx.clear()
    this.circleGfx.fillStyle(0xffffff, 0.04); this.circleGfx.fillCircle(this.mouseX, this.mouseY, range + 12)
    this.circleGfx.fillStyle(0xaaddff, 0.06); this.circleGfx.fillCircle(this.mouseX, this.mouseY, range)
    this.circleGfx.lineStyle(2, 0xffffff, 0.15); this.circleGfx.strokeCircle(this.mouseX, this.mouseY, range)
    this.circleGfx.lineStyle(1, 0xaaddff, 0.1); this.circleGfx.strokeCircle(this.mouseX, this.mouseY, range + 6)
    let targeted = 0
    for (const n of this.nodes) { if (n.isTargeted) targeted++ }
    if (targeted > 0) {
      this.circleGfx.lineStyle(1, 0xffdd88, 0.2); this.circleGfx.strokeCircle(this.mouseX, this.mouseY, range + 3)
      this.circleGfx.fillStyle(0xffdd88, 0.03); this.circleGfx.fillCircle(this.mouseX, this.mouseY, range)
    }
  }

  private showHitEffect(node: MineralNode, isCrit: boolean): void {
    const duration = isCrit ? 60 : 40
    const scaleMult = isCrit ? 0.85 : 0.92
    this.tweens.add({ targets: node.sprite, scaleX: node.sprite.scaleX * scaleMult, scaleY: node.sprite.scaleY * scaleMult, duration, yoyo: true, ease: 'Quad.easeOut' })

    const count = isCrit ? 5 : 2
    const particleColor = isCrit ? 0xff4444 : node.block.color
    for (let i = 0; i < count; i++) {
      const p = this.add.rectangle(node.x + randInt(-10, 10), node.y + randInt(-10, 10), randInt(2, 4), randInt(2, 4), particleColor, 0.6)
      this.tweens.add({ targets: p, x: p.x + randInt(-20, 20), y: p.y + randInt(10, 30), alpha: 0, duration: 250, ease: 'Quad.easeOut', onComplete: () => p.destroy() })
    }
  }

  private showDamageNumber(x: number, y: number, amount: number, isCrit: boolean): void {
    const color = isCrit ? '#ff4444' : '#ffffff'
    const size = isCrit ? '17px' : '13px'
    const prefix = isCrit ? '💥 ' : '-'
    const txt = this.add.text(x + randInt(-8, 8), y, `${prefix}${amount}`, {
      fontSize: size, color, fontStyle: 'bold', stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5)
    this.tweens.add({ targets: txt, y: y - (isCrit ? 45 : 30), alpha: 0, duration: isCrit ? 700 : 500, ease: 'Quad.easeOut', onComplete: () => txt.destroy() })
  }

  private showBreakEffect(node: MineralNode, isCrit: boolean): void {
    const color = isCrit ? 0xffdd44 : node.block.color
    const count = isCrit ? 18 : 10
    const baseShake = isCrit ? 120 : 60
    this.cameras.main.shake(baseShake, isCrit ? 0.008 : 0.004)

    for (let i = 0; i < count; i++) {
      const p = this.add.rectangle(node.x + randInt(-15, 15), node.y + randInt(-15, 15), randInt(4, 10), randInt(4, 10), color)
      this.tweens.add({ targets: p, x: node.x + randInt(-120, 120), y: node.y + randInt(-120, 120), alpha: 0, angle: randInt(-360, 360), duration: 300 + randInt(0, 200), ease: 'Quad.easeOut', onComplete: () => p.destroy() })
    }
  }

  shutdown(): void {
    EventBus.off('session-start', this.resetSession, this)
    for (const n of this.nodes) n.sprite.destroy()
    this.nodes = []; this.globalEffects = []
  }
}
