import { AUTO, Game, Scale } from 'phaser'
import { MiningScene } from './scenes/MiningScene'

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#3d6b34',
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
    },
    scene: [MiningScene],
}

const StartGame = (parent: string) => {
    return new Game({ ...config, parent })
}

export default StartGame
