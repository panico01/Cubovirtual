// node --experimental-strip-types scripts/check-vertice.mjs
import assert from 'node:assert/strict'
import { cars, filterCars, defaultFilters, installment, tradeIn, bestOf } from '../app/portfolio/vertice-motors/app/data.ts'

// filtros
assert.equal(filterCars(cars, defaultFilters).length, cars.length)
const suvs = filterCars(cars, { ...defaultFilters, bodies: ['suv'] })
assert.ok(suvs.length > 0 && suvs.every((c) => c.body === 'suv'))
assert.ok(filterCars(cars, { ...defaultFilters, q: 'hyundai creta' }).every((c) => c.model === 'Creta'))
assert.equal(filterCars(cars, { ...defaultFilters, q: 'dm-i hibrido' }).length, 1)          // sem acento acha "Híbrido"
assert.ok(filterCars(cars, { ...defaultFilters, maxPrice: 100_000 }).every((c) => c.price <= 100_000))
assert.ok(filterCars(cars, { ...defaultFilters, gear: 'Manual' }).every((c) => c.gear === 'Manual'))
const byPrice = filterCars(cars, defaultFilters).map((c) => c.price)
assert.deepEqual(byPrice, [...byPrice].sort((a, b) => a - b))
const byKm = filterCars(cars, { ...defaultFilters, sort: 'km' }).map((c) => c.km)
assert.deepEqual(byKm, [...byKm].sort((a, b) => a - b))

// tabela Price: 100 mil em 60x a 1,49% ≈ R$ 2.532,82
assert.ok(Math.abs(installment(100_000, 60) - 2532.82) < 0.01)
assert.equal(installment(0, 48), 0)
assert.ok(installment(50_000, 24) > installment(50_000, 60))

// avaliação do usado
const novo = tradeIn('corolla', 2026, 0)
const velho = tradeIn('corolla', 2018, 120_000)
assert.ok(novo.min < novo.max && velho.max < novo.min)
assert.equal(novo.min % 500, 0)
assert.equal(tradeIn('inexistente', 2020, 0), null)

assert.deepEqual(bestOf([cars[0], cars[2]]), { price: 149_900, km: 14_900, year: 2024 })
assert.ok(cars.length >= 20)
console.log('ok — regras do showroom')
