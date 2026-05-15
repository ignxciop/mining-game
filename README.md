# ⛏️ Mining Game

Juego incremental/idle de minería construido con **Phaser 4** + **React 19** + **TypeScript**.

Inspirado en _Keep on Mining!_, el objetivo es minar recursos, mejorar tus herramientas, desbloquear automatización y progresar infinitamente mediante crecimiento exponencial y mejoras estratégicas.

![screenshot](screenshot.png)

---

## Características

### Actuales (v1)

- Haz clic para minar bloques con barra de HP visible
- 5 recursos mineables: Piedra, Carbón, Hierro, Oro, Diamante
- 4 mejoras con costo exponencial
- Progresión de herramientas: de Pico de Madera a Pico Legendario
- Números flotantes de daño y partículas al romper bloques
- Auto-miner (daño automático cada segundo)
- Guardado automático en localStorage

### Planeadas

- Sistema de prestige / rebirth con multiplicadores permanentes
- Árbol de habilidades con builds distintas
- Rarezas de herramientas y minerales (Common → Mythic)
- Zonas / biomas con bloques únicos
- Eventos y bosses
- Logros y guardado en la nube
- Música relajante y efectos de sonido

---

## Stack Tecnológico

| Capa           | Tecnología                                        |
| -------------- | ------------------------------------------------- |
| Motor de juego | [Phaser 4](https://phaser.io/)                    |
| UI             | [React 19](https://react.dev/)                    |
| Estado global  | [Zustand](https://github.com/pmndrs/zustand)      |
| Estilos        | [Tailwind CSS 4](https://tailwindcss.com/)        |
| Build          | [Vite 6](https://vitejs.dev/)                     |
| Lenguaje       | [TypeScript 5.7](https://www.typescriptlang.org/) |
| Persistencia   | localStorage (middleware persist de Zustand)      |

---

## Cómo empezar

### Requisitos

- [Node.js](https://nodejs.org/) >= 18

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

---

## Estructura del proyecto

```
game/
├── public/
│   └── style.css              # Entry point de Tailwind + estilos base
├── src/
│   ├── main.tsx               # Entry point de React
│   ├── App.tsx                # Layout principal (canvas Phaser + overlay React)
│   ├── PhaserGame.tsx         # Componente puente React ↔ Phaser
│   ├── store/
│   │   └── gameStore.ts       # Store de Zustand (estado, acciones, persistencia)
│   ├── components/
│   │   ├── ResourcePanel.tsx  # Barra superior: recursos y estadísticas
│   │   └── UpgradeShop.tsx   # Barra inferior: botones de mejoras
│   └── game/
│       ├── main.ts            # Configuración e inicialización de Phaser
│       ├── EventBus.ts        # Emisor de eventos para comunicación React ↔ Phaser
│       ├── entities/
│       │   └── Block.ts       # Clase Bloque (HP, drops, loot table)
│       ├── systems/
│       │   └── MiningSystem.ts # Lógica de minería (daño, rotura, recompensas)
│       └── scenes/
│           ├── Boot.ts        # Escena de arranque
│           ├── Preloader.ts   # Carga de assets
│           └── MiningScene.ts # Escena principal del juego
├── vite/
│   ├── config.dev.mjs         # Configuración de Vite para desarrollo
│   └── config.prod.mjs        # Configuración de Vite para producción
├── package.json
└── README.md
```

---

## Cómo jugar

1. **Haz clic en el bloque** del centro para minarlo
2. Cada clic hace daño según el poder de tu pico
3. Cuando el HP del bloque llega a 0, se **rompe** y suelta recursos
4. Los bloques se vuelven **más duros y más valiosos** a medida que avanzas
5. Gasta **Piedra** en mejoras desde el panel inferior:
    - **Fuerza de Pico** — +1 de daño por golpe
    - **Velocidad** — minas más rápido
    - **Suerte** — mayor probabilidad de minerales raros
    - **Auto Miner** — daño automático cada segundo
6. El progreso se **guarda automáticamente** en tu navegador

---

## Fórmulas

### Costo de mejoras

```
costo = costoBase × crecimiento^nivel
```

| Mejora         | Costo Base | Crecimiento |
| -------------- | ---------- | ----------- |
| Fuerza de Pico | 10         | 1.5         |
| Velocidad      | 25         | 1.8         |
| Suerte         | 50         | 2.0         |
| Auto Miner     | 100        | 2.2         |

### HP del bloque

```
hp = 5 + nivel × 2
```

### Probabilidad de drops (por nivel de profundidad)

```
carbón:   min(0.30 + nivel × 0.03, 0.90)
hierro:   min(0.20 + nivel × 0.02, 0.70)
oro:      min(0.10 + nivel × 0.01, 0.50)
diamante: min(0.05 + nivel × 0.005, 0.30)
```

---

## Roadmap

### v1 ✅ (actual)

- Loop básico de minería
- 5 recursos
- 4 mejoras
- Auto-guardado

### v2 (próxima)

- Sistema de prestige / rebirth
- Árbol de habilidades
- Rarezas para herramientas y minerales
- Pulido visual (partículas, animaciones)

### v3 (futuro)

- Eventos y bosses
- Guardado en la nube (PostgreSQL + Node.js)
- Logros
- Audio (SFX + música)

---

## Licencia

[MIT](LICENSE)
