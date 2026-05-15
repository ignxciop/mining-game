import { useRef, useState, useEffect, useCallback } from 'react'
import { IRefPhaserGame, PhaserGame } from './PhaserGame'
import { Sidebar } from './components/Sidebar'
import { MobileHUD } from './components/MobileHUD'
import { MainMenu } from './components/MainMenu'
import { SessionSummary } from './components/SessionSummary'
import { SkillTreeView } from './components/SkillTreeView'
import { PrestigeView } from './components/PrestigeView'
import { useGameStore } from './store/gameStore'
import { EventBus } from './game/EventBus'

type Screen = 'menu' | 'mining' | 'summary' | 'upgrades' | 'prestige'

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null)
    const [screen, setScreen] = useState<Screen>('menu')
    const [gains, setGains] = useState<Record<string, number> | null>(null)
    const sessionStart = useRef<Record<string, number> | null>(null)
    const [isMobile] = useState(() => window.innerWidth < 768)

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
            const calcGains: Record<string, number> = {}
            const allKeys = new Set([...Object.keys(start), ...Object.keys(current)])
            for (const key of allKeys) {
                const diff = (current[key as string] ?? 0) - (start[key as string] ?? 0)
                if (diff > 0) calcGains[key] = diff
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
        return <SkillTreeView onBack={() => setScreen('menu')} onStartMining={startSession} />
    }

    if (screen === 'prestige') {
        return <PrestigeView onBack={() => setScreen('menu')} />
    }

    return (
        <div className="relative w-full h-dvh bg-[#0a0a0f] text-white overflow-hidden"
             style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <PhaserGame ref={phaserRef} />

            {screen === 'mining' && !isMobile && (
                <div className="absolute inset-y-0 left-0 flex items-start pt-3 pointer-events-none z-10">
                    <div className="pointer-events-auto ml-3 h-full">
                        <Sidebar onMenu={() => setScreen('menu')} />
                    </div>
                </div>
            )}

            {screen === 'mining' && isMobile && (
                <MobileHUD onMenu={() => setScreen('menu')} />
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
