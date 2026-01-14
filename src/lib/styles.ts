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
    text: 'text-danger',
    textDark: 'dark:text-danger',
    bg: 'bg-danger/10',
    bgDark: 'dark:bg-danger/20',
    border: 'border-danger/30',
    badge: 'bg-danger/10 text-danger border-danger/30',
  },
  alto: {
    text: 'text-danger',
    textDark: 'dark:text-danger',
    bg: 'bg-danger/10',
    bgDark: 'dark:bg-danger/20',
    border: 'border-danger/30',
    badge: 'bg-danger/10 text-danger border-danger/30',
  },
  medio: {
    text: 'text-warning',
    textDark: 'dark:text-warning',
    bg: 'bg-warning/10',
    bgDark: 'dark:bg-warning/20',
    border: 'border-warning/30',
    badge: 'bg-warning/10 text-warning border-warning/30',
  },
  baixo: {
    text: 'text-success',
    textDark: 'dark:text-success',
    bg: 'bg-success/10',
    bgDark: 'dark:bg-success/20',
    border: 'border-success/30',
    badge: 'bg-success/10 text-success border-success/30',
  },
} as const;

export type RiskLevel = keyof typeof riskColors;

// ===========================================
// CORES DE ÂMBITO (SCOPE)
// ===========================================

export const scopeColors = {
  1: {
    text: 'text-violet-700 dark:text-violet-400',
    textLight: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500',
    bgLight: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
    badge: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800',
    label: 'Âmbito 1 - Emissões Directas',
  },
  2: {
    text: 'text-primary dark:text-primary',
    textLight: 'text-primary/80 dark:text-primary',
    bg: 'bg-primary',
    bgLight: 'bg-primary/10 dark:bg-primary/20',
    border: 'border-primary/30 dark:border-primary/40',
    badge: 'bg-primary/10 text-primary border-primary/30',
    label: 'Âmbito 2 - Energia',
  },
  3: {
    text: 'text-orange-700 dark:text-orange-400',
    textLight: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    label: 'Âmbito 3 - Cadeia de Valor',
  },
} as const;

export type Scope = keyof typeof scopeColors;

// ===========================================
// CORES DE FINANCIAMENTO
// ===========================================

export const fundingColors = {
  subsidio: {
    text: 'text-success',
    bg: 'bg-success/20',
    bgLight: 'bg-success/10',
    border: 'border-success/30',
    label: 'Subsídio',
  },
  incentivo: {
    text: 'text-primary',
    bg: 'bg-primary/20',
    bgLight: 'bg-primary/10',
    border: 'border-primary/30',
    label: 'Incentivo',
  },
  financiamento: {
    text: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    label: 'Financiamento',
  },
} as const;

export type FundingType = keyof typeof fundingColors;

// ===========================================
// CORES DE PERCENTAGEM (para progress bars)
// ===========================================

export const getPercentageColors = (percentage: number) => {
  if (percentage >= 75) return { 
    text: 'text-success', 
    bg: 'bg-success', 
    bgLight: 'bg-success/10', 
    border: 'border-success/30' 
  };
  if (percentage >= 50) return { 
    text: 'text-lime-600 dark:text-lime-400', 
    bg: 'bg-lime-500', 
    bgLight: 'bg-lime-100 dark:bg-lime-900/30', 
    border: 'border-lime-200 dark:border-lime-800' 
  };
  if (percentage >= 25) return { 
    text: 'text-warning', 
    bg: 'bg-warning', 
    bgLight: 'bg-warning/10', 
    border: 'border-warning/30' 
  };
  return { 
    text: 'text-danger', 
    bg: 'bg-danger', 
    bgLight: 'bg-danger/10', 
    border: 'border-danger/30' 
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
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
    icon: XCircle,
    targetStep: 1,
  },
  em_preparacao: {
    label: 'Em preparação',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    icon: Clock,
    targetStep: 2,
  },
  plano_pronto: {
    label: 'Plano pronto',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    icon: CheckCircle,
    targetStep: 4,
  },
  enviado: {
    label: 'Enviado',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
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

// ===========================================
// SPACING
// ===========================================

export const spacing = {
  /** Cards principais (secções) */
  cardPadding: 'p-6',
  /** KPIs e mini-cards */
  cardPaddingCompact: 'p-4',
  /** Items dentro de cards */
  itemPadding: 'p-3',
  
  /** Elementos muito próximos */
  gapTight: 'gap-1',
  /** Padrão para ícone + texto */
  gapDefault: 'gap-2',
  /** Headers, elementos maiores */
  gapRelaxed: 'gap-3',
  /** Entre secções */
  gapLoose: 'gap-4',
  
  /** Entre items de lista */
  spaceItems: 'space-y-2',
  /** Entre secções dentro de card */
  spaceSections: 'space-y-4',
  /** Entre cards principais */
  spaceCards: 'space-y-6',
  
  /** Após headers de secção */
  sectionMargin: 'mb-4',
} as const;

// ===========================================
// RADIUS
// ===========================================

export const radius = {
  /** Cards, botões, inputs */
  default: 'rounded-lg',
  /** Badges, avatars, botões circulares */
  full: 'rounded-full',
  /** Elementos pequenos */
  sm: 'rounded-md',
} as const;

// ===========================================
// ICON SIZES
// ===========================================

export const iconSizes = {
  /** Muito pequeno, inline */
  xs: 'h-3 w-3',
  /** Pequeno inline */
  sm: 'h-3.5 w-3.5',
  /** Padrão (botões, KPIs) */
  default: 'h-4 w-4',
  /** Headers de secção */
  md: 'h-5 w-5',
  /** Destaques */
  lg: 'h-6 w-6',
} as const;

// ===========================================
// ELEMENTOS COMPOSTOS
// ===========================================

export const elements = {
  // Cards
  /** Card principal de secção */
  sectionCard: 'p-6 border rounded-lg shadow-sm',
  /** Card de KPI */
  kpiCard: 'p-4 border rounded-lg shadow-sm',
  /** Card dentro de outro card */
  nestedCard: 'p-3 border rounded-lg',
  /** Card clicável */
  clickableCard: 'cursor-pointer hover:shadow-md transition-shadow',
  
  // Botões
  /** Botão só com ícone */
  iconButton: 'p-1.5 rounded-lg hover:bg-muted transition-colors',
  /** Botão de texto pequeno */
  textButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors',
  /** Botão primário pequeno */
  primaryButtonSm: 'px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors',
  /** Botão primário */
  primaryButton: 'px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors',
  /** Botão outline pequeno */
  outlineButtonSm: 'flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors',
  /** Botão outline */
  outlineButton: 'flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors',
  /** Botão de collapse (chevron) */
  collapseButton: 'w-9 h-9 rounded-full border border-input bg-background hover:bg-muted/50 flex items-center justify-center transition-colors shrink-0',
  
  // Inputs
  /** Input de texto */
  input: 'px-3 py-1.5 text-sm border rounded-lg bg-background',
  /** Input pequeno (números) */
  inputSmall: 'w-24 px-3 py-1.5 text-sm border rounded-lg bg-background',
} as const;
