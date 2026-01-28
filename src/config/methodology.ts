// src/config/methodology.ts
// Configuração centralizada da página Metodologia

export const METHODOLOGY_VERSION = {
  major: 2,
  minor: 0,
  patch: 0,
  date: "2026-01-28",
};

export const getVersionString = () =>
  `v${METHODOLOGY_VERSION.major}.${METHODOLOGY_VERSION.minor}.${METHODOLOGY_VERSION.patch}`;

export const getVersionDate = () => {
  const date = new Date(METHODOLOGY_VERSION.date);
  return date.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
};

// Estrutura de navegação com grupos colapsáveis
export type SectionConfig = {
  id: string;
  label: string;
  icon: string;
};

export type SectionGroup = {
  id: string;
  label: string;
  sections: SectionConfig[];
};

export const methodologySections: SectionGroup[] = [
  {
    id: 'introducao',
    label: 'Introdução',
    sections: [
      { id: 'visao-geral', label: 'Visão Geral', icon: 'BookOpen' },
      { id: 'utilizadores', label: 'Tipos de Utilizador', icon: 'Users' },
      { id: 'glossario', label: 'Glossário', icon: 'FileText' },
    ]
  },
  {
    id: 'carbono',
    label: 'Carbono',
    sections: [
      { id: 'emissoes', label: 'Cálculo de Emissões', icon: 'Factory' },
      { id: 'indicadores', label: 'Indicadores', icon: 'BarChart3' },
      { id: 'potencial', label: 'Potencial de Melhoria', icon: 'TrendingDown' },
      { id: 'setores', label: 'Setores de Atividade', icon: 'Briefcase' },
      { id: 'intensidades', label: 'Fatores de Intensidade', icon: 'Scale' },
    ]
  },
  {
    id: 'plataforma',
    label: 'Plataforma',
    sections: [
      { id: 'dados', label: 'Dados a Recolher', icon: 'FileSpreadsheet' },
      { id: 'onboarding', label: 'Fluxo de Onboarding', icon: 'CheckCircle2' },
      { id: 'clusters', label: 'Gestão de Clusters', icon: 'Layers' },
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { id: 'graficos', label: 'Gráficos e Análises', icon: 'PieChart' },
      { id: 'planos', label: 'Planos de Acção', icon: 'Target' },
      { id: 'medidas', label: 'Medidas', icon: 'Leaf' },
      { id: 'financiamento', label: 'Financiamento', icon: 'Euro' },
    ]
  },
  {
    id: 'comunicacao',
    label: 'Comunicação',
    sections: [
      { id: 'incentivos', label: 'Sistema de Incentivos', icon: 'Mail' },
      { id: 'templates', label: 'Templates de Email', icon: 'FileText' },
      { id: 'email', label: 'Boas Práticas', icon: 'Send' },
    ]
  },
  {
    id: 'administracao',
    label: 'Administração',
    sections: [
      { id: 'admin', label: 'Painel de Controlo', icon: 'TowerControl' },
      { id: 'permissoes', label: 'Permissões', icon: 'Shield' },
      { id: 'infraestruturas', label: 'Infraestruturas', icon: 'Database' },
      { id: 'bibliografia', label: 'Bibliografia', icon: 'Library' },
    ]
  },
];

// Glossário de termos técnicos
export const glossary = [
  { term: 'CO₂e', definition: 'Dióxido de carbono equivalente. Unidade que permite comparar diferentes gases com efeito de estufa.' },
  { term: 'GEE', definition: 'Gases com Efeito de Estufa. Incluem CO₂, CH₄, N₂O e gases fluorados.' },
  { term: 'Scope 1', definition: 'Emissões diretas de fontes que a empresa controla (ex: caldeiras, veículos próprios).' },
  { term: 'Scope 2', definition: 'Emissões indiretas da energia comprada (electricidade, calor).' },
  { term: 'Scope 3', definition: 'Outras emissões indiretas na cadeia de valor (fornecedores, viagens, resíduos).' },
  { term: 'VAB', definition: 'Valor Acrescentado Bruto. Medida do contributo económico de uma atividade.' },
  { term: 'GWP', definition: 'Global Warming Potential. Potencial de aquecimento global de um gás.' },
  { term: 'CAE', definition: 'Classificação Portuguesa de Atividades Económicas.' },
  { term: 'NIF', definition: 'Número de Identificação Fiscal. Identificador único de empresas em Portugal.' },
  { term: 'FTE', definition: 'Full-Time Equivalent. Número de colaboradores em equivalente a tempo inteiro.' },
  { term: 'Cluster', definition: 'Grupo lógico de empresas para gestão e análise conjunta.' },
  { term: 'Onboarding', definition: 'Processo de adesão de uma empresa à plataforma até calcular a pegada.' },
  { term: 'Simple', definition: 'Plataforma self-service de cálculo de pegada de carbono.' },
  { term: 'Bounce', definition: 'Email que não foi entregue ao destinatário.' },
  { term: 'CTOR', definition: 'Click-to-Open Rate. Percentagem de cliques entre emails abertos.' },
];

// Descrições dos tipos de utilizador
export const userTypes = {
  get2c: {
    name: 'Get2C',
    description: 'Administrador da plataforma. Gere múltiplos clientes (municípios e empresas).',
    capabilities: [
      'Criar e gerir clientes',
      'Definir permissões de acesso',
      'Aceder a métricas globais',
      'Gerir templates de email',
    ],
    icon: 'TowerControl',
    color: 'primary',
  },
  municipio: {
    name: 'Município',
    description: 'Autarquia local que acompanha as empresas do seu território.',
    capabilities: [
      'Visualizar empresas do território',
      'Enviar campanhas de incentivo',
      'Aceder a infraestruturas municipais',
      'Criar planos de acção territoriais',
    ],
    icon: 'Landmark',
    color: 'purple-500',
  },
  empresa: {
    name: 'Empresa',
    description: 'Organização que gere a sua cadeia de fornecedores.',
    capabilities: [
      'Visualizar fornecedores',
      'Comparar alternativas por setor',
      'Identificar potencial de substituição',
      'Criar planos de acção individuais',
    ],
    icon: 'Building2',
    color: 'blue-500',
  },
};
