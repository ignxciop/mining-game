interface Props {
    onBack: () => void
}

export function UpgradesView({ onBack }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 select-none bg-[#0a0a0f]">
            <h2 className="text-3xl font-bold text-white">⚡ Mejoras</h2>

            <div className="flex flex-col gap-4 w-64">
                <div className="w-full py-4 rounded-xl text-center text-lg font-semibold
                    bg-gray-800/50 border border-gray-700/50 text-gray-500">
                    [?]
                </div>

                <div className="w-full py-4 rounded-xl text-center text-lg font-semibold
                    bg-gray-800/50 border border-gray-700/50 text-gray-500">
                    [?]
                </div>
            </div>

            <button
                onClick={onBack}
                className="mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            >
                ← Volver
            </button>
        </div>
    )
}
