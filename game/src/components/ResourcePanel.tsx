import { useGameStore, ResourceType } from '../store/gameStore'

const RESOURCE_META: Record<ResourceType, { label: string; color: string }> = {
    stone: { label: 'Piedra', color: 'text-gray-300' },
    coal: { label: 'Carbón', color: 'text-gray-500' },
    iron: { label: 'Hierro', color: 'text-orange-400' },
    gold: { label: 'Oro', color: 'text-yellow-400' },
    diamond: { label: 'Diamante', color: 'text-cyan-400' },
}

function formatNumber(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toString()
}

export function ResourcePanel() {
    const resources = useGameStore((s) => s.resources)
    const tool = useGameStore((s) => s.tool)
    const stats = useGameStore((s) => s.stats)

    return (
        <div className="flex flex-col gap-2 select-none">
            <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>⛏ {tool.name}</span>
                <span>Poder: {tool.power}</span>
                <span>Bloques: {stats.blocksBroken}</span>
                <span>Clics: {stats.totalClicks}</span>
            </div>
            <div className="flex gap-4 text-sm">
                {(Object.keys(RESOURCE_META) as ResourceType[]).map((key) => {
                    const meta = RESOURCE_META[key]
                    const amount = resources[key] ?? 0
                    return (
                        <div key={key} className={`${meta.color} font-mono`}>
                            {meta.label}: {formatNumber(amount)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
