// node --experimental-strip-types scripts/check-brasa.mjs
import assert from 'node:assert/strict'
import { buildLayers, productOf, totals, addToCart, trackState, unitPrice, STEP_MS } from '../app/portfolio/brasa-burger/app/data.ts'

// camadas: adicionais no lugar certo e pão sempre no topo
assert.deepEqual(buildLayers(productOf('classico'), []), ['bottom', 'sauce', 'patty', 'cheese', 'lettuce', 'tomato', 'top'])
assert.deepEqual(buildLayers(productOf('classico'), ['smash', 'cheddar', 'bacon']),
  ['bottom', 'sauce', 'patty', 'patty', 'cheese', 'cheese', 'bacon', 'lettuce', 'tomato', 'top'])
assert.deepEqual(buildLayers(productOf('veggie'), ['smash']).slice(0, 4), ['bottom', 'sauce', 'veggie', 'patty'])
assert.equal(buildLayers(productOf('double'), ['cebola']).at(-2), 'onion')
assert.equal(buildLayers(productOf('double'), ['cebola']).at(-1), 'top')

// preços: R$ 32,90 + 9 + 4 = 45,90
assert.equal(unitPrice({ productId: 'classico', extras: ['smash', 'cheddar'] }), 45.9)
const item = { productId: 'classico', extras: ['bacon'], note: '', qty: 2 } // 2 × 38,90 = 77,80
let cart = addToCart([], item)
assert.deepEqual(totals(cart, 'entrega', ''), { subtotal: 77.8, fee: 5.9, discount: 0, total: 83.7 })
assert.deepEqual(totals(cart, 'retirada', ''), { subtotal: 77.8, fee: 0, discount: 0, total: 77.8 })
assert.deepEqual(totals(cart, 'entrega', ' brasa10 '), { subtotal: 77.8, fee: 5.9, discount: 7.78, total: 75.92 })
cart = addToCart(cart, { ...item, qty: 1 })                                     // mesmo item soma
assert.equal(cart.length, 1)
assert.equal(cart[0].qty, 3)
assert.equal(totals(cart, 'entrega', '').fee, 0)                                // acima de R$ 80: frete grátis
assert.equal(addToCart(cart, { ...item, note: 'sem cebola' }).length, 2)          // observação diferente: outro item
assert.deepEqual(totals([], 'entrega', ''), { subtotal: 0, fee: 0, discount: 0, total: 0 })

// acompanhamento do pedido
assert.deepEqual(trackState(1000, 1000), { step: 0, progress: 0 })
assert.equal(trackState(0, STEP_MS * 2 + 1).step, 2)
assert.deepEqual(trackState(0, STEP_MS * 99), { step: 3, progress: 1 })
console.log('ok — regras do cardápio e do pedido')
