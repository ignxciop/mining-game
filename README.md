# ⛏️ Mining Game

Juego incremental/idle de minería con sesiones cortas. Construido con **Phaser 4** + **React 19** + **TypeScript**.

Inspirado en *Keep on Mining!* y juegos idle modernos. Mové el mouse sobre los minerales para minarlos automáticamente en sesiones de 20 segundos.

![screenshot](game/screenshot.png)

---

## Características

### Gameplay
- **Sesiones de 20 segundos** — miná lo más que puedas antes de que se acabe el tiempo
- **Minería por proximidad** — mové el mouse cerca de un mineral y se mina solo
- **Círculo de minería** — visualiza tu rango de daño alrededor del cursor
- **4 minerales con rareza**: Tierra (70%), Cobre (20%), Hierro (8%), Acero (2%)
- **3 estados visuales** por mineral según su vida restante (intacto → dañado → crítico)
- **Sprites reales** — cada mineral tiene su propio PNG con 3 variantes
- **Resumen post-sesión** — al terminar el tiempo, ves exactamente qué ganaste

### Currencies
Cada mineral destruido entrega **exactamente 1 unidad de sí mismo**:
- 🪨 **Tierra** — común, 5 HP
- 🥉 **Cobre** — poco común, 10 HP
- 🔩 **Hierro** — raro, 20 HP
- 💎 **Acero** — muy raro, 40 HP

### Upgrades (3)
| Mejora | Stat | Costo | Fórmula |
|--------|------|-------|---------|
| ⛏️ **Fuerza de Pico** | Daño por golpe (exponencial) | Tierra | `1 + nivel×(nivel+1)/2` |
| ⚡ **Velocidad** | Ticks por segundo | Cobre | `0.15 / (1 + nivel×0.15)` |
| 🍀 **Suerte** | Probabilidad de minerales raros | Hierro | Reduce peso de Tierra dinámicamente |

### Feedback visual
- Partículas al golpear minerales
- Fragmentos al romperlos
- Números de daño flotantes
- Temporizador visual con cambio de color y pulso al acercarse al final
- Círculo de minería con glow

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Motor de juego | [Phaser 4](https://phaser.io/) |
| UI | [React 19](https://react.dev/) |
| Estado global | [Zustand](https://github.com/pmndrs/zustand) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) |
| Build | [Vite 6](https://vitejs.dev/) |
| Lenguaje | [TypeScript 5.7](https://www.typescriptlang.org/) |
| Persistencia | localStorage (middleware persist de Zustand) |

---

## Cómo empezar

### Requisitos
- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) (opcional, usa `npm` si no lo tenés)

### Instalar y ejecutar

```bash
# desde el directorio game/
pnpm install
pnpm run dev
```

El servidor de desarrollo arranca en `http://localhost:8080`.

### Build para producción

```bash
pnpm run build
```

El resultado se genera en la carpeta `dist/`.

### Docker (producción)

```bash
# Desde la raíz del proyecto
cp .env.example .env
docker compose up -d --build
```

El juego se sirve en `http://localhost:4011`.

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `nginx` | 4011 | Reverse proxy (frontend + API futura) |
| `game` | — | Frontend con nginx interno (SPA) |
| `backend` | 4012 | API placeholder (Express, futuro) |
| `db` | 5432 | PostgreSQL (futuro, comentado) |

---

## Estructura del proyecto

```
├── docker-compose.yml          # Orquestación de servicios
├── .env.example                # Variables de entorno
├── nginx/
│   └── nginx.conf              # Reverse proxy (frontend + API)
├── game/
│   ├── Dockerfile              # Multi-stage build (node → nginx)
│   ├── nginx.conf              # Nginx interno para SPA
│   ├── .dockerignore
│   ├── public/
│   │   └── assets/
│   │       ├── ores/           # Sprites PNG de minerales
│   │       └── background/     # Fondos de niveles
│   ├── src/
│   │   ├── index.css           # Entry point de Tailwind
│   │   ├── main.tsx            # Entry point de React
│   │   ├── App.tsx             # Layout y navegación
│   │   ├── PhaserGame.tsx      # Componente puente React ↔ Phaser
│   │   ├── store/
│   │   │   └── gameStore.ts    # Estado global con persistencia
│   │   ├── components/
│   │   ├── MainMenu.tsx        # Menú principal (Minar / Mejoras)
│   │   ├── Sidebar.tsx         # Barra lateral (pico + recursos)
│   │   ├── UpgradeShop.tsx     # Botones de mejoras
│   │   ├── SessionSummary.tsx  # Resumen post-sesión
│   │   └── UpgradesView.tsx    # Pantalla completa de mejoras
│   └── game/
│       ├── main.ts             # Configuración de Phaser
│       ├── EventBus.ts         # Eventos React ↔ Phaser
│       ├── entities/
│       │   ├── Block.ts        # Bloque minable (HP, drops, textura)
│       │   ├── MineralTypes.ts # Configuración de minerales (pesos, HP, texturas)
│       │   └── Zone.ts         # Definiciones de zonas (legacy)
│       ├── systems/
│       │   └── MiningSystem.ts # Sistema de minería (legacy)
│       └── scenes/
│           └── MiningScene.ts  # Escena principal (gameplay)
├── package.json
└── README.md
```

---

## Cómo jugar

1. **Menú principal** → presioná **"Minar"**
2. Entrás a una **sesión de 20 segundos**
3. **Mové el mouse** sobre los minerales en el área verde
4. Un **círculo** muestra tu rango de minería
5. Los minerales dentro del círculo **reciben daño automáticamente**
6. Cuando se rompen, **dan 1 de su propio recurso** y reaparecen en otra posición
7. El **temporizador** cuenta regresivamente (cambia a amarillo → rojo)
8. Al llegar a 0, ves el **resumen** de lo obtenido en esa sesión
9. Elegí: **Minar otra vez**, **Mejoras** o **Menú**

### Mejoras
Desde el menú principal o el resumen, entrá a **Mejoras** para gastar tus recursos:

- **Fuerza de Pico** (🪨 Tierra) — daño exponencial cuanto más alto el nivel
- **Velocidad** (🥉 Cobre) — más ticks de daño por segundo
- **Suerte** (🔩 Hierro) — menos Tierra, más Cobre/Hierro/Acero al spawnear

---

## Fórmulas

### Costo de mejoras
```
costo = costoBase × crecimiento^nivel
```

| Mejora | Costo Base | Crecimiento | Currency |
|--------|-----------|-------------|----------|
| Fuerza de Pico | 10 | 1.5 | Tierra |
| Velocidad | 5 | 1.6 | Cobre |
| Suerte | 3 | 1.7 | Hierro |

### Daño del pico
```
daño = 1 + nivel × (nivel + 1) / 2
```

### Intervalo de daño
```
intervalo = 0.15 / (1 + nivelVelocidad × 0.15)
```

### Rareza de minerales
| Mineral | Peso base | HP |
|---------|----------|----|
| Tierra | 70 | 5 |
| Cobre | 20 | 10 |
| Hierro | 8 | 20 |
| Acero | 2 | 40 |

La **Suerte** reduce dinámicamente el peso de Tierra y lo redistribuye entre Cobre, Hierro y Acero.

---

## Roadmap

### v1 ✅ (actual)
- Sesiones de 20 segundos con temporizador
- Minería automática por proximidad del mouse
- 4 minerales con sprites y 3 estados visuales
- 3 mejoras con fórmulas exponenciales
- Sidebar con pico y recursos
- Resumen post-sesión
- Guardado automático

### v2 (próxima)
- Sistema de prestige con multiplicadores
- Más minerales y mejoras
- Efectos de sonido
- Más feedback visual (partículas, animaciones)

### v3 (futuro)
- Logros
- estadísticas globales
- Guardado en la nube (PostgreSQL + Node.js backend)
- Multiplicadores de sesión

---

## Licencia

[MIT](LICENSE)
