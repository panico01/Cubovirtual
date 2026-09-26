// Dados fictícios e regras do CRM Horizonte Imóveis (sem backend: tudo roda no navegador)

export type Stage = 'novo' | 'atendimento' | 'visita' | 'proposta' | 'fechado'
export type Source = 'Instagram' | 'Site' | 'Portais' | 'Indicação' | 'WhatsApp'
export type Broker = { id: string; name: string; color: string }
export type Property = { id: string; title: string; hood: string; price: number; beds: number; area: number }
export type LeadEvent = { at: number; text: string }
export type Lead = {
  id: string
  name: string
  phone: string
  source: Source
  propertyId: string
  value: number
  brokerId: string | null
  stage: Stage
  createdAt: number
  updatedAt: number
  events: LeadEvent[]
}

export const stages: { id: Stage; label: string }[] = [
  { id: 'novo', label: 'Novos' },
  { id: 'atendimento', label: 'Em atendimento' },
  { id: 'visita', label: 'Visita agendada' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'fechado', label: 'Fechado' },
]
export const stageIndex = (s: Stage) => stages.findIndex((x) => x.id === s)
export const stageLabel = (s: Stage) => stages[stageIndex(s)].label

export const sources: { id: Source; color: string }[] = [
  { id: 'Instagram', color: '#2DD4BF' },
  { id: 'Portais', color: '#38BDF8' },
  { id: 'Site', color: '#A78BFA' },
  { id: 'WhatsApp', color: '#4ADE80' },
  { id: 'Indicação', color: '#FBBF24' },
]

export const brokers: Broker[] = [
  { id: 'camila', name: 'Camila Andrade', color: '#2DD4BF' },
  { id: 'bruno', name: 'Bruno Teixeira', color: '#38BDF8' },
  { id: 'juliana', name: 'Juliana Reis', color: '#A78BFA' },
  { id: 'diego', name: 'Diego Martins', color: '#FBBF24' },
]

export const properties: Property[] = [
  { id: 'p1', title: 'Apartamento 3 dorms', hood: 'Jardim Europa', price: 1_280_000, beds: 3, area: 118 },
  { id: 'p2', title: 'Cobertura duplex', hood: 'Alto da Boa Vista', price: 2_450_000, beds: 4, area: 240 },
  { id: 'p3', title: 'Studio mobiliado', hood: 'Centro', price: 395_000, beds: 1, area: 34 },
  { id: 'p4', title: 'Casa em condomínio', hood: 'Parque das Águas', price: 1_890_000, beds: 4, area: 310 },
  { id: 'p5', title: 'Apartamento 2 dorms', hood: 'Vila Nova', price: 640_000, beds: 2, area: 68 },
  { id: 'p6', title: 'Garden com quintal', hood: 'Bela Vista', price: 920_000, beds: 3, area: 132 },
  { id: 'p7', title: 'Sobrado reformado', hood: 'Jardim América', price: 1_150_000, beds: 3, area: 180 },
  { id: 'p8', title: 'Loft industrial', hood: 'Vila Madalena', price: 780_000, beds: 1, area: 72 },
  { id: 'p9', title: 'Apartamento alto padrão', hood: 'Horto Florestal', price: 3_200_000, beds: 4, area: 285 },
  { id: 'p10', title: 'Terreno em condomínio', hood: 'Reserva do Lago', price: 540_000, beds: 0, area: 450 },
]

const people = [
  'Marcelo Figueiredo', 'Aline Batista', 'Rodrigo Sampaio', 'Tatiane Queiroz', 'Felipe Moura', 'Priscila Antunes',
  'Gustavo Rezende', 'Daniela Barros', 'Leandro Siqueira', 'Bianca Valente', 'Henrique Paiva', 'Natália Coelho',
  'André Guimarães', 'Sabrina Lacerda', 'Vinícius Prado', 'Cristiane Borges', 'Otávio Mendonça', 'Luana Peixoto',
  'Fábio Cardoso', 'Débora Fontes', 'Mateus Arantes', 'Simone Tavares', 'Caio Bittencourt', 'Elisa Magalhães',
  'Roberto Nunes', 'Viviane Leal', 'Lucas Pacheco', 'Helena Vasconcelos', 'Sérgio Amaral', 'Mônica Brito',
  'Pedro Henrique Dias', 'Raquel Monteiro', 'Alexandre Freitas', 'Carla Sant’Anna', 'Júlio César Lima', 'Yasmin Correia',
  'Márcio Aguiar', 'Laura Bastos', 'Renan Falcão', 'Beatriz Leme', 'Igor Vilela', 'Patrícia Moraes',
]

export const brokerOf = (id: string | null) => brokers.find((b) => b.id === id) ?? null
export const propertyOf = (id: string) => properties.find((p) => p.id === id) ?? properties[0]
export const initials = (name: string) => name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
export const compact = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi` : `R$ ${Math.round(v / 1000)} mil`

export function ago(ts: number, now = Date.now()) {
  const min = Math.floor((now - ts) / 60_000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  if (min < 60 * 24) return `há ${Math.floor(min / 60)} h`
  const d = Math.floor(min / (60 * 24))
  return `há ${d} ${d === 1 ? 'dia' : 'dias'}`
}

const H = 3_600_000
const D = 24 * H

function prng(seedValue: number) {
  let s = seedValue
  const rand = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)]
  return { rand, pick }
}

const phoneFor = (i: number) => `(11) 9${String(8100 + ((i * 373) % 1900)).padStart(4, '0')}-${String(1000 + ((i * 7919) % 9000)).padStart(4, '0')}`

// Linha do tempo coerente com a etapa em que o lead está
function timeline(stage: Stage, created: number, now: number, source: Source, broker: Broker | null, property: Property, value: number) {
  const steps = [`Lead recebido via ${source} · interesse em ${property.title} (${property.hood})`]
  if (broker) steps.push(`Distribuído para ${broker.name}`, 'Primeiro contato por WhatsApp')
  if (stageIndex(stage) >= 2) steps.push('Visita agendada ao imóvel', 'Visita realizada · cliente gostou da planta')
  if (stageIndex(stage) >= 3) steps.push(`Proposta enviada: ${brl(value)}`)
  if (stage === 'fechado') steps.push('Contrato assinado · venda fechada')
  const span = (now - created) * 0.9
  return steps.map((text, i) => ({ at: Math.round(created + (span * i) / Math.max(steps.length, 1)), text }))
}

export function seed(now = Date.now()): Lead[] {
  const { rand, pick } = prng(20261001)
  const plan: [Stage, number][] = [['novo', 7], ['atendimento', 9], ['visita', 7], ['proposta', 5], ['fechado', 6]]
  const out: Lead[] = []
  for (const [stage, count] of plan) {
    for (let i = 0; i < count; i++) {
      const n = out.length
      const property = pick(properties)
      const source = pick(sources).id
      const created = Math.round(now - (stage === 'novo' ? rand() * 30 * H : (2 + rand() * 26) * D))
      const broker = stage === 'novo' && i < 3 ? null : pick(brokers)
      const value = stageIndex(stage) >= 3 ? Math.round((property.price * (0.92 + rand() * 0.06)) / 1000) * 1000 : property.price
      const events = timeline(stage, created, now, source, broker, property, value)
      out.push({
        id: `l${n}`, name: people[n], phone: phoneFor(n), source, propertyId: property.id, value,
        brokerId: broker?.id ?? null, stage, createdAt: created, updatedAt: events[events.length - 1].at, events,
      })
    }
  }
  return out
}

// Lead "chegando ao vivo": nomes seguem depois dos usados no seed
export function incoming(count: number, now = Date.now()): Lead {
  const { pick } = prng(777 + count * 31)
  const property = pick(properties)
  const source = pick(sources).id
  const n = 34 + (count % (people.length - 34))
  return {
    id: `live${now}`, name: people[n], phone: phoneFor(n + count), source, propertyId: property.id, value: property.price,
    brokerId: null, stage: 'novo', createdAt: now, updatedAt: now,
    events: [{ at: now, text: `Lead recebido via ${source} · interesse em ${property.title} (${property.hood})` }],
  }
}

// Leads recebidos por dia nos últimos 30 dias (inclui os descartados, por isso é maior que o funil)
export function dailySeries(): number[] {
  const { rand } = prng(424242)
  return Array.from({ length: 30 }, (_, i) => Math.round(9 + 5 * Math.sin(i / 3.2) + i * 0.25 + rand() * 6))
}

export const isActive = (l: Lead) => l.stage !== 'fechado'

// "Roleta": cada lead sem corretor vai para quem tem menos leads ativos (empate: ordem da equipe)
export function distribute(leads: Lead[], now = Date.now()) {
  const load = new Map(brokers.map((b) => [b.id, leads.filter((l) => isActive(l) && l.brokerId === b.id).length]))
  const assigned: { leadId: string; brokerId: string }[] = []
  const queue = leads.filter((l) => !l.brokerId).sort((a, b) => a.createdAt - b.createdAt)
  for (const lead of queue) {
    const broker = brokers.reduce((best, b) => (load.get(b.id)! < load.get(best.id)! ? b : best))
    load.set(broker.id, load.get(broker.id)! + 1)
    assigned.push({ leadId: lead.id, brokerId: broker.id })
  }
  const byLead = new Map(assigned.map((a) => [a.leadId, a.brokerId]))
  const next = leads.map((l) => {
    const brokerId = byLead.get(l.id)
    if (!brokerId) return l
    return { ...l, brokerId, updatedAt: now, events: [...l.events, { at: now, text: `Distribuído para ${brokerOf(brokerId)!.name} pela roleta` }] }
  })
  return { leads: next, assigned }
}

export function moveStage(lead: Lead, stage: Stage, now = Date.now()): Lead {
  if (lead.stage === stage) return lead
  const text = stage === 'fechado' ? `Venda fechada: ${brl(lead.value)}` : `Etapa alterada: ${stageLabel(lead.stage)} → ${stageLabel(stage)}`
  return { ...lead, stage, updatedAt: now, events: [...lead.events, { at: now, text }] }
}
