import Phaser from 'phaser'
import { MiningSystem } from '../systems/MiningSystem'
import { useGameStore } from '../../store/gameStore'

export class MiningScene extends Phaser.Scene {
    private miningSystem!: MiningSystem
    private blockGfx!: Phaser.GameObjects.Graphics
    private hpBarGfx!: Phaser.GameObjects.Graphics
    private blockZone!: Phaser.GameObjects.Zone
    private infoText!: Phaser.GameObjects.Text
    private autoMineTimer!: Phaser.Time.TimerEvent
    private readonly blockSize = 140

    constructor() {
        super('MiningScene')
    }

    create(): void {
        this.miningSystem = new MiningSystem()

        this.blockGfx = this.add.graphics()
        this.hpBarGfx = this.add.graphics()

        const cx = this.scale.width / 2
        const cy = this.scale.height / 2

        this.blockZone = this.add.zone(cx, cy, this.blockSize, this.blockSize)
            .setInteractive({ useHandCursor: true })

        this.blockZone.on('pointerdown', () => this.onMine())

        this.infoText = this.add.text(cx, cy + this.blockSize / 2 + 40, '¡Haz clic para minar!', {
            fontSize: '16px',
            color: '#94a3b8',
        }).setOrigin(0.5)

        this.drawBlock()

        this.autoMineTimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const store = useGameStore.getState()
                const autoLevel = store.upgrades['auto_miner'] ?? 0
                if (autoLevel > 0) {
                    const autoDamage = Math.max(1, Math.floor(autoLevel * 0.5))
                    this.applyDamage(autoDamage)
                }
            },
        })
    }

    shutdown(): void {
        if (this.autoMineTimer) this.autoMineTimer.destroy()
    }

    private onMine(): void {
        const store = useGameStore.getState()
        store.clickMine()
        const pickaxeLevel = store.upgrades['pickaxe_power'] ?? 0
        const damage = 1 + pickaxeLevel
        this.applyDamage(damage)
    }

    private applyDamage(damage: number): void {
        const brokenColor = this.miningSystem.currentBlock.color
        const result = this.miningSystem.mine(damage)

        this.showDamageText(result.damage)

        if (result.broken && result.rewards) {
            const store = useGameStore.getState()
            store.addResources(result.rewards)
            this.showBreakParticles(brokenColor)
        }

        this.drawBlock()
    }

    private drawBlock(): void {
        const cx = this.scale.width / 2
        const cy = this.scale.height / 2
        const block = this.miningSystem.currentBlock
        const hpPct = Math.max(0, block.hp / block.maxHp)
        const s = this.blockSize

        this.blockGfx.clear()
        this.blockGfx.fillStyle(block.color, 1)
        this.blockGfx.fillRoundedRect(cx - s / 2, cy - s / 2, s, s, 12)
        this.blockGfx.lineStyle(3, 0xffffff, 0.25)
        this.blockGfx.strokeRoundedRect(cx - s / 2, cy - s / 2, s, s, 12)

        this.hpBarGfx.clear()
        const barY = cy + s / 2 + 14
        this.hpBarGfx.fillStyle(0x1a1a1a, 0.9)
        this.hpBarGfx.fillRoundedRect(cx - 70, barY, 140, 14, 4)

        const barColor = hpPct > 0.5 ? 0x22c55e : hpPct > 0.25 ? 0xf59e0b : 0xef4444
        this.hpBarGfx.fillStyle(barColor, 1)
        if (hpPct > 0) {
            this.hpBarGfx.fillRoundedRect(cx - 70, barY, 140 * hpPct, 14, 4)
        }

        const hpText = `${block.hp} / ${block.maxHp}`
        if (!this.infoText.text.includes('HP') || this.infoText.text !== hpText) {
            this.infoText.setText(hpText)
        }
        this.infoText.setPosition(cx, barY + 30)
    }

    private showDamageText(amount: number): void {
        const cx = this.scale.width / 2
        const cy = this.scale.height / 2
        const txt = this.add.text(
            cx + Phaser.Math.Between(-30, 30),
            cy - this.blockSize / 2 - 10,
            `-${amount}`,
            { fontSize: '22px', color: '#ef4444', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 }
        ).setOrigin(0.5)

        this.tweens.add({
            targets: txt,
            y: txt.y - 50,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => txt.destroy(),
        })
    }

    private showBreakParticles(color: number): void {
        const cx = this.scale.width / 2
        const cy = this.scale.height / 2
        for (let i = 0; i < 16; i++) {
            const p = this.add.rectangle(
                cx + Phaser.Math.Between(-20, 20),
                cy + Phaser.Math.Between(-20, 20),
                Phaser.Math.Between(4, 8),
                Phaser.Math.Between(4, 8),
                color
            )
            this.tweens.add({
                targets: p,
                x: cx + Phaser.Math.Between(-120, 120),
                y: cy + Phaser.Math.Between(-120, 120),
                alpha: 0,
                angle: Phaser.Math.Between(-360, 360),
                duration: 500,
                ease: 'Power3',
                onComplete: () => p.destroy(),
            })
        }

        const gem = this.add.text(cx, cy, '💎', { fontSize: '32px' }).setOrigin(0.5)
        this.tweens.add({
            targets: gem,
            y: gem.y - 60,
            alpha: 0,
            scale: 2,
            duration: 700,
            ease: 'Back.easeIn',
            onComplete: () => gem.destroy(),
        })
    }
}
