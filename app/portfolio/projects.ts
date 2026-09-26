import { Anton, Cormorant_Garamond, Michroma, Space_Grotesk } from 'next/font/google'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: '600', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: '700', display: 'swap' })
const anton = Anton({ subsets: ['latin'], weight: '400', display: 'swap' })
const michroma = Michroma({ subsets: ['latin'], weight: '400', display: 'swap' })

export type Project = {
  slug: string
  client: string
  domain?: string // só para produto real; marcas fictícias não mostram endereço
  segment: string
  system: string
  keyword: string // termo de busca que a página do case mira (título e H1)
  forWho: string
  tagline: string
  challenge: string
  solution: string
  features: string[]
  stack: string[]
  brand: { bg: string; fg: string; accent: string; font: string }
  // Sem demo publicada: card aparece como "em breve" e a página não é gerada
  soon?: boolean
  // Demo interativa em /portfolio/<slug>/app já publicada
  live?: boolean
  // Página própria em /portfolio/<slug> (fora do molde de case), ex.: produto real
  custom?: boolean
}

export const projects: Project[] = [
  {
    slug: 'vitalle',
    client: 'Vitalle Clínica',
    segment: 'Saúde & estética',
    system: 'Agendamento online',
    keyword: 'Sistema de agendamento online para clínicas',
    forWho: 'Clínicas de estética, consultórios, dentistas, fisioterapeutas e salões que ainda marcam horário por WhatsApp e telefone. O paciente escolhe serviço, profissional e horário sozinho, a qualquer hora, e a recepção para de apagar incêndio: menos faltas, nenhum horário duplicado e a agenda da equipe inteira em uma tela só.',
    tagline: 'Agenda cheia sem ninguém preso ao telefone.',
    challenge: 'Agendamentos por WhatsApp e telefone geravam horários duplicados, faltas sem aviso e uma recepção sobrecarregada.',
    solution: 'Página pública de agendamento com horários em tempo real, confirmação automática por WhatsApp e um painel de agenda para toda a equipe.',
    features: ['Agendamento online 24 horas', 'Agenda da equipe com arrastar e soltar', 'Confirmação e lembrete por WhatsApp', 'Ficha e histórico de cada paciente'],
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    brand: { bg: '#F4F1EA', fg: '#1F3A2E', accent: '#B08D57', font: cormorant.className },
    live: true,
  },
  {
    slug: 'horizonte-imoveis',
    client: 'Horizonte Imóveis',
    segment: 'Mercado imobiliário',
    system: 'CRM de vendas',
    keyword: 'CRM para imobiliárias',
    forWho: 'Imobiliárias e corretores autônomos que recebem leads de portais, Instagram e indicação e acompanham tudo em planilha ou no WhatsApp. Cada contato entra no funil, vai para um corretor e ganha histórico, e a diretoria vê em tempo real quantas visitas, propostas e vendas saíram no mês.',
    tagline: 'Cada lead no lugar certo. Cada corretor sabendo o próximo passo.',
    challenge: 'Leads de portais e do Instagram se perdiam em planilhas; ninguém sabia quem já tinha atendido quem nem em que etapa estava cada negociação.',
    solution: 'Funil visual por etapa, distribuição de leads entre corretores e um painel com os números que importam para a diretoria.',
    features: ['Funil de vendas em quadro visual', 'Painel de indicadores em tempo real', 'Distribuição de leads por corretor', 'Ficha do lead com linha do tempo'],
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    brand: { bg: '#0A1418', fg: '#E6F1F2', accent: '#2DD4BF', font: spaceGrotesk.className },
    live: true,
  },
  {
    slug: 'brasa-burger',
    client: 'Brasa Burger Co.',
    segment: 'Food service',
    system: 'Cardápio digital e delivery',
    keyword: 'Cardápio digital com pedido direto para delivery',
    forWho: 'Hamburguerias, pizzarias, restaurantes e dark kitchens que pagam comissão alta aos aplicativos de entrega. Com cardápio próprio, o pedido chega direto, sem taxa por venda, e o cliente fica com você: dá para chamar de volta com cupom, combo novo ou programa de fidelidade.',
    tagline: 'Do cardápio ao portão, sem taxa de marketplace.',
    challenge: 'A hamburgueria dependia de aplicativos de entrega com comissões altas e nenhum relacionamento direto com os próprios clientes.',
    solution: 'Cardápio próprio com pedido direto, carrinho com adicionais, checkout rápido e acompanhamento do pedido em tempo real.',
    features: ['Cardápio com produto em 3D', 'Carrinho com adicionais e observações', 'Checkout em poucos toques', 'Acompanhamento do pedido ao vivo'],
    stack: ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion'],
    brand: { bg: '#0D0D0D', fg: '#FFF4E8', accent: '#FF5A1F', font: anton.className },
    live: true,
  },
  {
    slug: 'vertice-motors',
    client: 'Vértice Motors',
    segment: 'Automotivo',
    system: 'Showroom de seminovos',
    keyword: 'Site para loja de carros seminovos',
    forWho: 'Lojas de seminovos, revendas e concessionárias que vendem pelo Instagram e pelos portais e respondem o dia inteiro às mesmas perguntas de preço e parcela. O cliente filtra o estoque, simula o financiamento, avalia o carro na troca e agenda o test drive sem esperar resposta.',
    tagline: 'Do anúncio ao test drive sem o cliente sair do celular.',
    challenge: 'A loja vendia pelo Instagram e por portais: o cliente perguntava preço e parcela por mensagem, esfriava na espera e a equipe repetia as mesmas respostas o dia inteiro.',
    solution: 'Showroom próprio com estoque filtrável, simulador de financiamento, avaliação do usado na troca, comparador e agendamento de test drive em poucos toques.',
    features: ['Estoque com filtros e comparador', 'Simulador de financiamento na hora', 'Avaliação do usado na troca', 'Agendamento de test drive'],
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    brand: { bg: '#EDEEE9', fg: '#0E0F12', accent: '#D7263D', font: michroma.className },
    live: true,
  },
  {
    slug: 'affiliabot',
    client: 'AffiliaBOT',
    domain: 'affiliabot.com.br',
    segment: 'SaaS · Afiliados',
    system: 'Plataforma de automação',
    keyword: 'Automação de ofertas de afiliados no WhatsApp',
    forWho: 'Afiliados da Amazon, Mercado Livre e Shopee que administram grupos de ofertas no WhatsApp e perdem horas copiando links do Telegram.',
    tagline: 'Ofertas convertidas e repassadas 24 horas por dia.',
    challenge: 'Afiliados passavam o dia copiando ofertas de canais do Telegram, trocando links à mão e colando em dezenas de grupos de WhatsApp.',
    solution: 'Um SaaS que ouve os canais, converte cada link para a tag do afiliado e repassa a oferta para os grupos em segundos, 24 horas por dia.',
    features: ['Conversão automática de links Amazon, Mercado Livre e Shopee', 'Repasse Telegram → WhatsApp com foto ou card', 'Ritmo, selo e filtro de preço por rota', 'Relatório de vendas por nicho'],
    stack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Node.js', 'Docker'],
    brand: { bg: '#07090E', fg: '#E9EDF5', accent: '#3B82F6', font: spaceGrotesk.className },
    custom: true,
  },
]
