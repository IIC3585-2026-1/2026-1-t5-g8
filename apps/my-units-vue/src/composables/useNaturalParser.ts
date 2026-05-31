// Inline written-number converter to avoid ClojureScript-compiled library issues
const ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
}
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
}

function wordsToNumbers(text: string): string {
  // Normalize hyphens so "twenty-two" → "twenty two"
  const words = text.replace(/-/g, ' ').split(/\s+/)
  const out: string[] = []
  let i = 0

  while (i < words.length) {
    const w = words[i]!.toLowerCase()
    const next = words[i + 1]?.toLowerCase() ?? ''

    const isNumWord =
      w in ONES || w in TENS || w === 'hundred' || w === 'thousand' ||
      (w === 'a' && (next === 'hundred' || next === 'thousand'))

    if (!isNumWord) {
      out.push(words[i]!)
      i++
      continue
    }

    let total = 0
    let current = 0

    while (i < words.length) {
      const ww = words[i]!.toLowerCase()
      const nx = words[i + 1]?.toLowerCase() ?? ''
      if (ww === 'a' && (nx === 'hundred' || nx === 'thousand')) {
        current = current || 1
        i++
      } else if (ww in ONES) {
        current += ONES[ww]!
        i++
      } else if (ww in TENS) {
        current += TENS[ww]!
        i++
      } else if (ww === 'hundred') {
        current = (current || 1) * 100
        i++
      } else if (ww === 'thousand') {
        total += (current || 1) * 1000
        current = 0
        i++
      } else {
        break
      }
    }
    out.push(String(total + current))
  }
  return out.join(' ')
}

export type ParseResult = {
  value: number
  fromUnit: string
  toUnit: string
  category: string
  toBase: Record<string, number> | null
}

type CategoryDef = {
  title: string
  toBase: Record<string, number> | null
  aliases: Record<string, string> // alias (lowercase) → canonical unit key
}

const CATEGORIES: CategoryDef[] = [
  {
    title: 'Longitud',
    toBase: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 },
    aliases: {
      meter: 'm', meters: 'm', metre: 'm', metres: 'm',
      kilometer: 'km', kilometers: 'km', kilometre: 'km', kilometres: 'km', km: 'km', kms: 'km',
      centimeter: 'cm', centimeters: 'cm', centimetre: 'cm', centimetres: 'cm', cm: 'cm',
      millimeter: 'mm', millimeters: 'mm', millimetre: 'mm', millimetres: 'mm', mm: 'mm',
      mile: 'mi', miles: 'mi', mi: 'mi',
      foot: 'ft', feet: 'ft', ft: 'ft',
      inch: 'in', inches: 'in',
    },
  },
  {
    title: 'Peso',
    toBase: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, t: 1000 },
    aliases: {
      kilogram: 'kg', kilograms: 'kg', kilogramme: 'kg', kilogrammes: 'kg', kg: 'kg', kilos: 'kg', kilo: 'kg',
      gram: 'g', grams: 'g', gramme: 'g', grammes: 'g',
      milligram: 'mg', milligrams: 'mg', milligramme: 'mg', milligrammes: 'mg', mg: 'mg',
      pound: 'lb', pounds: 'lb', lb: 'lb', lbs: 'lb',
      ounce: 'oz', ounces: 'oz', oz: 'oz',
      'metric ton': 't', 'metric tons': 't', tonne: 't', tonnes: 't', ton: 't', tons: 't',
    },
  },
  {
    title: 'Temperatura',
    toBase: null,
    aliases: {
      celsius: '°C', centigrade: '°C', '°c': '°C',
      fahrenheit: '°F', farenheit: '°F', '°f': '°F',
      kelvin: 'K',
    },
  },
  {
    title: 'Volumen',
    toBase: { L: 1, mL: 0.001, 'm³': 1000, gal: 3.78541, 'fl oz': 0.0295735, cup: 0.236588 },
    aliases: {
      liter: 'L', liters: 'L', litre: 'L', litres: 'L', litro: 'L', litros: 'L',
      milliliter: 'mL', milliliters: 'mL', millilitre: 'mL', millilitres: 'mL', ml: 'mL',
      'cubic meter': 'm³', 'cubic meters': 'm³', 'cubic metre': 'm³', 'cubic metres': 'm³', 'm³': 'm³',
      gallon: 'gal', gallons: 'gal', gal: 'gal',
      'fluid ounce': 'fl oz', 'fluid ounces': 'fl oz', 'fl oz': 'fl oz', floz: 'fl oz',
      cup: 'cup', cups: 'cup',
    },
  },
  {
    title: 'Área',
    toBase: { 'm²': 1, 'km²': 1e6, 'cm²': 0.0001, ha: 10000, ac: 4046.86, 'ft²': 0.092903 },
    aliases: {
      'square meter': 'm²', 'square meters': 'm²', 'square metre': 'm²', 'square metres': 'm²', 'm²': 'm²',
      'square kilometer': 'km²', 'square kilometers': 'km²', 'km²': 'km²',
      'square centimeter': 'cm²', 'square centimeters': 'cm²', 'cm²': 'cm²',
      hectare: 'ha', hectares: 'ha', ha: 'ha',
      acre: 'ac', acres: 'ac', ac: 'ac',
      'square foot': 'ft²', 'square feet': 'ft²', 'ft²': 'ft²',
    },
  },
  {
    title: 'Velocidad',
    toBase: { 'km/h': 1, 'm/s': 3.6, mph: 1.60934, kn: 1.852 },
    aliases: {
      'kilometer per hour': 'km/h', 'kilometers per hour': 'km/h', 'km/h': 'km/h', kph: 'km/h', kmh: 'km/h',
      'meter per second': 'm/s', 'meters per second': 'm/s', 'm/s': 'm/s', mps: 'm/s',
      'mile per hour': 'mph', 'miles per hour': 'mph', mph: 'mph',
      knot: 'kn', knots: 'kn', kn: 'kn', kt: 'kn',
    },
  },
  {
    title: 'Tiempo',
    toBase: { s: 1, min: 60, h: 3600, día: 86400, sem: 604800 },
    aliases: {
      second: 's', seconds: 's', sec: 's', secs: 's',
      minute: 'min', minutes: 'min', min: 'min',
      hour: 'h', hours: 'h', hr: 'h', hrs: 'h',
      day: 'día', days: 'día', dia: 'día', día: 'día',
      week: 'sem', weeks: 'sem', sem: 'sem',
    },
  },
  {
    title: 'Almacenamiento',
    toBase: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
    aliases: {
      terabyte: 'TB', terabytes: 'TB', tb: 'TB',
      gigabyte: 'GB', gigabytes: 'GB', gb: 'GB',
      megabyte: 'MB', megabytes: 'MB', mb: 'MB',
      kilobyte: 'KB', kilobytes: 'KB', kb: 'KB',
      byte: 'B', bytes: 'B',
    },
  },
]

type FlatAlias = { alias: string; unit: string; category: string; toBase: Record<string, number> | null }

// Build sorted (longest-first) flat list for greedy matching
const FLAT_ALIASES: FlatAlias[] = CATEGORIES.flatMap((cat) =>
  Object.entries(cat.aliases).map(([alias, unit]) => ({
    alias,
    unit,
    category: cat.title,
    toBase: cat.toBase,
  })),
).sort((a, b) => b.alias.length - a.alias.length)

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findUnitInText(text: string, exclude?: string): FlatAlias | null {
  for (const entry of FLAT_ALIASES) {
    if (exclude && entry.category !== exclude) continue
    const escaped = escapeRegex(entry.alias)
    // Alphanumeric aliases use word boundaries; special-char aliases use simple match
    const pattern = /^[a-z0-9]+$/i.test(entry.alias)
      ? new RegExp(`\\b${escaped}\\b`, 'i')
      : new RegExp(escaped, 'i')
    if (pattern.test(text)) return entry
  }
  return null
}

const SEPARATOR_RE = /\b(to|into|in|as|a)\b/i

export function parseQuery(input: string): ParseResult | null {
  if (!input.trim()) return null

  // Convert written numbers ("twenty two" → "22")
  const converted = wordsToNumbers(input.trim())
  const str = typeof converted === 'string' ? converted : typeof converted === 'number' ? String(converted) : input

  // Extract numeric value
  const numMatch = str.match(/-?(\d+\.?\d*)/)
  if (!numMatch?.[0]) return null
  const value = parseFloat(numMatch[0])
  if (isNaN(value)) return null

  // Split into from-segment and to-segment
  const sepMatch = SEPARATOR_RE.exec(str)
  if (!sepMatch?.index) return null

  const leftSeg = str.slice(0, sepMatch.index)
  const rightSeg = str.slice(sepMatch.index + sepMatch[0].length)

  const fromMatch = findUnitInText(leftSeg)
  if (!fromMatch) return null

  // to-unit must be in the same category
  const toMatch = findUnitInText(rightSeg, fromMatch.category)
  if (!toMatch) return null

  return {
    value,
    fromUnit: fromMatch.unit,
    toUnit: toMatch.unit,
    category: fromMatch.category,
    toBase: fromMatch.toBase,
  }
}

function tempToCelsius(v: number, unit: string): number {
  if (unit === '°C') return v
  if (unit === '°F') return ((v - 32) * 5) / 9
  return v - 273.15
}

function celsiusTo(v: number, unit: string): number {
  if (unit === '°C') return v
  if (unit === '°F') return (v * 9) / 5 + 32
  return v + 273.15
}

export function computeResult(parsed: ParseResult): number {
  const { value, fromUnit, toUnit, toBase } = parsed
  if (fromUnit === toUnit) return value
  if (toBase === null) return celsiusTo(tempToCelsius(value, fromUnit), toUnit)
  return (value * toBase[fromUnit]!) / toBase[toUnit]!
}

export function formatResult(n: number): string {
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(3)
  if (Math.abs(n) >= 1_000_000) return n.toExponential(3)
  return parseFloat(n.toFixed(6)).toString()
}
