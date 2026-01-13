// Tipos para tracking de emails enviados
export interface EmailRecord {
  id: string;
  sentAt: string;
  subject: string;
  preview: string;
  templateUsed: string;
}

export interface CompanyEmailTracking {
  companyId: string; // Referência ao Supplier.id
  emailsSent: number;
  emailHistory: EmailRecord[];
}

// Simular histórico de emails para algumas empresas
// Em produção, isto viria de uma API/base de dados
const generateMockEmailHistory = (companyId: string, count: number): EmailRecord[] => {
  const templates = ['Convite Inicial', 'Lembrete', 'Benefícios', 'Urgente'];
  const subjects = [
    'Convite para calcular a sua pegada de carbono',
    'Lembrete: Cálculo de pegada de carbono',
    'Benefícios do cálculo de pegada de carbono',
    'Importante: Requisitos de sustentabilidade'
  ];
  
  const history: EmailRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90) + (i * 30); // Espaçar emails
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const templateIndex = Math.min(i, templates.length - 1);
    
    history.push({
      id: `${companyId}-email-${i + 1}`,
      sentAt: date.toISOString(),
      subject: subjects[templateIndex],
      preview: `Email enviado para incentivar o cálculo de pegada de carbono...`,
      templateUsed: templates[templateIndex]
    });
  }
  
  // Ordenar por data (mais recente primeiro)
  return history.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
};

// Gerar tracking mock para empresas sem dataSource "get2zero"
// A chave é o companyId (Supplier.id)
export const mockEmailTracking: Record<string, CompanyEmailTracking> = {
  // Empresas com 3 emails (saturadas - vermelho)
  '3': { companyId: '3', emailsSent: 3, emailHistory: generateMockEmailHistory('3', 3) },
  '8': { companyId: '8', emailsSent: 3, emailHistory: generateMockEmailHistory('8', 3) },
  
  // Empresas com 2 emails (amber)
  '1': { companyId: '1', emailsSent: 2, emailHistory: generateMockEmailHistory('1', 2) },
  '5': { companyId: '5', emailsSent: 2, emailHistory: generateMockEmailHistory('5', 2) },
  '12': { companyId: '12', emailsSent: 2, emailHistory: generateMockEmailHistory('12', 2) },
  
  // Empresas com 1 email (azul)
  '2': { companyId: '2', emailsSent: 1, emailHistory: generateMockEmailHistory('2', 1) },
  '9': { companyId: '9', emailsSent: 1, emailHistory: generateMockEmailHistory('9', 1) },
  '15': { companyId: '15', emailsSent: 1, emailHistory: generateMockEmailHistory('15', 1) },
  
  // Restantes empresas terão 0 emails (calculado dinamicamente)
};

// Função para obter tracking de uma empresa (retorna default se não existir)
export const getCompanyEmailTracking = (companyId: string): CompanyEmailTracking => {
  return mockEmailTracking[companyId] || {
    companyId,
    emailsSent: 0,
    emailHistory: []
  };
};

// Templates de email
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
