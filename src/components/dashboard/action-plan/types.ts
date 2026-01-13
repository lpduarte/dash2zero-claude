import type { Supplier } from '@/types/supplier';

export type Step = 1 | 2 | 3 | 4;

export interface StepConfig {
  number: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ExpandedSections {
  proximosPassos: boolean;
  diagnosticoImpacto: boolean;
  medidas: boolean;
  financiamento: boolean;
  contexto: boolean;
  notas: boolean;
}

export interface MunicipalityActionPlanModalProps {
  supplier: Supplier | null;
  riskLevel: 'alto' | 'medio' | 'normal';
  riskMultiplier: number;
  avgSectorIntensity: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Props comuns para os steps
export interface BaseStepProps {
  supplier: Supplier;
  avgSectorIntensity: number;
}

export interface Step1Props extends BaseStepProps {
  riskLevel: 'alto' | 'medio' | 'normal';
  riskMultiplier: number;
}

export interface Step2Props extends BaseStepProps {
  selectedMeasures: string[];
  onMeasuresChange: (measures: string[]) => void;
  recommendedApplied: boolean;
  onRecommendedAppliedChange: (applied: boolean) => void;
}

export interface Step3Props extends BaseStepProps {
  selectedMeasures: string[];
  selectedFunding: string[];
  onFundingChange: (funding: string[]) => void;
}

export interface Step4Props extends BaseStepProps {
  selectedMeasures: string[];
  selectedFunding: string[];
  municipalityNotes: string;
  onNotesChange: (notes: string) => void;
  emailSent: boolean;
  onSendEmail: () => void;
  expandedSections: ExpandedSections;
  onToggleSection: (section: string, event?: React.MouseEvent) => void;
  onToggleAllSections: () => void;
  allExpanded: boolean;
  riskLevel: 'alto' | 'medio' | 'normal';
  onClose: () => void;
  onPrevious: () => void;
  storageKey: string;
}

// Helpers
export const getDimensionLabel = (size: string) => {
  const labels: Record<string, string> = {
    'micro': 'Micro',
    'pequena': 'Pequena',
    'media': 'Média',
    'grande': 'Grande'
  };
  return labels[size] || size;
};
