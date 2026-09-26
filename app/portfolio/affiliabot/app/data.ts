// Simulação do motor do AffiliaBOT com ofertas fictícias (nada aqui toca o sistema real)

export type Store = 'amazon' | 'ml' | 'shopee'
export type Offer = { id: number; channel: string; title: string; text: string; price: string; old: string; image: string }
export type Result =
  | { ok: true; store: Store; original: string; converted: string; text: string }
  | { ok: false; reason: string }

export const TAG = 'suaTag-20'
export const stores: { id: Store; name: string; color: string }[] = [
  { id: 'amazon', name: 'Amazon', color: '#FF9900' },
  { id: 'ml', name: 'Mercado Livre', color: '#FFE600' },
  { id: 'shopee', name: 'Shopee', color: '#EE4D2D' },
]

export const BLOCKED = ['entre no nosso grupo vip', 'link do grupo']

// Ofertas que chegam dos canais do Telegram (fictícias); a última de loja sem integração mostra o descarte
export const offers: Offer[] = [
  { id: 1, channel: 'Promoções Tech', title: 'Fone Bluetooth JBL Tune 520BT', price: 'R$ 199,90', old: 'R$ 349,00', image: '🎧',
    text: '🔥 Fone Bluetooth JBL Tune 520BT\n💸 De R$ 349,00 por R$ 199,90\n👉 https://amzn.to/3xFone52\nEntre no nosso grupo VIP' },
  { id: 2, channel: 'Achadinhos da Casa', title: 'Air Fryer Mondial 4L', price: 'R$ 279,90', old: 'R$ 459,90', image: '🍟',
    text: '🏠 Air Fryer Mondial 4L\n💸 Por R$ 279,90 à vista\n👉 https://meli.la/2AirFry4\nLink do grupo: t.me/achadinhos' },
  { id: 3, channel: 'Ofertas Relâmpago', title: 'Kit 3 camisetas básicas', price: 'R$ 59,90', old: 'R$ 99,90', image: '👕',
    text: '⚡ Kit 3 camisetas básicas algodão\n💸 R$ 59,90 com cupom\n👉 https://shp.ee/kit3cam' },
  { id: 4, channel: 'Promoções Tech', title: 'Echo Dot 5ª geração', price: 'R$ 284,05', old: 'R$ 449,00', image: '🔊',
    text: '🔊 Echo Dot 5ª geração\n💸 De R$ 449,00 por R$ 284,05\n👉 https://www.amazon.com.br/dp/B09B8V1LZ3' },
  { id: 5, channel: 'Achadinhos da Casa', title: 'Jogo de panelas 5 peças', price: 'R$ 189,00', old: 'R$ 299,00', image: '🍳',
    text: '🍳 Jogo de panelas antiaderente 5 peças\n💸 R$ 189,00\n👉 https://loja-qualquer.com/panelas' },
  { id: 6, channel: 'Ofertas Relâmpago', title: 'Tênis de corrida', price: 'R$ 229,90', old: 'R$ 399,90', image: '👟',
    text: '👟 Tênis de corrida amortecido\n💸 Por R$ 229,90\n👉 https://produto.mercadolivre.com.br/MLB-3412-tenis' },
]

const URL_RE = /https?:\/\/[^\s]+/g

export function storeOf(url: string): Store | null {
  const host = url.replace(/^https?:\/\//, '').split('/')[0].toLowerCase()
  if (/(^|\.)amazon\.com(\.br)?$|^amzn\.to$|^a\.co$/.test(host)) return 'amazon'
  if (/(^|\.)mercadolivre\.com(\.br)?$|^meli\.la$/.test(host)) return 'ml'
  if (/(^|\.)shopee\.com(\.br)?$|^shp\.ee$/.test(host)) return 'shopee'
  return null
}

// Ilustrativo: o link final leva a tag do afiliado (o sistema real usa as integrações de cada loja)
export function convert(url: string, store: Store) {
  const code = url.split('/').filter(Boolean).pop()!.replace(/[^A-Za-z0-9-]/g, '').slice(0, 12)
  if (store === 'amazon') return `https://www.amazon.com.br/dp/${code}?tag=${TAG}`
  if (store === 'ml') return `https://meli.la/${code}?tag=${TAG}`
  return `https://s.shopee.com.br/${code}?sub=${TAG}`
}

const plain = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Mesma regra do produto: qualquer link de loja sem integração (ou desligada) descarta a mensagem inteira
export function processOffer(text: string, enabled: Record<Store, boolean>): Result {
  const urls = text.match(URL_RE) ?? []
  if (!urls.length) return { ok: false, reason: 'Mensagem sem link de produto' }
  let out = text
  let first: { store: Store; original: string; converted: string } | null = null
  for (const url of urls) {
    const store = storeOf(url)
    if (!store) return { ok: false, reason: `Link de loja sem integração (${url.replace(/^https?:\/\//, '').split('/')[0]})` }
    if (!enabled[store]) return { ok: false, reason: `${stores.find((s) => s.id === store)!.name} está desligada` }
    const converted = convert(url, store)
    out = out.replace(url, converted)
    first ??= { store, original: url, converted }
  }
  out = out.split('\n').filter((line) => !BLOCKED.some((b) => plain(line).includes(b))).join('\n').trim()
  return { ok: true, ...first!, text: out }
}
