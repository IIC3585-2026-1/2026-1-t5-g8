<script lang="ts">
  import type { Component } from 'svelte';
  import ArrowUpDown from '@lucide/svelte/icons/a-arrow-down';

  type Props = {
    title: string;
    Icon: Component;
    units: string[];
    toBase: Record<string, number> | null;
    defaults: [string, string];
  };

  let { title, Icon, units, toBase, defaults }: Props = $props();

  let value: number | '' = $state(1);
  let fromUnit: string = $state(defaults[0]);
  let toUnit: string = $state(defaults[1]);

  function convertTempToCelsius(v: number, unit: string): number {
    if (unit === '°C') return v;
    if (unit === '°F') return (v - 32) * 5 / 9;
    return v - 273.15;
  }

  function convertFromCelsiusTo(v: number, unit: string): number {
    if (unit === '°C') return v;
    if (unit === '°F') return v * 9 / 5 + 32;
    return v + 273.15;
  }

  function convert(inputValue: number, from: string, to: string): number {
    if (from === to) return inputValue;
    if (toBase === null) return convertFromCelsiusTo(convertTempToCelsius(inputValue, from), to);
    return (inputValue * toBase[from]) / toBase[to];
  }

  const result = $derived(!isNaN(value as number)
      ? convert(value as number, fromUnit, toUnit)
      : null
  );

  const formattedResult = $derived(
    result !== null ? format(result) : ''
  );

  function format(n: number): string {
    if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(3);
    if (Math.abs(n) >= 1_000_000) return n.toExponential(3);
    return parseFloat(n.toFixed(6)).toString();
  }

  function swapUnits() {
    [fromUnit, toUnit] = [toUnit, fromUnit];
  }
</script>

<article class="card">
  <header>
    <Icon size={18} color="green"></Icon>
    <h2>{title}</h2>
  </header>

  <div class="row">
    <input
      type="number"
      bind:value={value}
      placeholder="0"
      step="any"
    />
    <select bind:value={fromUnit}>
      {#each units as u (u)}
        <option value={u}>{u}</option>
      {/each}
    </select>
  </div>

  <div class="swap-row">
    <button
      class="swap-btn"
      onclick={swapUnits}
      title="Swap units"
    >
      <ArrowUpDown size={16}></ArrowUpDown>
    </button>
  </div>

  <div class="row">
    <input
      type="text"
      value={formattedResult}
      readonly
      placeholder="—"
      class="result"
    />
    <select bind:value={toUnit}>
      {#each units as u (u)}
        <option value={u}>{u}</option>
      {/each}
    </select>
  </div>
</article>

<style>
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.25rem;
    transition: box-shadow 0.2s, border-color 0.2s;
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

  input.resultado {
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
    transition: background 0.15s, transform 0.15s;
  }

  .swap-btn:hover {
    background: var(--bg-secondary);
    transform: rotate(180deg);
  }
</style>