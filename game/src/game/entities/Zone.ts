export interface ZoneConfig {
    id: string
    name: string
    color: number
    borderColor: number
    bgColor: number
    unlockCost: number
    minTier: number
}

export const ZONES: ZoneConfig[] = [
    {
        id: 'stone_quarry',
        name: 'Cantera de Piedra',
        color: 0x6b7280,
        borderColor: 0x22c55e,
        bgColor: 0x14532d,
        unlockCost: 0,
        minTier: 0,
    },
    {
        id: 'coal_mine',
        name: 'Mina de Carbón',
        color: 0x374151,
        borderColor: 0x1f2937,
        bgColor: 0x111827,
        unlockCost: 100,
        minTier: 10,
    },
    {
        id: 'iron_deposit',
        name: 'Depósito de Hierro',
        color: 0x92400e,
        borderColor: 0x78350f,
        bgColor: 0x1c1917,
        unlockCost: 500,
        minTier: 25,
    },
    {
        id: 'gold_vein',
        name: 'Veta de Oro',
        color: 0xd97706,
        borderColor: 0xb45309,
        bgColor: 0x1a1a0e,
        unlockCost: 2000,
        minTier: 50,
    },
    {
        id: 'diamond_cavern',
        name: 'Caverna de Diamante',
        color: 0x06b6d4,
        borderColor: 0x0891b2,
        bgColor: 0x0a1a1f,
        unlockCost: 10000,
        minTier: 100,
    },
]

export function getZoneForTier(tier: number): ZoneConfig {
    let best = ZONES[0]
    for (const zone of ZONES) {
        if (tier >= zone.minTier) {
            best = zone
        }
    }
    return best
}
