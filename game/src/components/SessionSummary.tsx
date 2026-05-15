

const MINERAL_LABELS: Record<string, string> = {
  clay: 'Arcilla', shale: 'Pizarra', sulfur: 'Azufre',
  copper: 'Cobre', iron: 'Hierro', silver: 'Plata',
  coal_crystal: 'Carbón', cinnabar: 'Cinabrio',
  obsidian: 'Obsidiana', jade: 'Jade', malachite: 'Malaquita',
  lapis_lazuli: 'Lapislázuli', turquoise: 'Turquesa',
  rose_quartz: 'Cuarzo Rosa', citrine: 'Citrino',
  fluorite: 'Fluorita', rhodonite: 'Rodonita',
  amber: 'Ámbar', blue_topaz: 'Topacio Azul',
  emerald: 'Esmeralda', sapphire: 'Zafiro',
  amethyst: 'Amatista', aquamarine: 'Aguamarina',
  sunstone: 'Piedra Solar', void: 'Vacío',
}

const MINERAL_IMAGES: Record<string, string> = {
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

interface Props {
  gains: Record<string, number>
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
  const entries = Object.entries(gains).filter(([, v]) => v > 0)
  const hasGains = entries.length > 0

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm safe-area-padding">
      <div className="w-full max-w-sm sm:max-w-md mx-4 rounded-3xl bg-gradient-to-b from-gray-800/95 to-gray-900/95 border border-amber-800/30 shadow-2xl shadow-black/60 p-5 sm:p-8">
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⛏️</div>
          <h2 className="text-lg sm:text-xl font-bold text-amber-300">Resumen de la sesión</h2>
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2 mb-6 sm:mb-8 max-h-48 overflow-y-auto">
          {entries.map(([key, amount]) => (
            <div key={key}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl
                bg-gradient-to-r from-gray-700/60 to-gray-800/60 border border-gray-700/40"
            >
              <img src={MINERAL_IMAGES[key] ?? '/assets/ores/clay1.png'} alt="" className="w-6 h-6 object-contain" />
              <span className="flex-1 text-sm text-gray-300 truncate">{MINERAL_LABELS[key] ?? key}</span>
              <span className="font-mono text-sm font-bold text-green-400">+{formatNumber(amount)}</span>
            </div>
          ))}
          {!hasGains && (
            <div className="text-center text-gray-500 text-xs mt-2">No se obtuvieron recursos en esta sesión</div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 sm:gap-3">
          <button onClick={onMineAgain}
            className="w-full py-3.5 sm:py-3.5 rounded-2xl text-base font-bold min-h-[48px]
              bg-gradient-to-b from-amber-500 to-amber-700 active:from-amber-600 active:to-amber-800
              text-white border border-amber-400/40 transition-all duration-100 cursor-pointer active:scale-[0.97] shadow-lg shadow-amber-900/30"
          >⛏️ Minar otra vez</button>

          <div className="flex gap-2.5 sm:gap-3">
            <button onClick={onUpgrades}
              className="flex-1 py-3 sm:py-3 rounded-2xl text-sm font-semibold min-h-[44px]
                bg-gradient-to-b from-gray-700/80 to-gray-800/80 active:from-gray-800/80 active:to-gray-900/80
                text-gray-300 border border-gray-600/40 transition-all duration-100 cursor-pointer active:scale-[0.97]"
            >⚡ Mejoras</button>

            <button onClick={onMenu}
              className="flex-1 py-3 sm:py-3 rounded-2xl text-sm font-semibold min-h-[44px]
                bg-gradient-to-b from-gray-700/80 to-gray-800/80 active:from-gray-800/80 active:to-gray-900/80
                text-gray-300 border border-gray-600/40 transition-all duration-100 cursor-pointer active:scale-[0.97]"
            >← Menú</button>
          </div>
        </div>
      </div>
    </div>
  )
}
