// Tipos para tracking de emails enviados
export interface EmailRecord {
  id: string;
  sentAt: string;
  subject: string;
  preview: string;
  templateUsed: string;
}

export interface CompanyEmailTracking {
  companyId: string;
  emailsSent: number;
  emailHistory: EmailRecord[];
}

// Função para gerar histórico de emails
const generateEmailHistory = (companyId: string, count: number, startDaysAgo: number = 90): EmailRecord[] => {
  const templates = [
    { id: 't1', name: 'Convite Inicial', subject: 'Convite para calcular a sua pegada de carbono' },
    { id: 't2', name: 'Lembrete', subject: 'Lembrete: Cálculo de pegada de carbono' },
    { id: 't3', name: 'Benefícios', subject: 'Benefícios do cálculo de pegada de carbono para a sua empresa' },
    { id: 't4', name: 'Urgente', subject: 'Importante: Requisitos de sustentabilidade - Ação necessária' },
  ];
  
  const history: EmailRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = startDaysAgo - (i * 25); // Espaçar ~25 dias entre emails
    const date = new Date(now.getTime() - Math.max(daysAgo, 1) * 24 * 60 * 60 * 1000);
    const template = templates[Math.min(i, templates.length - 1)];
    
    history.push({
      id: `${companyId}-email-${i + 1}`,
      sentAt: date.toISOString(),
      subject: template.subject,
      preview: `Email enviado usando o template "${template.name}" para incentivar o cálculo de pegada de carbono...`,
      templateUsed: template.name
    });
  }
  
  return history.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
};

// Mock data para empresas (vista Empresa)
// Distribuição: ~25% nunca contactadas, ~35% 1 email, ~25% 2 emails, ~15% 3+ emails
export const mockEmailTracking: Record<string, CompanyEmailTracking> = {
  // ===== FORNECEDORES (5 empresas) =====
  // 1 nunca contactada, 2 com 1 email, 1 com 2 emails, 1 saturada
  'emp-sup-np-001': { companyId: 'emp-sup-np-001', emailsSent: 2, emailHistory: generateEmailHistory('emp-sup-np-001', 2, 45) },
  'emp-sup-np-002': { companyId: 'emp-sup-np-002', emailsSent: 0, emailHistory: [] },
  'emp-sup-np-003': { companyId: 'emp-sup-np-003', emailsSent: 3, emailHistory: generateEmailHistory('emp-sup-np-003', 3, 80) },
  'emp-sup-np-004': { companyId: 'emp-sup-np-004', emailsSent: 1, emailHistory: generateEmailHistory('emp-sup-np-004', 1, 30) },
  'emp-sup-np-005': { companyId: 'emp-sup-np-005', emailsSent: 1, emailHistory: generateEmailHistory('emp-sup-np-005', 1, 15) },
  
  // ===== CLIENTES (15 empresas) =====
  // 4 nunca contactadas, 5 com 1 email, 4 com 2 emails, 2 saturadas
  'emp-cli-np-001': { companyId: 'emp-cli-np-001', emailsSent: 1, emailHistory: generateEmailHistory('emp-cli-np-001', 1, 28) },
  'emp-cli-np-002': { companyId: 'emp-cli-np-002', emailsSent: 0, emailHistory: [] },
  'emp-cli-np-003': { companyId: 'emp-cli-np-003', emailsSent: 2, emailHistory: generateEmailHistory('emp-cli-np-003', 2, 60) },
  'emp-cli-np-004': { companyId: 'emp-cli-np-004', emailsSent: 1, emailHistory: generateEmailHistory('emp-cli-np-004', 1, 20) },
  'emp-cli-np-005': { companyId: 'emp-cli-np-005', emailsSent: 0, emailHistory: [] },
  'emp-cli-np-006': { companyId: 'emp-cli-np-006', emailsSent: 3, emailHistory: generateEmailHistory('emp-cli-np-006', 3, 90) },
  'emp-cli-np-007': { companyId: 'emp-cli-np-007', emailsSent: 0, emailHistory: [] },
  'emp-cli-np-008': { companyId: 'emp-cli-np-008', emailsSent: 2, emailHistory: generateEmailHistory('emp-cli-np-008', 2, 50) },
  'emp-cli-np-009': { companyId: 'emp-cli-np-009', emailsSent: 1, emailHistory: generateEmailHistory('emp-cli-np-009', 1, 12) },
  'emp-cli-np-010': { companyId: 'emp-cli-np-010', emailsSent: 0, emailHistory: [] },
  'emp-cli-np-011': { companyId: 'emp-cli-np-011', emailsSent: 2, emailHistory: generateEmailHistory('emp-cli-np-011', 2, 55) },
  'emp-cli-np-012': { companyId: 'emp-cli-np-012', emailsSent: 1, emailHistory: generateEmailHistory('emp-cli-np-012', 1, 35) },
  'emp-cli-np-013': { companyId: 'emp-cli-np-013', emailsSent: 0, emailHistory: [] },
  'emp-cli-np-014': { companyId: 'emp-cli-np-014', emailsSent: 3, emailHistory: generateEmailHistory('emp-cli-np-014', 3, 85) },
  'emp-cli-np-015': { companyId: 'emp-cli-np-015', emailsSent: 1, emailHistory: generateEmailHistory('emp-cli-np-015', 1, 22) },
  
  // ===== PARCEIROS (20 empresas) =====
  // 5 nunca contactadas, 7 com 1 email, 5 com 2 emails, 3 saturadas
  'emp-par-np-001': { companyId: 'emp-par-np-001', emailsSent: 0, emailHistory: [] },
  'emp-par-np-002': { companyId: 'emp-par-np-002', emailsSent: 1, emailHistory: generateEmailHistory('emp-par-np-002', 1, 25) },
  'emp-par-np-003': { companyId: 'emp-par-np-003', emailsSent: 2, emailHistory: generateEmailHistory('emp-par-np-003', 2, 48) },
  'emp-par-np-004': { companyId: 'emp-par-np-004', emailsSent: 0, emailHistory: [] },
  'emp-par-np-005': { companyId: 'emp-par-np-005', emailsSent: 1, emailHistory: generateEmailHistory('emp-par-np-005', 1, 18) },
  'emp-par-np-006': { companyId: 'emp-par-np-006', emailsSent: 0, emailHistory: [] },
  'emp-par-np-007': { companyId: 'emp-par-np-007', emailsSent: 3, emailHistory: generateEmailHistory('emp-par-np-007', 3, 75) },
  'emp-par-np-008': { companyId: 'emp-par-np-008', emailsSent: 1, emailHistory: generateEmailHistory('emp-par-np-008', 1, 32) },
  'emp-par-np-009': { companyId: 'emp-par-np-009', emailsSent: 0, emailHistory: [] },
  'emp-par-np-010': { companyId: 'emp-par-np-010', emailsSent: 2, emailHistory: generateEmailHistory('emp-par-np-010', 2, 42) },
  'emp-par-np-011': { companyId: 'emp-par-np-011', emailsSent: 0, emailHistory: [] },
  'emp-par-np-012': { companyId: 'emp-par-np-012', emailsSent: 1, emailHistory: generateEmailHistory('emp-par-np-012', 1, 10) },
  'emp-par-np-013': { companyId: 'emp-par-np-013', emailsSent: 0, emailHistory: [] },
  'emp-par-np-014': { companyId: 'emp-par-np-014', emailsSent: 2, emailHistory: generateEmailHistory('emp-par-np-014', 2, 65) },
  'emp-par-np-015': { companyId: 'emp-par-np-015', emailsSent: 1, emailHistory: generateEmailHistory('emp-par-np-015', 1, 40) },
  'emp-par-np-016': { companyId: 'emp-par-np-016', emailsSent: 0, emailHistory: [] },
  'emp-par-np-017': { companyId: 'emp-par-np-017', emailsSent: 3, emailHistory: generateEmailHistory('emp-par-np-017', 3, 88) },
  'emp-par-np-018': { companyId: 'emp-par-np-018', emailsSent: 1, emailHistory: generateEmailHistory('emp-par-np-018', 1, 8) },
  'emp-par-np-019': { companyId: 'emp-par-np-019', emailsSent: 0, emailHistory: [] },
  'emp-par-np-020': { companyId: 'emp-par-np-020', emailsSent: 2, emailHistory: generateEmailHistory('emp-par-np-020', 2, 38) },
  
  // ===== MUNICÍPIO - APOIADAS (8 empresas) =====
  // 2 nunca contactadas, 3 com 1 email, 2 com 2 emails, 1 saturada
  'mun-apo-np-001': { companyId: 'mun-apo-np-001', emailsSent: 1, emailHistory: generateEmailHistory('mun-apo-np-001', 1, 20) },
  'mun-apo-np-002': { companyId: 'mun-apo-np-002', emailsSent: 0, emailHistory: [] },
  'mun-apo-np-003': { companyId: 'mun-apo-np-003', emailsSent: 2, emailHistory: generateEmailHistory('mun-apo-np-003', 2, 55) },
  'mun-apo-np-004': { companyId: 'mun-apo-np-004', emailsSent: 0, emailHistory: [] },
  'mun-apo-np-005': { companyId: 'mun-apo-np-005', emailsSent: 3, emailHistory: generateEmailHistory('mun-apo-np-005', 3, 70) },
  'mun-apo-np-006': { companyId: 'mun-apo-np-006', emailsSent: 1, emailHistory: generateEmailHistory('mun-apo-np-006', 1, 15) },
  'mun-apo-np-007': { companyId: 'mun-apo-np-007', emailsSent: 0, emailHistory: [] },
  'mun-apo-np-008': { companyId: 'mun-apo-np-008', emailsSent: 2, emailHistory: generateEmailHistory('mun-apo-np-008', 2, 45) },
  
  // ===== MUNICÍPIO - MONITORIZADAS (4 empresas) =====
  // 1 nunca contactada, 1 com 1 email, 1 com 2 emails, 1 saturada
  'mun-mon-np-001': { companyId: 'mun-mon-np-001', emailsSent: 2, emailHistory: generateEmailHistory('mun-mon-np-001', 2, 50) },
  'mun-mon-np-002': { companyId: 'mun-mon-np-002', emailsSent: 1, emailHistory: generateEmailHistory('mun-mon-np-002', 1, 28) },
  'mun-mon-np-003': { companyId: 'mun-mon-np-003', emailsSent: 0, emailHistory: [] },
  'mun-mon-np-004': { companyId: 'mun-mon-np-004', emailsSent: 3, emailHistory: generateEmailHistory('mun-mon-np-004', 3, 82) },
  
  // ===== MUNICÍPIO - PARCEIRAS (3 empresas) =====
  // 1 nunca contactada, 1 com 1 email, 1 com 2 emails
  'mun-par-np-001': { companyId: 'mun-par-np-001', emailsSent: 0, emailHistory: [] },
  'mun-par-np-002': { companyId: 'mun-par-np-002', emailsSent: 1, emailHistory: generateEmailHistory('mun-par-np-002', 1, 22) },
  'mun-par-np-003': { companyId: 'mun-par-np-003', emailsSent: 2, emailHistory: generateEmailHistory('mun-par-np-003', 2, 40) },
};

// Função para obter tracking de uma empresa
export const getCompanyEmailTracking = (companyId: string): CompanyEmailTracking => {
  return mockEmailTracking[companyId] || {
    companyId,
    emailsSent: 0,
    emailHistory: []
  };
};

// Obter todo o histórico de emails (para a tabela de histórico)
export const getAllEmailHistory = () => {
  const allHistory: Array<{
    id: string;
    sentAt: string;
    companyId: string;
    templateUsed: string;
    subject: string;
  }> = [];
  
  Object.values(mockEmailTracking).forEach(tracking => {
    tracking.emailHistory.forEach(email => {
      allHistory.push({
        id: email.id,
        sentAt: email.sentAt,
        companyId: tracking.companyId,
        templateUsed: email.templateUsed,
        subject: email.subject,
      });
    });
  });
  
  return allHistory.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
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
    body: `Boa tarde,

Gostaríamos de convidá-lo/a a calcular a pegada de carbono da sua empresa através da plataforma Get2Zero.

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
    body: `Boa tarde,

Esperamos que esteja bem.

Gostaríamos de relembrar o nosso convite para calcular a pegada de carbono da sua empresa através da plataforma Get2Zero.

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
    body: `Boa tarde,

Gostaríamos de partilhar consigo os benefícios que o cálculo da pegada de carbono pode trazer à sua empresa:

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
    body: `Boa tarde,

Face aos novos requisitos regulamentares e às exigências crescentes de sustentabilidade, reforçamos a importância do cálculo da pegada de carbono da sua empresa.

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
