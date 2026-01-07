export type MeasureCategory = 'energia' | 'mobilidade' | 'residuos' | 'agua';
export type MeasurePriority = 'alta' | 'media' | 'baixa';
export type InterventionLevel = 'soft' | 'interventiva';
export type Scope = 1 | 2 | 3;

export interface Measure {
  id: string;
  category: MeasureCategory;
  scope: Scope;                 // Qual âmbito esta medida impacta
  name: string;
  description: string;
  emissionReduction: number;    // t CO₂e/ano
  investment: number;           // €
  timeline: string;             // "1-2 meses", "6-12 meses"
  priority: MeasurePriority;
  interventionLevel: InterventionLevel;
  roi?: number;                 // anos (opcional)
  annualSavings?: number;       // € (opcional)
  
  // Requisitos de infraestrutura
  requiredInfrastructure?: {
    key: string;                // chave do mockInfrastructure
    minimumValue: number;       // valor mínimo necessário
    reason: string;             // razão para mostrar no tooltip
  };
  
  // Requisitos de fundos
  requiredFunding?: {
    category: MeasureCategory;
    minimumAmount: number;
    reason: string;
  };
  
  applicableTo: {
    sectors?: string[];         // Se vazio = todos
    sizes?: ('micro' | 'pequena' | 'media' | 'grande')[];
    minEmissions?: number;      // Mínimo para fazer sentido
  };
  
  // Benefícios adicionais
  additionalBenefits?: string[];
}

export type FundingType = 'subsidio' | 'financiamento' | 'incentivo';

export interface FundingSource {
  id: string;
  type: FundingType;
  name: string;
  provider: string;             // "Estado", "CM Cascais", "UE"
  description?: string;         // Descrição do fundo
  maxAmount: number;            // €
  percentage?: number;          // % do investimento
  interestRate?: string;        // Taxa de juro (para financiamentos)
  deadline?: string;            // "2025-03-31" ou "Contínuo"
  requirements: string[];
  applicableTo: {
    measureCategories?: MeasureCategory[];
    maxCompanySize?: 'micro' | 'pequena' | 'media' | 'grande';
    sectors?: string[];         // Sectores elegíveis
  };
  // Novos campos
  currentlyOpen?: boolean;
  remainingBudget?: number;     // € ainda disponível
}

export interface ActionPlan {
  companyId: string;
  companyName: string;
  selectedMeasures: string[];   // IDs das medidas
  selectedFunding: string[];    // IDs dos fundos
  totalReduction: number;       // t CO₂e
  totalInvestment: number;      // €
  totalFunding: number;         // €
  createdAt: Date;
}
