// ============================================================================
// TIPOS PARA TRACKING DE EMAILS (compatível com SendGrid Webhooks)
// ============================================================================
//
// INTEGRAÇÃO SENDGRID - DOCUMENTAÇÃO
// ===================================
//
// 1. CONFIGURAÇÃO DE WEBHOOKS
//    - Criar endpoint POST /api/webhooks/sendgrid no backend
//    - Configurar Event Webhook no SendGrid: Settings > Mail Settings > Event Webhook
//    - URL: https://[dominio]/api/webhooks/sendgrid
//    - Selecionar eventos: Delivered, Bounced, Dropped, Spam Reports, Opens, Clicks
//
// 2. ESTRUTURA DO PAYLOAD SENDGRID (exemplo)
//    [
//      {
//        "email": "destinatario@exemplo.com",
//        "timestamp": 1234567890,
//        "event": "delivered" | "bounce" | "dropped" | "spamreport" | "open" | "click",
//        "sg_message_id": "abc123.xyz",
//        "reason": "...",           // Para bounces
//        "type": "bounce" | "blocked", // Para bounces: hard vs soft
//        "url": "..."               // Para clicks
//      }
//    ]
//
// 3. MAPEAMENTO DE EVENTOS SENDGRID -> EmailDeliveryStatus
//    - "delivered"   -> 'delivered'
//    - "open"        -> 'opened'
//    - "click"       -> 'clicked'
//    - "bounce"      -> 'bounced' (type: "bounce" = hard, "blocked" = soft)
//    - "dropped"     -> 'dropped'
//    - "spamreport"  -> 'spam'
//
// 4. CAMPOS A GUARDAR NA BASE DE DADOS
//    - sg_message_id: identificador único do email (para associar eventos)
//    - email: endereço do destinatário
//    - event timestamps: deliveredAt, openedAt, clickedAt, bouncedAt, spamReportedAt
//    - bounce_type: 'hard' | 'soft'
//    - bounce_reason: motivo do bounce
//
// 5. SEGURANÇA
//    - Validar assinatura do webhook SendGrid (Event Webhook Signature Verification)
//    - Docs: https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook-security-features
//
// 6. AÇÕES RECOMENDADAS
//    - Hard bounce: remover email da lista ou marcar como inválido
//    - Soft bounce: tentar novamente após 24-48h, máximo 3 tentativas
//    - Spam report: remover da lista de envio (obrigatório por lei)
//
// ============================================================================
// Eventos SendGrid: processed, delivered, bounce, dropped, spamreport, open, click
// Docs: https://docs.sendgrid.com/for-developers/tracking-events/event

// Status de entrega de email (baseado em eventos SendGrid)
export type EmailDeliveryStatus =
  | 'delivered'    // Email entregue com sucesso
  | 'opened'       // Email foi aberto
  | 'clicked'      // Link foi clicado
  | 'bounced'      // Email não entregue (hard/soft bounce)
  | 'dropped'      // SendGrid rejeitou (invalid, unsubscribed, etc.)
  | 'spam'         // Marcado como spam pelo destinatário
  | 'pending';     // Enviado mas sem confirmação de entrega

// Tipo de bounce (SendGrid distingue hard vs soft)
export type BounceType = 'hard' | 'soft';

// Registo de um email enviado
export interface EmailRecord {
  id: string;
  sentAt: string;
  subject: string;
  preview: string;
  templateUsed: string;
  // Campos de deliverability (vindos dos webhooks SendGrid)
  deliveryStatus: EmailDeliveryStatus;
  deliveredAt?: string;      // Timestamp de entrega
  openedAt?: string;         // Timestamp de abertura
  clickedAt?: string;        // Timestamp de clique
  bouncedAt?: string;        // Timestamp de bounce
  bounceType?: BounceType;   // Tipo de bounce (hard = permanente, soft = temporário)
  bounceReason?: string;     // Razão do bounce (ex: "invalid email", "mailbox full")
  spamReportedAt?: string;   // Timestamp de report de spam
}

// Resumo de deliverability por empresa
export interface DeliverySummary {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  spam: number;
  pending: number;
}

export interface CompanyEmailTracking {
  companyId: string;
  emailsSent: number;
  emailHistory: EmailRecord[];
  // Flag para alertas visuais
  hasDeliveryIssues: boolean;  // true se tem bounce ou spam
  lastDeliveryIssue?: {
    type: 'bounced' | 'spam';
    reason?: string;
    date: string;
  };
}

// Opções para gerar emails com problemas de entrega
interface EmailGenerationOptions {
  deliveryIssue?: 'bounced' | 'spam';
  bounceType?: BounceType;
  bounceReason?: string;
}

// Função para gerar histórico de emails
const generateEmailHistory = (
  companyId: string,
  count: number,
  startDaysAgo: number = 90,
  options?: EmailGenerationOptions
): EmailRecord[] => {
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
    const sentDate = new Date(now.getTime() - Math.max(daysAgo, 1) * 24 * 60 * 60 * 1000);
    const template = templates[Math.min(i, templates.length - 1)];

    // Determinar status de entrega
    // O último email (i === 0 após ordenação) pode ter problema se options definir
    const isLastEmail = i === count - 1;
    const hasIssue = isLastEmail && options?.deliveryIssue;

    let deliveryStatus: EmailDeliveryStatus = 'delivered';
    let deliveredAt: string | undefined;
    let openedAt: string | undefined;
    let clickedAt: string | undefined;
    let bouncedAt: string | undefined;
    let bounceType: BounceType | undefined;
    let bounceReason: string | undefined;
    let spamReportedAt: string | undefined;

    if (hasIssue && options?.deliveryIssue === 'bounced') {
      deliveryStatus = 'bounced';
      bouncedAt = new Date(sentDate.getTime() + 60000).toISOString(); // 1 min depois
      bounceType = options.bounceType || 'hard';
      bounceReason = options.bounceReason || 'Email address does not exist';
    } else if (hasIssue && options?.deliveryIssue === 'spam') {
      deliveryStatus = 'spam';
      deliveredAt = new Date(sentDate.getTime() + 30000).toISOString();
      openedAt = new Date(sentDate.getTime() + 3600000).toISOString(); // 1h depois
      spamReportedAt = new Date(sentDate.getTime() + 3700000).toISOString(); // Pouco depois de abrir
    } else {
      // Email normal - simular abertura e clique com probabilidade
      deliveredAt = new Date(sentDate.getTime() + 30000).toISOString();
      // ~70% abrem
      if (Math.random() < 0.7) {
        openedAt = new Date(sentDate.getTime() + Math.random() * 86400000).toISOString();
        deliveryStatus = 'opened';
        // ~40% dos que abrem clicam
        if (Math.random() < 0.4) {
          clickedAt = new Date(new Date(openedAt).getTime() + Math.random() * 300000).toISOString();
          deliveryStatus = 'clicked';
        }
      }
    }

    history.push({
      id: `${companyId}-email-${i + 1}`,
      sentAt: sentDate.toISOString(),
      subject: template.subject,
      preview: `Email enviado usando o template "${template.name}" para incentivar o cálculo de pegada de carbono...`,
      templateUsed: template.name,
      deliveryStatus,
      deliveredAt,
      openedAt,
      clickedAt,
      bouncedAt,
      bounceType,
      bounceReason,
      spamReportedAt,
    });
  }

  return history.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
};

// Helper para criar tracking sem problemas de entrega
const createTracking = (companyId: string, emailsSent: number, startDaysAgo: number = 90): CompanyEmailTracking => ({
  companyId,
  emailsSent,
  emailHistory: emailsSent > 0 ? generateEmailHistory(companyId, emailsSent, startDaysAgo) : [],
  hasDeliveryIssues: false,
});

// Helper para criar tracking COM problemas de entrega
const createTrackingWithIssue = (
  companyId: string,
  emailsSent: number,
  startDaysAgo: number,
  issue: 'bounced' | 'spam',
  issueDetails?: { bounceType?: BounceType; bounceReason?: string }
): CompanyEmailTracking => {
  const history = generateEmailHistory(companyId, emailsSent, startDaysAgo, {
    deliveryIssue: issue,
    bounceType: issueDetails?.bounceType,
    bounceReason: issueDetails?.bounceReason,
  });

  const lastEmail = history[0]; // Mais recente

  return {
    companyId,
    emailsSent,
    emailHistory: history,
    hasDeliveryIssues: true,
    lastDeliveryIssue: {
      type: issue,
      reason: issue === 'bounced' ? lastEmail.bounceReason : 'Marcado como spam pelo destinatário',
      date: issue === 'bounced' ? lastEmail.bouncedAt! : lastEmail.spamReportedAt!,
    },
  };
};

// Mock data para empresas (vista Empresa)
// Distribuição: ~25% nunca contactadas, ~35% 1 email, ~25% 2 emails, ~15% 3+ emails
// Alguns com problemas de entrega: ~5% bounce, ~3% spam
export const mockEmailTracking: Record<string, CompanyEmailTracking> = {
  // ===== FORNECEDORES (5 empresas) =====
  // 1 nunca contactada, 2 com 1 email, 1 com 2 emails, 1 saturada
  // emp-sup-np-003: BOUNCED (email inválido)
  'emp-sup-np-001': createTracking('emp-sup-np-001', 2, 45),
  'emp-sup-np-002': createTracking('emp-sup-np-002', 0),
  'emp-sup-np-003': createTrackingWithIssue('emp-sup-np-003', 3, 80, 'bounced', {
    bounceType: 'hard',
    bounceReason: 'Email address does not exist'
  }),
  'emp-sup-np-004': createTracking('emp-sup-np-004', 1, 30),
  'emp-sup-np-005': createTracking('emp-sup-np-005', 1, 15),

  // ===== CLIENTES (15 empresas) =====
  // emp-cli-np-006: SPAM (marcado como spam)
  // emp-cli-np-011: BOUNCED (caixa cheia)
  'emp-cli-np-001': createTracking('emp-cli-np-001', 1, 28),
  'emp-cli-np-002': createTracking('emp-cli-np-002', 0),
  'emp-cli-np-003': createTracking('emp-cli-np-003', 2, 60),
  'emp-cli-np-004': createTracking('emp-cli-np-004', 1, 20),
  'emp-cli-np-005': createTracking('emp-cli-np-005', 0),
  'emp-cli-np-006': createTrackingWithIssue('emp-cli-np-006', 3, 90, 'spam'),
  'emp-cli-np-007': createTracking('emp-cli-np-007', 0),
  'emp-cli-np-008': createTracking('emp-cli-np-008', 2, 50),
  'emp-cli-np-009': createTracking('emp-cli-np-009', 1, 12),
  'emp-cli-np-010': createTracking('emp-cli-np-010', 0),
  'emp-cli-np-011': createTrackingWithIssue('emp-cli-np-011', 2, 55, 'bounced', {
    bounceType: 'soft',
    bounceReason: 'Mailbox full'
  }),
  'emp-cli-np-012': createTracking('emp-cli-np-012', 1, 35),
  'emp-cli-np-013': createTracking('emp-cli-np-013', 0),
  'emp-cli-np-014': createTracking('emp-cli-np-014', 3, 85),
  'emp-cli-np-015': createTracking('emp-cli-np-015', 1, 22),

  // ===== PARCEIROS (20 empresas) =====
  // emp-par-np-007: BOUNCED (domínio inválido)
  // emp-par-np-017: SPAM
  'emp-par-np-001': createTracking('emp-par-np-001', 0),
  'emp-par-np-002': createTracking('emp-par-np-002', 1, 25),
  'emp-par-np-003': createTracking('emp-par-np-003', 2, 48),
  'emp-par-np-004': createTracking('emp-par-np-004', 0),
  'emp-par-np-005': createTracking('emp-par-np-005', 1, 18),
  'emp-par-np-006': createTracking('emp-par-np-006', 0),
  'emp-par-np-007': createTrackingWithIssue('emp-par-np-007', 3, 75, 'bounced', {
    bounceType: 'hard',
    bounceReason: 'Domain does not exist'
  }),
  'emp-par-np-008': createTracking('emp-par-np-008', 1, 32),
  'emp-par-np-009': createTracking('emp-par-np-009', 0),
  'emp-par-np-010': createTracking('emp-par-np-010', 2, 42),
  'emp-par-np-011': createTracking('emp-par-np-011', 0),
  'emp-par-np-012': createTracking('emp-par-np-012', 1, 10),
  'emp-par-np-013': createTracking('emp-par-np-013', 0),
  'emp-par-np-014': createTracking('emp-par-np-014', 2, 65),
  'emp-par-np-015': createTracking('emp-par-np-015', 1, 40),
  'emp-par-np-016': createTracking('emp-par-np-016', 0),
  'emp-par-np-017': createTrackingWithIssue('emp-par-np-017', 3, 88, 'spam'),
  'emp-par-np-018': createTracking('emp-par-np-018', 1, 8),
  'emp-par-np-019': createTracking('emp-par-np-019', 0),
  'emp-par-np-020': createTracking('emp-par-np-020', 2, 38),

  // ===== MUNICÍPIO - APOIADAS (8 empresas) =====
  // mun-apo-np-005: BOUNCED
  'mun-apo-np-001': createTracking('mun-apo-np-001', 1, 20),
  'mun-apo-np-002': createTracking('mun-apo-np-002', 0),
  'mun-apo-np-003': createTracking('mun-apo-np-003', 2, 55),
  'mun-apo-np-004': createTracking('mun-apo-np-004', 0),
  'mun-apo-np-005': createTrackingWithIssue('mun-apo-np-005', 3, 70, 'bounced', {
    bounceType: 'hard',
    bounceReason: 'User unknown'
  }),
  'mun-apo-np-006': createTracking('mun-apo-np-006', 1, 15),
  'mun-apo-np-007': createTracking('mun-apo-np-007', 0),
  'mun-apo-np-008': createTracking('mun-apo-np-008', 2, 45),

  // ===== MUNICÍPIO - MONITORIZADAS (4 empresas) =====
  'mun-mon-np-001': createTracking('mun-mon-np-001', 2, 50),
  'mun-mon-np-002': createTracking('mun-mon-np-002', 1, 28),
  'mun-mon-np-003': createTracking('mun-mon-np-003', 0),
  'mun-mon-np-004': createTracking('mun-mon-np-004', 3, 82),

  // ===== MUNICÍPIO - PARCEIRAS (3 empresas) =====
  'mun-par-np-001': createTracking('mun-par-np-001', 0),
  'mun-par-np-002': createTracking('mun-par-np-002', 1, 22),
  'mun-par-np-003': createTracking('mun-par-np-003', 2, 40),
};

// Função para obter tracking de uma empresa
export const getCompanyEmailTracking = (companyId: string): CompanyEmailTracking => {
  return mockEmailTracking[companyId] || {
    companyId,
    emailsSent: 0,
    emailHistory: [],
    hasDeliveryIssues: false,
  };
};

// Função para calcular métricas globais de deliverability
export const getDeliveryMetrics = (companyIds?: string[]): DeliverySummary & {
  bounceRate: number;
  spamRate: number;
  deliveryRate: number;
} => {
  const trackingRecords = companyIds
    ? companyIds.map(id => mockEmailTracking[id]).filter(Boolean)
    : Object.values(mockEmailTracking);

  const allEmails = trackingRecords.flatMap(t => t.emailHistory);

  const summary: DeliverySummary = {
    totalSent: allEmails.length,
    delivered: allEmails.filter(e => e.deliveryStatus !== 'bounced' && e.deliveryStatus !== 'pending').length,
    opened: allEmails.filter(e => e.deliveryStatus === 'opened' || e.deliveryStatus === 'clicked').length,
    clicked: allEmails.filter(e => e.deliveryStatus === 'clicked').length,
    bounced: allEmails.filter(e => e.deliveryStatus === 'bounced').length,
    spam: allEmails.filter(e => e.deliveryStatus === 'spam').length,
    pending: allEmails.filter(e => e.deliveryStatus === 'pending').length,
  };

  return {
    ...summary,
    bounceRate: summary.totalSent > 0 ? Math.round((summary.bounced / summary.totalSent) * 100) : 0,
    spamRate: summary.totalSent > 0 ? Math.round((summary.spam / summary.totalSent) * 100) : 0,
    deliveryRate: summary.totalSent > 0 ? Math.round((summary.delivered / summary.totalSent) * 100) : 0,
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

// Aggregate onboarding stats for a cluster
export interface ClusterOnboardingStats {
  total: number;
  porContactar: number;
  semInteracao: number;
  interessada: number;
  emProgresso: number;
  completo: number;
  // Percentages
  porContactarPct: number;
  semInteracaoPct: number;
  interessadaPct: number;
  emProgressoPct: number;
  completoPct: number;
}

export const getClusterOnboardingStats = <T extends { onboardingStatus: string }>(
  companies: T[]
): ClusterOnboardingStats => {
  const total = companies.length;

  if (total === 0) {
    return {
      total: 0,
      porContactar: 0,
      semInteracao: 0,
      interessada: 0,
      emProgresso: 0,
      completo: 0,
      porContactarPct: 0,
      semInteracaoPct: 0,
      interessadaPct: 0,
      emProgressoPct: 0,
      completoPct: 0,
    };
  }

  const statusCounts = companies.reduce((acc, c) => {
    acc[c.onboardingStatus] = (acc[c.onboardingStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const porContactar = statusCounts['por_contactar'] || 0;
  const semInteracao = statusCounts['sem_interacao'] || 0;
  const interessada = (statusCounts['interessada'] || 0) +
                      (statusCounts['interessada_simple'] || 0) +
                      (statusCounts['interessada_formulario'] || 0) +
                      (statusCounts['registada_simple'] || 0);
  const emProgresso = (statusCounts['em_progresso_simple'] || 0) +
                      (statusCounts['em_progresso_formulario'] || 0);
  const completo = statusCounts['completo'] || 0;

  return {
    total,
    porContactar,
    semInteracao,
    interessada,
    emProgresso,
    completo,
    porContactarPct: Math.round((porContactar / total) * 100),
    semInteracaoPct: Math.round((semInteracao / total) * 100),
    interessadaPct: Math.round((interessada / total) * 100),
    emProgressoPct: Math.round((emProgresso / total) * 100),
    completoPct: Math.round((completo / total) * 100),
  };
};

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
