// node --experimental-strip-types scripts/check-vitalle.mjs
import assert from 'node:assert/strict'
import { conflicts, freeSlots, seed, fitsDay, proOf, CLOSE } from '../app/portfolio/vitalle/app/data.ts'

const a = { id: 'a', patient: 'X', phone: '', serviceId: 'limpeza', proId: 'helena', date: '2026-10-05', start: 600, status: 'confirmado' } // 10:00–11:00
assert.equal(conflicts([a], { ...a, id: 'b', start: 630 }), true)             // sobrepõe
assert.equal(conflicts([a], { ...a, id: 'b', start: 660 }), false)            // encosta no fim
assert.equal(conflicts([a], { ...a, id: 'b', start: 570, serviceId: 'consulta' }), false)            // 09:30 consulta de 30min termina às 10:00
assert.equal(conflicts([a], { ...a, id: 'b', start: 570, serviceId: 'limpeza' }), true)
assert.equal(conflicts([a], { ...a, id: 'b', proId: 'marina' }), false)       // outro profissional
assert.equal(conflicts([a], a), false)                                        // ele mesmo não conflita
assert.equal(fitsDay(CLOSE - 60, 'harmonizacao'), false)

const monday = new Date(2026, 9, 5, 7) // antes de abrir
const slots = freeSlots([a], '2026-10-05', 'limpeza', 'helena', monday)
assert.ok(!slots.some((s) => s.start === 600 || s.start === 570 || s.start === 630))
assert.ok(slots.some((s) => s.start === 660))
assert.ok(freeSlots([a], '2026-10-05', 'limpeza', null, monday).some((s) => s.start === 600 && s.proId !== 'helena'))
assert.equal(freeSlots([], '2026-10-05', 'consulta', 'helena', new Date(2026, 9, 5, 12, 10))[0].start, 12 * 60 + 30) // hoje: só depois de agora

const s = seed(monday)
assert.ok(s.length > 60)
assert.ok(s.every((x) => fitsDay(x.start, x.serviceId) && !conflicts(s, x) && new Date(x.date + 'T12:00').getDay() !== 0))
assert.ok(s.every((x) => proOf(x.proId).does.includes(x.serviceId)))                     // cada um no seu tratamento
assert.ok(freeSlots([], '2026-10-05', 'botox', null, monday).every((x) => x.proId === 'helena'))
assert.deepEqual(seed(monday), s) // determinístico
console.log('ok —', s.length, 'consultas no seed')
