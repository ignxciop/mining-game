interface Props {
    onSelect: (screen: "mining" | "upgrades") => void;
}

export function MainMenu({ onSelect }: Props) {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-dvh overflow-hidden select-none bg-[#0f0a06] px-4 safe-area-padding">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#78350f30,transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,#1e3a5f20,transparent_60%)]" />

            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="hidden sm:block absolute inset-8 border-2 border-amber-900/15 rounded-[40px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-12 w-full max-w-sm">
                <div className="text-center">
                    <div className="text-5xl sm:text-7xl mb-3 sm:mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                        ⛏️
                    </div>
                    <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] leading-[1.2] pb-2">
                        Mining Game
                    </h1>
                    <p className="text-amber-300/40 text-xs sm:text-base mt-3 sm:mt-4 tracking-[0.3em] uppercase font-light">
                        Incremental Idle Mining
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full sm:w-80">
                    <button
                        onClick={() => onSelect("mining")}
                        className="group relative w-full py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold
                            bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800
                            active:from-amber-600 active:via-amber-700 active:to-amber-900
                            text-white transition-all duration-100 ease-out cursor-pointer
                            active:scale-[0.97] shadow-[0_8px_32px_rgba(217,119,6,0.35)]
                            active:shadow-[0_2px_16px_rgba(217,119,6,0.2)]
                            border border-amber-400/40 active:border-amber-500/30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <span className="text-2xl drop-shadow">⛏️</span>
                            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Minar</span>
                        </span>
                    </button>

                    <button
                        onClick={() => onSelect("upgrades")}
                        className="group relative w-full py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold
                            bg-gradient-to-b from-sky-500 via-blue-600 to-blue-800
                            active:from-sky-600 active:via-blue-700 active:to-blue-900
                            text-white transition-all duration-100 ease-out cursor-pointer
                            active:scale-[0.97] shadow-[0_8px_32px_rgba(37,99,235,0.35)]
                            active:shadow-[0_2px_16px_rgba(37,99,235,0.2)]
                            border border-sky-400/40 active:border-sky-500/30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <span className="text-2xl drop-shadow">⚡</span>
                            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Mejoras</span>
                        </span>
                    </button>
                </div>

                <div className="text-center text-amber-400/15 text-[10px] sm:text-xs tracking-widest uppercase">
                    v0.1 &middot; En desarrollo
                </div>
            </div>
        </div>
    );
}
