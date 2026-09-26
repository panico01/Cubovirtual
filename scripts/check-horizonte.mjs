// node --experimental-strip-types scripts/check-horizonte.mjs
import assert from 'node:assert/strict'
import { seed, distribute, moveStage, incoming, dailySeries, stageIndex, isActive, brokers } from '../app/portfolio/horizonte-imoveis/app/data.ts'

const now = Date.UTC(2026, 9, 1, 15)
const leads = seed(now)
assert.equal(leads.length, 34)
assert.deepEqual(seed(now), leads)                                            // determinístico
assert.equal(new Set(leads.map((l) => l.name)).size, leads.length)             // nomes únicos
assert.ok(leads.every((l) => l.createdAt <= now && l.updatedAt <= now && l.events.every((e, i) => i === 0 || e.at >= l.events[i - 1].at)))
assert.ok(leads.every((l) => l.brokerId || l.stage === 'novo'))                // só "novo" pode estar sem corretor
assert.ok(leads.filter((l) => stageIndex(l.stage) >= 3).every((l) => l.events.some((e) => e.text.startsWith('Proposta'))))

// roleta: todos recebem corretor e a carga fica equilibrada (diferença máx. 1 entre quem recebeu)
const unassigned = leads.filter((l) => !l.brokerId).length
const extra = [incoming(0, now), incoming(1, now + 1), incoming(2, now + 2)]
const { leads: after, assigned } = distribute([...leads, ...extra], now)
assert.equal(assigned.length, unassigned + 3)
assert.ok(after.every((l) => l.brokerId))
const loadBefore = brokers.map((b) => leads.filter((l) => isActive(l) && l.brokerId === b.id).length)
const minBefore = Math.min(...loadBefore)
const loadAfter = brokers.map((b) => after.filter((l) => isActive(l) && l.brokerId === b.id).length)
assert.ok(loadAfter.every((n, i) => n === loadBefore[i] || n - minBefore <= Math.ceil((unassigned + 3) / brokers.length) + 1))
assert.ok(Math.min(...loadAfter) >= minBefore + 1)                              // quem tinha menos recebeu

const moved = moveStage(leads[0], 'fechado', now)
assert.equal(moved.stage, 'fechado')
assert.match(moved.events.at(-1).text, /^Venda fechada/)
assert.equal(moveStage(leads[0], leads[0].stage, now), leads[0])                // mesma etapa: nada muda

assert.equal(dailySeries().length, 30)
assert.notEqual(incoming(0, now).name, incoming(1, now).name)
console.log('ok —', leads.length, 'leads no seed,', unassigned, 'sem corretor')
