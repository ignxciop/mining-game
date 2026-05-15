import { useGameStore, getPickaxePower } from '../store/gameStore'

interface Props { onMenu: () => void }

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const MINERAL_SPRITES: Record<string, string> = {
  clay: '/assets/ores/clay1.png', shale: '/assets/ores/shale1.png', sulfur: '/assets/ores/sulfur1.png',
  copper: '/assets/ores/copper1.png', iron: '/assets/ores/iron1.png', silver: '/assets/ores/silver1.png',
  coal_crystal: '/assets/ores/coal_crystal1.png', cinnabar: '/assets/ores/cinnabar1.png',
  obsidian: '/assets/ores/obsidian1.png', jade: '/assets/ores/jade1.png', malachite: '/assets/ores/malachite1.png',
  lapis_lazuli: '/assets/ores/lapis_lazuli1.png', turquoise: '/assets/ores/turquoise1.png',
  rose_quartz: '/assets/ores/rose_quartz1.png', citrine: '/assets/ores/citrine1.png',
  fluorite: '/assets/ores/fluorite1.png', rhodonite: '/assets/ores/rhodonite1.png',
  amber: '/assets/ores/amber1.png', blue_topaz: '/assets/ores/blue_topaz1.png',
  emerald: '/assets/ores/emerald1.png', sapphire: '/assets/ores/sapphire1.png',
  amethyst: '/assets/ores/amethyst1.png', aquamarine: '/assets/ores/aquamarine1.png',
  sunstone: '/assets/ores/sunstone1.png', void: '/assets/ores/void1.png',
}

export function Sidebar({ onMenu }: Props) {
  const resources = useGameStore((s) => s.resources)
  const tool = useGameStore((s) => s.tool)
  const pickLevel = useGameStore((s) => s.upgrades['pickaxe_power'] ?? 0)
  const reset = useGameStore((s) => s.reset)

  const topResources = Object.entries(resources)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .filter(([, v]) => v > 0)

  return (
    <div className="flex flex-col gap-4 w-52 h-full select-none py-3 max-sm:w-44">
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
        {/* Pickaxe Panel */}
        <div className="rounded-2xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 border border-amber-800/30 shadow-lg shadow-black/40 p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">⛏️</div>
            <div className="text-center">
              <div className="text-sm font-bold text-amber-300 leading-tight">{tool.name}</div>
              <div className="text-xs text-amber-500/70 mt-0.5">Nv.{pickLevel}</div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent my-1" />
            <div className="text-xs text-gray-400">
              Daño: <span className="text-amber-400 font-bold font-mono">{getPickaxePower(pickLevel).toFixed(1)}</span>
            </div>
            <div className="text-[10px] text-gray-600">DPS</div>
          </div>
        </div>

        {/* Resources Panel */}
        <div className="rounded-2xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 border border-amber-800/30 shadow-lg shadow-black/40 p-3">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-1">Recursos</div>
          <div className="flex flex-col gap-1.5">
            {topResources.map(([key, amount]) => (
              <div key={key}
                className="flex items-center gap-2 px-2.5 py-2 rounded-xl
                  bg-gradient-to-r from-gray-700/80 to-gray-800/80 border border-gray-700/40
                  shadow-sm shadow-black/20"
              >
                <img src={MINERAL_SPRITES[key] ?? '/assets/ores/clay1.png'} alt="" className="w-7 h-7 object-contain" />
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide truncate max-w-20">{key}</span>
                  <span className="font-mono text-sm font-bold text-white">{formatNumber(amount)}</span>
                </div>
              </div>
            ))}
            {topResources.length === 0 && (
              <div className="text-[10px] text-gray-600 text-center py-2">Sin recursos aún</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2">
        <button onClick={() => { if (window.confirm('¿Resetear todo el progreso?')) reset() }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
            bg-gradient-to-b from-red-900/60 to-red-950/60 hover:from-red-800/60 hover:to-red-900/60
            active:from-red-950/60 active:to-red-950/80 border border-red-800/30 hover:border-red-700/50
            text-red-400 hover:text-red-300 transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-98"
        >🔄 Resetear stats</button>

        <button onClick={onMenu}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
            bg-gradient-to-b from-gray-700/80 to-gray-800/80 hover:from-gray-600/80 hover:to-gray-700/80
            active:from-gray-800/80 active:to-gray-900/80 border border-gray-600/40 hover:border-gray-500/60
            text-gray-400 hover:text-gray-200 transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-98"
        >← Menú principal</button>
      </div>
    </div>
  )
}
