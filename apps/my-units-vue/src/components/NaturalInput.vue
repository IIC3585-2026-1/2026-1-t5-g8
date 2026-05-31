<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseQuery, computeResult, formatResult, type ParseResult } from '@/composables/useNaturalParser'

type MatchEvent = {
  category: string
  value: number
  fromUnit: string
  toUnit: string
}

const emit = defineEmits<{ match: [MatchEvent] }>()

const input = ref('')
const parsed = ref<ParseResult | null>(null)

const resultText = computed(() => {
  if (!parsed.value) return null
  const n = computeResult(parsed.value)
  return `${parsed.value.value} ${parsed.value.fromUnit} = ${formatResult(n)} ${parsed.value.toUnit}`
})

function onInput() {
  parsed.value = parseQuery(input.value)
  if (parsed.value) {
    emit('match', {
      category: parsed.value.category,
      value: parsed.value.value,
      fromUnit: parsed.value.fromUnit,
      toUnit: parsed.value.toUnit,
    })
  }
}
</script>

<template>
  <div class="natural-wrap">
    <div class="input-row">
      <span class="icon">⌕</span>
      <input
        v-model="input"
        class="natural-input"
        type="text"
        placeholder="e.g. 22 km to miles, twenty kgs to pounds…"
        spellcheck="false"
        @input="onInput"
      />
    </div>

    <p v-if="input && resultText" class="hint ok">
      {{ resultText }}
      <span class="category">({{ parsed!.category }})</span>
    </p>
    <p v-else-if="input && !resultText" class="hint err">
      No se pudo interpretar — intenta algo como "22 km to miles"
    </p>
  </div>
</template>

<style scoped>
.natural-wrap {
  margin-bottom: 1.75rem;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 0.85rem;
  transition: border-color 0.15s;
}

.input-row:focus-within {
  border-color: var(--accent);
}

.icon {
  font-size: 1.2rem;
  color: var(--text-secondary);
  user-select: none;
  line-height: 1;
}

.natural-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  padding: 0.65rem 0;
  color: var(--text-primary);
  outline: none;
}

.natural-input::placeholder {
  color: var(--text-secondary);
  font-style: italic;
}

.hint {
  margin: 0.4rem 0.2rem 0;
  font-size: 0.875rem;
}

.hint.ok {
  color: var(--accent);
  font-weight: 500;
}

.hint.err {
  color: var(--text-secondary);
}

.category {
  font-weight: 400;
  opacity: 0.75;
  margin-left: 0.3rem;
}
</style>
