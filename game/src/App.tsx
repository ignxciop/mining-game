import { useRef } from 'react'
import { IRefPhaserGame, PhaserGame } from './PhaserGame'
import { ResourcePanel } from './components/ResourcePanel'
import { UpgradeShop } from './components/UpgradeShop'

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null)

    return (
        <div className="relative w-full h-screen bg-[#0a0a0f] text-white overflow-hidden">
            <div id="game-container" className="absolute inset-0" />

            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 to-transparent">
                <ResourcePanel />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <UpgradeShop />
            </div>

            <PhaserGame ref={phaserRef} />
        </div>
    )
}

export default App
