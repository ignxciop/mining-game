import { Scene, GameObjects } from 'phaser'
import { Block } from '../entities/Block'
import { MINERALS, getRandomMineralByWeight } from '../entities/MineralTypes'
import { useGameStore, getSpeedInterval, SESSION_DURATION } from '../../store/gameStore'
import { EventBus } from '../EventBus'

const MINING_RANGE = 80
const MINERAL_COUNT = 8
const MINERAL_SIZE = 64
const MIN_SPACING = 90

function getAreaDimensions(w: number, h: number): { w: number; h: number } {
    const maxW = Math.min(520, w * 0.85)
    const maxH = Math.min(380, h * 0.55)
    const aspect = 520 / 380
    let aw = maxW
    let ah = maxW / aspect
    if (ah > maxH) { ah = maxH; aw = maxH * aspect }
    return { w: Math.round(aw), h: Math.round(ah) }
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

interface MineralNode {
    block: Block
    sprite: GameObjects.Image
    x: number
    y: number
    damageTimer: number
    isTargeted: boolean
    damageAccum: number
}

function generateGrassTexture(scene: Scene, w: number, h: number): void {
    const key = 'bg_grass'
    if (scene.textures.exists(key)) return

    const gfx = scene.add.graphics()
    gfx.fillStyle(0x4a7c3f, 1)
    gfx.fillRect(0, 0, w, h)
    for (let i = 0; i < 40; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const r = 3 + Math.random() * 8
        gfx.fillStyle(0x3d6b34, 0.3 + Math.random() * 0.2)
        gfx.fillCircle(x, y, r)
    }
    for (let i = 0; i < 14; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        gfx.fillStyle(0x5a4a3a, 0.15 + Math.random() * 0.1)
        gfx.fillEllipse(x, y, 10 + Math.random() * 20, 6 + Math.random() * 8)
    }
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const r = 2 + Math.random() * 4
        gfx.fillStyle(0x6b5b4b, 0.2 + Math.random() * 0.15)
        gfx.fillCircle(x, y, r)
        gfx.fillStyle(0x8b7b6b, 0.15)
        gfx.fillCircle(x - 1, y - 1, r * 0.7)
    }
    gfx.generateTexture(key, w, h)
    gfx.destroy()
}

export class MiningScene extends Scene {
    private nodes: MineralNode[] = []
    private mouseX = 0
    private mouseY = 0
    private circleGfx!: GameObjects.Graphics
    private areaGfx!: GameObjects.Graphics
    private areaCX = 0
    private areaCY = 0
    private areaW = 520
    private areaH = 380
    private timeLeft = SESSION_DURATION
    private timerText!: GameObjects.Text
    private ended = false

    constructor() {
        super('MiningScene')
    }

    preload(): void {
        for (const m of MINERALS) {
            for (const stage of m.stages) {
                this.load.image(stage.textureKey, `assets/ores/${stage.textureKey}.png`)
            }
        }
    }

    create(): void {
        this.ended = false
        this.timeLeft = SESSION_DURATION
        this.nodes = []

        this.areaCX = this.scale.width / 2
        this.areaCY = this.scale.height / 2

        const dims = getAreaDimensions(this.scale.width, this.scale.height)
        this.areaW = dims.w
        this.areaH = dims.h

        generateGrassTexture(this, this.areaW, this.areaH)

        this.areaGfx = this.add.graphics()
        this.circleGfx = this.add.graphics()

        this.timerText = this.add.text(this.areaCX, this.areaCY - this.areaH / 2 - 50, '', {
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5)

        this.drawArea()

        this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
            if (!this.ended) {
                this.mouseX = p.x
                this.mouseY = p.y
            }
        })

        this.spawnAllNodes()
        this.updateTimerDisplay()

        EventBus.on('session-start', this.resetSession, this)
        EventBus.emit('current-scene-ready', this)
    }

    update(_time: number, delta: number): void {
        if (this.ended) return

        this.timeLeft -= delta / 1000
        if (this.timeLeft <= 0) {
            this.timeLeft = 0
            this.endSession()
            return
        }

        this.updateNodes(delta)
        this.drawCircle()
        this.updateTimerDisplay()
    }

    private updateTimerDisplay(): void {
        const secs = Math.ceil(this.timeLeft)
        const color = this.timeLeft <= 5 ? '#ef4444' : this.timeLeft <= 10 ? '#f59e0b' : '#ffffff'
        this.timerText.setText(`${secs}s`)
        this.timerText.setColor(color)

        if (this.timeLeft <= 5) {
            this.timerText.setScale(1 + (Math.sin(this.timeLeft * 20) * 0.03))
        } else {
            this.timerText.setScale(1)
        }
    }

    private endSession(): void {
        this.ended = true
        this.circleGfx.clear()

        EventBus.emit('session-ended')
    }

    private resetSession(): void {
        for (const node of this.nodes) {
            node.sprite.destroy()
        }
        this.nodes = []
        this.ended = false
        this.timeLeft = SESSION_DURATION
        this.mouseX = 0
        this.mouseY = 0
        this.spawnAllNodes()
        this.updateTimerDisplay()
    }

    private drawArea(): void {
        const cx = this.areaCX
        const cy = this.areaCY
        const hw = this.areaW / 2
        const hh = this.areaH / 2

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

    private spawnAllNodes(): void {
        for (let i = 0; i < MINERAL_COUNT; i++) this.spawnNode()
    }

    private spawnNode(): MineralNode {
        const store = useGameStore.getState()
        const luckLevel = store.upgrades['luck'] ?? 0
        const mineral = getRandomMineralByWeight(luckLevel)
        const block = new Block(mineral)
        const pos = this.findSpawnPosition()
        const sprite = this.add.image(pos.x, pos.y, block.textureKey)
            .setOrigin(0.5)
            .setDisplaySize(MINERAL_SIZE, MINERAL_SIZE)

        const node: MineralNode = { block, sprite, x: pos.x, y: pos.y, damageTimer: 0, isTargeted: false, damageAccum: 0 }
        this.nodes.push(node)
        return node
    }

    private findSpawnPosition(): { x: number; y: number } {
        const pad = 50
        const maxAttempts = 50
        const hw = this.areaW / 2 - pad
        const hh = this.areaH / 2 - pad
        const cx = this.areaCX
        const cy = this.areaCY

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const x = cx - hw + Math.random() * hw * 2
            const y = cy - hh + Math.random() * hh * 2
            let valid = true
            for (const node of this.nodes) {
                const dx = node.x - x
                const dy = node.y - y
                if (Math.sqrt(dx * dx + dy * dy) < MIN_SPACING) { valid = false; break }
            }
            if (valid) return { x, y }
        }
        return { x: cx + randInt(-hw, hw), y: cy + randInt(-hh, hh) }
    }

    private updateNodes(delta: number): void {
        const store = useGameStore.getState()
        const dps = store.tool.power
        const speedLevel = store.upgrades['speed'] ?? 0
        const interval = getSpeedInterval(speedLevel)
        const dt = delta / 1000

        for (const node of this.nodes) {
            const dx = node.x - this.mouseX
            const dy = node.y - this.mouseY
            const dist = Math.sqrt(dx * dx + dy * dy)
            const inRange = dist < MINING_RANGE
            node.isTargeted = inRange

            if (inRange) {
                node.damageTimer += dt
                node.damageAccum += dps * dt

                while (node.damageTimer >= interval) {
                    node.damageTimer -= interval
                    const prevStage = node.block.stageIndex
                    const dmg = Math.floor(node.damageAccum)
                    if (dmg < 1) break
                    node.damageAccum -= dmg
                    node.block.takeDamage(dmg)
                    if (node.block.stageIndex !== prevStage) node.sprite.setTexture(node.block.textureKey)
                    this.showHitEffect(node)
                    this.showDamageNumber(node.x, node.y - 30, dmg)
                    if (node.block.isBroken()) {
                        const rewards = node.block.breakBlock()
                        if (rewards) { const s = useGameStore.getState(); s.addResources(rewards) }
                        this.showBreakEffect(node)
                        this.respawnNode(node)
                        break
                    }
                }
            } else {
                node.damageTimer = 0
                node.damageAccum = 0
            }
        }
    }

    private respawnNode(node: MineralNode): void {
        const idx = this.nodes.indexOf(node)
        if (idx === -1) return
        node.sprite.destroy()
        this.nodes.splice(idx, 1)
        this.spawnNode()
    }

    private drawCircle(): void {
        this.circleGfx.clear()
        this.circleGfx.fillStyle(0xffffff, 0.04)
        this.circleGfx.fillCircle(this.mouseX, this.mouseY, MINING_RANGE + 12)
        this.circleGfx.fillStyle(0xaaddff, 0.06)
        this.circleGfx.fillCircle(this.mouseX, this.mouseY, MINING_RANGE)
        this.circleGfx.lineStyle(2, 0xffffff, 0.15)
        this.circleGfx.strokeCircle(this.mouseX, this.mouseY, MINING_RANGE)
        this.circleGfx.lineStyle(1, 0xaaddff, 0.1)
        this.circleGfx.strokeCircle(this.mouseX, this.mouseY, MINING_RANGE + 6)

        let targeted = 0
        for (const node of this.nodes) { if (node.isTargeted) targeted++ }
        if (targeted > 0) {
            this.circleGfx.lineStyle(1, 0xffdd88, 0.2)
            this.circleGfx.strokeCircle(this.mouseX, this.mouseY, MINING_RANGE + 3)
            this.circleGfx.fillStyle(0xffdd88, 0.03)
            this.circleGfx.fillCircle(this.mouseX, this.mouseY, MINING_RANGE)
        }
    }

    private showHitEffect(node: MineralNode): void {
        this.tweens.add({ targets: node.sprite, scaleX: node.sprite.scaleX * 0.92, scaleY: node.sprite.scaleY * 0.92, duration: 40, yoyo: true, ease: 'Quad.easeOut' })
        for (let i = 0; i < 2; i++) {
            const p = this.add.rectangle(node.x + randInt(-10, 10), node.y + randInt(-10, 10), randInt(2, 4), randInt(2, 4), node.block.color, 0.5)
            this.tweens.add({ targets: p, x: p.x + randInt(-20, 20), y: p.y + randInt(10, 30), alpha: 0, duration: 200, ease: 'Quad.easeOut', onComplete: () => p.destroy() })
        }
    }

    private showDamageNumber(x: number, y: number, amount: number): void {
        const display = amount < 1 ? amount.toFixed(1) : Math.round(amount).toString()
        const txt = this.add.text(x + randInt(-8, 8), y, `-${display}`, { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5)
        this.tweens.add({ targets: txt, y: y - 30, alpha: 0, duration: 500, ease: 'Quad.easeOut', onComplete: () => txt.destroy() })
    }

    private showBreakEffect(node: MineralNode): void {
        const color = node.block.color
        for (let i = 0; i < 10; i++) {
            const p = this.add.rectangle(node.x + randInt(-15, 15), node.y + randInt(-15, 15), randInt(4, 10), randInt(4, 10), color)
            this.tweens.add({ targets: p, x: node.x + randInt(-100, 100), y: node.y + randInt(-100, 100), alpha: 0, angle: randInt(-360, 360), duration: 300 + randInt(0, 200), ease: 'Quad.easeOut', onComplete: () => p.destroy() })
        }
    }

    shutdown(): void {
        EventBus.off('session-start', this.resetSession, this)
        for (const node of this.nodes) node.sprite.destroy()
        this.nodes = []
    }
}
