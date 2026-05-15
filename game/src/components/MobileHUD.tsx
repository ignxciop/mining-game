import { useState } from 'react'
import { useGameStore, getPickaxePower } from '../store/gameStore'

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

interface Props { onMenu: () => void }

export function MobileHUD({ onMenu }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const resources = useGameStore((s) => s.resources)
  const tool = useGameStore((s) => s.tool)
  const pickLevel = useGameStore((s) => s.upgrades['pickaxe_power'] ?? 0)
  const reset = useGameStore((s) => s.reset)

  const topResources = Object.entries(resources)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .filter(([, v]) => v > 0)

  return (
    <>
      <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1 justify-center pointer-events-none z-10">
        {topResources.map(([key, amount]) => (
          <div key={key}
            className="flex items-center gap-1 px-1.5 py-1 rounded-lg pointer-events-auto
              bg-black/60 backdrop-blur-sm border border-white/10 shadow-lg"
          >
            <span className="text-[10px] font-mono truncate max-w-12">{key}</span>
            <span className="text-[11px] font-mono font-bold text-white">{formatNumber(amount)}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)}
        className="absolute bottom-4 right-4 w-11 h-11 flex items-center justify-center rounded-full z-20 pointer-events-auto
          bg-gradient-to-b from-gray-700/90 to-gray-800/90 border border-gray-600/50 text-white shadow-lg shadow-black/40 active:scale-90"
        aria-label="Menú"
      >
        <span className="text-lg font-bold leading-none">{menuOpen ? '✕' : '≡'}</span>
      </button>

      {menuOpen && (
        <div className="absolute inset-0 z-30 flex items-end justify-center pb-20 pointer-events-none">
          <div className="pointer-events-auto mx-4 w-full max-w-xs rounded-2xl bg-gradient-to-b from-gray-800/95 to-gray-900/95
            border border-amber-800/30 shadow-2xl shadow-black/60 p-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700/40">
              <span className="text-xl">⛏️</span>
              <div className="leading-tight">
                <div className="text-sm font-bold text-amber-300">{tool.name}</div>
                <div className="text-[10px] text-gray-500">Nv.{pickLevel} · {getPickaxePower(pickLevel).toFixed(1)} DPS</div>
              </div>
            </div>

            <button onClick={() => { setMenuOpen(false); onMenu() }}
              className="w-full py-3 rounded-xl text-sm font-semibold mb-2
                bg-gradient-to-b from-gray-700/80 to-gray-800/80 border border-gray-600/40 text-gray-300 active:scale-[0.97]"
            >← Menú principal</button>

            <button onClick={() => { setMenuOpen(false); if (window.confirm('¿Resetear todo el progreso?')) reset() }}
              className="w-full py-3 rounded-xl text-sm font-semibold
                bg-gradient-to-b from-red-900/60 to-red-950/60 border border-red-800/30 text-red-400 active:scale-[0.97]"
            >🔄 Resetear stats</button>
          </div>
        </div>
      )}
    </>
  )
}
