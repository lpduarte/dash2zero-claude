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
  sm: 'shadow-md',
  /** Cards principais (secções) */
  md: 'shadow-md',
  /** Modais e elementos elevados */
  lg: 'shadow-lg',
} as const;

// ===========================================
// CORES DE RISCO
// ===========================================

export const riskColors = {
  alto: {
    text: 'text-danger',
    textDark: 'dark:text-danger',
    bg: 'bg-danger/10',
    bgDark: 'dark:bg-danger/20',
    border: 'border-danger/30',
    badge: 'bg-danger text-white border-transparent hover:bg-danger/80 transition-colors',
  },
  medio: {
    text: 'text-warning',
    textDark: 'dark:text-warning',
    bg: 'bg-warning/10',
    bgDark: 'dark:bg-warning/20',
    border: 'border-warning/30',
    badge: 'bg-warning text-white border-transparent hover:bg-warning/80 transition-colors',
  },
  baixo: {
    text: 'text-success',
    textDark: 'dark:text-success',
    bg: 'bg-success/10',
    bgDark: 'dark:bg-success/20',
    border: 'border-success/30',
    badge: 'bg-success text-white border-transparent hover:bg-success/80 transition-colors',
  },
} as const;

export type RiskLevel = keyof typeof riskColors;

// ===========================================
// CORES DE ÂMBITO (SCOPE)
// ===========================================

export const scopeColors = {
  1: {
    text: 'text-scope-1',
    textLight: 'text-scope-1/80',
    bg: 'bg-scope-1',
    bgLight: 'bg-scope-1/10',
    border: 'border-scope-1/30',
    badge: 'bg-scope-1/15 text-orange-700 dark:text-scope-1 dark:bg-scope-1/20 border-scope-1/30 hover:bg-scope-1/25 transition-colors',
    label: 'Âmbito 1 - Emissões Diretas (Coral)',
  },
  2: {
    text: 'text-scope-2',
    textLight: 'text-scope-2/80',
    bg: 'bg-scope-2',
    bgLight: 'bg-scope-2/10',
    border: 'border-scope-2/30',
    badge: 'bg-scope-2/15 text-amber-700 dark:text-scope-2 dark:bg-scope-2/20 border-scope-2/30 hover:bg-scope-2/25 transition-colors',
    label: 'Âmbito 2 - Energia (Âmbar)',
  },
  3: {
    text: 'text-scope-3',
    textLight: 'text-scope-3/80',
    bg: 'bg-scope-3',
    bgLight: 'bg-scope-3/10',
    border: 'border-scope-3/30',
    badge: 'bg-scope-3/15 text-cyan-700 dark:text-scope-3 dark:bg-scope-3/20 border-scope-3/30 hover:bg-scope-3/25 transition-colors',
    label: 'Âmbito 3 - Cadeia de Valor (Petróleo)',
  },
} as const;

export type Scope = keyof typeof scopeColors;

// ===========================================
// CORES DE STATUS DE ONBOARDING
// ===========================================

export const onboardingStatusColors = {
  pending: {
    bg: 'bg-status-pending',
    bgLight: 'bg-status-pending/15',
    text: 'text-status-pending',
    border: 'border-status-pending/30',
    badge: 'bg-status-pending/15 text-status-pending border-status-pending/30',
    label: 'Por contactar',
  },
  contacted: {
    bg: 'bg-status-contacted',
    bgLight: 'bg-status-contacted/15',
    text: 'text-status-contacted',
    border: 'border-status-contacted/30',
    badge: 'bg-status-contacted/15 text-status-contacted border-status-contacted/30',
    label: 'Sem interação',
  },
  interested: {
    bg: 'bg-status-interested',
    bgLight: 'bg-status-interested/15',
    text: 'text-status-interested',
    border: 'border-status-interested/30',
    badge: 'bg-status-interested/15 text-status-interested border-status-interested/30',
    label: 'Interessada',
  },
  progress: {
    bg: 'bg-status-progress',
    bgLight: 'bg-status-progress/15',
    text: 'text-status-progress',
    border: 'border-status-progress/30',
    badge: 'bg-status-progress/15 text-status-progress border-status-progress/30',
    label: 'Em progresso',
  },
  complete: {
    bg: 'bg-status-complete',
    bgLight: 'bg-status-complete/15',
    text: 'text-status-complete',
    border: 'border-status-complete/30',
    badge: 'bg-status-complete/15 text-status-complete border-status-complete/30',
    label: 'Completo',
  },
} as const;

export type OnboardingStatus = keyof typeof onboardingStatusColors;

// ===========================================
// CORES DE FINANCIAMENTO
// ===========================================

export const fundingColors = {
  subsidio: {
    text: 'text-primary',
    bg: 'bg-primary/20',
    bgLight: 'bg-primary/10',
    border: 'border-primary/30',
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
    text: 'text-primary',
    bg: 'bg-primary/20',
    bgLight: 'bg-primary/10',
    border: 'border-primary/30',
    label: 'Financiamento',
  },
} as const;

export type FundingType = keyof typeof fundingColors;

// ===========================================
// CORES DE PERCENTAGEM (para progress bars)
// ===========================================

export const getPercentageColors = (percentage: number) => {
  if (percentage >= 50) return {
    text: 'text-success',
    bg: 'bg-success',
    bgLight: 'bg-success/10',
    border: 'border-success/30'
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
  sectionTitle: 'font-bold text-xl',
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
  sectionCard: 'p-6 border rounded-lg shadow-md',
  /** Card de KPI */
  kpiCard: 'p-4 border rounded-md shadow-md bg-card hover:shadow-lg hover:border-primary/25 transition-all duration-200',
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
  primaryButtonSm: 'px-3 py-1.5 text-sm font-normal bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors',
  /** Botão primário */
  primaryButton: 'px-4 py-2 text-sm font-normal bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors',
  /** Botão outline pequeno */
  outlineButtonSm: 'flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors',
  /** Botão outline */
  outlineButton: 'flex items-center gap-2 px-4 py-2 text-sm font-normal border rounded-lg hover:bg-muted transition-colors',
  /** Botão de collapse (chevron) */
  collapseButton: 'w-9 h-9 rounded-full border border-input bg-background hover:bg-muted/50 flex items-center justify-center transition-colors shrink-0',
  
  // Inputs
  /** Input de texto */
  input: 'px-3 py-1.5 text-sm border rounded-lg bg-background',
  /** Input pequeno (números) */
  inputSmall: 'w-24 px-3 py-1.5 text-sm border rounded-lg bg-background',
} as const;

// ===========================================
// COLLAPSIBLE / EXPANSÃO
// ===========================================

export const collapsible = {
  /** Duração padrão da animação (400ms) */
  duration: 'duration-[400ms]',

  /** Ícone de collapse - tamanho e transição */
  icon: 'h-4 w-4 transition-transform duration-[400ms]',
  /** Ícone quando expandido (rotate-180) */
  iconExpanded: 'rotate-180',

  /** Trigger full-width (CollapsibleSection) */
  triggerFullWidth: 'w-full flex items-center justify-between p-4 transition-colors',
  /** Trigger full-width compacto (modais) */
  triggerCompact: 'w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors',
  /** Trigger full-width - estado default */
  triggerDefault: 'bg-muted/30 hover:bg-muted/50',
  /** Trigger full-width - estado highlighted */
  triggerHighlighted: 'bg-primary/10 hover:bg-primary/20',

  /** Trigger circular (SectionHeader) */
  triggerCircular: 'w-9 h-9 rounded-full border border-input bg-background hover:bg-muted/50 flex items-center justify-center transition-colors shrink-0',

  /** Container do collapsible */
  container: 'border rounded-lg overflow-hidden',
  /** Container highlighted */
  containerHighlighted: 'border-2 border-primary/30 bg-primary/5',

  /** Conteúdo expandido */
  content: 'p-4 border-t',
  /** Conteúdo highlighted */
  contentHighlighted: 'border-primary/20',
} as const;

// ===========================================
// HEADER (para testes)
// ===========================================

export const header = {
  /** Container principal */
  container: 'relative overflow-x-clip',
  /** Wrapper com padding */
  wrapper: 'relative py-6 px-8',
  /** Content wrapper centrado */
  content: 'relative max-w-[1400px] mx-auto',
  /** Layout flex principal */
  layout: 'flex items-center justify-between',

  /** Logo área */
  logoArea: 'flex items-center gap-3',
  /** Ícone do logo */
  logoIcon: 'h-14 w-14 text-primary',
  /** Título principal */
  title: 'text-4xl font-bold text-foreground',
  /** Subtítulo */
  subtitle: 'text-muted-foreground text-sm',

  /** Área de ações (direita) */
  actionsArea: 'flex items-center gap-4',

  /** Container de navegação/toggle */
  navContainer: 'flex gap-1 bg-background/40 backdrop-blur-md rounded-lg p-1 border border-primary/20',
  /** Link/botão ativo */
  navItemActive: 'flex items-center justify-center gap-2 h-9 px-3 rounded-md transition-all duration-200 bg-primary text-primary-foreground shadow-md',
  /** Link/botão inativo */
  navItemInactive: 'flex items-center justify-center gap-2 h-9 px-3 rounded-md transition-all duration-200 text-foreground/70 hover:text-foreground hover:bg-primary/10',
  /** Botão quadrado (ícone só) ativo */
  navButtonActive: 'flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 bg-primary text-primary-foreground shadow-md',
  /** Botão quadrado (ícone só) inativo */
  navButtonInactive: 'flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 text-foreground/70 hover:text-foreground hover:bg-primary/10',

  /** Container dos elementos pulsantes */
  pulseContainer: 'absolute inset-0 pointer-events-none',
  /** Elemento pulsante base */
  pulseElement: 'absolute rounded-full blur-3xl',

  /** Linha brilhante inferior */
  glowLine: 'relative w-full flex items-center justify-center',
} as const;

/** Configuração dos elementos pulsantes do header */
export const headerPulseElements = [
  { className: 'top-0 right-0 w-72 h-72 bg-primary/50 animate-pulse-slow', transform: 'translate(20%, -70%)' },
  { className: 'top-0 right-20 w-56 h-56 bg-primary/40 animate-pulse-slower', transform: 'translateY(-60%)', delay: '1s' },
  { className: 'top-0 right-1/4 w-48 h-48 bg-primary/35 animate-pulse-slower', transform: 'translateY(-50%)', delay: '0.5s' },
  { className: 'top-0 left-0 w-40 h-40 bg-primary/25 animate-pulse-slower', transform: 'translate(-30%, -70%)', delay: '2s' },
  { className: 'top-0 left-10 w-36 h-36 bg-primary/20 animate-pulse-slow', transform: 'translateY(-50%)', delay: '1.5s' },
] as const;

/** Estilo da linha brilhante */
export const headerGlowLineStyle = {
  width: '100%',
  height: '2px',
  background: 'linear-gradient(90deg, transparent 0%, hsl(175 66% 38%) 20%, hsl(175 66% 38%) 80%, transparent 100%)',
  opacity: 0.65,
  boxShadow: '0 0 8px hsl(175 66% 38% / 0.4)',
} as const;
