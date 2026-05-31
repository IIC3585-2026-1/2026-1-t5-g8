<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import { ArrowUpDown } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  icon: Component
  units: string[]
  toBase: Record<string, number> | null
  defaults: [string, string]
}>()

const value = ref<number>(1)
const fromUnit = ref(props.defaults[0])
const toUnit = ref(props.defaults[1])

function convertTempToCelsius(v: number, unit: string): number {
  if (unit === '°C') return v
  if (unit === '°F') return ((v - 32) * 5) / 9
  return v - 273.15
}

function convertFromCelsiusTo(v: number, unit: string): number {
  if (unit === '°C') return v
  if (unit === '°F') return (v * 9) / 5 + 32
  return v + 273.15
}

function convert(inputValue: number, from: string, to: string): number {
  if (from === to) return inputValue
  if (props.toBase === null)
    return convertFromCelsiusTo(convertTempToCelsius(inputValue, from), to)
  return (inputValue * props.toBase[from]!) / props.toBase[to]!
}

function format(n: number): string {
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(3)
  if (Math.abs(n) >= 1_000_000) return n.toExponential(3)
  return parseFloat(n.toFixed(6)).toString()
}

const result = computed(() =>
  !isNaN(value.value) ? convert(value.value, fromUnit.value, toUnit.value) : null,
)

const formattedResult = computed(() => (result.value !== null ? format(result.value) : ''))

function swapUnits() {
  ;[fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value]
}
</script>

<template>
  <article class="card">
    <header>
      <component :is="icon" :size="18" color="green" />
      <h2>{{ title }}</h2>
    </header>

    <div class="row">
      <input v-model.number="value" type="number" placeholder="0" step="any" />
      <select v-model="fromUnit">
        <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
      </select>
    </div>

    <div class="swap-row">
      <button class="swap-btn" title="Swap units" @click="swapUnits">
        <ArrowUpDown :size="16" />
      </button>
    </div>

    <div class="row">
      <input :value="formattedResult" type="text" placeholder="—" readonly class="result" />
      <select v-model="toUnit">
        <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
      </select>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  border-color: var(--border-color-hover);
}

header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin: 0;
}

.row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

input[type='number'],
input[type='text'] {
  flex: 1;
  min-width: 0;
  font-size: 1.15rem;
  font-weight: 500;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: border-color 0.15s;
}

input[type='number']:focus {
  outline: none;
  border-color: var(--accent);
}

input.result {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: default;
}

select {
  padding: 0.5rem 0.4rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.15s;
}

select:focus {
  outline: none;
  border-color: var(--accent);
}

.swap-row {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
}

.swap-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: var(--text-secondary);
  transition:
    background 0.15s,
    transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swap-btn:hover {
  background: var(--bg-secondary);
  transform: rotate(180deg);
}
</style>
