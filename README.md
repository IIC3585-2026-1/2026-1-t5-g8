# MyUnits

Un convertidor de unidades construido **dos veces** con dos frameworks reactivos  
distintos: primero en **Svelte 5** y luego en **Vue 3**.

## Características

- **8 categorías de conversión**: longitud, peso, temperatura, volumen, área, velocidad,
tiempo y almacenamiento.
- **Conversión en tiempo real**: el resultado se recalcula apenas cambias el número o
cualquiera de las dos unidades.
- **Conversión inversa**: un botón de swap (↕) intercambia unidad de origen y destino sin
retipear.
- **Diseño por componentes**: cada categoría es una tarjeta (`ConversionCard`) reusable
que recibe su configuración por props. Las categorías son datos, no componentes
distintos, así que agregar una nueva es añadir un objeto a un arreglo.
- **Modo oscuro automático** según las preferencias del sistema y **grilla responsive**.
- **Lenguaje natural (solo en Vue)**: un buscador entiende frases como `"22 km to miles"`  
o `"twenty kgs to pounds"`, detecta la conversión y resalta la tarjeta correspondiente.

## Cómo ejecutarla

El repositorio es un monorepo con **npm workspaces**. Desde la raíz:

```bash
npm install          # instala dependencias de ambas apps

npm run dev:vue      # levanta la versión Vue
npm run dev:svelte   # levanta la versión Svelte
```

Build de producción:

```bash
npm run build:vue
npm run build:svelte
```

Requiere Node `^20.19.0 || >=22.12.0`.

## Vue vs Svelte

El mismo componente en los dos frameworks. Por ejemplo, estado y valor derivado:

```ts
// Vue: el estado es un "ref", se accede con .value
const value = ref(1)
const result = computed(() => convert(value.value, fromUnit.value, toUnit.value))
```

```ts
// Svelte: el estado es una variable normal, las runes hacen la reactividad
let value = $state(1)
const result = $derived(convert(value, fromUnit, toUnit))
```

Lo que sacamos en limpio comparándolos:

- **Reactividad**: Vue separa el contenedor reactivo (`ref`) de su contenido (`.value`);  
Svelte 5 hace que una variable normal sea reactiva con runes, lo que se siente más cercano a JavaScript plano.
- **Estructura**: Vue usa `main.ts` + router explícito; SvelteKit usa enrutamiento por archivos (`src/routes/`) y un `+layout.svelte` en vez de `App.vue`.
- **Estilos**: ambos tienen `<style>` con scope por componente y casi la misma sintaxis, así que migrar el CSS entre las dos apps fue prácticamente copiar y pegar.

## Uso de IA

- Estructura inicial de componentes, tipos de TypeScript y estilos repetitivos generados con ayuda de IA, lo que nos dejó tiempo para enfocarnos en  
entender los frameworks.
- La IA ayudó a juntar las tablas de las 8 categorías, que después verificamos a mano contra fuentes.
- **E**l parser de lenguaje natural lo propuso la IA con una librería externa que daba problemas en el bundle, así que la descartamos y reescribimos el conversor de palabras a números a mano. Las decisiones de arquitectura (diseño data-driven, no usar store global) fueron del equipo.
- Este README fue generado con apoyo de IA.

## Autoevaluación

**Fortalezas**

- Uso de IA como herramienta de apoyo con revisión crítica.
- Feature extra de lenguaje natural en la versión Vue.
- Buena planificación y separación de responsabilidad
- Dedicación a enteder bien la implementación de los frameworks y delegar a la IA solamente algunas implementaciones pero pensadas y aprobadas por nosotros.

**Por mejorar**

- Llevar la feature de lenguaje natural también a Svelte para una paridad real.
- Distribuir mejor los tiempos ya que la tarea contaba con harta complejidad en terminos de código al tratar con dos frameworks distintos.
- Mejor comunicación con el equipo para planificar como abordar la tarea.

