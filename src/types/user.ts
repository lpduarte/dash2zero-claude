// Tipos de utilizador
export type UserType = 'empresa' | 'municipio' | 'get2c';

// Permissões por módulo - cada uma pode ser ligada/desligada por cliente
export interface ClientPermissions {
  // Dashboard
  dashboard: {
    viewKPIs: boolean;
    viewCharts: boolean;
    viewSupplierDetails: boolean;
    useFilters: boolean;
  };
  // Clusters
  clusters: {
    viewKPIs: boolean;
    viewList: boolean;
    createCluster: boolean;
    editCluster: boolean;
    deleteCluster: boolean;
    manageCompanies: boolean;
  };
  // Incentivos
  incentives: {
    viewKPIs: boolean;
    viewFunnel: boolean;
    viewCompanyList: boolean;
    sendEmails: boolean;
    manageTemplates: boolean;
  };
  // Pipeline
  pipeline: {
    view: boolean;
    edit: boolean;
  };
}

// Perfis pré-definidos para quick-select
export type PermissionProfile = 'visualizacao' | 'gestao-parcial' | 'gestao-completa';

// Cliente da Get2C (município ou empresa parceira)
export interface Client {
  id: string;
  name: string;
  type: 'municipio' | 'empresa';
  logo?: string;
  contactEmail: string;
  contactName?: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;

  // Permissões
  permissions: ClientPermissions;

  // Métricas resumidas (para dashboard admin)
  metrics: {
    totalCompanies: number;
    totalClusters: number;
    funnelStats: {
      incontactaveis?: number;  // Empresas com problemas de entrega (bounce/spam/opt-out)
      porContactar: number;
      semInteracao: number;
      interessada: number;
      // Breakdown pós-decisão por via (Simple ou Formulário)
      simple: {
        registada: number;
        emProgresso: number;
        completo: number;
      };
      formulario: {
        emProgresso: number;
        completo: number;
      };
    };
    lastActivity?: Date;
    emailBounces?: number;        // Emails com erro de entrega
    weeklyCompletions?: number[]; // Pegadas completas por semana (últimas 12)
  };

  // Integração futura com ZeroPro
  zeroProIntegration?: {
    enabled: boolean;
    accountId?: string;
    syncScope3Data: boolean;
    lastSync?: Date;
  };
}

// Utilizador base (manter compatibilidade)
export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  municipality?: string; // Apenas para userType='municipio'
  clientId?: string; // Referência ao Client quando não é get2c
  createdAt: Date;
}
