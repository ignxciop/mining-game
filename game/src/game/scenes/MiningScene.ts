import { Scene, GameObjects } from 'phaser'
import { Block } from '../entities/Block'
import {
  MINERALS, getRandomMineralByWeight, getMineralById,
  MineralEffect, MineralType, MineralId,
} from '../entities/MineralTypes'
import {
  useGameStore, getSpeedInterval,
  getFortuneChance, getTripleDropChance, getDropMultiplier, SESSION_DURATION,
} from '../../store/gameStore'
import { EventBus } from '../EventBus'

const IS_MOBILE = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
const BASE_RANGE = IS_MOBILE ? 55 : 80
const MINERAL_COUNT = IS_MOBILE ? 5 : 8
const MINERAL_SIZE = IS_MOBILE ? 52 : 64
const MIN_SPACING = IS_MOBILE ? Math.max(Math.round((typeof window !== 'undefined' ? window.innerWidth : 375) * 0.22), 80) : 90
const COMBO_WINDOW = 1.5
const RAGE_THRESHOLD = 10
const MAX_PARTICLES = 20

function getAreaDimensions(w: number, h: number) {
  if (IS_MOBILE) {
    const mw = Math.min(420, w * 0.92); const mh = Math.min(500, h * 0.62)
    return { w: Math.round(mw), h: Math.round(mh) }
  }
  const maxW = Math.min(520, w * 0.85); const maxH = Math.min(380, h * 0.55)
  const aspect = 520 / 380; let aw = maxW; let ah = maxW / aspect
  if (ah > maxH) { ah = maxH; aw = maxH * aspect }
  return { w: Math.round(aw), h: Math.round(ah) }
}

function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }

interface MineralNode {
  block: Block; sprite: GameObjects.Image; x: number; y: number
  damageTimer: number; isTargeted: boolean
  activeEffects: ActiveEffect[]
  isVein: boolean
}

interface ActiveEffect { type: string; remaining: number; value: number }

function generateGrassTexture(scene: Scene, w: number, h: number): void {
  const key = 'bg_grass'
  if (scene.textures.exists(key)) return
  const gfx = scene.add.graphics()
  gfx.fillStyle(0x4a7c3f, 1); gfx.fillRect(0, 0, w, h)
  for (let i = 0; i < 40; i++) { gfx.fillStyle(0x3d6b34, 0.3 + Math.random() * 0.2); gfx.fillCircle(Math.random() * w, Math.random() * h, 3 + Math.random() * 8) }
  for (let i = 0; i < 14; i++) { gfx.fillStyle(0x5a4a3a, 0.15 + Math.random() * 0.1); gfx.fillEllipse(Math.random() * w, Math.random() * h, 10 + Math.random() * 20, 6 + Math.random() * 8) }
  for (let i = 0; i < 8; i++) { const x = Math.random() * w; const y = Math.random() * h; const r = 2 + Math.random() * 4; gfx.fillStyle(0x6b5b4b, 0.2 + Math.random() * 0.15); gfx.fillCircle(x, y, r); gfx.fillStyle(0x8b7b6b, 0.15); gfx.fillCircle(x - 1, y - 1, r * 0.7) }
  gfx.generateTexture(key, w, h); gfx.destroy()
}

export class MiningScene extends Scene {
  private nodes: MineralNode[] = []
  private mouseX = 0; private mouseY = 0
  private circleGfx!: GameObjects.Graphics
  private areaGfx!: GameObjects.Graphics
  private areaCX = 0; private areaCY = 0
  private areaW = 520; private areaH = 380
  private timeLeft = SESSION_DURATION; private timerText!: GameObjects.Text
  private ended = false
  private globalEffects: ActiveEffect[] = []
  private timeBonus = 0
  private eventTimer = 0
  private autoTimer = 0
  private comboIdleTimer = 0
  private rageActive = false
  private rageFlash!: GameObjects.Graphics
  private particleCount = 0
  private damageTextPool: GameObjects.Text[] = []

  constructor() { super('MiningScene') }

  preload(): void {
    for (const m of MINERALS)
      for (const stage of m.stages)
        this.load.image(stage.textureKey, `assets/ores/${stage.textureKey}.png`)
  }

  create(): void {
    this.ended = false; this.timeLeft = SESSION_DURATION; this.nodes = []; this.rageActive = false; this.comboIdleTimer = 0; this.eventTimer = 0; this.autoTimer = 0; this.globalEffects = []
    this.areaCX = this.scale.width / 2; this.areaCY = this.scale.height / 2
    const dims = getAreaDimensions(this.scale.width, this.scale.height)
    this.areaW = dims.w; this.areaH = dims.h
    generateGrassTexture(this, this.areaW, this.areaH)

    const store = useGameStore.getState()
    this.timeBonus = store.upgrades['time_bonus'] ?? 0
    this.timeLeft = SESSION_DURATION + this.timeBonus

    this.areaGfx = this.add.graphics(); this.circleGfx = this.add.graphics()
    this.rageFlash = this.add.graphics().setAlpha(0).setDepth(100)
    this.particleCount = 0
    this.damageTextPool = []
    this.timerText = this.add.text(this.areaCX, this.areaCY - this.areaH / 2 - 50, '', {
      fontSize: '32px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5)
    this.drawArea()
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => { if (!this.ended) { this.mouseX = p.x; this.mouseY = p.y } })
    this.spawnAllNodes()
    this.updateTimerDisplay()
    EventBus.on('session-start', this.clearSession, this)
    EventBus.emit('current-scene-ready', this)
  }

  update(_time: number, delta: number): void {
    if (this.ended) return
    this.timeLeft -= delta / 1000
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.endSession(); return }
    this.comboIdleTimer += delta / 1000
    if (this.comboIdleTimer > COMBO_WINDOW) {
      const store = useGameStore.getState()
      if (store.combo > 0) { store.resetCombo(); this.rageActive = false }
    }
    this.updateGlobalEffects(delta)
    this.eventTimer += delta / 1000
    if (this.eventTimer > 10) { this.eventTimer = 0; this.trySpawnEvent() }
    this.updateNodes(delta)
    this.updateAutoExcavator(delta)
    this.drawCircle()
    this.updateTimerDisplay()
    this.updateRageFlash()
  }

  private updateRageFlash(): void {
    this.rageFlash.clear()
    if (this.rageActive) {
      this.rageFlash.fillStyle(0xff0000, 0.06 + Math.sin(Date.now() * 0.005) * 0.03)
      this.rageFlash.fillRect(0, 0, this.scale.width, this.scale.height)
    }
  }

  private updateAutoExcavator(delta: number): void {
    const store = useGameStore.getState()
    if ((store.upgrades['auto_excavator'] ?? 0) <= 0) return
    this.autoTimer += delta / 1000
    if (this.autoTimer >= 3) {
      this.autoTimer = 0
      const alive = this.nodes.filter((n) => !n.block.isBroken())
      if (alive.length > 0) { const t = alive[randInt(0, alive.length - 1)]; t.block.takeDamage(3); this.showHitEffect(t, false) }
    }
  }

  private trySpawnEvent(): void {
    const store = useGameStore.getState()
    const rate = (store.upgrades['rare_event_rate'] ?? 0) > 0 ? 0.2 : 0.05
    if (Math.random() > rate) return
    const events = ['golden_vein', 'meteor', 'time_fracture']
    const chosen = events[randInt(0, events.length - 1)]
    if (chosen === 'golden_vein') {
      this.showLargeText('🌟 Veta Dorada!')
      const store = useGameStore.getState(); store.addResources({ emerald: 2, sapphire: 1 })
    } else if (chosen === 'meteor') {
      this.showLargeText('☄️ Meteorito!'); this.cameras.main.shake(200, 0.012)
      for (const node of this.nodes) { node.block.takeDamage(10); this.showHitEffect(node, false) }
    } else if (chosen === 'time_fracture') {
      this.timeLeft += 5; this.showLargeText('⏳ +5s!')
    }
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
    let range = BASE_RANGE + (store.upgrades['mining_range'] ?? 0)
    if (this.globalEffects.some((e) => e.type === 'frenzy')) range *= 2
    return range
  }

  private updateTimerDisplay(): void {
    const secs = Math.ceil(this.timeLeft)
    const color = this.timeLeft <= 5 ? '#ef4444' : this.timeLeft <= 10 ? '#f59e0b' : '#ffffff'
    this.timerText.setText(`${secs}s`); this.timerText.setColor(color)
    if (this.timeLeft <= 5) this.timerText.setScale(1 + Math.sin(this.timeLeft * 20) * 0.03)
    else this.timerText.setScale(1)
  }

  private endSession(): void { this.ended = true; this.circleGfx.clear(); EventBus.emit('session-ended') }

  private clearSession(): void {
    for (const n of this.nodes) n.sprite.destroy()
    this.nodes = []; this.globalEffects = []; this.eventTimer = 0; this.autoTimer = 0; this.comboIdleTimer = 0; this.rageActive = false; this.particleCount = 0
    this.ended = false
    const store = useGameStore.getState()
    store.resetCombo()
    this.timeBonus = store.upgrades['time_bonus'] ?? 0
    this.timeLeft = SESSION_DURATION + this.timeBonus
    this.mouseX = 0; this.mouseY = 0
    this.spawnAllNodes(); this.updateTimerDisplay()
  }

  private drawArea(): void {
    const cx = this.areaCX; const cy = this.areaCY
    const hw = this.areaW / 2; const hh = this.areaH / 2
    this.areaGfx.clear()
    this.areaGfx.fillStyle(0x000000, 0.3); this.areaGfx.fillRoundedRect(cx - hw + 4, cy - hh + 4, this.areaW, this.areaH, 16)
    this.areaGfx.fillStyle(0x3d6b34, 0.5); this.areaGfx.fillRoundedRect(cx - hw, cy - hh, this.areaW, this.areaH, 16)
    this.areaGfx.lineStyle(2, 0x5a4a3a, 0.5); this.areaGfx.strokeRoundedRect(cx - hw, cy - hh, this.areaW, this.areaH, 16)
    this.areaGfx.lineStyle(1, 0x6b5b4b, 0.2); this.areaGfx.strokeRoundedRect(cx - hw + 3, cy - hh + 3, this.areaW - 6, this.areaH - 6, 14)
  }

  private spawnAllNodes(): void { for (let i = 0; i < MINERAL_COUNT; i++) this.spawnNode() }

  private spawnNode(): MineralNode {
    const store = useGameStore.getState()
    const luckLevel = store.upgrades['luck'] ?? 0
    const prestigeLv = store.prestigeLevel ?? 0
    const allowed = store.unlockedMinerals.length > 0 ? store.unlockedMinerals : ['clay', 'shale'] as MineralId[]

    let mineral: MineralType
    const voidBonus = store.upgrades['void_spawn'] ?? 0
    if (voidBonus > 0 && Math.random() < 0.15 && allowed.includes('void')) {
      mineral = getMineralById('void') ?? getRandomMineralByWeight(luckLevel, prestigeLv, allowed)
    } else {
      mineral = getRandomMineralByWeight(luckLevel, prestigeLv, allowed)
    }

    const block = new Block(mineral)
    const pos = this.findSpawnPosition()
    const sprite = this.add.image(pos.x, pos.y, block.textureKey).setOrigin(0.5).setDisplaySize(MINERAL_SIZE, MINERAL_SIZE)
    const node: MineralNode = { block, sprite, x: pos.x, y: pos.y, damageTimer: 0, isTargeted: false, activeEffects: [], isVein: false }
    this.nodes.push(node)

    // Vein chance (5%)
    if (Math.random() < 0.05 && this.nodes.length < 12) {
      node.isVein = true
      const veinCount = randInt(2, 4)
      for (let v = 0; v < veinCount; v++) {
        const vx = pos.x + randInt(-40, 40); const vy = pos.y + randInt(-40, 40)
        if (vx < 50 || vx > this.scale.width - 50 || vy < 50 || vy > this.scale.height - 50) continue
        const vBlock = new Block(mineral)
        const vSprite = this.add.image(vx, vy, vBlock.textureKey).setOrigin(0.5).setDisplaySize(MINERAL_SIZE - 8, MINERAL_SIZE - 8)
        this.nodes.push({ block: vBlock, sprite: vSprite, x: vx, y: vy, damageTimer: 0, isTargeted: false, activeEffects: [], isVein: true })
      }
    }

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
    const dt = delta / 1000; const range = this.getMiningRange()
    const critLevel = store.upgrades['crit_chance'] ?? 0
    const critDmgLevel = store.upgrades['crit_damage'] ?? 0
    const fortuneLevel = store.upgrades['fortune'] ?? 0
    const efficiencyLevel = store.upgrades['efficiency'] ?? 0
    const cosmic = store.upgrades['cosmic_power'] ?? 0
    const voidPact = store.upgrades['void_pact'] ?? 0
    const sunPact = store.upgrades['sun_pact'] ?? 0
    const combo = store.combo ?? 0
    const cosmicMult = 1 + cosmic * 1.0

    let dmgMult = 1
    if (voidPact > 0) dmgMult += 0.5
    if (sunPact > 0) dmgMult -= 0.2
    if (this.rageActive) dmgMult *= 2
    const comboMult = 1 + combo * 0.05

    for (const node of this.nodes) {
      const inRange = Math.hypot(node.x - this.mouseX, node.y - this.mouseY) < range
      node.isTargeted = inRange

      if (inRange) {
        node.damageTimer += dt
        while (node.damageTimer >= interval) {
          node.damageTimer -= interval
          let dmg = baseDamage
          const prevStage = node.block.stageIndex

          dmg = Math.round(dmg * dmgMult * cosmicMult * comboMult)

          const frenzyActive = this.globalEffects.some((e) => e.type === 'frenzy')
          if (frenzyActive) dmg = Math.round(dmg * 2)
          const radiation = this.globalEffects.filter((e) => e.type === 'radioactive').length
          if (radiation > 0) dmg += 2 * radiation

          let isCrit = false; let isSuperCrit = false
          if (critLevel > 0 && Math.random() < critLevel / 100) {
            const critMult = 2 + 0.5 * critDmgLevel
            dmg = Math.round(dmg * critMult); isCrit = true
            if (Math.random() < 0.05) { dmg = Math.round(dmg * 3); isSuperCrit = true }
          }

          node.block.takeDamage(dmg)
          if (node.block.stageIndex !== prevStage) node.sprite.setTexture(node.block.textureKey)
          this.showHitEffect(node, isCrit || isSuperCrit)
          if (isSuperCrit) { this.showLargeText('💥 SUPER CRÍTICO!'); this.cameras.main.shake(150, 0.01) }

          this.showDamageNumber(node.x, node.y - 30, dmg, isCrit || isSuperCrit)

          if (node.block.isBroken()) {
            const rewards = node.block.breakBlock()
            let totalAmount = 1
            totalAmount = Math.round(totalAmount * getDropMultiplier(efficiencyLevel))
            if (fortuneLevel > 0 && Math.random() < getFortuneChance(fortuneLevel) / 100) { totalAmount *= 2; this.showFortunePopup(node.x, node.y - 60, 'x2') }
            if (fortuneLevel >= 3 && Math.random() < getTripleDropChance(fortuneLevel) / 100) { totalAmount *= 3; this.showFortunePopup(node.x, node.y - 60, '💎 JACKPOT x3!') }

            const mineralEffect = node.block.effect
            if (mineralEffect) this.applyMineralEffect(node, mineralEffect)

            if (rewards) {
              const enriched: Record<string, number> = {}
              for (const [key] of Object.entries(rewards)) enriched[key] = totalAmount
              useGameStore.getState().addResources(enriched)
            }

            // Combo
            const s = useGameStore.getState()
            s.incrementCombo()
            this.comboIdleTimer = 0
            if ((s.combo ?? 0) >= RAGE_THRESHOLD) this.rageActive = true

            this.showBreakEffect(node, isCrit || isSuperCrit)
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
    const cosmic = store.upgrades['cosmic_power'] ?? 0
    const cosmicMult = 1 + cosmic * 1.0

    switch (effect.type) {
      case 'explosive': {
        const radius = effect.radius + (store.upgrades['explosion_radius'] ?? 0) * 60
        for (const other of this.nodes) { if (other === node) continue; if (Math.hypot(other.x - node.x, other.y - node.y) < radius) { other.block.takeDamage(effect.damage); this.showHitEffect(other, false) } }
        this.cameras.main.shake(100, 0.005); break
      }
      case 'speed_boost': this.globalEffects.push({ type: 'speed_boost', remaining: effect.duration, value: effect.multiplier }); break
      case 'time_bonus': this.timeLeft += effect.seconds; break
      case 'tidal_wave': for (const other of this.nodes) { if (other === node) continue; other.block.takeDamage(Math.round(effect.damage * cosmicMult)); this.showHitEffect(other, false) }; this.cameras.main.shake(150, 0.008); break
      case 'sun_blessing': this.globalEffects.push({ type: 'sun_blessing', remaining: effect.duration, value: effect.tickDamage }); break
      case 'moon_freeze': this.timeLeft += effect.seconds; this.showLargeText('🌙 Tiempo congelado!'); break
      case 'chain': {
        const bonus = store.upgrades['jade_chain_bonus'] ?? 0
        if (Math.random() < effect.chance + bonus / 100) {
          const targets = this.nodes.filter((n) => n !== node)
          if (targets.length > 0) { const t = targets[randInt(0, targets.length - 1)]; t.block.takeDamage(5); this.showHitEffect(t, false) }
        }; break
      }
      case 'jackpot': this.showLargeText('💰 JACKPOT!'); this.cameras.main.shake(200, 0.015); break
      case 'frenzy': this.globalEffects.push({ type: 'frenzy', remaining: effect.duration, value: 0 }); this.showLargeText('⚡ FRENESÍ!'); break
      case 'radioactive': this.globalEffects.push({ type: 'radioactive', remaining: effect.duration, value: effect.damage }); this.showLargeText('☢️ RADIACTIVO!'); break
      case 'ghost': {
        const newX = this.areaCX + randInt(-this.areaW / 2 + 30, this.areaW / 2 - 30)
        const newY = this.areaCY + randInt(-this.areaH / 2 + 30, this.areaH / 2 - 30)
        node.sprite.setPosition(newX, newY); node.x = newX; node.y = newY; break
      }
      case 'corrupt': {
        this.showLargeText('👹 CORRUPTO!')
        const extraDrops: Record<string, number> = {}
        for (const key of Object.keys(node.block.breakBlock() ?? {})) extraDrops[key] = Math.round(effect.rewardMult * 2)
        if (Object.keys(extraDrops).length > 0) {
          useGameStore.getState().addResources(extraDrops)
        }
        break
      }
    }
  }

  private showSpawnEffect(node: MineralNode): void {
    const tier = node.block.mineral.tier
    if (tier >= 6) { this.cameras.main.shake(80, 0.003); this.showLargeText(`✨ ${node.block.mineral.name}!`) }
  }

  private showLargeText(text: string): void {
    const txt = this.add.text(this.areaCX, this.areaCY - 40, text, { fontSize: '20px', color: '#ffd700', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: txt, alpha: 1, y: txt.y - 20, duration: 300, yoyo: true, hold: 800, onComplete: () => txt.destroy() })
  }

  private showFortunePopup(x: number, y: number, text: string): void {
    const txt = this.add.text(x, y, text, { fontSize: '14px', color: '#ffd700', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5)
    this.tweens.add({ targets: txt, y: y - 40, alpha: 0, duration: 800, ease: 'Quad.easeOut', onComplete: () => txt.destroy() })
  }

  private respawnNode(node: MineralNode): void {
    const idx = this.nodes.indexOf(node); if (idx === -1) return
    node.sprite.destroy(); this.nodes.splice(idx, 1); this.spawnNode()
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
    if (targeted > 0 || this.rageActive) {
      const glowColor = this.rageActive ? 0xff4444 : 0xffdd88
      this.circleGfx.lineStyle(1, glowColor, 0.2); this.circleGfx.strokeCircle(this.mouseX, this.mouseY, range + 3)
      this.circleGfx.fillStyle(glowColor, 0.03); this.circleGfx.fillCircle(this.mouseX, this.mouseY, range)
    }
  }

  private spawnParticle(x: number, y: number, color: number, isCrit: boolean): void {
    if (this.particleCount >= MAX_PARTICLES) return
    this.particleCount++
    const size = isCrit ? randInt(3, 6) : randInt(2, 4)
    const p = this.add.rectangle(x + randInt(-12, 12), y + randInt(-12, 12), size, size, color, 0.7)
    this.tweens.add({
      targets: p, x: p.x + randInt(-25, 25), y: p.y + randInt(15, 35),
      alpha: 0, duration: isCrit ? 300 : 200,
      onComplete: () => { p.destroy(); this.particleCount = Math.max(0, this.particleCount - 1) },
    })
  }

  private showHitEffect(node: MineralNode, isCrit: boolean): void {
    const dur = isCrit ? 60 : 40; const scaleM = isCrit ? 0.85 : 0.92
    this.tweens.add({ targets: node.sprite, scaleX: node.sprite.scaleX * scaleM, scaleY: node.sprite.scaleY * scaleM, duration: dur, yoyo: true })
    const count = isCrit ? 4 : 2; const color = isCrit ? 0xff4444 : node.block.color
    for (let i = 0; i < count; i++) this.spawnParticle(node.x, node.y, color, isCrit)
  }

  private showDamageNumber(x: number, y: number, amount: number, isCrit: boolean): void {
    const color = isCrit ? '#ff4444' : '#ffffff'; const size = isCrit ? '18px' : '13px'; const prefix = isCrit ? '💥 ' : ''

    const recycled = this.damageTextPool.find((t) => t.alpha === 0)
    const txt = recycled ?? this.add.text(0, 0, '', { fontSize: size, color, fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5)
    if (!recycled) this.damageTextPool.push(txt)

    txt.setPosition(x + randInt(-8, 8), y)
    txt.setText(`${prefix}${Math.round(amount)}`)
    txt.setFontSize(isCrit ? 18 : 13)
    txt.setColor(color)
    txt.setAlpha(1)

    this.tweens.add({ targets: txt, y: y - (isCrit ? 50 : 30), alpha: 0, duration: isCrit ? 700 : 500 })
  }

  private showBreakEffect(node: MineralNode, isCrit: boolean): void {
    const color = isCrit ? 0xffdd44 : node.block.color
    const count = isCrit ? 10 : 5
    const shake = isCrit ? 150 : 60
    this.cameras.main.shake(shake, isCrit ? 0.01 : 0.004)
    for (let i = 0; i < count; i++) this.spawnParticle(node.x, node.y, color, isCrit)
  }

  shutdown(): void {
    EventBus.off('session-start', this.clearSession, this)
    for (const n of this.nodes) n.sprite.destroy()
    this.nodes = []; this.globalEffects = []
  }
}
