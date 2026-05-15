import { Boot } from './scenes/Boot'
import { Preloader } from './scenes/Preloader'
import { MiningScene } from './scenes/MiningScene'
import { AUTO, Game } from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#0a0a0f',
    scene: [
        Boot,
        Preloader,
        MiningScene,
    ],
}

const StartGame = (parent: string) => {
    return new Game({ ...config, parent })
}

export default StartGame
