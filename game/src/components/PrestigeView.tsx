import { useState } from 'react'
import { useGameStore, getPrestigePoints } from '../store/gameStore'

const PRESTIGE_UPGRADES = [
  { id: 'prestige_damage', name: 'Fuerza Eterna', desc: '+1 daño permanente', cost: 10, stat: 'pickaxe_power', val: 1 },
  { id: 'prestige_speed', name: 'Velocidad Eterna', desc: '+1 speed permanente', cost: 10, stat: 'speed', val: 1 },
  { id: 'prestige_luck', name: 'Suerte Eterna', desc: '+1 luck permanente', cost: 10, stat: 'luck', val: 1 },
  { id: 'prestige_boost', name: 'Comienzo Acelerado', desc: '+3 speed al iniciar run', cost: 25, stat: 'speed', val: 3 },
  { id: 'prestige_legendary', name: 'Pico Legendario', desc: 'Daño ×2 inicial', cost: 50, stat: 'pickaxe_power', val: 0 },
  { id: 'prestige_mult', name: 'Multiplicador ×2', desc: 'Todos los recursos ×2', cost: 100, stat: 'efficiency', val: 0 },
]

interface Props { onBack: () => void }

export function PrestigeView({ onBack }: Props) {
  const prestigeLevel = useGameStore((s) => s.prestigeLevel ?? 0)
  const prestigePoints = useGameStore((s) => s.prestigePoints ?? 0)
  const prestigeUpgrades = useGameStore((s) => s.prestigeUpgrades ?? {})
  const lifetimeStats = useGameStore((s) => s.lifetimeStats)
  const doPrestige = useGameStore((s) => s.doPrestige)
  const buyPrestigeUpgrade = useGameStore((s) => s.buyPrestigeUpgrade)
  const [confirming, setConfirming] = useState(false)

  const pointsIfReset = getPrestigePoints(lifetimeStats.totalResourceValue)
  return (
    <div className="flex flex-col min-h-dvh bg-[#0a0a0f] text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-amber-900/20">
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold
            bg-gradient-to-b from-gray-700/80 to-gray-800/80 border border-gray-600/40
            text-gray-400 active:scale-[0.97]"
        >←</button>
        <h2 className="text-sm sm:text-lg font-bold text-purple-300">🌟 Prestige</h2>
        <div className="w-12 sm:w-16" />
      </div>

      {/* Info */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 text-center border-b border-gray-800/50">
        <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌟</div>
        <div className="text-xs sm:text-sm text-gray-400">Nivel Prestige: <span className="text-purple-300 font-bold">{prestigeLevel}</span></div>
        <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Fragmentos de Vacío: <span className="text-amber-400 font-bold font-mono">{prestigePoints}</span></div>
        <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Valor total acumulado: {lifetimeStats.totalResourceValue}</div>
      </div>

      {/* Prestige button */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 text-center border-b border-gray-800/50">
        {!confirming ? (
          <button onClick={() => setConfirming(true)}
            disabled={lifetimeStats.totalResourceValue < 1000}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-100 active:scale-[0.97]
              ${lifetimeStats.totalResourceValue >= 1000
                ? 'bg-gradient-to-b from-purple-600 to-purple-800 text-white border border-purple-500/40 shadow-lg shadow-purple-900/30'
                : 'bg-gray-800/50 text-gray-600 border border-gray-700/40 cursor-not-allowed'}`}
          >
            🌟 Hacer Prestige
            {lifetimeStats.totalResourceValue >= 1000
              ? <span className="hidden sm:inline"> (+{pointsIfReset} fragmentos)</span>
              : <span className="hidden sm:inline"> (1,000 valor requerido)</span>}
            <span className="sm:hidden text-[10px] block mt-0.5 opacity-70">
              {lifetimeStats.totalResourceValue >= 1000 ? `+${pointsIfReset}💎` : 'req. 1,000 valor'}
            </span>
          </button>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <div className="text-[10px] sm:text-xs text-red-400">¿Resetear progreso a cambio de <span className="font-bold">{pointsIfReset}</span> fragmentos?</div>
            <div className="flex gap-3">
              <button onClick={() => { doPrestige(); setConfirming(false) }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-b from-red-600 to-red-800 text-white border border-red-500/40"
              >Sí, prestige</button>
              <button onClick={() => setConfirming(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-b from-gray-700/80 to-gray-800/80 text-gray-400 border border-gray-600/40"
              >Cancelar</button>
            </div>
          </div>
        )}
      </div>

      {/* Prestige Upgrades */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <h3 className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">Tienda Prestige</h3>
        <div className="flex flex-col gap-1.5 sm:gap-2 max-w-md mx-auto">
          {PRESTIGE_UPGRADES.map((upg) => {
            const level = prestigeUpgrades[upg.id] ?? 0
            const canAfford = prestigePoints >= upg.cost
            return (
              <button key={upg.id}
                onClick={() => { buyPrestigeUpgrade(upg.id, upg.cost, upg.stat, upg.val) }}
                disabled={!canAfford}
                className={`flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all duration-100 active:scale-[0.97]
                  ${canAfford
                    ? 'bg-gradient-to-b from-gray-700/90 to-gray-800/90 border border-gray-600/60 text-gray-200 hover:border-purple-500/50'
                    : 'bg-gray-800/40 text-gray-600 border border-gray-800/40 cursor-not-allowed'}`}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold text-xs sm:text-sm">{upg.name}</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-500">{upg.desc}</span>
                </div>
                <span className={`text-[10px] sm:text-xs font-mono font-bold ${canAfford ? 'text-purple-400' : 'text-gray-600'}`}>
                  {level > 0 ? `Nv.${level}` : `${upg.cost}💎`}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
