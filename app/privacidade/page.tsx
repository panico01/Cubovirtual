import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Cubo Virtual',
  description: 'Como a Cubo Virtual trata os dados de quem visita o site, conforme a LGPD (Lei 13.709/2018).',
  alternates: { canonical: '/privacidade/' },
}

const sections: [string, string[]][] = [
  ['Quem somos', [
    'Cubo Virtual, agência de criação de sites e sistemas com sede em Sumaré-SP. Contato para assuntos de privacidade: contato@cubovirtual.com.br.',
  ]],
  ['Quais dados coletamos', [
    'Este site não tem formulário nem cadastro. Quando você clica em um botão de WhatsApp ou e-mail, a conversa acontece nesses serviços, e recebemos apenas o que você decidir nos enviar, como nome, telefone e detalhes do projeto.',
    'Para medir os resultados dos nossos anúncios usamos a tag do Google Ads, que pode gravar cookies e registrar dados técnicos de navegação, como páginas vistas, tipo de dispositivo e cliques em botões de contato. Não usamos esses dados para identificar você pessoalmente.',
  ]],
  ['Para que usamos', [
    'Responder seu contato, preparar orçamentos e prestar os serviços contratados (execução de contrato e procedimentos preliminares, art. 7º, V, da LGPD).',
    'Medir e melhorar nossos anúncios e o site (legítimo interesse, art. 7º, IX, da LGPD).',
  ]],
  ['Com quem compartilhamos', [
    'Com o Google (anúncios e medição) e com o WhatsApp/Meta (conversas), que tratam os dados conforme as próprias políticas de privacidade. Não vendemos dados a ninguém.',
  ]],
  ['Cookies', [
    'Você pode bloquear ou apagar cookies nas configurações do seu navegador e ajustar a personalização de anúncios em adssettings.google.com. O site continua funcionando normalmente sem eles.',
  ]],
  ['Por quanto tempo guardamos', [
    'Conversas e dados de orçamento ficam guardados enquanto forem necessários para o atendimento ou para cumprir obrigações legais. Dados de medição seguem os prazos do Google.',
  ]],
  ['Seus direitos', [
    'Você pode pedir a qualquer momento acesso, correção, exclusão ou informação sobre o uso dos seus dados, escrevendo para contato@cubovirtual.com.br. Respondemos em até 15 dias. Também é possível reclamar à ANPD (gov.br/anpd).',
  ]],
]

export default function PrivacyPage() {
  return (
    <main>
      <Header />
      <section className="border-b-2 border-line">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="eyebrow text-primary">LGPD</p>
          <h1 className="section-title mt-6 text-balance">Política de Privacidade</h1>
          <p className="mt-4 text-sm text-subtle">Atualizada em 26 de setembro de 2026.</p>
          {sections.map(([title, paragraphs]) => (
            <div key={title} className="mt-12">
              <h2 className="text-2xl font-extrabold tracking-[-.03em]">{title}</h2>
              {paragraphs.map((text) => <p key={text} className="mt-4 text-lg leading-relaxed text-subtle">{text}</p>)}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
