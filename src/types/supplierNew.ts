// Novo tipo de Supplier com clusterId

// Empresa COM pegada calculada
export interface SupplierWithFootprint {
  id: string;
  name: string;
  clusterIds: string[];
  sector: string;
  subsector?: string;
  region: string;
  district: string;
  municipality: string;
  parish: string;
  companySize: 'micro' | 'pequena' | 'media' | 'grande';
  employees: number;
  area: number;
  revenue: number;
  contact: {
    email: string;
    phone: string;
    website: string;
    nif: string;
  };
  scope1: number;
  scope2: number;
  scope3: number;
  totalEmissions: number;
  emissionsPerRevenue: number;
  emissionsPerEmployee: number;
  emissionsPerArea: number;
  hasSBTi: boolean;
  certifications: string[];
  yearlyProgress: {
    year: number;
    emissions: number;
  }[];
  sustainabilityReport?: string;
  rating: 'A' | 'B' | 'C' | 'D' | 'E';
  dataSource: 'formulario' | 'get2zero';
}

// Empresa SEM pegada calculada
export interface SupplierWithoutFootprint {
  id: string;
  name: string;
  clusterIds: string[];
  sector: string;
  subsector?: string;
  region: string;
  district: string;
  municipality: string;
  parish: string;
  companySize: 'micro' | 'pequena' | 'media' | 'grande';
  employees: number;
  area: number;
  revenue: number;
  contact: {
    email: string;
    phone: string;
    website: string;
    nif: string;
  };
  emailsSent: number;
  lastContactDate?: string;
  onboardingStatus:
    | 'por_contactar'
    | 'sem_interacao'
    | 'interessada'
    | 'registada_simple'
    | 'em_progresso_simple'
    | 'em_progresso_formulario'
    | 'completo';
  completedVia?: 'simple' | 'formulario';
}

export type SupplierAny = SupplierWithFootprint | SupplierWithoutFootprint;

export const hasFootprint = (supplier: SupplierAny): supplier is SupplierWithFootprint => {
  return 'totalEmissions' in supplier;
};
