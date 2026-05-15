interface Props {
    onSelect: (screen: "mining" | "upgrades") => void;
}

export function MainMenu({ onSelect }: Props) {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden select-none bg-[#0f0a06]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#78350f30,transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,#1e3a5f20,transparent_60%)]" />
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="absolute inset-8 border-2 border-amber-900/15 rounded-[40px] pointer-events-none" />
            <div className="absolute inset-10 border border-amber-900/10 rounded-[32px] pointer-events-none" />

            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />

            <div
                className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-amber-400/30 animate-pulse"
                style={{ animationDuration: "3s" }}
            />
            <div
                className="absolute top-1/3 right-16 w-1.5 h-1.5 rounded-full bg-blue-400/30 animate-pulse"
                style={{ animationDuration: "2.5s" }}
            />
            <div
                className="absolute bottom-1/3 left-20 w-1.5 h-1.5 rounded-full bg-amber-400/20 animate-pulse"
                style={{ animationDuration: "4s" }}
            />
            <div
                className="absolute bottom-1/4 right-12 w-2 h-2 rounded-full bg-yellow-400/25 animate-pulse"
                style={{ animationDuration: "3.5s" }}
            />

            <div className="relative z-10 flex flex-col items-center gap-12 px-6">
                <div className="text-center">
                    <div className="text-7xl mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                        ⛏️
                    </div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] leading-[1.2] pb-2">
                        Mining Game
                    </h1>
                    <p className="text-amber-300/40 text-sm sm:text-base mt-4 tracking-[0.3em] uppercase font-light">
                        Incremental Idle Mining
                    </p>
                </div>

                <div className="flex flex-col gap-5 w-72 sm:w-80">
                    <button
                        onClick={() => onSelect("mining")}
                        className="group relative w-full py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold
                            bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800
                            hover:from-amber-400 hover:via-amber-500 hover:to-amber-700
                            active:from-amber-600 active:via-amber-700 active:to-amber-900
                            text-white
                            transition-all duration-200 ease-out cursor-pointer
                            hover:scale-[1.04] active:scale-[0.97]
                            hover:brightness-110 active:brightness-90
                            shadow-[0_8px_32px_rgba(217,119,6,0.35)]
                            hover:shadow-[0_8px_40px_rgba(217,119,6,0.5)]
                            active:shadow-[0_2px_16px_rgba(217,119,6,0.2)]
                            border border-amber-400/40
                            hover:border-amber-300/60
                            active:border-amber-500/30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <span className="text-2xl drop-shadow">⛏️</span>
                            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                Minar
                            </span>
                        </span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    </button>

                    <button
                        onClick={() => onSelect("upgrades")}
                        className="group relative w-full py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold
                            bg-gradient-to-b from-sky-500 via-blue-600 to-blue-800
                            hover:from-sky-400 hover:via-blue-500 hover:to-blue-700
                            active:from-sky-600 active:via-blue-700 active:to-blue-900
                            text-white
                            transition-all duration-200 ease-out cursor-pointer
                            hover:scale-[1.04] active:scale-[0.97]
                            hover:brightness-110 active:brightness-90
                            shadow-[0_8px_32px_rgba(37,99,235,0.35)]
                            hover:shadow-[0_8px_40px_rgba(37,99,235,0.5)]
                            active:shadow-[0_2px_16px_rgba(37,99,235,0.2)]
                            border border-sky-400/40
                            hover:border-sky-300/60
                            active:border-sky-500/30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <span className="text-2xl drop-shadow">⚡</span>
                            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                Mejoras
                            </span>
                        </span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    </button>
                </div>

                <div className="text-center text-amber-400/15 text-xs tracking-widest uppercase">
                    v0.1 &middot; En desarrollo
                </div>
            </div>
        </div>
    );
}

