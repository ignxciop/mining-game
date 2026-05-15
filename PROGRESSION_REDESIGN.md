# ⛏️ Mining Game — Rediseño de Progresión v2.0

---

## 1. Mineral Tiers & Rarezas (24 minerales reales)

### Tier 1 — Early Game (comunes, spawn inmediato)

| Mineral | HP | Peso base | Color | Efecto especial |
|---------|----|-----------|-------|-----------------|
| clay | 3 | 20 | Marrón claro | — |
| shale | 4 | 18 | Gris pizarra | — |
| sulfur | 6 | 12 | Amarillo | **Explosivo**: al romperse daña minerales adyacentes (-3 HP en radio 60px) |

### Tier 2 — Early-Mid (aparecen tras ~5 runs o 100 bloques rotos)

| Mineral | HP | Peso base | Color | Efecto especial |
|---------|----|-----------|-------|-----------------|
| copper | 8 | 15 | Naranja | — |
| iron | 12 | 12 | Gris acero | — |
| coal_crystal | 10 | 10 | Negro brillante | **Aceleración**: al romperlo, +50% velocidad de ticks por 3s |
| cinnabar | 14 | 8 | Rojo oscuro | **Veneno**: al romperlo, el siguiente mineral recibe +3 de daño inicial |

### Tier 3 — Mid Game (requiere tener al menos 3 skills desbloqueadas)

| Mineral | HP | Peso base | Color | Efecto especial |
|---------|----|-----------|-------|-----------------|
| silver | 16 | 10 | Plateado | **Bonus de monedas**: da +2 de recurso en vez de +1 |
| obsidian | 25 | 6 | Negro profundo | **Resistente**: reduce el daño recibido en 1 (mínimo 1) |
| jade | 18 | 7 | Verde | **Cadena**: al romperse, 30% de chance de romper otro mineral aleatorio |
| malachite | 15 | 8 | Verde bandeado | **Multiplicador**: los siguientes 3 golpes hacen 2x de daño |

### Tier 4 — Mid-Late (requiere 6+ skills desbloqueadas)

| Mineral | HP | Peso base | Color | Efecto especial |
|---------|----|-----------|-------|-----------------|
| lapis_lazuli | 20 | 5 | Azul profundo | **Suerte**: +20% rareza en el siguiente spawn |
| turquoise | 22 | 4 | Azul verdoso | **Escudo**: el próximo mineral recibe 30% menos daño (mecánica de protección) |
| rose_quartz | 18 | 5 | Rosa | **Cura/Vida**: restaura 1 HP al mineral que estás minando (alarga la run) |
| citrine | 18 | 4 | Amarillo dorado | **Oro**: duplica recursos por 5s |

### Tier 5 — Late Game (requiere 10+ skills o prestige 1+)

| Mineral | HP | Peso base | Color | Efecto especial |
|---------|----|-----------|-------|-----------------|
| fluorite | 24 | 3 | Multicolor | **Rebote**: 25% del daño se propaga a otro mineral |
| rhodonite | 28 | 2 | Rosa oscuro | **Combo**: cada golpe a este mineral acumula combo +1, al romperse da combo × recursos |
| amber | 20 | 3 | Ámbar | **Fósil**: 10% de chance de no consumirse, reaparece en otra posición |
| blue_topaz | 26 | 2 | Azul claro | **Crítico garantizado**: los próximos 2 golpes son críticos |

### Tier 6 — Ultra Late / Prestige (requiere prestige 2+)

| Mineral | HP | Peso base | Color | Efecto especial |
|---------|----|-----------|-------|-----------------|
| emerald | 30 | 1.5 | Verde esmeralda | **Jackpot**: al romperlo, explota en recursos × 3 |
| sapphire | 35 | 1 | Azul zafiro | **Tiempo**: +2 segundos al temporizador de la run |
| amethyst | 32 | 1.2 | Púrpura | **Multi-run**: los recursos obtenidos cuentan × 1.5 para prestige |
| aquamarine | 28 | 1 | Azul marino | **Ola**: daña TODOS los minerales en pantalla en -5 HP |

### Tier 7 — Legendary / Evento (rarísimos, spawn condicional)

| Mineral | HP | Peso base | Color | Efecto especial |
|---------|----|-----------|-------|-----------------|
| sunstone | 40 | 0.5 | Dorado radiante | **Sol**: todos los minerales reciben 2 de daño cada tick durante 8s |
| void | 50 | 0.3 | Negro violáceo | **Vacío**: distorsiona el área, los minerales aledaños reciben daño +1 por tick |
| moonstone | 45 | 0.4 | Blanco lunar | **Luna**: congela el temporizador por 5s (el tiempo no avanza) |

---

## 2. Sistema de Progresión por Etapas

### Early Game (runs 1-20)

**Objetivo:** Desbloquear el nodo raíz y las primeras ramas.
**Duración estimada:** 20-30 minutos.
**Sensación:** Cada run desbloquea algo.

| Hito | Condición | Recompensa |
|------|-----------|------------|
| Primera run completada | — | +5 tierra inicial |
| 10 bloques rotos | Automático | Desbloquea nodo `sharp_pick` |
| 50 bloques rotos total | Estadística | Desbloquea `strong_swing` y `quick_hands` |
| Obtener 20 cobre total | Recurso | Desbloquea rama Utilidad |
| Tener 3 skills activas | Skills | Spawnean minerales Tier 2 (sulfur, coal_crystal, cinnabar) |
| 100 bloques rotos | Estadística | Desbloquea la rama Suerte completa |

**Pacing:** Las primeras 5 runs deben permitir al jugador comprar 2-3 skills. Cada run debe sentirse más poderosa que la anterior.

### Mid Game (runs 20-80)

**Objetivo:** Especializarse en una build, desbloquear Tier 3-4.
**Duración estimada:** 2-4 horas.
**Sensación:** Las builds empiezan a diferenciarse.

| Hito | Condición | Recompensa |
|------|-----------|------------|
| 500 bloques rotos | Estadística | Spawnean Tier 3 (obsidian, jade, malachite) |
| 6 skills desbloqueadas | Skills | Desbloquea nodos legendarios en cada rama |
| 20 de daño por tick | Tool power | Desbloquea `crit_chance` en el árbol (si no se había comprado) |
| 5 de speed | Speed level | Los ticks se sienten notablemente más rápidos |
| 8 skills desbloqueadas | Skills | Spawnean Tier 4 (lapis, turquoise, rose_quartz, citrine) |
| Primera vez que rompes obsidian | Hito | Desbloquea "Minero Resistente" (perk visual) |

### Late Game (runs 80+)

**Objetivo:** Prepararse para prestige, maximizar builds.
**Duración estimada:** 5-10 horas.
**Sensación:** Cada run genera recursos masivos y te acerca al prestige.

| Hito | Condición | Recompensa |
|------|-----------|------------|
| 12 skills desbloqueadas | Skills | Spawnean Tier 5 (fluorite, rhodonite, amber, blue_topaz) |
| 5,000 bloques rotos total | Estadística | Desbloquea "Modo Automático" para menú (QoL) |
| 100 de daño por tick | Tool power | Desbloquea el skill "Golpe Cataclísmico" en el árbol |
| 15 skills desbloqueadas | Skills | Spawnean Tier 6 (emerald, sapphire, amethyst, aquamarine) |
| Prestige disponible | Skills + estadísticas | Aparece botón de prestige en el menú |

### Prestige Game (después del primer prestige)

**Objetivo:** Multiplicadores permanentes, builds híbridas.
**Duración estimada:** Ilimitada (loop de prestige).

| Hito | Condición | Recompensa |
|------|-----------|------------|
| 1er prestige | Requisitos cumplidos | Desbloquea minerales Tier 6 |
| 2do prestige | Prestige previo | Desbloquea minerales Tier 7 |
| 3er prestige | Prestige previo | Desbloquea "Multiplicador de Prestige ×2" |
| 5to prestige | Prestige previo | Desbloquea nods legendarios 

---

## 3. Sistema de Prestige / Rebirth

### Cómo se desbloquea

El prestige aparece cuando:
- Tienes 15+ skills desbloqueadas
- Has roto 10,000+ bloques en total
- Tienes 100+ de acero acumulado

### Qué se resetea

- Todos los recursos (`resources`)
- Todos los skills del árbol (`skills`)
- Todas las stat upgrades (`upgrades`)
- El nivel del pico (`tool.power`)
- Estadísticas de run

### Qué se mantiene

- `prestige_level` (nuevo campo en store)
- `prestige_points` (moneda prestige)
- Prestige upgrades comprados (permanentes)
- Desbloqueos permanentes (minerales Tier 6+)
- Logros/milestones globales

### Moneda Prestige: **Fragmentos de Vacío**

Fórmula de ganancia de prestige:

```
fragmentos = floor(acero_total_acumulado ^ 0.6)
```

| Acero acumulado | Fragmentos ganados |
|----------------|-------------------|
| 100 | 15 |
| 500 | 41 |
| 1,000 | 63 |
| 5,000 | 166 |
| 10,000 | 251 |

### Tienda Prestige (upgrades permanentes)

| Upgrade | Costo | Efecto |
|---------|-------|--------|
| Fuerza Eterna | 10 | +1 daño base permanente |
| Velocidad Eterna | 10 | +1 speed permanente |
| Suerte Eterna | 10 | +1 luck permanente |
| Minería Acelerada | 25 | Empiezas cada run con +3 speed |
| Pico Legendario | 50 | Empiezas cada run con daño × 2 |
| Multiplicador ×2 | 100 | Todos los recursos ×2 |
| Invocación Mineral | 30 | +2 minerales extra en el área |
| Vacío Interior | 75 | Los minerales void aparecen siempre |
| Alquimia Mayor | 150 | Cada recurso da +1 adicional |

---

## 4. Nuevo Árbol de Habilidades (24 nodos, 6 ramas)

### Rama Daño (rojo) — 4 nodos

| Nodo | Costo | Requiere | Efecto |
|------|-------|----------|--------|
| sharp_pick | 5 dirt | — | `pickaxe_power` +1 (raíz) |
| strong_swing | 20 clay, 5 copper | sharp_pick | `pickaxe_power` +1 |
| giant_strike | 20 copper, 5 iron | strong_swing | `pickaxe_power` +2 |
| crit_chance | 10 copper, 3 iron (×3) | strong_swing | `crit_chance` +5% por nivel |

### Rama Velocidad (cyan) — 3 nodos

| Nodo | Costo | Requiere | Efecto |
|------|-------|----------|--------|
| quick_hands | 15 clay, 3 copper | sharp_pick | `speed` +1 |
| swift_miner | 15 copper, 5 iron | quick_hands | `speed` +2 |
| blitz | 15 iron, 3 steel | swift_miner | `speed` +3 |

### Rama Suerte (verde) — 3 nodos

| Nodo | Costo | Requiere | Efecto |
|------|-------|----------|--------|
| lucky_find | 15 clay, 3 copper | sharp_pick | `luck` +1 |
| rare_hunter | 15 copper, 5 iron | lucky_find | `luck` +2 |
| treasure_magnet | 15 iron, 5 steel | rare_hunter | `luck` +3 |

### Rama Utilidad (púrpura) — 4 nodos

| Nodo | Costo | Requiere | Efecto |
|------|-------|----------|--------|
| efficiency | 25 clay, 10 copper | sharp_pick | Todo mineral da +1 recurso |
| magnet | 20 copper, 8 iron (×2) | efficiency | `mining_range` +10px |
| fortune | 20 iron, 10 steel | efficiency | 20% de duplicar recurso |
| explosion_master | 25 iron, 5 amethyst | fortune | Los sulfur tienen efecto AoE doble |

### Rama Especialización (naranja) — 5 nodos

| Nodo | Costo | Requiere | Efecto |
|------|-------|----------|--------|
| coal_affinity | 10 sulfur | efficiency | `coal_crystal` aparece 50% más seguido |
| obsidian_heart | 15 obsidian | coal_affinity | +1 de daño contra minerales resistentes |
| jade_chain | 20 jade | obsidian_heart | `jade` chain effect sube a 50% |
| void_touched | 5 void | 10 skills total | Minerales void siempre spawn + 1 |
| sun_chosen | 3 sunstone | void_touched | Los sunstone duran 12s en vez de 8s |

### Rama Legendaria (dorada) — 5 nodos (solo post-prestige)

| Nodo | Costo | Requiere | Efecto |
|------|-------|----------|--------|
| eternal_pick | 5 prestige | 1er prestige | +5 daño base permanente |
| time_warper | 5 prestige | 1er prestige | +3s a todas las runs |
| rare_magnet | 5 prestige | 1er prestige | Todos los minerales raros tienen 30% más de spawn |
| diamond_skin | 5 prestige | 1er prestige | Los minerales dan 2 recursos en vez de 1 |
| cosmic_miner | 10 prestige | 2do prestige | Todos los efectos especiales de minerales tienen 50% más de potencia |

---

## 5. Nuevas Estadísticas

| Stat | Rol | Fórmula o comportamiento |
|------|-----|-------------------------|
| `crit_chance` | % de crítico | Cada golpe tiene `crit_chance%` de hacer ×3 de daño |
| `crit_damage` | Multiplicador de crítico | Base ×3, escalable con skills |
| `efficiency` | +1 recurso extra | `drops = base + efficiency` |
| `fortune` | % duplicación | `random < fortune% → recursos × 2` |
| `fortune_mult` | Multiplicador de fortuna | Cuando fortune activa, multiplica por `1 + fortune_mult` |
| `explosion_radius` | Radio de explosión sulfur | Base 60px + `explosion_radius × 10px` |
| `combo_chain` | Cadena combo | Se acumula con ciertos minerales, multiplica recursos al romperlos |
| `time_bonus` | Segundos extra por run | `SESSION_DURATION + time_bonus` |
| `spawn_rate` | Velocidad de reaparición | Los minerales rotos reaparecen `spawn_rate%` más rápido |

---

## 6. Runs — Objetivos y Misiones

### Misiones Diarias (3 por día)

| Misión | Recompensa |
|--------|-----------|
| Rompe 50 minerales en una run | +50 tierra |
| Consigue 10 cobre en una run | +5 cobre |
| Rompe un mineral de acero | +1 acero |
| Activa 3 críticos en una run | +1 hierro |
| Rompe 3 minerales raros seguidos | +1 steel |
| No rompas ningún mineral por 5s | +50% speed en la próxima run |
| Rompe un mineral en menos de 0.5s | +2 recursos del tipo roto |

### Logros Globales

| Logro | Condición | Recompensa |
|-------|-----------|------------|
| Principiante | 100 bloques rotos | +1 speed permanente |
| Minero | 1,000 bloques rotos | Desbloquea mineral Tier 3 |
| Veterano | 10,000 bloques rotos | Desbloquea prestige |
| Legendario | 100,000 bloques rotos | +5 daño permanente |
| Coleccionista | Rompe cada tipo de mineral al menos 1 vez | Desbloquea nodo legendario |
| Velocista | Completa una run en menos de 5s reales (minerales rotos muy rápido) | +2 speed permanente |
| Millonario | Consigue 1,000 de cualquier recurso | +1 fortuna |

---

## 7. Builds Recomendadas

### Build "Velocista" (Speed)

**Nodos clave:** `quick_hands` → `swift_miner` → `blitz`
**Sinergias:**
- `coal_crystal` da aceleración temporal
- Más ticks → más oportunidades de crítico
- Ideal para farming rápido de minerales comunes

**Gameplay:** Los minerales explotan casi instantáneamente. Sensación de "imparable".

### Build "Crítica" (Crit)

**Nodos clave:** `sharp_pick` → `strong_swing` → `crit_chance`
**Sinergias:**
- `blue_topaz` garantiza críticos
- `rhodonite` acumula combo con críticos
- Alto daño burst, bueno contra minerales resistentes

**Gameplay:** Golpes normales moderados, pero de repente un crítico explota el mineral.

### Build "Fortuna" (Luck + Utility)

**Nodos clave:** `lucky_find` → `rare_hunter` → `treasure_magnet` + `fortune`
**Sinergias:**
- Minerales raros aparecen más seguido
- `fortune` duplica recursos frecuentemente
- `efficiency` da +1 extra

**Gameplay:** Cada mineral roto da muchos recursos. Sensación de "lluvia de loot".

### Build "Caudillos" (Explosiones + Cadena)

**Nodos clave:** `efficiency` → `explosion_master` + `jade_chain`
**Sinergias:**
- `sulfur` explota en AoE
- `jade` encadena rompiendo otros minerales
- Las cadenas generan combos

**Gameplay:** Un mineral roto desencadena reacciones en cadena. Muy satisfactorio visualmente.

---

## 8. Progression Flow (Early → Mid → Late → Prestige)

```
EARLY (runs 1-20)
├── Minerales: clay, shale, sulfur
├── Skills disponibles: sharp_pick, strong_swing, quick_hands
├── Sensación: cada run compro 1-2 skills nuevas
└── Duración por run: 15-20s reales

MID (runs 20-80)
├── Minerales: + copper, iron, coal_crystal, cinnabar, obsidian, jade
├── Skills disponibles: + swift_miner, lucky_find, efficiency
├── Sensación: me estoy especializando en una build
├── Duración por run: 18-20s reales (minerales más duros)
└── Primera vez que veo un mineral raro emocionante

LATE (runs 80+)
├── Minerales: + lapis, turquoise, fluorite, rhodonite, amber
├── Skills disponibles: + blitz, treasure_magnet, fortune, magnet
├── Sensación: mi build está completa, farmeo masivo
├── Duración por run: 20s (aprovecho cada segundo)
└── Me estoy preparando para prestige

PRESTIGE
├── Reseteo skills y recursos
├── Mantengo prestige upgrades (daño, speed, luck permanentes)
├── Spawnean Tier 6 instantáneamente (emerald, sapphire)
├── Sensación: "wow, ahora soy mucho más rápido que antes"
└── Nueva run: rompo clay en 1 tick, progreso muchísimo más rápido
```

---

## 9. Visual Feedback por Rareza

| Rareza | Color glow | Partículas al romper | Screen shake | Efecto de spawn |
|--------|-----------|---------------------|-------------|-----------------|
| Común (T1) | Sin glow | 3-5 partículas | No | Aparece sin efecto |
| Poco común (T2) | Blanco suave | 5-8 partículas | Mínimo | Pequeño fade in |
| Raro (T3) | Azul claro | 8-12 partículas | Suave | Destello azul |
| Épico (T4) | Púrpura | 12-18 partículas | Medio | Aparición con glow |
| Legendario (T5+) | Dorado/naranja | 18-25 partículas | Fuerte | Animación de entrada con rayos |
| Evento (T7) | Arcoíris pulsante | 25-35 partículas | Muy fuerte | Slow-motion al aparecer + sonido |

---

## 10. Fórmulas de Balance

### Daño del pico (exponencial real)

```
tool_power = 1 + (level × (level + 1)) / 2
```

### Intervalo de speed

```
interval = 1 / (1 + speed_level × 0.18)
```

### Costo de skills (multi-recurso)

Cada skill en el árbol tiene costos fijos (no escalan por nivel). Pero los nodos con `maxLevel > 1` (como `crit_chance`) tienen costo por nivel:

```
crit_chance nivel N:  (10 + N×5) cobre  +  (3 + N×2) hierro
magnet nivel N:       (20 + N×8) cobre  +  (8 + N×4) hierro
```

### Spawn rate de minerales según stats

```
peso_base modificado por luck:
  peso = max(1, peso_base - luck × 2)

peso_base modificado por minerales desbloqueados:
  Si no has roto nunca ese tipo: peso × 0.3 (hasta que rompas 1)
  Si has roto 100+ de ese tipo: peso × 1.5 (más común)

peso_base modificado por prestige:
  prestige_level ≥ 2: Tier 6 siempre tiene peso ≥ 1
  prestige_level ≥ 3: Tier 7 siempre tiene peso ≥ 0.5
```

### Fórmula de crítico

```
crit_chance_total = upgrades['crit_chance'] ?? 0  // 5% por nivel
crit_damage_mult = 3  // base, escalable con skills
// En MiningScene, al aplicar daño:
if (random < crit_chance_total / 100) {
    damage *= crit_damage_mult
    // mostrar popup "¡CRÍTICO!" con glow
}
```

### Fórmula de fortuna (duplicación)

```
fortune_chance = (upgrades['fortune'] ?? 0) * 20  // 20% por nivel
// Al romper un mineral:
if (random < fortune_chance / 100) {
    rewards[key] *= 2
    // mostrar popup "¡FORTUNA x2!"
}
```

---

## 11. Power Spikes — Momentos Clave

| Momento | Qué pasa | Sensación |
|---------|----------|-----------|
| Compras `strong_swing` | Daño sube de 1 a 2 | "Ahora rompo el doble de rápido" |
| Compras `quick_hands` | Ticks bajan de 1s a 0.87s | "Se siente más fluido" |
| Rompes tu primer `sulfur` | Explota y daña minerales cerca | "Wow, hubo una explosión" |
| Llegas a 5 de daño | Rompes clay en 1 tick | "Los minerales explotan" |
| Consigues `crit_chance` nivel 2 | 10% de crítico | "De repente salen números rojos gigantes" |
| Rompes tu primer `void` | Distorsión visual, daño masivo | "Esto es ÉPICO" |
| Primer prestige | Todo se resetea pero eres 2× más rápido | "Empiezo de nuevo pero poderoso" |
| Compras `time_warper` | Runs duran 23s en vez de 20s | "Más tiempo para farmear" |

---

## 12. Implementación Técnica — Próximos Pasos

Para implementar este rediseño, los archivos a modificar/crear serían:

1. **`src/data/MineralRarity.ts`** — Nueva: define los 24 minerales con tiers, HP, pesos, efectos especiales
2. **`src/data/SkillTreeData.ts`** — Actualizar: 24 nodos, 6 ramas, costos multi-recurso
3. **`src/store/gameStore.ts`** — Agregar: `prestige_level`, `prestige_points`, `prestige_upgrades`, milestones
4. **`src/game/entities/Block.ts`** — Actualizar: soporte para efectos especiales por mineral
5. **`src/game/scenes/MiningScene.ts`** — Mejorar: críticos, partículas por rareza, screen shake, efectos especiales
6. **`src/components/SkillTreeView.tsx`** — Actualizar: 6 ramas, colores, nodos legendarios
7. **`src/components/PrestigeView.tsx`** — Nueva: pantalla de prestige con tienda
8. **`src/components/Milestones.tsx`** — Nueva: logros y misiones
9. **`src/components/MainMenu.tsx`** — Actualizar: botón de prestige, mostrar nivel

---

Este documento contiene TODO el diseño de progresión v2.0. Cada sección es implementable de forma independiente y escalable.
