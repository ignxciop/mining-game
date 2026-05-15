import { useGameStore, UPGRADES, getUpgradeCost } from '../store/gameStore'

export function UpgradeShop() {
    const resources = useGameStore((s) => s.resources)
    const upgrades = useGameStore((s) => s.upgrades)
    const buyUpgrade = useGameStore((s) => s.buyUpgrade)

    return (
        <div className="flex gap-3 select-none">
            {UPGRADES.map((def) => {
                const level = upgrades[def.id] ?? 0
                const cost = getUpgradeCost(def, level)
                const canAfford = (resources.stone ?? 0) >= cost

                return (
                    <button
                        key={def.id}
                        onClick={() => buyUpgrade(def.id)}
                        disabled={!canAfford}
                        className={`
                            flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg text-xs
                            transition-all duration-150 border
                            ${canAfford
                                ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-blue-500 cursor-pointer'
                                : 'bg-gray-900/50 border-gray-800 text-gray-600 cursor-not-allowed opacity-60'
                            }
                        `}
                    >
                        <span className="font-semibold text-sm text-gray-200">{def.name}</span>
                        <span className="text-gray-400">{def.description}</span>
                        <span className="text-amber-400 font-mono mt-1">
                            Nv.{level} — 🪨 {cost}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
