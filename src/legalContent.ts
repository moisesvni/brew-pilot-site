import type { Locale } from './types'

export type LegalKind = 'privacy' | 'cookies' | 'terms'

export interface LegalSection {
  title: string
  paragraphs: string[]
}

export interface LegalDocument {
  title: string
  description: string
  eyebrow: string
  updated: string
  backLabel: string
  contentsLabel: string
  noteTitle: string
  noteBody: string
  sections: LegalSection[]
}

const documents: Record<Locale, Record<LegalKind, LegalDocument>> = {
  'pt-BR': {
    privacy: {
      title: 'Política de Privacidade',
      description: 'Entenda como o Brew Pilot trata dados pessoais, consentimento e direitos do titular.',
      eyebrow: 'Privacidade e transparência',
      updated: 'Última atualização: 31 de agosto de 2026',
      backLabel: 'Voltar para o Brew Pilot',
      contentsLabel: 'Nesta política',
      noteTitle: 'Precisa falar sobre seus dados?',
      noteBody: 'Use o contato de privacidade configurado no ambiente. Para facilitar a validação, inclua o e-mail da conta e o pedido desejado.',
      sections: [
        { title: 'Quem somos', paragraphs: ['O Brew Pilot é operado por {controller}, controlador dos dados pessoais tratados neste serviço.', 'Contato sobre privacidade: {contact}.'] },
        { title: 'Dados e finalidades', paragraphs: ['Tratamos dados de cadastro e autenticação, como nome, e-mail, identificadores de conta e login social, para criar e proteger contas e prestar o serviço.', 'Também tratamos receitas, lotes, perfis, configurações e dados técnicos para armazenar, sincronizar, exibir recursos, prevenir fraude e diagnosticar falhas.'] },
        { title: 'Bases legais e compartilhamento', paragraphs: ['As bases legais podem incluir execução de contrato, obrigação legal, legítimo interesse para segurança e consentimento para cookies de medição.', 'Podemos compartilhar dados com provedores de hospedagem, banco, e-mail, autenticação, prevenção de abuso e análise autorizada, com salvaguardas adequadas.'] },
        { title: 'Retenção e segurança', paragraphs: ['Mantemos os dados pelo tempo necessário para prestar o serviço, cumprir obrigações legais, resolver disputas e proteger direitos.', 'Adotamos controles técnicos e organizacionais compatíveis com o risco, mas nenhum serviço conectado à internet é completamente livre de incidentes.'] },
        { title: 'Direitos do titular', paragraphs: ['Você pode solicitar confirmação, acesso, correção, informações sobre compartilhamentos, portabilidade quando aplicável, anonimização, bloqueio ou eliminação, observadas as exceções legais.', 'Para exercer seus direitos, escreva para {contact}, com dados suficientes para validação segura da identidade. Também é possível reclamar à autoridade competente.'] },
        { title: 'Alterações e contato', paragraphs: ['Podemos atualizar esta política para refletir mudanças no produto, na legislação ou nos fornecedores. A versão vigente estará sempre nesta página.'] },
      ],
    },
    cookies: {
      title: 'Política de Cookies',
      description: 'Saiba quais tecnologias o Brew Pilot usa para funcionamento, preferências e medição consentida.',
      eyebrow: 'Privacidade e transparência',
      updated: 'Última atualização: 31 de agosto de 2026',
      backLabel: 'Voltar para o Brew Pilot',
      contentsLabel: 'Nesta política',
      noteTitle: 'Sua escolha pode mudar',
      noteBody: 'A medição só é ativada depois do consentimento. Você pode revisar essa escolha nas preferências de privacidade do Brew Pilot.',
      sections: [
        { title: 'O que são cookies', paragraphs: ['Cookies são pequenos arquivos ou identificadores armazenados no navegador. Tecnologias equivalentes podem cumprir funções semelhantes.'] },
        { title: 'Categorias usadas pelo Brew Pilot', paragraphs: ['O armazenamento necessário mantém sessão, idioma e preferências de privacidade, além de apoiar autenticação, segurança e funcionamento do serviço.', 'A medição usa o Google Analytics 4 somente após consentimento explícito. Não usamos cookies de publicidade comportamental nesta implementação.'] },
        { title: 'Suas escolhas', paragraphs: ['Você pode aceitar ou recusar cookies de medição. A escolha pode ser alterada a qualquer momento pelo link de preferências no Brew Pilot.'] },
        { title: 'Google Analytics', paragraphs: ['O Google Analytics pode coletar identificadores online, dados do dispositivo e interações com páginas. Não o configure antes do consentimento nem envie dados que identifiquem diretamente uma pessoa.'] },
      ],
    },
    terms: {
      title: 'Termos de Uso',
      description: 'Conheça as regras para usar o Brew Pilot, seus recursos e o conteúdo inserido na conta.',
      eyebrow: 'Uso responsável',
      updated: 'Última atualização: 31 de agosto de 2026',
      backLabel: 'Voltar para o Brew Pilot',
      contentsLabel: 'Nestes termos',
      noteTitle: 'Uma dúvida sobre o serviço?',
      noteBody: 'Recursos pagos, preços e cancelamento aparecem antes da contratação. Para dúvidas gerais, use o canal de suporte configurado.',
      sections: [
        { title: 'Aceitação', paragraphs: ['Ao criar uma conta ou usar o Brew Pilot, você concorda com estes Termos e com a Política de Privacidade. Se não concordar, não use o serviço.'] },
        { title: 'Serviço e conta', paragraphs: ['O Brew Pilot oferece ferramentas para planejar e acompanhar a produção cervejeira. Você é responsável pelos dados, credenciais e atividades da sua conta.'] },
        { title: 'Conteúdo do usuário', paragraphs: ['Você mantém os direitos sobre receitas, notas e conteúdos inseridos. Concede ao Brew Pilot autorização limitada para armazenar, processar, sincronizar e exibir esse conteúdo para operar os recursos escolhidos.'] },
        { title: 'Uso aceitável', paragraphs: ['Não tente acessar contas de terceiros, burlar limites, introduzir código malicioso, abusar de integrações, violar direitos ou usar o serviço para atividade ilícita.'] },
        { title: 'Disponibilidade e limitações', paragraphs: ['O serviço pode sofrer indisponibilidades, alterações e manutenção. As informações do Brew Pilot apoiam decisões e não substituem julgamento técnico, normas de segurança ou orientação profissional.'] },
        { title: 'Planos, mudanças e contato', paragraphs: ['Recursos pagos, preços e cancelamento serão apresentados antes da contratação. Podemos alterar o serviço e comunicaremos mudanças relevantes de forma adequada.', 'Contato: {contact}.'] },
      ],
    },
  },
  'en-US': {
    privacy: {
      title: 'Privacy Policy',
      description: 'Learn how Brew Pilot handles personal data, consent, and data subject rights.',
      eyebrow: 'Privacy and transparency',
      updated: 'Last updated: August 31, 2026',
      backLabel: 'Back to Brew Pilot',
      contentsLabel: 'In this policy',
      noteTitle: 'Need to talk about your data?',
      noteBody: 'Use the privacy contact configured for this environment. Include the account email and the request you want to make.',
      sections: [
        { title: 'Who we are', paragraphs: ['Brew Pilot is operated by {controller}, the controller of the personal data processed by this service.', 'Privacy contact: {contact}.'] },
        { title: 'Data and purposes', paragraphs: ['We process registration and authentication data, such as name, email, account identifiers and social login data, to create and protect accounts and provide the service.', 'We also process recipes, batches, profiles, settings and technical data to store, synchronize, display features, prevent fraud and diagnose failures.'] },
        { title: 'Legal bases and sharing', paragraphs: ['Legal bases may include contract performance, legal obligations, legitimate interest for security and consent for measurement cookies.', 'We may share data with hosting, database, email, authentication, abuse prevention and authorized analytics providers under appropriate safeguards.'] },
        { title: 'Retention and security', paragraphs: ['We keep data for as long as necessary to provide the service, meet legal obligations, resolve disputes and protect rights.', 'We use technical and organizational controls appropriate to the risk, but no internet service is completely free from incidents.'] },
        { title: 'Your rights', paragraphs: ['You may request confirmation, access, correction, information about sharing, portability where applicable, anonymization, blocking or deletion, subject to legal exceptions.', 'To exercise your rights, contact {contact} with enough information for secure identity validation. You may also contact the applicable data protection authority.'] },
        { title: 'Changes and contact', paragraphs: ['We may update this policy to reflect changes in the product, law or providers. The current version is always available on this page.'] },
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      description: 'Learn which technologies Brew Pilot uses for operation, preferences, and consented measurement.',
      eyebrow: 'Privacy and transparency',
      updated: 'Last updated: August 31, 2026',
      backLabel: 'Back to Brew Pilot',
      contentsLabel: 'In this policy',
      noteTitle: 'Your choice can change',
      noteBody: 'Measurement starts only after consent. You can review the choice through privacy preferences in the application.',
      sections: [
        { title: 'What cookies are', paragraphs: ['Cookies are small files or identifiers stored in your browser. Equivalent technologies may serve similar purposes.'] },
        { title: 'Categories used by Brew Pilot', paragraphs: ['Necessary storage supports session, language and privacy preferences, authentication, security and service operation.', 'Measurement uses Google Analytics 4 only after explicit consent. We do not use behavioral advertising cookies in this implementation.'] },
        { title: 'Your choices', paragraphs: ['You can accept or reject measurement cookies. Your choice can be changed at any time through the cookie preferences link in the application.'] },
        { title: 'Google Analytics', paragraphs: ['Google Analytics may collect online identifiers, device information and page interactions. Do not configure it before consent or send data that directly identifies a person.'] },
      ],
    },
    terms: {
      title: 'Terms of Use',
      description: 'Learn the rules for using Brew Pilot, its features, and content added to your account.',
      eyebrow: 'Responsible use',
      updated: 'Last updated: August 31, 2026',
      backLabel: 'Back to Brew Pilot',
      contentsLabel: 'In these terms',
      noteTitle: 'Have a question about the service?',
      noteBody: 'Paid features, prices, and cancellation are shown before purchase. For general questions, use the configured support channel.',
      sections: [
        { title: 'Acceptance', paragraphs: ['By creating an account or using Brew Pilot, you agree to these Terms and the Privacy Policy. If you disagree, do not use the service.'] },
        { title: 'Service and account', paragraphs: ['Brew Pilot provides tools for planning and tracking beer production. You are responsible for your data, credentials and activity on your account.'] },
        { title: 'User content', paragraphs: ['You retain rights to recipes, notes and other content you enter. You grant Brew Pilot limited permission to store, process, synchronize and display it to operate selected features.'] },
        { title: 'Acceptable use', paragraphs: ['Do not access third-party accounts, bypass limits, introduce malicious code, abuse integrations, infringe rights or use the service unlawfully.'] },
        { title: 'Availability and limitations', paragraphs: ['The service may have outages, changes and maintenance. Brew Pilot information supports decisions and does not replace technical judgment, safety standards or professional advice.'] },
        { title: 'Plans, changes and contact', paragraphs: ['Paid features, prices and cancellation terms will be presented before purchase. We may change the service and will communicate relevant changes appropriately.', 'Contact: {contact}.'] },
      ],
    },
  },
  es: {
    privacy: {
      title: 'Política de Privacidad',
      description: 'Conoce cómo Brew Pilot trata datos personales, consentimiento y derechos del titular.',
      eyebrow: 'Privacidad y transparencia',
      updated: 'Última actualización: 31 de agosto de 2026',
      backLabel: 'Volver a Brew Pilot',
      contentsLabel: 'En esta política',
      noteTitle: '¿Necesitas hablar sobre tus datos?',
      noteBody: 'Usa el contacto de privacidad configurado para este entorno. Incluye el correo de la cuenta y tu solicitud.',
      sections: [
        { title: 'Quiénes somos', paragraphs: ['Brew Pilot es operado por {controller}, responsable del tratamiento de los datos personales procesados por este servicio.', 'Contacto de privacidad: {contact}.'] },
        { title: 'Datos y finalidades', paragraphs: ['Tratamos datos de registro y autenticación, como nombre, correo e identificadores de cuenta, para crear y proteger cuentas y prestar el servicio.', 'También tratamos recetas, lotes, perfiles, configuraciones y datos técnicos para almacenar, sincronizar, mostrar funciones, prevenir fraude y diagnosticar fallos.'] },
        { title: 'Bases legales y divulgación', paragraphs: ['Las bases pueden incluir ejecución del contrato, obligaciones legales, interés legítimo de seguridad y consentimiento para cookies de medición.', 'Podemos compartir datos con proveedores de alojamiento, base de datos, correo, autenticación, prevención de abuso y análisis autorizado, con garantías adecuadas.'] },
        { title: 'Conservación y seguridad', paragraphs: ['Conservamos los datos mientras sea necesario para prestar el servicio, cumplir obligaciones legales, resolver disputas y proteger derechos.', 'Aplicamos controles técnicos y organizativos adecuados al riesgo, pero ningún servicio de internet está completamente libre de incidentes.'] },
        { title: 'Tus derechos', paragraphs: ['Puedes solicitar confirmación, acceso, corrección, información sobre compartición, portabilidad cuando corresponda, anonimización, bloqueo o eliminación, según las excepciones legales.', 'Para ejercer tus derechos, escribe a {contact} con información suficiente para validar tu identidad de forma segura.'] },
        { title: 'Cambios y contacto', paragraphs: ['Podemos actualizar esta política por cambios en el producto, la ley o los proveedores. La versión vigente estará siempre en esta página.'] },
      ],
    },
    cookies: {
      title: 'Política de Cookies',
      description: 'Conoce qué tecnologías usa Brew Pilot para funcionar, guardar preferencias y medir con consentimiento.',
      eyebrow: 'Privacidad y transparencia',
      updated: 'Última actualización: 31 de agosto de 2026',
      backLabel: 'Volver a Brew Pilot',
      contentsLabel: 'En esta política',
      noteTitle: 'Tu elección puede cambiar',
      noteBody: 'La medición se activa solo después del consentimiento. Puedes revisar la elección desde las preferencias de privacidad de la aplicación.',
      sections: [
        { title: 'Qué son las cookies', paragraphs: ['Las cookies son pequeños archivos o identificadores almacenados en el navegador. Tecnologías equivalentes pueden cumplir funciones similares.'] },
        { title: 'Categorías usadas por Brew Pilot', paragraphs: ['El almacenamiento necesario mantiene la sesión, el idioma y las preferencias de privacidad, además de apoyar la autenticación, seguridad y operación del servicio.', 'La medición usa Google Analytics 4 solo después del consentimiento explícito. No usamos cookies de publicidad comportamental en esta implementación.'] },
        { title: 'Tus opciones', paragraphs: ['Puedes aceptar o rechazar las cookies de medición. La elección puede cambiarse en cualquier momento desde el enlace de preferencias de cookies de la aplicación.'] },
        { title: 'Google Analytics', paragraphs: ['Google Analytics puede recopilar identificadores online, datos del dispositivo e interacciones con páginas. No lo configures antes del consentimiento ni envíes datos que identifiquen directamente a una persona.'] },
      ],
    },
    terms: {
      title: 'Términos de Uso',
      description: 'Conoce las reglas para usar Brew Pilot, sus funciones y el contenido de tu cuenta.',
      eyebrow: 'Uso responsable',
      updated: 'Última actualización: 31 de agosto de 2026',
      backLabel: 'Volver a Brew Pilot',
      contentsLabel: 'En estos términos',
      noteTitle: '¿Tienes una duda sobre el servicio?',
      noteBody: 'Las funciones pagadas, los precios y la cancelación se muestran antes de la compra. Para dudas generales, usa el canal de soporte configurado.',
      sections: [
        { title: 'Aceptación', paragraphs: ['Al crear una cuenta o usar Brew Pilot, aceptas estos Términos y la Política de Privacidad. Si no estás de acuerdo, no uses el servicio.'] },
        { title: 'Servicio y cuenta', paragraphs: ['Brew Pilot ofrece herramientas para planificar y seguir la producción de cerveza. Eres responsable de tus datos, credenciales y actividad en tu cuenta.'] },
        { title: 'Contenido del usuario', paragraphs: ['Conservas los derechos sobre las recetas, notas y demás contenido que introduzcas. Concedes a Brew Pilot permiso limitado para operarlo dentro de las funciones elegidas.'] },
        { title: 'Uso aceptable', paragraphs: ['No accedas a cuentas de terceros, evadas límites, introduzcas código malicioso, abuses de integraciones, infrinjas derechos ni uses el servicio ilegalmente.'] },
        { title: 'Disponibilidad y límites', paragraphs: ['El servicio puede tener interrupciones, cambios y mantenimiento. La información de Brew Pilot apoya decisiones y no sustituye el criterio técnico ni el asesoramiento profesional.'] },
        { title: 'Planes, cambios y contacto', paragraphs: ['Las funciones pagadas, precios y cancelación se mostrarán antes de la compra. Podemos cambiar el servicio y comunicaremos los cambios relevantes.', 'Contacto: {contact}.'] },
      ],
    },
  },
}

export const getLegalDocument = (locale: Locale, kind: LegalKind): LegalDocument => documents[locale][kind]
