import { UpgradeShop } from './UpgradeShop'

interface Props {
    onBack: () => void
}

export function UpgradesView({ onBack }: Props) {
    return (
        <div className="flex flex-col items-center min-h-dvh select-none bg-[#0a0a0f] px-4 pt-8 sm:pt-16 safe-area-padding"
             style={{ paddingTop: 'calc(env(safe-area-inset-top) + 2rem)' }}>
            <div className="w-full max-w-lg flex flex-col items-center gap-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">⚡ Mejoras</h2>

                <div className="w-full rounded-2xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 border border-amber-800/30 shadow-lg shadow-black/40 py-4">
                    <UpgradeShop />
                </div>

                <button
                    onClick={onBack}
                    className="text-sm text-gray-500 active:text-gray-300 transition-colors cursor-pointer
                        py-3 px-6 active:scale-[0.97]"
                >
                    ← Volver
                </button>
            </div>
        </div>
    )
}
