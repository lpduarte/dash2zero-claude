export type MeasureCategory = 'energia' | 'mobilidade' | 'residuos' | 'agua';
export type MeasurePriority = 'alta' | 'media' | 'baixa';

export interface Measure {
  id: string;
  category: MeasureCategory;
  name: string;
  description: string;
  emissionReduction: number;  // t CO₂e/ano
  investment: number;          // €
  timeline: number;            // meses
  priority: MeasurePriority;
  roi?: number;                // anos (opcional)
  annualSavings?: number;      // € (opcional)
  applicableTo: {
    sectors?: string[];        // Se vazio = todos
    sizes?: ('micro' | 'pequena' | 'media' | 'grande')[];
    minEmissions?: number;     // Mínimo para fazer sentido
  };
}

export type FundingType = 'subsidio' | 'financiamento' | 'incentivo';

export interface FundingSource {
  id: string;
  type: FundingType;
  name: string;
  provider: string;            // "Estado", "CM Cascais", "UE"
  maxAmount: number;           // €
  percentage?: number;         // % do investimento
  deadline?: string;           // "2025-03-31" ou "rolling"
  requirements: string[];
  applicableTo: {
    measureCategories?: MeasureCategory[];
    maxCompanySize?: 'micro' | 'pequena' | 'media' | 'grande';
  };
}

export interface ActionPlan {
  companyId: string;
  companyName: string;
  selectedMeasures: string[];  // IDs das medidas
  selectedFunding: string[];   // IDs dos fundos
  totalReduction: number;      // t CO₂e
  totalInvestment: number;     // €
  totalFunding: number;        // €
  createdAt: Date;
}
