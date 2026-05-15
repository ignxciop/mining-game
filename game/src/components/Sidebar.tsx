import { useGameStore, getPickaxePower } from '../store/gameStore'
import { MineralId } from '../game/entities/MineralTypes'

interface Props {
    onMenu: () => void
}

const RESOURCE_SPRITES: Record<MineralId, string> = {
    dirt: '/assets/ores/dirt_1.png',
    copper: '/assets/ores/copper1.png',
    iron: '/assets/ores/iron1.png',
    steel: '/assets/ores/steel1.png',
}

const RESOURCE_LABELS: Record<MineralId, string> = {
    dirt: 'Tierra',
    copper: 'Cobre',
    iron: 'Hierro',
    steel: 'Acero',
}

const RESOURCE_COLORS: Record<MineralId, string> = {
    dirt: 'from-stone-700/80 to-stone-800/80 border-stone-600/40',
    copper: 'from-amber-700/80 to-amber-800/80 border-amber-600/40',
    iron: 'from-gray-600/80 to-gray-700/80 border-gray-500/40',
    steel: 'from-cyan-700/80 to-cyan-800/80 border-cyan-600/40',
}

function formatNumber(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toString()
}

export function Sidebar({ onMenu }: Props) {
    const resources = useGameStore((s) => s.resources)
    const tool = useGameStore((s) => s.tool)
    const pickLevel = useGameStore((s) => s.upgrades['pickaxe_power'] ?? 0)
    const reset = useGameStore((s) => s.reset)

    return (
        <div className="flex flex-col gap-4 w-52 h-full select-none py-3 max-sm:w-44">
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
                {/* Pickaxe Panel */}
                <div className="rounded-2xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 border border-amber-800/30 shadow-lg shadow-black/40 p-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                            ⛏️
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-amber-300 leading-tight">
                                {tool.name}
                            </div>
                            <div className="text-xs text-amber-500/70 mt-0.5">
                                Nv.{pickLevel}
                            </div>
                        </div>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent my-1" />
                        <div className="text-xs text-gray-400">
                            Daño: <span className="text-amber-400 font-bold font-mono">
                                {getPickaxePower(pickLevel).toFixed(1)}
                            </span>
                        </div>
                        <div className="text-[10px] text-gray-600">
                            DPS
                        </div>
                    </div>
                </div>

                {/* Resources Panel */}
                <div className="rounded-2xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 border border-amber-800/30 shadow-lg shadow-black/40 p-3">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-1">
                        Recursos
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {(Object.keys(RESOURCE_LABELS) as MineralId[]).map((key) => {
                            const amount = resources[key] ?? 0
                            return (
                                <div
                                    key={key}
                                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl
                                        bg-gradient-to-r ${RESOURCE_COLORS[key]}
                                        shadow-sm shadow-black/20`}
                                >
                                    <img
                                        src={RESOURCE_SPRITES[key]}
                                        alt={RESOURCE_LABELS[key]}
                                        className="w-7 h-7 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                                    />
                                    <div className="flex flex-col leading-tight min-w-0">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                                            {RESOURCE_LABELS[key]}
                                        </span>
                                        <span className="font-mono text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                            {formatNumber(amount)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => {
                        if (window.confirm('¿Resetear todo el progreso?')) {
                            reset()
                        }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                        bg-gradient-to-b from-red-900/60 to-red-950/60
                        hover:from-red-800/60 hover:to-red-900/60
                        active:from-red-950/60 active:to-red-950/80
                        border border-red-800/30 hover:border-red-700/50
                        text-red-400 hover:text-red-300
                        transition-all duration-150 cursor-pointer
                        hover:scale-[1.02] active:scale-98"
                >
                    🔄 Resetear stats
                </button>

                <button
                    onClick={onMenu}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                        bg-gradient-to-b from-gray-700/80 to-gray-800/80
                        hover:from-gray-600/80 hover:to-gray-700/80
                        active:from-gray-800/80 active:to-gray-900/80
                        border border-gray-600/40 hover:border-gray-500/60
                        text-gray-400 hover:text-gray-200
                        transition-all duration-150 cursor-pointer
                        hover:scale-[1.02] active:scale-98"
                >
                    ← Menú principal
                </button>
            </div>
        </div>
    )
}
