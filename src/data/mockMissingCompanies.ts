export interface EmailRecord {
  id: string;
  sentAt: string;
  subject: string;
  preview: string;
  templateUsed: string;
}

export interface MissingCompany {
  id: string;
  name: string;
  email: string;
  sector: string;
  cluster: "fornecedor" | "cliente" | "parceiro";
  emailsSent: number;
  emailHistory: EmailRecord[];
}

export const mockMissingCompanies: MissingCompany[] = [
  {
    id: "mc1",
    name: "TechSolutions Lda",
    email: "geral@techsolutions.pt",
    sector: "Tecnologia",
    cluster: "fornecedor",
    emailsSent: 2,
    emailHistory: [
      {
        id: "e1",
        sentAt: "2024-01-15T10:30:00Z",
        subject: "Convite para calcular a sua pegada de carbono",
        preview: "Prezado parceiro, gostaríamos de convidá-lo a calcular a pegada de carbono da sua organização...",
        templateUsed: "Convite Inicial"
      },
      {
        id: "e2",
        sentAt: "2024-02-20T14:15:00Z",
        subject: "Lembrete: Cálculo de pegada de carbono",
        preview: "Esperamos que esteja bem. Gostaríamos de relembrar o nosso convite para calcular...",
        templateUsed: "Lembrete"
      }
    ]
  },
  {
    id: "mc2",
    name: "Construções Ribeiro SA",
    email: "ambiente@construcoesribeiro.pt",
    sector: "Indústria",
    cluster: "fornecedor",
    emailsSent: 1,
    emailHistory: [
      {
        id: "e3",
        sentAt: "2024-02-01T09:00:00Z",
        subject: "Convite para calcular a sua pegada de carbono",
        preview: "Prezado parceiro, gostaríamos de convidá-lo a calcular a pegada de carbono da sua organização...",
        templateUsed: "Convite Inicial"
      }
    ]
  },
  {
    id: "mc3",
    name: "Transportes Martins",
    email: "info@transportesmartins.pt",
    sector: "Logística",
    cluster: "parceiro",
    emailsSent: 3,
    emailHistory: [
      {
        id: "e4",
        sentAt: "2024-01-10T11:00:00Z",
        subject: "Convite para calcular a sua pegada de carbono",
        preview: "Prezado parceiro, gostaríamos de convidá-lo a calcular a pegada de carbono...",
        templateUsed: "Convite Inicial"
      },
      {
        id: "e5",
        sentAt: "2024-02-05T10:00:00Z",
        subject: "Lembrete: Cálculo de pegada de carbono",
        preview: "Esperamos que esteja bem. Gostaríamos de relembrar o nosso convite...",
        templateUsed: "Lembrete"
      },
      {
        id: "e6",
        sentAt: "2024-03-01T09:30:00Z",
        subject: "Última oportunidade: Requisitos de sustentabilidade",
        preview: "Face aos novos requisitos regulamentares, reforçamos a importância...",
        templateUsed: "Urgente"
      }
    ]
  },
  {
    id: "mc4",
    name: "Alimentar Global Lda",
    email: "sustentabilidade@alimentarglobal.pt",
    sector: "Serviços",
    cluster: "cliente",
    emailsSent: 0,
    emailHistory: []
  },
  {
    id: "mc5",
    name: "Química Industrial SA",
    email: "ambiente@quimicaindustrial.pt",
    sector: "Indústria",
    cluster: "fornecedor",
    emailsSent: 1,
    emailHistory: [
      {
        id: "e7",
        sentAt: "2024-02-28T15:00:00Z",
        subject: "Convite para calcular a sua pegada de carbono",
        preview: "Prezado parceiro, gostaríamos de convidá-lo a calcular...",
        templateUsed: "Convite Inicial"
      }
    ]
  },
  {
    id: "mc6",
    name: "Serviços Financeiros ABC",
    email: "esg@sfabc.pt",
    sector: "Serviços",
    cluster: "cliente",
    emailsSent: 0,
    emailHistory: []
  },
  {
    id: "mc7",
    name: "Têxteis do Norte",
    email: "geral@texteisnorte.pt",
    sector: "Indústria",
    cluster: "parceiro",
    emailsSent: 2,
    emailHistory: [
      {
        id: "e8",
        sentAt: "2024-01-20T10:00:00Z",
        subject: "Convite para calcular a sua pegada de carbono",
        preview: "Prezado parceiro, gostaríamos de convidá-lo...",
        templateUsed: "Convite Inicial"
      },
      {
        id: "e9",
        sentAt: "2024-03-05T11:30:00Z",
        subject: "Benefícios do cálculo de pegada de carbono",
        preview: "Gostaríamos de partilhar consigo os benefícios...",
        templateUsed: "Benefícios"
      }
    ]
  },
  {
    id: "mc8",
    name: "Energia Verde Lda",
    email: "comercial@energiaverde.pt",
    sector: "Tecnologia",
    cluster: "cliente",
    emailsSent: 0,
    emailHistory: []
  },
  {
    id: "mc9",
    name: "Logística Express",
    email: "geral@logisticaexpress.pt",
    sector: "Logística",
    cluster: "fornecedor",
    emailsSent: 1,
    emailHistory: [
      {
        id: "e10",
        sentAt: "2024-03-10T09:00:00Z",
        subject: "Convite para calcular a sua pegada de carbono",
        preview: "Prezado parceiro, gostaríamos de convidá-lo...",
        templateUsed: "Convite Inicial"
      }
    ]
  },
  {
    id: "mc10",
    name: "MetalWorks SA",
    email: "ambiente@metalworks.pt",
    sector: "Indústria",
    cluster: "parceiro",
    emailsSent: 0,
    emailHistory: []
  },
  {
    id: "mc11",
    name: "Digital Services Lda",
    email: "info@digitalservices.pt",
    sector: "Tecnologia",
    cluster: "cliente",
    emailsSent: 2,
    emailHistory: [
      {
        id: "e11",
        sentAt: "2024-02-15T10:00:00Z",
        subject: "Convite para calcular a sua pegada de carbono",
        preview: "Prezado parceiro, gostaríamos de convidá-lo...",
        templateUsed: "Convite Inicial"
      },
      {
        id: "e12",
        sentAt: "2024-03-20T14:00:00Z",
        subject: "Lembrete: Cálculo de pegada de carbono",
        preview: "Esperamos que esteja bem. Gostaríamos de relembrar...",
        templateUsed: "Lembrete"
      }
    ]
  },
  {
    id: "mc12",
    name: "Consultoria Pro",
    email: "geral@consultoriapro.pt",
    sector: "Serviços",
    cluster: "fornecedor",
    emailsSent: 0,
    emailHistory: []
  }
];

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "t1",
    name: "Convite Inicial",
    description: "Primeiro contacto para convidar ao cálculo",
    subject: "Convite para calcular a sua pegada de carbono",
    body: `Prezado/a,

Gostaríamos de convidá-lo/a a calcular a pegada de carbono da {companyName} através da plataforma Get2Zero.

O cálculo da pegada de carbono é fundamental para:
• Identificar oportunidades de redução de emissões
• Cumprir requisitos regulamentares
• Demonstrar compromisso com a sustentabilidade
• Melhorar a posição competitiva no mercado

Para começar, aceda à plataforma através do link abaixo e siga as instruções.

Estamos disponíveis para qualquer esclarecimento.

Com os melhores cumprimentos,
Equipa de Sustentabilidade`
  },
  {
    id: "t2",
    name: "Lembrete",
    description: "Follow-up amigável após primeiro contacto",
    subject: "Lembrete: Cálculo de pegada de carbono",
    body: `Prezado/a,

Esperamos que esteja bem.

Gostaríamos de relembrar o nosso convite para calcular a pegada de carbono da {companyName} através da plataforma Get2Zero.

Compreendemos que possa ter questões ou necessitar de apoio no processo. A nossa equipa está disponível para:
• Esclarecer dúvidas sobre o processo de cálculo
• Fornecer suporte técnico na utilização da plataforma
• Agendar uma sessão de acompanhamento

Não hesite em contactar-nos.

Com os melhores cumprimentos,
Equipa de Sustentabilidade`
  },
  {
    id: "t3",
    name: "Benefícios",
    description: "Destacar vantagens competitivas",
    subject: "Benefícios do cálculo de pegada de carbono para a sua empresa",
    body: `Prezado/a,

Gostaríamos de partilhar consigo os benefícios que o cálculo da pegada de carbono pode trazer à {companyName}:

📊 VANTAGENS COMPETITIVAS
• Diferenciação no mercado face a concorrentes
• Acesso a novos clientes com critérios ESG
• Melhoria da imagem corporativa

💰 BENEFÍCIOS FINANCEIROS
• Identificação de oportunidades de poupança energética
• Acesso a financiamento verde
• Redução de custos operacionais

📋 CONFORMIDADE REGULAMENTAR
• Preparação para requisitos futuros de reporte
• Cumprimento de critérios de sustentabilidade
• Resposta a exigências de clientes e parceiros

Estamos disponíveis para uma sessão de esclarecimento.

Com os melhores cumprimentos,
Equipa de Sustentabilidade`
  },
  {
    id: "t4",
    name: "Urgente",
    description: "Comunicação sobre prazos ou requisitos",
    subject: "Importante: Requisitos de sustentabilidade - Ação necessária",
    body: `Prezado/a,

Face aos novos requisitos regulamentares e às exigências crescentes de sustentabilidade, reforçamos a importância do cálculo da pegada de carbono da {companyName}.

⚠️ PONTOS IMPORTANTES:
• Novos requisitos de reporte ESG entram em vigor em breve
• Muitos clientes começam a exigir dados de emissões aos fornecedores
• O cálculo da pegada é o primeiro passo para uma estratégia de descarbonização

🎯 PRÓXIMOS PASSOS:
1. Aceda à plataforma Get2Zero
2. Complete o questionário de cálculo (aproximadamente 30 minutos)
3. Receba o seu relatório de pegada de carbono

A nossa equipa pode ajudá-lo neste processo. Responda a este email para agendar uma sessão de apoio.

Com os melhores cumprimentos,
Equipa de Sustentabilidade`
  },
  {
    id: "t5",
    name: "Personalizado",
    description: "Template em branco para personalizar",
    subject: "",
    body: ""
  }
];
