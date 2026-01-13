/**
 * Estilos centralizados para manter consistência no projecto
 * Dash2Zero Simple
 */

import { XCircle, Clock, CheckCircle, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PlanStatus } from './planUtils';

// ===========================================
// SHADOWS
// ===========================================

export const shadows = {
  /** Cards pequenos (KPIs, items de lista) */
  sm: 'shadow-sm',
  /** Cards principais (secções) */
  md: 'shadow-md',
  /** Modais e elementos elevados */
  lg: 'shadow-lg',
} as const;

// ===========================================
// CORES DE RISCO
// ===========================================

export const riskColors = {
  critico: {
    text: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700 border-red-200',
  },
  alto: {
    text: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-600 border-red-200',
  },
  medio: {
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-600 border-amber-200',
  },
  baixo: {
    text: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-600 border-green-200',
  },
} as const;

export type RiskLevel = keyof typeof riskColors;

// ===========================================
// CORES DE ÂMBITO (SCOPE)
// ===========================================

export const scopeColors = {
  1: {
    text: 'text-violet-700',
    bg: 'bg-violet-100',
    bgLight: 'bg-violet-50',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    label: 'Âmbito 1 - Emissões Directas',
  },
  2: {
    text: 'text-blue-700',
    bg: 'bg-blue-100',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    label: 'Âmbito 2 - Energia',
  },
  3: {
    text: 'text-orange-700',
    bg: 'bg-orange-100',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    label: 'Âmbito 3 - Cadeia de Valor',
  },
} as const;

export type Scope = keyof typeof scopeColors;

// ===========================================
// CORES DE FINANCIAMENTO
// ===========================================

export const fundingColors = {
  subsidio: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    bgLight: 'bg-green-50',
    border: 'border-green-200',
    label: 'Subsídio',
  },
  incentivo: {
    text: 'text-blue-700',
    bg: 'bg-blue-100',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    label: 'Incentivo',
  },
  financiamento: {
    text: 'text-purple-700',
    bg: 'bg-purple-100',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200',
    label: 'Financiamento',
  },
} as const;

export type FundingType = keyof typeof fundingColors;

// ===========================================
// CORES DE PERCENTAGEM (para progress bars)
// ===========================================

export const getPercentageColors = (percentage: number) => {
  if (percentage >= 75) return { 
    text: 'text-green-600', 
    bg: 'bg-green-500', 
    bgLight: 'bg-green-100', 
    border: 'border-green-200' 
  };
  if (percentage >= 50) return { 
    text: 'text-lime-600', 
    bg: 'bg-lime-500', 
    bgLight: 'bg-lime-100', 
    border: 'border-lime-200' 
  };
  if (percentage >= 25) return { 
    text: 'text-amber-600', 
    bg: 'bg-amber-500', 
    bgLight: 'bg-amber-100', 
    border: 'border-amber-200' 
  };
  return { 
    text: 'text-red-600', 
    bg: 'bg-red-500', 
    bgLight: 'bg-red-100', 
    border: 'border-red-200' 
  };
};

// ===========================================
// ESTILOS DE CARDS
// ===========================================

export const cardStyles = {
  /** Card de KPI pequeno */
  kpi: 'p-4 border rounded-lg shadow-sm',
  /** Card de secção principal */
  section: 'p-6 border rounded-lg shadow-md',
  /** Card dentro de outro card (sem shadow) */
  nested: 'p-4 border rounded-lg',
  /** Card clicável */
  clickable: 'cursor-pointer hover:bg-muted/50 transition-colors',
  /** Card seleccionado */
  selected: 'border-primary bg-primary/5 border-2',
} as const;

// ===========================================
// ESTILOS DE BOTÕES COMUNS
// ===========================================

export const buttonStyles = {
  /** Botão de ícone (info, settings) */
  icon: 'p-1.5 bg-muted rounded text-muted-foreground hover:text-foreground transition-colors',
  /** Botão de texto com ícone */
  textIcon: 'flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors',
  /** Botão de collapse (chevron) */
  collapse: 'w-9 h-9 rounded-full border border-input bg-background hover:bg-muted/50 flex items-center justify-center transition-colors shrink-0',
} as const;

// ===========================================
// ESTILOS DE TEXTO
// ===========================================

export const textStyles = {
  /** Título de KPI */
  kpiTitle: 'text-sm text-muted-foreground',
  /** Valor de KPI */
  kpiValue: 'text-2xl font-bold',
  /** Unidade/subtítulo de KPI */
  kpiUnit: 'text-xs text-muted-foreground',
  /** Título de secção */
  sectionTitle: 'font-semibold text-lg',
} as const;

// ===========================================
// CONFIGURAÇÃO DE ESTADOS DE PLANO
// ===========================================

export interface PlanStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon;
  targetStep: number;
}

export const planStatusConfig: Record<PlanStatus, PlanStatusConfig> = {
  sem_plano: {
    label: 'Sem plano',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle,
    targetStep: 1,
  },
  em_preparacao: {
    label: 'Em preparação',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Clock,
    targetStep: 2,
  },
  plano_pronto: {
    label: 'Plano pronto',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    targetStep: 4,
  },
  enviado: {
    label: 'Enviado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Mail,
    targetStep: 4,
  },
};

/**
 * Obtém configuração visual para um estado de plano
 */
export const getPlanStatusConfig = (status: PlanStatus): PlanStatusConfig => {
  return planStatusConfig[status];
};
