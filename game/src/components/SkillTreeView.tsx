import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { SKILL_TREE, SkillNodeDef, getBranchColor, getMineralSprite } from '../data/SkillTreeData'


const COLS = 5
const ROWS = 4
const CELL_W = 160
const CELL_H = 130

function nodePos(col: number, row: number) {
    return {
        left: col * CELL_W + CELL_W / 2,
        top: row * CELL_H + CELL_H / 2,
    }
}

function hasLinesBetween(a: SkillNodeDef, b: SkillNodeDef): boolean {
    return b.requires.includes(a.id) || a.requires.includes(b.id)
}

function getLinePath(from: SkillNodeDef, to: SkillNodeDef): string | null {
    if (!hasLinesBetween(from, to)) return null
    const p1 = nodePos(from.position.col, from.position.row)
    const p2 = nodePos(to.position.col, to.position.row)
    if (p1.left === p2.left && p1.top === p2.top) return null
    const mx = (p1.left + p2.left) / 2
    const my = (p1.top + p2.top) / 2
    return `M ${p1.left} ${p1.top} Q ${mx} ${p1.top} ${mx} ${my} Q ${mx} ${p2.top} ${p2.left} ${p2.top}`
}

interface Props {
    onBack: () => void
}

export function SkillTreeView({ onBack }: Props) {
    const resources = useGameStore((s) => s.resources)
    const skills = useGameStore((s) => s.skills)
    const purchaseSkill = useGameStore((s) => s.purchaseSkill)
    const [selectedNode, setSelectedNode] = useState<SkillNodeDef | null>(null)

    const totalW = COLS * CELL_W + 40
    const totalH = ROWS * CELL_H + 40

    function isUnlocked(node: SkillNodeDef): boolean {
        return (skills[node.id] ?? 0) >= node.maxLevel
    }

    function isAvailable(node: SkillNodeDef): boolean {
        if (isUnlocked(node)) return false
        return node.requires.every((reqId) => {
            const req = SKILL_TREE.find((n) => n.id === reqId)
            if (!req) return true
            return (skills[req.id] ?? 0) >= req.maxLevel
        })
    }

    function canAfford(node: SkillNodeDef): boolean {
        return node.costs.every((c) => (resources[c.resource] ?? 0) >= c.amount)
    }

    function handlePurchase(node: SkillNodeDef) {
        if (!isAvailable(node) || !canAfford(node)) return
        const costs: Record<string, number> = {}
        for (const c of node.costs) costs[c.resource] = c.amount
        purchaseSkill(node.id, costs, node.upgradesStat, node.upgradeValue)
        setSelectedNode(null)
    }

    return (
        <div className="flex flex-col min-h-dvh bg-[#0a0a0f] text-white select-none safe-area-padding">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-900/20">
                <button onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                        bg-gradient-to-b from-gray-700/80 to-gray-800/80 border border-gray-600/40
                        text-gray-400 active:scale-[0.97] transition-transform duration-100"
                >
                    ← Volver
                </button>
                <h2 className="text-base sm:text-lg font-bold text-amber-300">Árbol de habilidades</h2>
                <div className="w-16" />
            </div>

            {/* Tree container */}
            <div className="flex-1 overflow-auto p-2">
                <div className="relative mx-auto" style={{ width: totalW, height: totalH, minWidth: totalW }}>
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                        {SKILL_TREE.map((node) =>
                            SKILL_TREE.filter((other) => other.requires.includes(node.id)).map((child) => {
                                const d = getLinePath(node, child)
                                if (!d) return null
                                const unlocked = isUnlocked(node) && isUnlocked(child)
                                const available = isAvailable(node) && isAvailable(child)
                                return (
                                    <path key={`${node.id}-${child.id}`} d={d} fill="none"
                                        stroke={unlocked ? '#22c55e' : available ? '#6b7280' : '#374151'}
                                        strokeWidth={unlocked ? 3 : 2}
                                        strokeOpacity={unlocked ? 0.7 : available ? 0.4 : 0.2}
                                    />
                                )
                            })
                        )}
                    </svg>

                    {/* Nodes */}
                    {SKILL_TREE.map((node) => {
                        const pos = nodePos(node.position.col, node.position.row)
                        const unlocked = isUnlocked(node)
                        const available = isAvailable(node)
                        const afford = canAfford(node)
                        const state = unlocked ? 'unlocked' : (available ? (afford ? 'available' : 'nofunds') : 'locked')

                        return (
                            <button key={node.id}
                                onClick={() => setSelectedNode(node)}
                                style={{ left: pos.left - 56, top: pos.top - 44 }}
                                className={`absolute w-28 h-[88px] rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-150
                                    ${state === 'unlocked'
                                        ? `bg-gradient-to-b ${getBranchColor(node.branch)} shadow-[0_0_16px_rgba(34,197,94,0.3)] border-green-500/60 scale-100`
                                        : state === 'available'
                                            ? `bg-gradient-to-b ${getBranchColor(node.branch)} opacity-90 border-green-500/40 hover:scale-105 active:scale-95 cursor-pointer`
                                            : state === 'nofunds'
                                                ? `bg-gradient-to-b ${getBranchColor(node.branch)} opacity-70 border-red-500/30 hover:scale-105 active:scale-95 cursor-pointer`
                                                : 'bg-gray-800/60 border-gray-700/40 opacity-50 cursor-not-allowed'
                                    }
                                    border-2 shadow-lg`}
                            >
                                <span className={`text-lg ${state === 'unlocked' ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : ''}`}>
                                    {node.icon}
                                </span>
                                <span className={`text-[9px] font-bold text-center leading-tight px-1
                                    ${state === 'unlocked' ? 'text-green-300' : state === 'available' || state === 'nofunds' ? 'text-gray-200' : 'text-gray-500'}`}>
                                    {node.name}
                                </span>
                                {node.maxLevel > 1 && (
                                    <span className="text-[8px] text-gray-500 font-mono">
                                        {(skills[node.id] ?? 0)}/{node.maxLevel}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Detail panel */}
            {selectedNode && (
                <div className="border-t border-amber-900/20 bg-gray-900/95 backdrop-blur-md p-4 safe-area-padding-bottom">
                    <div className="max-w-md mx-auto flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{selectedNode.icon}</span>
                            <div>
                                <div className="font-bold text-sm text-white">{selectedNode.name}</div>
                                <div className="text-xs text-gray-400">{selectedNode.description}</div>
                            </div>
                        </div>

                        {!isUnlocked(selectedNode) && (
                            <>
                                <div className="flex flex-wrap gap-2">
                                    {selectedNode.costs.map((cost) => {
                                        const have = resources[cost.resource] ?? 0
                                        const enough = have >= cost.amount
                                        return (
                                            <div key={cost.resource}
                                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs
                                                    ${enough ? 'bg-gray-800/80 text-gray-300' : 'bg-red-900/30 text-red-400'}`}
                                            >
                                                <img src={getMineralSprite(cost.resource)} alt="" className="w-4 h-4 object-contain" />
                                                <span className="font-mono">{have}/{cost.amount}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {isAvailable(selectedNode) ? (
                                    <button onClick={() => handlePurchase(selectedNode)}
                                        disabled={!canAfford(selectedNode)}
                                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-100 active:scale-[0.97]
                                            ${canAfford(selectedNode)
                                                ? 'bg-gradient-to-b from-green-600 to-green-800 text-white border border-green-500/40 shadow-lg shadow-green-900/30'
                                                : 'bg-gray-800/50 text-gray-600 border border-gray-700/40 cursor-not-allowed'}`}
                                    >
                                        {canAfford(selectedNode) ? '✓ Desbloquear' : '🔒 Recursos insuficientes'}
                                    </button>
                                ) : (
                                    <div className="text-center text-xs text-gray-500 py-2">
                                        🔒 Requiere: {selectedNode.requires.map((r) => {
                                            const n = SKILL_TREE.find((s) => s.id === r)
                                            return n?.name ?? r
                                        }).join(', ')}
                                    </div>
                                )}
                            </>
                        )}

                        {isUnlocked(selectedNode) && (
                            <div className="text-center text-xs text-green-500 py-1">
                                ✓ Desbloqueado
                            </div>
                        )}

                        <button onClick={() => setSelectedNode(null)}
                            className="text-xs text-gray-500 active:text-gray-300 py-1"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
