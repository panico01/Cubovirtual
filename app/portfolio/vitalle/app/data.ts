// Dados fictícios e regras de agenda da demo Vitalle (sem backend: tudo roda no navegador)

export type Service = { id: string; name: string; desc: string; duration: number; price: number }
export type Pro = { id: string; name: string; role: string; color: string; does: string[] }
export type Appt = {
  id: string
  patient: string
  phone: string
  serviceId: string
  proId: string
  date: string // YYYY-MM-DD
  start: number // minutos desde 00:00
  status: 'confirmado' | 'pendente'
}

export const OPEN = 8 * 60
export const CLOSE = 18 * 60
export const SLOT = 30
export const DAYS = 6 // segunda a sábado

export const services: Service[] = [
  { id: 'consulta', name: 'Consulta dermatológica', desc: 'Avaliação completa da pele e plano de cuidados.', duration: 30, price: 250 },
  { id: 'limpeza', name: 'Limpeza de pele', desc: 'Extração, esfoliação e hidratação profunda.', duration: 60, price: 180 },
  { id: 'peeling', name: 'Peeling químico', desc: 'Renovação celular para manchas e textura.', duration: 30, price: 320 },
  { id: 'drenagem', name: 'Drenagem linfática', desc: 'Redução de inchaço e sensação de leveza.', duration: 60, price: 150 },
  { id: 'botox', name: 'Toxina botulínica', desc: 'Suavização de linhas de expressão.', duration: 30, price: 890 },
  { id: 'harmonizacao', name: 'Harmonização facial', desc: 'Protocolo personalizado de preenchimento.', duration: 90, price: 1500 },
]

export const pros: Pro[] = [
  { id: 'helena', name: 'Dra. Helena Duarte', role: 'Dermatologista', color: '#3F6B55', does: ['consulta', 'botox', 'harmonizacao', 'peeling'] },
  { id: 'marina', name: 'Marina Costa', role: 'Esteticista', color: '#B08D57', does: ['limpeza', 'peeling', 'drenagem'] },
  { id: 'rafael', name: 'Rafael Lima', role: 'Fisioterapeuta dermatofuncional', color: '#B8694F', does: ['drenagem', 'limpeza'] },
]

const patients: [string, string][] = [
  ['Ana Beatriz Souza', '(11) 98123-4567'], ['Carolina Mendes', '(11) 99234-1188'], ['Fernanda Rocha', '(11) 97345-2290'],
  ['Juliana Prado', '(11) 98456-3321'], ['Larissa Campos', '(11) 99567-4412'], ['Patrícia Nogueira', '(11) 98678-5503'],
  ['Renata Alves', '(11) 97789-6694'], ['Beatriz Farias', '(11) 99890-7785'], ['Camila Duarte', '(11) 98901-8876'],
  ['Gabriela Torres', '(11) 97012-9967'], ['Isabela Martins', '(11) 99123-0058'], ['Mariana Lopes', '(11) 98234-1149'],
  ['Paula Ribeiro', '(11) 97345-2230'], ['Letícia Moraes', '(11) 99456-3321'], ['Vanessa Pires', '(11) 98567-4412'],
  ['Ricardo Azevedo', '(11) 97678-5503'], ['Eduardo Brandão', '(11) 99789-6694'], ['Thiago Carvalho', '(11) 98890-7785'],
]

export const serviceOf = (id: string) => services.find((s) => s.id === id) ?? services[0]
export const proOf = (id: string) => pros.find((p) => p.id === id) ?? pros[0]
export const prosFor = (serviceId: string) => pros.filter((p) => p.does.includes(serviceId))

const pad = (n: number) => String(n).padStart(2, '0')
export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const weekStart = (d = new Date()) => addDays(d, -((d.getDay() + 6) % 7))
export const hhmm = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`
export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
export const dayLabel = (key: string) => fromKey(key).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })

type Slot = Pick<Appt, 'id' | 'proId' | 'date' | 'start' | 'serviceId'>

// Mesmo profissional, mesmo dia e intervalos que se sobrepõem
export function conflicts(appts: Appt[], c: Slot) {
  const end = c.start + serviceOf(c.serviceId).duration
  return appts.some((a) =>
    a.id !== c.id && a.proId === c.proId && a.date === c.date &&
    a.start < end && c.start < a.start + serviceOf(a.serviceId).duration,
  )
}

export const fitsDay = (start: number, serviceId: string) =>
  start >= OPEN && start + serviceOf(serviceId).duration <= CLOSE

// Horários livres num dia; sem profissional escolhido, pega o primeiro disponível em cada horário
export function freeSlots(appts: Appt[], date: string, serviceId: string, proId: string | null, now = new Date()) {
  const isToday = date === toKey(now)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const out: { start: number; proId: string }[] = []
  for (let start = OPEN; fitsDay(start, serviceId); start += SLOT) {
    if (isToday && start <= nowMin) continue
    const pro = (proId ? [proId] : prosFor(serviceId).map((p) => p.id))
      .find((id) => !conflicts(appts, { id: '', proId: id, date, start, serviceId }))
    if (pro) out.push({ start, proId: pro })
  }
  return out
}

// Agenda inicial determinística da semana atual e da próxima
export function seed(today = new Date()): Appt[] {
  let s = 20260926
  const rand = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)]

  const out: Appt[] = []
  const monday = weekStart(today)
  for (let day = 0; day < DAYS * 2; day++) {
    const date = toKey(addDays(monday, day + (day >= DAYS ? 1 : 0)))
    for (const pro of pros) {
      for (let tries = 0; tries < 9; tries++) {
        const serviceId = pick(pro.does)
        const start = OPEN + Math.floor(rand() * ((CLOSE - OPEN) / SLOT)) * SLOT
        const candidate = { id: `s${out.length}`, proId: pro.id, date, start, serviceId }
        if (!fitsDay(start, serviceId) || conflicts(out, candidate)) continue
        const [patient, phone] = pick(patients)
        out.push({ ...candidate, patient, phone, status: date < toKey(today) || rand() > 0.3 ? 'confirmado' : 'pendente' })
      }
    }
  }
  return out
}
