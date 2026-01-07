export interface Supplier {
  id: string;
  name: string;
  sector: string;
  subsector?: string; // Sub-tipo para melhor matching de alternativas (química, vidro, têxtil, etc.)
  region: string;
  district: string; // Distrito (ex: "Porto", "Lisboa", "Faro")
  municipality: string; // Município (ex: "Portimão", "Matosinhos")
  parish: string; // Freguesia (ex: "Praia da Rocha", "Senhora da Hora")
  companySize: 'micro' | 'pequena' | 'media' | 'grande'; // Calculado automaticamente
  scope1: number; // tons CO2e
  scope2: number;
  scope3: number;
  totalEmissions: number;
  emissionsPerRevenue: number; // kg CO2e per EUR
  emissionsPerEmployee: number; // tons CO2e per employee
  emissionsPerArea: number; // tons CO2e per m²
  employees: number;
  area: number; // m²
  revenue: number; // million EUR
  hasSBTi: boolean;
  certifications: string[];
  yearlyProgress: {
    year: number;
    emissions: number;
  }[];
  contact: {
    email: string;
    phone: string;
    website: string;
    nif: string;
  };
  sustainabilityReport?: string;
  rating: 'A' | 'B' | 'C' | 'D' | 'E';
  dataSource: 'formulario' | 'get2zero';
  cluster: 'fornecedor' | 'cliente' | 'parceiro';
}

export type SectorFilter = 'all' | 'manufacturing' | 'technology' | 'construction' | 'transport' | 'services';
export type RegionFilter = 'all' | 'north' | 'center' | 'south' | 'islands';
export type CompanySizeFilter = 'all' | 'micro' | 'pequena' | 'media' | 'grande';

export interface UniversalFilterState {
  companySize: string[]; // array de valores selecionados
  district: string[]; // array de distritos selecionados
  municipality: string[]; // array de municípios selecionados
  parish: string[]; // array de freguesias selecionadas
}

export interface AdvancedFilters {
  nifGroup: string;
  nif: string;
  district: string;
  municipality: string;
  companySize: string;
  revenue: string;
  caeSection: string;
  caeDivision: string;
  company: string;
  carbonYear: string;
  dateRange: {
    start: string;
    end: string;
  };
}
