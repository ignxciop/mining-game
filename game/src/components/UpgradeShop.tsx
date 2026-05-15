import { useGameStore, UPGRADES, getUpgradeCost } from '../store/gameStore'

const CURRENCY_ICONS: Record<string, string> = {
    dirt: '🪨',
    copper: '🥉',
    iron: '🔩',
    steel: '💎',
}

export function UpgradeShop() {
    const resources = useGameStore((s) => s.resources)
    const upgrades = useGameStore((s) => s.upgrades)
    const buyUpgrade = useGameStore((s) => s.buyUpgrade)

    return (
        <div className="select-none px-4 py-2">
            <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                {UPGRADES.map((def) => {
                    const level = upgrades[def.id] ?? 0
                    const cost = getUpgradeCost(def, level)
                    const currency = def.currency
                    const canAfford = (resources[currency] ?? 0) >= cost
                    const currIcon = CURRENCY_ICONS[currency] ?? '🪨'

                    return (
                        <button
                            key={def.id}
                            onClick={() => buyUpgrade(def.id)}
                            disabled={!canAfford}
                            className={`
                                group relative flex flex-col items-center gap-0.5 px-3 sm:px-4 py-2 sm:py-2.5
                                rounded-xl text-xs sm:text-sm font-semibold
                                transition-all duration-200 ease-out
                                ${canAfford
                                    ? 'bg-gradient-to-b from-gray-700/90 to-gray-800/90 border-gray-600/60 text-gray-200 hover:from-gray-600/90 hover:to-gray-700/90 hover:scale-105 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(217,119,6,0.2)] cursor-pointer active:scale-95 active:brightness-90'
                                    : 'bg-gradient-to-b from-gray-800/40 to-gray-900/40 border-gray-800/40 text-gray-600 cursor-not-allowed'
                                }
                                border shadow-sm
                            `}
                        >
                            {canAfford && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                            )}
                            <span className="text-base sm:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                                {def.icon}
                            </span>
                            <span className="text-[10px] sm:text-xs leading-tight text-center">
                                {def.name}
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className={`
                                    text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded
                                    ${canAfford ? 'bg-amber-900/40 text-amber-400' : 'bg-gray-800/40 text-gray-600'}
                                `}>
                                    Nv.{level}
                                </span>
                            </div>
                            <span className={`
                                text-[10px] sm:text-xs font-mono mt-0.5 flex items-center gap-1
                                ${canAfford ? 'text-amber-300' : 'text-gray-600'}
                            `}>
                                {currIcon} {cost}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
