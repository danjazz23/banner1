# 🍔 Burger Kingdom - Digital Menu Experience

## Descripción

Experiencia digital interactiva diseñada para pantallas de establecimientos de comida rápida. Presenta un sistema de menú digital auto-interactivo que muestra hamburguesas, combos y ofertas especiales de forma cíclica y atractiva.

## Características Principales

### 🎨 Diseño Visual
- **Estética Premium**: Colores vibrantes (naranja, dorado, rojo) que estimulan el apetito
- **Animaciones Fluidas**: Transiciones suaves entre escenas usando GSAP
- **Tipografía Impactante**: Fuentes grandes y legibles desde distancia
- **Elementos Flotantes**: Hamburguesas y elementos con animación de flotación

### 🔄 Auto-Interactivo
- **Ciclo Automático**: Cambia de escena cada 12 segundos sin intervención
- **4 Escenas Principales**:
  1. **Hero**: Introducción impactante con hamburguesa estrella
  2. **Burgers**: Carrusel de hamburguesas premium
  3. **Combos**: Ofertas de menús completos
  4. **Ofertas**: Promociones temporales con countdown

### ⚡ Tecnología
- **GSAP**: Animaciones profesionales de alto rendimiento
- **CSS Moderno**: Variables CSS, Grid, Flexbox
- **SVG**: Gráficos vectoriales escalables
- **Vanilla JS**: Sin frameworks pesados

## Estructura del Proyecto

```
digital-menu/
├── index.html              # Documento principal
├── css/
│   ├── variables.css       # Sistema de diseño
│   ├── reset.css           # Normalización
│   ├── components.css      # Componentes UI
│   ├── animations.css      # Keyframes y utilidades
│   └── responsive.css      # Media queries
├── js/
│   ├── main.js             # Controlador principal
│   ├── utils/
│   │   └── helpers.js      # Funciones utilitarias
│   └── scenes/
│       ├── loader.js       # Pantalla de carga
│       ├── hero.js         # Escena hero
│       ├── burgers.js      # Escena burgers
│       ├── combos.js       # Escena combos
│       └── offers.js       # Escena ofertas
└── assets/
    └── images/
        └── burgers/        # SVGs de hamburguesas
```

## Uso

### En Establecimiento

1. Abrir `index.html` en un navegador moderno (Chrome recomendado)
2. Activar modo pantalla completa (F11)
3. El sistema comenzará automáticamente después de la carga

### Controles Manuales (Opcional)

- **Flechas ← →**: Navegar entre escenas
- **Espacio**: Pausar/reanudar ciclo automático
- **Click en indicadores**: Ir a escena específica

## Personalización

### Tiempos de Escena

Editar en `js/main.js`:
```javascript
config: {
    autoAdvanceDelay: 12000, // Milisegundos por escena
}
```

### Colores de Marca

Editar en `css/variables.css`:
```css
:root {
    --color-primary: #FF6B00;    /* Naranja principal */
    --color-secondary: #FFD700;  /* Dorado */
    --color-accent: #FF4757;     /* Rojo acento */
}
```

### Productos

Modificar el HTML en las secciones correspondientes:
- `.burger-card` para hamburguesas
- `.combo-card` para combos
- `.offer-card` para ofertas

## Performance

- **Peso Total**: ~200KB (sin contar imágenes externas)
- **FPS**: 60fps constantes en hardware moderno
- **Compatible**: Chrome, Firefox, Safari, Edge
- **Responsive**: Adaptable a diferentes resoluciones

## Accesibilidad

- Soporte para `prefers-reduced-motion`
- Contraste de color WCAG AA
- Semántica HTML correcta
- Navegación por teclado

## Licencia

Proyecto creado para demostración técnica.

---

**Burger Kingdom** - Experiencia Digital Menu © 2024
