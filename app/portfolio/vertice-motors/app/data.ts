// Estoque fictício e regras da demo Vértice Motors (sem backend: tudo roda no navegador)

export type Body = 'sedan' | 'suv' | 'hatch' | 'picape'
export type Car = {
  id: string // também é o nome da foto em /public/portfolio/vertice/<id>.webp
  brand: string
  model: string
  version: string
  year: number
  km: number
  price: number
  body: Body
  colorName: string
  fuel: 'Flex' | 'Diesel' | 'Híbrido' | 'Elétrico'
  gear: 'Automático' | 'Manual'
  badges: string[]
  items: string[]
}

export const bodies: { id: Body; label: string }[] = [
  { id: 'sedan', label: 'Sedã' },
  { id: 'suv', label: 'SUV' },
  { id: 'hatch', label: 'Hatch' },
  { id: 'picape', label: 'Picape' },
]

const A = 'Automático'
export const cars: Car[] = [
  { id: 'corolla', brand: 'Toyota', model: 'Corolla', version: 'Altis Premium Hybrid', year: 2023, km: 28_400, price: 164_900, body: 'sedan', colorName: 'Prata Supernova', fuel: 'Híbrido', gear: A, badges: ['Único dono', 'Revisões na concessionária'], items: ['Piloto automático adaptativo', 'Bancos em couro', 'Central multimídia', 'Câmera de ré'] },
  { id: 'civic', brand: 'Honda', model: 'Civic', version: 'Touring 1.5 Turbo', year: 2022, km: 41_300, price: 159_900, body: 'sedan', colorName: 'Prata Lunar', fuel: 'Flex', gear: A, badges: ['Laudo aprovado'], items: ['Honda Sensing', 'Som premium', 'Teto solar'] },
  { id: 'sentra', brand: 'Nissan', model: 'Sentra', version: 'Exclusive 2.0 CVT', year: 2024, km: 14_900, price: 149_900, body: 'sedan', colorName: 'Branco Diamond', fuel: 'Flex', gear: A, badges: ['Baixa km', 'Garantia de fábrica'], items: ['Câmera 360°', 'Som Bose', 'Bancos em couro'] },
  { id: 'polo', brand: 'Volkswagen', model: 'Polo', version: 'Highline 200 TSI', year: 2023, km: 19_800, price: 98_900, body: 'hatch', colorName: 'Vermelho Sunset', fuel: 'Flex', gear: A, badges: ['Baixa km'], items: ['Painel digital', 'Carregador por indução', 'Faróis full LED'] },
  { id: 'onix', brand: 'Chevrolet', model: 'Onix', version: 'RS 1.0 Turbo', year: 2023, km: 24_900, price: 94_900, body: 'hatch', colorName: 'Vermelho Carmim', fuel: 'Flex', gear: A, badges: ['Laudo aprovado'], items: ['Wi-Fi nativo', 'Alerta de ponto cego', 'Partida remota'] },
  { id: 'hb20', brand: 'Hyundai', model: 'HB20', version: 'Platinum Plus 1.0 TGDI', year: 2023, km: 22_100, price: 96_500, body: 'hatch', colorName: 'Cinza Silky', fuel: 'Flex', gear: A, badges: ['Único dono'], items: ['Frenagem autônoma', 'Painel digital', 'Carregador por indução'] },
  { id: 'argo', brand: 'Fiat', model: 'Argo', version: 'Drive 1.3', year: 2022, km: 36_700, price: 72_900, body: 'hatch', colorName: 'Vermelho Montecarlo', fuel: 'Flex', gear: 'Manual', badges: ['Único dono'], items: ['Central multimídia', 'Volante multifuncional'] },
  { id: 'kwid', brand: 'Renault', model: 'Kwid', version: 'Outsider 1.0', year: 2023, km: 18_200, price: 62_900, body: 'hatch', colorName: 'Laranja Ocre', fuel: 'Flex', gear: 'Manual', badges: ['Baixa km'], items: ['Central multimídia', 'Câmera de ré'] },
  { id: 'dolphin', brand: 'BYD', model: 'Dolphin', version: 'EV 95 cv', year: 2024, km: 7_300, price: 139_900, body: 'hatch', colorName: 'Branco Ski', fuel: 'Elétrico', gear: A, badges: ['Garantia de fábrica', 'Baixa km'], items: ['Autonomia de 290 km', 'Recarga rápida', 'Teto panorâmico'] },
  { id: 'compass', brand: 'Jeep', model: 'Compass', version: 'Limited T270', year: 2022, km: 41_200, price: 148_900, body: 'suv', colorName: 'Vermelho Colorado', fuel: 'Flex', gear: A, badges: ['Laudo aprovado'], items: ['Teto solar', 'Partida sem chave', 'Rodas aro 18'] },
  { id: 'renegade', brand: 'Jeep', model: 'Renegade', version: 'Longitude T270', year: 2022, km: 38_600, price: 109_900, body: 'suv', colorName: 'Branco Polar', fuel: 'Flex', gear: A, badges: ['Revisões na concessionária'], items: ['Central multimídia', 'Sensor de estacionamento', 'Ar digital'] },
  { id: 'corolla-cross', brand: 'Toyota', model: 'Corolla Cross', version: 'XRE 2.0', year: 2023, km: 26_800, price: 162_900, body: 'suv', colorName: 'Branco Perolizado', fuel: 'Flex', gear: A, badges: ['Único dono', 'Revisões na concessionária'], items: ['Toyota Safety Sense', 'Bancos em couro', 'Carregador por indução'] },
  { id: 'creta', brand: 'Hyundai', model: 'Creta', version: 'Ultimate 2.0', year: 2024, km: 9_100, price: 154_900, body: 'suv', colorName: 'Branco Atlas', fuel: 'Flex', gear: A, badges: ['Baixa km', 'Garantia de fábrica'], items: ['Teto solar panorâmico', 'Frenagem autônoma', 'Ar digital dual zone'] },
  { id: 'hr-v', brand: 'Honda', model: 'HR-V', version: 'Touring 1.5 Turbo', year: 2023, km: 21_400, price: 169_900, body: 'suv', colorName: 'Prata Platinum', fuel: 'Flex', gear: A, badges: ['Laudo aprovado'], items: ['Honda Sensing', 'Teto solar', 'Porta-malas elétrico'] },
  { id: 'kicks', brand: 'Nissan', model: 'Kicks', version: 'Platinum 1.0 Turbo', year: 2025, km: 5_800, price: 159_900, body: 'suv', colorName: 'Azul Deep Ocean', fuel: 'Flex', gear: A, badges: ['Garantia de fábrica', 'Baixa km'], items: ['Câmera 360°', 'Som Bose', 'ProPilot'] },
  { id: 't-cross', brand: 'Volkswagen', model: 'T-Cross', version: 'Highline 250 TSI', year: 2024, km: 16_500, price: 152_900, body: 'suv', colorName: 'Branco Puro', fuel: 'Flex', gear: A, badges: ['Baixa km'], items: ['Painel digital', 'Teto solar', 'Piloto adaptativo'] },
  { id: 'nivus', brand: 'Volkswagen', model: 'Nivus', version: 'Highline 200 TSI', year: 2022, km: 33_900, price: 114_900, body: 'suv', colorName: 'Cinza Moonstone', fuel: 'Flex', gear: A, badges: ['Único dono'], items: ['VW Play', 'Faróis full LED', 'Piloto adaptativo'] },
  { id: 'tracker', brand: 'Chevrolet', model: 'Tracker', version: 'Premier 1.2 Turbo', year: 2022, km: 35_100, price: 119_900, body: 'suv', colorName: 'Azul Eclipse', fuel: 'Flex', gear: A, badges: ['Laudo aprovado'], items: ['Teto solar', 'Wi-Fi nativo', 'Estacionamento automático'] },
  { id: 'pulse', brand: 'Fiat', model: 'Pulse', version: 'Impetus 1.0 Turbo', year: 2023, km: 23_700, price: 107_900, body: 'suv', colorName: 'Branco Banchisa', fuel: 'Flex', gear: A, badges: ['Único dono'], items: ['Central multimídia', 'Carregador por indução', 'Partida sem chave'] },
  { id: 'song-plus', brand: 'BYD', model: 'Song Plus', version: 'DM-i Híbrido', year: 2024, km: 12_500, price: 219_900, body: 'suv', colorName: 'Branco Neve', fuel: 'Híbrido', gear: A, badges: ['Garantia de fábrica', 'Baixa km'], items: ['Autonomia de 1.000 km', 'Tela giratória', 'Carregador por indução'] },
  { id: 'sw4', brand: 'Toyota', model: 'SW4', version: 'SRX 2.8 Diesel 4x4 7 lugares', year: 2021, km: 72_300, price: 329_900, body: 'suv', colorName: 'Branco Perolizado', fuel: 'Diesel', gear: A, badges: ['Revisões na concessionária'], items: ['7 lugares', 'Tração 4x4', 'Bancos em couro'] },
  { id: 'hilux', brand: 'Toyota', model: 'Hilux', version: 'SRX 2.8 4x4', year: 2021, km: 68_000, price: 259_900, body: 'picape', colorName: 'Branco Perolizado', fuel: 'Diesel', gear: A, badges: ['Revisões na concessionária'], items: ['Tração 4x4', 'Controle de descida', 'Capota marítima'] },
  { id: 'ranger', brand: 'Ford', model: 'Ranger', version: 'Wildtrak 3.0 V6', year: 2024, km: 15_600, price: 309_900, body: 'picape', colorName: 'Laranja Luxe', fuel: 'Diesel', gear: A, badges: ['Baixa km', 'Garantia de fábrica'], items: ['Motor V6', 'Câmera 360°', 'Modos de terreno'] },
  { id: 'amarok', brand: 'Volkswagen', model: 'Amarok', version: 'Extreme V6 4Motion', year: 2023, km: 29_800, price: 289_900, body: 'picape', colorName: 'Azul Starlight', fuel: 'Diesel', gear: A, badges: ['Único dono'], items: ['Motor V6', 'Tração 4Motion', 'Bancos em couro'] },
  { id: 'toro', brand: 'Fiat', model: 'Toro', version: 'Volcano 2.0 Diesel 4x4', year: 2022, km: 54_200, price: 164_900, body: 'picape', colorName: 'Prata Bari', fuel: 'Diesel', gear: A, badges: ['Laudo aprovado'], items: ['Tração 4x4', 'Central multimídia', 'Bancos em couro'] },
  { id: 'strada', brand: 'Fiat', model: 'Strada', version: 'Volcano 1.3 Cabine Dupla', year: 2023, km: 27_300, price: 104_900, body: 'picape', colorName: 'Cinza Strato', fuel: 'Flex', gear: 'Manual', badges: ['Único dono'], items: ['Cabine dupla', 'Central multimídia', 'Rodas aro 16'] },
]

export const RATE = 0.0149 // taxa mensal ilustrativa
export const TERMS = [24, 36, 48, 60]

export const carOf = (id: string) => cars.find((c) => c.id === id) ?? cars[0]
export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
export const km = (v: number) => `${v.toLocaleString('pt-BR')} km`

// Parcela pela tabela Price
export function installment(financed: number, months: number, rate = RATE) {
  if (financed <= 0) return 0
  return (financed * rate) / (1 - Math.pow(1 + rate, -months))
}

export type Filters = { q: string; bodies: Body[]; maxPrice: number; minYear: number; gear: 'todos' | Car['gear']; sort: 'preco' | 'km' | 'ano' }
export const defaultFilters: Filters = { q: '', bodies: [], maxPrice: 350_000, minYear: 2021, gear: 'todos', sort: 'preco' }

const plain = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function filterCars(list: Car[], f: Filters) {
  const q = plain(f.q.trim())
  return list
    .filter((c) => !q || plain(`${c.brand} ${c.model} ${c.version}`).includes(q))
    .filter((c) => !f.bodies.length || f.bodies.includes(c.body))
    .filter((c) => c.price <= f.maxPrice && c.year >= f.minYear)
    .filter((c) => f.gear === 'todos' || c.gear === f.gear)
    .sort((a, b) => (f.sort === 'preco' ? a.price - b.price : f.sort === 'km' ? a.km - b.km : b.year - a.year || a.km - b.km))
}

// Avaliação ilustrativa do usado: tabela-base × idade × quilometragem, com faixa de ±5%
export const tradeModels: { id: string; label: string; base: number }[] = [
  { id: 'hb20', label: 'Hyundai HB20', base: 92_000 },
  { id: 'onix', label: 'Chevrolet Onix', base: 95_000 },
  { id: 'gol', label: 'Volkswagen Gol', base: 78_000 },
  { id: 'kicks', label: 'Nissan Kicks', base: 128_000 },
  { id: 'corolla', label: 'Toyota Corolla', base: 150_000 },
  { id: 'renegade', label: 'Jeep Renegade', base: 132_000 },
]

export function tradeIn(modelId: string, year: number, mileage: number, thisYear = 2026) {
  const model = tradeModels.find((m) => m.id === modelId)
  if (!model) return null
  const age = Math.max(0, thisYear - year)
  const value = model.base * Math.pow(0.88, age) * Math.max(0.55, 1 - mileage / 250_000)
  const round = (v: number) => Math.round(v / 500) * 500
  return { min: round(value * 0.95), max: round(value * 1.05) }
}

// Melhor valor de cada linha do comparador (para destacar)
export function bestOf(list: Car[]) {
  return {
    price: Math.min(...list.map((c) => c.price)),
    km: Math.min(...list.map((c) => c.km)),
    year: Math.max(...list.map((c) => c.year)),
  }
}
