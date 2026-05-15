export type MineralId = 'dirt' | 'copper' | 'iron' | 'steel'

export interface MineralStage {
    textureKey: string
}

export interface MineralType {
    id: MineralId
    name: string
    stages: [MineralStage, MineralStage, MineralStage]
    color: number
    hp: number
    baseWeight: number
}

export const MINERALS: MineralType[] = [
    {
        id: 'dirt',
        name: 'Tierra',
        stages: [
            { textureKey: 'dirt_1' },
            { textureKey: 'dirt_2' },
            { textureKey: 'dirt_3' },
        ],
        color: 0x8B5E3C,
        hp: 5,
        baseWeight: 70,
    },
    {
        id: 'copper',
        name: 'Cobre',
        stages: [
            { textureKey: 'copper1' },
            { textureKey: 'copper2' },
            { textureKey: 'copper3' },
        ],
        color: 0xD97706,
        hp: 10,
        baseWeight: 20,
    },
    {
        id: 'iron',
        name: 'Hierro',
        stages: [
            { textureKey: 'iron1' },
            { textureKey: 'iron2' },
            { textureKey: 'iron3' },
        ],
        color: 0x9CA3AF,
        hp: 20,
        baseWeight: 8,
    },
    {
        id: 'steel',
        name: 'Acero',
        stages: [
            { textureKey: 'steel1' },
            { textureKey: 'steel2' },
            { textureKey: 'steel3' },
        ],
        color: 0x38BDF8,
        hp: 40,
        baseWeight: 2,
    },
]

export function getRandomMineralByWeight(luckLevel = 0): MineralType {
    const weights = MINERALS.map((m) => {
        if (m.id === 'dirt') {
            return Math.max(5, m.baseWeight * (1 - luckLevel * 0.06))
        }
        return m.baseWeight + (70 - Math.max(5, 70 * (1 - luckLevel * 0.06))) * (m.baseWeight / 30)
    })

    const total = weights.reduce((a, b) => a + b, 0)
    let roll = Math.random() * total

    for (let i = 0; i < MINERALS.length; i++) {
        roll -= weights[i]
        if (roll <= 0) return MINERALS[i]
    }
    return MINERALS[0]
}

export function getStageIndex(hpPct: number): number {
    if (hpPct >= 0.75) return 0
    if (hpPct >= 0.25) return 1
    return 2
}

export function getMineralById(id: MineralId): MineralType | undefined {
    return MINERALS.find((m) => m.id === id)
}
