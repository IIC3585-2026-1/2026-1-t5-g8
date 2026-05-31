<script setup lang="ts">
import {
  Ruler,
  Scale,
  Thermometer,
  Droplets,
  Square,
  Gauge,
  Timer,
  HardDrive,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import ConversionCard from '@/components/ConversionCard.vue'

type Conversor = {
  title: string
  icon: Component
  units: string[]
  toBase: Record<string, number> | null
  defaults: [string, string]
}

const conversores: Conversor[] = [
  {
    title: 'Longitud',
    icon: Ruler,
    units: ['m', 'km', 'cm', 'mm', 'mi', 'ft', 'in'],
    toBase: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 },
    defaults: ['m', 'km'],
  },
  {
    title: 'Peso',
    icon: Scale,
    units: ['kg', 'g', 'mg', 'lb', 'oz', 't'],
    toBase: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, t: 1000 },
    defaults: ['kg', 'lb'],
  },
  {
    title: 'Temperatura',
    icon: Thermometer,
    units: ['°C', '°F', 'K'],
    toBase: null,
    defaults: ['°C', '°F'],
  },
  {
    title: 'Volumen',
    icon: Droplets,
    units: ['L', 'mL', 'm³', 'gal', 'fl oz', 'cup'],
    toBase: { L: 1, mL: 0.001, 'm³': 1000, gal: 3.78541, 'fl oz': 0.0295735, cup: 0.236588 },
    defaults: ['L', 'gal'],
  },
  {
    title: 'Área',
    icon: Square,
    units: ['m²', 'km²', 'cm²', 'ha', 'ac', 'ft²'],
    toBase: { 'm²': 1, 'km²': 1e6, 'cm²': 0.0001, ha: 10000, ac: 4046.86, 'ft²': 0.092903 },
    defaults: ['m²', 'ft²'],
  },
  {
    title: 'Velocidad',
    icon: Gauge,
    units: ['km/h', 'm/s', 'mph', 'kn'],
    toBase: { 'km/h': 1, 'm/s': 3.6, mph: 1.60934, kn: 1.852 },
    defaults: ['km/h', 'm/s'],
  },
  {
    title: 'Tiempo',
    icon: Timer,
    units: ['s', 'min', 'h', 'día', 'sem'],
    toBase: { s: 1, min: 60, h: 3600, día: 86400, sem: 604800 },
    defaults: ['min', 'h'],
  },
  {
    title: 'Almacenamiento',
    icon: HardDrive,
    units: ['B', 'KB', 'MB', 'GB', 'TB'],
    toBase: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
    defaults: ['MB', 'GB'],
  },
]
</script>

<template>
  <main>
    <header>
      <h1>MyUnits</h1>
      <p>Conversor de unidades</p>
    </header>

    <div class="grid">
      <ConversionCard
        v-for="c in conversores"
        :key="c.title"
        :title="c.title"
        :icon="c.icon"
        :units="c.units"
        :to-base="c.toBase"
        :defaults="c.defaults"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

header p {
  color: var(--text-secondary);
  margin-top: 0.25rem;
  font-size: 0.95rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
}
</style>
