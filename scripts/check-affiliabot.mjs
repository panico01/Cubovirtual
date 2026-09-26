// node --experimental-strip-types scripts/check-affiliabot.mjs
import assert from 'node:assert/strict'
import { offers, processOffer, storeOf, TAG } from '../app/portfolio/affiliabot/app/data.ts'

const all = { amazon: true, ml: true, shopee: true }
assert.equal(storeOf('https://amzn.to/x'), 'amazon')
assert.equal(storeOf('https://produto.mercadolivre.com.br/MLB-1'), 'ml')
assert.equal(storeOf('https://shp.ee/abc'), 'shopee')
assert.equal(storeOf('https://amazon.com.br.golpe.com/x'), null)                // domínio parecido não passa
assert.equal(storeOf('https://loja-qualquer.com/x'), null)

const r1 = processOffer(offers[0].text, all)
assert.ok(r1.ok && r1.store === 'amazon' && r1.text.includes(`tag=${TAG}`))
assert.ok(r1.ok && !/grupo vip/i.test(r1.text))                               // frase bloqueada removida
assert.ok(r1.ok && !r1.text.includes('amzn.to'))                              // link original trocado
assert.equal(processOffer(offers[4].text, all).ok, false)                       // loja sem integração: descarta
const off = processOffer(offers[1].text, { ...all, ml: false })
assert.ok(!off.ok && off.reason.includes('desligada'))
assert.equal(processOffer('sem link nenhum', all).ok, false)
const two = processOffer('a https://amzn.to/1 b https://loja-x.com/2', all)     // um link ruim derruba tudo
assert.equal(two.ok, false)
console.log('ok — regras do motor AffiliaBOT')
