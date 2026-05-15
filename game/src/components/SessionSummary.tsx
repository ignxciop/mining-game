import { ResourceType } from '../store/gameStore'

const META: Record<ResourceType, { label: string; img: string }> = {
    dirt: { label: 'Tierra', img: '/assets/ores/dirt_1.png' },
    copper: { label: 'Cobre', img: '/assets/ores/copper1.png' },
    iron: { label: 'Hierro', img: '/assets/ores/iron1.png' },
    steel: { label: 'Acero', img: '/assets/ores/steel1.png' },
}

interface Props {
    gains: Record<ResourceType, number>
    onMineAgain: () => void
    onUpgrades: () => void
    onMenu: () => void
}

function formatNumber(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toString()
}

export function SessionSummary({ gains, onMineAgain, onUpgrades, onMenu }: Props) {
    const hasGains = Object.values(gains).some((v) => v > 0)

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm sm:max-w-md mx-4 rounded-3xl bg-gradient-to-b from-gray-800/95 to-gray-900/95 border border-amber-800/30 shadow-2xl shadow-black/60 p-5 sm:p-8">
                <div className="text-center mb-4 sm:mb-6">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⛏️</div>
                    <h2 className="text-lg sm:text-xl font-bold text-amber-300">Resumen de la sesión</h2>
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                    {(Object.keys(META) as ResourceType[]).map((key) => {
                        const amount = gains[key] ?? 0
                        return (
                            <div
                                key={key}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl
                                    bg-gradient-to-r from-gray-700/60 to-gray-800/60
                                    border border-gray-700/40`}
                            >
                                <img src={META[key].img} alt={META[key].label} className="w-7 h-7 object-contain" />
                                <span className="flex-1 text-sm text-gray-300">{META[key].label}</span>
                                <span className={`font-mono text-sm font-bold ${amount > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                                    {amount > 0 ? `+${formatNumber(amount)}` : '—'}
                                </span>
                            </div>
                        )
                    })}
                    {!hasGains && (
                        <div className="text-center text-gray-500 text-xs mt-2">
                            No se obtuvieron recursos en esta sesión
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2.5 sm:gap-3">
                    <button
                        onClick={onMineAgain}
                        className="w-full py-3.5 sm:py-3.5 rounded-2xl text-base font-bold min-h-[48px]
                            bg-gradient-to-b from-amber-500 to-amber-700
                            active:from-amber-600 active:to-amber-800
                            text-white border border-amber-400/40
                            transition-all duration-100 cursor-pointer
                            active:scale-[0.97] shadow-lg shadow-amber-900/30"
                    >
                        ⛏️ Minar otra vez
                    </button>

                    <div className="flex gap-2.5 sm:gap-3">
                        <button
                            onClick={onUpgrades}
                            className="flex-1 py-3 sm:py-3 rounded-2xl text-sm font-semibold min-h-[44px]
                                bg-gradient-to-b from-gray-700/80 to-gray-800/80
                                active:from-gray-800/80 active:to-gray-900/80
                                text-gray-300 border border-gray-600/40
                                transition-all duration-100 cursor-pointer
                                active:scale-[0.97]"
                        >
                            ⚡ Mejoras
                        </button>

                        <button
                            onClick={onMenu}
                            className="flex-1 py-3 sm:py-3 rounded-2xl text-sm font-semibold min-h-[44px]
                                bg-gradient-to-b from-gray-700/80 to-gray-800/80
                                active:from-gray-800/80 active:to-gray-900/80
                                text-gray-300 border border-gray-600/40
                                transition-all duration-100 cursor-pointer
                                active:scale-[0.97]"
                        >
                            ← Menú
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
