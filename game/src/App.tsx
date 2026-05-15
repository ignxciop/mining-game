import { useRef, useState, useEffect, useCallback } from 'react'
import { IRefPhaserGame, PhaserGame } from './PhaserGame'
import { Sidebar } from './components/Sidebar'
import { MainMenu } from './components/MainMenu'
import { SessionSummary } from './components/SessionSummary'
import { UpgradesView } from './components/UpgradesView'
import { useGameStore, ResourceType } from './store/gameStore'
import { EventBus } from './game/EventBus'

type Screen = 'menu' | 'mining' | 'summary' | 'upgrades'

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null)
    const [screen, setScreen] = useState<Screen>('menu')
    const [gains, setGains] = useState<Record<ResourceType, number> | null>(null)
    const sessionStart = useRef<Record<ResourceType, number> | null>(null)

    const startSession = useCallback(() => {
        const current = useGameStore.getState().resources
        sessionStart.current = { ...current }
        setGains(null)
        setScreen('mining')
    }, [])

    const mineAgain = useCallback(() => {
        const current = useGameStore.getState().resources
        sessionStart.current = { ...current }
        setGains(null)
        setScreen('mining')
        setTimeout(() => EventBus.emit('session-start'), 50)
    }, [])

    useEffect(() => {
        const onEnd = () => {
            const start = sessionStart.current
            if (!start) return
            const current = useGameStore.getState().resources
            const calcGains: Record<ResourceType, number> = {
                dirt: (current.dirt ?? 0) - (start.dirt ?? 0),
                copper: (current.copper ?? 0) - (start.copper ?? 0),
                iron: (current.iron ?? 0) - (start.iron ?? 0),
                steel: (current.steel ?? 0) - (start.steel ?? 0),
            }
            setGains(calcGains)
            setScreen('summary')
        }

        EventBus.on('session-ended', onEnd)
        return () => { EventBus.removeListener('session-ended', onEnd) }
    }, [])

    if (screen === 'menu') {
        return <MainMenu onSelect={(s) => {
            if (s === 'mining') startSession()
            else setScreen(s)
        }} />
    }

    if (screen === 'upgrades') {
        return <UpgradesView onBack={() => setScreen('menu')} />
    }

    return (
        <div className="relative w-full h-screen bg-[#0a0a0f] text-white overflow-hidden">
            <PhaserGame ref={phaserRef} />

            {screen === 'mining' && (
                <div className="absolute inset-y-0 left-0 flex items-start pt-3 pointer-events-none z-10">
                    <div className="pointer-events-auto ml-3 h-full">
                        <Sidebar onMenu={() => setScreen('menu')} />
                    </div>
                </div>
            )}

            {screen === 'summary' && gains && (
                <SessionSummary
                    gains={gains}
                    onMineAgain={mineAgain}
                    onUpgrades={() => setScreen('upgrades')}
                    onMenu={() => setScreen('menu')}
                />
            )}
        </div>
    )
}

export default App
