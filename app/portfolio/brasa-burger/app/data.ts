// Cardápio fictício e regras de pedido da demo Brasa Burger (sem backend: tudo roda no navegador)

export type Layer = 'bottom' | 'sauce' | 'patty' | 'veggie' | 'cheese' | 'bacon' | 'lettuce' | 'tomato' | 'onion' | 'top'
export type Category = 'burgers' | 'acompanhamentos' | 'bebidas' | 'sobremesas'
export type Product = {
  id: string
  category: Category
  name: string
  desc: string
  price: number
  layers?: Layer[] // só burgers; de baixo para cima
  icon?: string
  tag?: string
}
export type Extra = { id: 'smash' | 'cheddar' | 'bacon' | 'cebola'; name: string; price: number }
export type CartItem = { key: string; productId: string; extras: Extra['id'][]; note: string; qty: number }
export type Mode = 'entrega' | 'retirada'
export type Payment = 'pix' | 'cartao' | 'dinheiro'
export type Order = {
  id: number
  items: CartItem[]
  mode: Mode
  payment: Payment
  name: string
  address: string
  totals: Totals
  createdAt: number
}
export type Totals = { subtotal: number; fee: number; discount: number; total: number }

export const categories: { id: Category; label: string }[] = [
  { id: 'burgers', label: 'Burgers' },
  { id: 'acompanhamentos', label: 'Acompanhamentos' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'sobremesas', label: 'Sobremesas' },
]

export const products: Product[] = [
  { id: 'classico', category: 'burgers', name: 'Brasa Clássico', desc: 'Smash 120g, cheddar, alface, tomate e molho da casa no pão brioche.', price: 32.9,
    layers: ['bottom', 'sauce', 'patty', 'cheese', 'lettuce', 'tomato', 'top'] },
  { id: 'double', category: 'burgers', name: 'Double Smash', desc: 'Dois smash de 120g, cheddar em dobro e cebola caramelizada.', price: 41.9, tag: 'Mais pedido',
    layers: ['bottom', 'patty', 'cheese', 'patty', 'cheese', 'onion', 'top'] },
  { id: 'inferno', category: 'burgers', name: 'Bacon Inferno', desc: 'Smash, cheddar, bacon crocante e molho picante de pimenta defumada.', price: 39.9, tag: 'Picante',
    layers: ['bottom', 'sauce', 'patty', 'cheese', 'bacon', 'top'] },
  { id: 'veggie', category: 'burgers', name: 'Brasa Veggie', desc: 'Burger de grão-de-bico na brasa, queijo, alface e tomate.', price: 34.9,
    layers: ['bottom', 'sauce', 'veggie', 'cheese', 'lettuce', 'tomato', 'top'] },
  { id: 'batata', category: 'acompanhamentos', name: 'Batata rústica', desc: 'Com páprica defumada e maionese de alho.', price: 16.9, icon: '🍟' },
  { id: 'onion', category: 'acompanhamentos', name: 'Onion rings', desc: 'Anéis de cebola empanados, crocantes por fora.', price: 18.9, icon: '🧅' },
  { id: 'nuggets', category: 'acompanhamentos', name: 'Nuggets da casa', desc: '8 unidades com molho barbecue.', price: 19.9, icon: '🍗' },
  { id: 'refri', category: 'bebidas', name: 'Refrigerante lata', desc: '350 ml, bem gelado.', price: 6.9, icon: '🥤' },
  { id: 'limonada', category: 'bebidas', name: 'Limonada da casa', desc: 'Limão-siciliano, hortelã e gengibre. 500 ml.', price: 9.9, icon: '🍋' },
  { id: 'shake', category: 'bebidas', name: 'Milkshake de Nutella', desc: 'Cremoso, com calda e chantilly. 400 ml.', price: 19.9, icon: '🥛' },
  { id: 'brownie', category: 'sobremesas', name: 'Brownie com sorvete', desc: 'Brownie quente, sorvete de creme e calda.', price: 17.9, icon: '🍫' },
  { id: 'cookie', category: 'sobremesas', name: 'Cookie gigante', desc: 'Massa amanteigada com gotas de chocolate.', price: 12.9, icon: '🍪' },
]

export const extras: Extra[] = [
  { id: 'smash', name: 'Smash extra', price: 9 },
  { id: 'cheddar', name: 'Cheddar extra', price: 4 },
  { id: 'bacon', name: 'Bacon crocante', price: 6 },
  { id: 'cebola', name: 'Cebola caramelizada', price: 4 },
]

export const DELIVERY_FEE = 5.9
export const FREE_DELIVERY_FROM = 80
export const COUPON = 'BRASA10'
export const STEP_MS = 10_000 // demo acelerada: cada etapa do pedido leva 10 s

export const productOf = (id: string) => products.find((p) => p.id === id) ?? products[0]
export const extraOf = (id: Extra['id']) => extras.find((e) => e.id === id)!
export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Adicionais entram no lugar certo do lanche (o 3D e a miniatura usam esta mesma lista)
export function buildLayers(product: Product, chosen: Extra['id'][]): Layer[] {
  const out: Layer[] = (product.layers ?? []).filter((l) => l !== 'top')
  const lastOf = (...kinds: Layer[]) => Math.max(...kinds.map((k) => out.lastIndexOf(k)))
  if (chosen.includes('smash')) out.splice(lastOf('patty', 'veggie') + 1, 0, 'patty')
  if (chosen.includes('cheddar')) out.splice(lastOf('patty', 'veggie') + 1, 0, 'cheese')
  if (chosen.includes('bacon')) out.splice(lastOf('cheese', 'patty', 'veggie') + 1, 0, 'bacon')
  if (chosen.includes('cebola')) out.push('onion')
  return [...out, 'top']
}

export const unitPrice = (item: Pick<CartItem, 'productId' | 'extras'>) =>
  productOf(item.productId).price + item.extras.reduce((s, e) => s + extraOf(e).price, 0)

const round = (v: number) => Math.round(v * 100) / 100

export function totals(items: CartItem[], mode: Mode, coupon: string): Totals {
  const subtotal = round(items.reduce((s, i) => s + unitPrice(i) * i.qty, 0))
  const fee = mode === 'retirada' || subtotal >= FREE_DELIVERY_FROM || subtotal === 0 ? 0 : DELIVERY_FEE
  const discount = coupon.trim().toUpperCase() === COUPON ? round(subtotal * 0.1) : 0
  return { subtotal, fee, discount, total: round(subtotal + fee - discount) }
}

// Mesmo lanche com os mesmos adicionais e observação soma na quantidade
export function addToCart(cart: CartItem[], item: Omit<CartItem, 'key'>): CartItem[] {
  const key = `${item.productId}|${[...item.extras].sort().join(',')}|${item.note.trim()}`
  const found = cart.find((c) => c.key === key)
  if (found) return cart.map((c) => (c.key === key ? { ...c, qty: c.qty + item.qty } : c))
  return [...cart, { ...item, key, note: item.note.trim() }]
}

export const trackSteps = (mode: Mode) =>
  mode === 'entrega'
    ? ['Pedido recebido', 'Na chapa', 'Saiu para entrega', 'Entregue']
    : ['Pedido recebido', 'Na chapa', 'Pronto para retirada', 'Retirado']

// Etapa atual (0–3) e progresso contínuo (0–1) do pedido a partir do horário em que foi feito
export function trackState(createdAt: number, now: number) {
  const elapsed = Math.max(0, now - createdAt)
  return { step: Math.min(3, Math.floor(elapsed / STEP_MS)), progress: Math.min(1, elapsed / (3 * STEP_MS)) }
}
