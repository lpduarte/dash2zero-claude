/**
 * Utilitários para gestão de planos de acção
 * Centraliza funções usadas em múltiplos componentes
 */

import { riskColors } from './styles';

// Tipos
export interface PlanData {
  selectedMeasures: string[];
  selectedFunding: string[];
  municipalityNotes?: string;
  currentStep?: number;
  expandedSections?: Record<string, boolean>;
  lastUpdated?: string;
  lastStep?: number;
  completedStep4?: boolean;
  reachedTarget?: boolean;
  emailSent?: boolean;
  emailSentAt?: string;
  generatedBy?: 'manual' | 'bulk_wizard';
}

export type PlanStatus = 'sem_plano' | 'em_preparacao' | 'plano_pronto' | 'enviado';

/**
 * Obtém dados do plano do localStorage
 */
export const getPlanData = (supplierId: string): PlanData | null => {
  try {
    const stored = localStorage.getItem(`actionPlan_${supplierId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erro ao ler dados do plano:', e);
  }
  return null;
};

/**
 * Guarda dados do plano no localStorage
 */
export const savePlanData = (supplierId: string, data: Partial<PlanData>): void => {
  try {
    const existing = getPlanData(supplierId) || {};
    const merged = {
      ...existing,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`actionPlan_${supplierId}`, JSON.stringify(merged));
  } catch (e) {
    console.error('Erro ao guardar dados do plano:', e);
  }
};

/**
 * Calcula o estado do plano baseado nos dados
 */
export const getPlanStatus = (planData: PlanData | null): PlanStatus => {
  if (!planData || !planData.selectedMeasures || planData.selectedMeasures.length === 0) {
    return 'sem_plano';
  }
  if (planData.emailSent) {
    return 'enviado';
  }
  if (planData.completedStep4) {
    return 'plano_pronto';
  }
  return 'em_preparacao';
};

/**
 * Limpa todos os planos do localStorage (para reset/debug)
 */
export const clearAllPlans = (): number => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('actionPlan_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  return keysToRemove.length;
};

/**
 * Obtém nível de risco baseado na intensidade vs média do sector
 */
export const getRiskLevel = (intensity: number, avgSector: number): string => {
  if (avgSector === 0) return 'N/A';
  const percentAbove = ((intensity - avgSector) / avgSector) * 100;
  if (percentAbove >= 100) return 'Crítico';
  if (percentAbove >= 50) return 'Alto';
  if (percentAbove > 0) return 'Médio';
  return 'Baixo';
};

/**
 * Obtém informação completa de risco (nível, cor, percentagem, texto)
 */
export const getRiskInfo = (intensity: number, avgSector: number): {
  level: string;
  color: string;
  percentAbove: number;
  comparisonText: string;
  isAbove: boolean;
} => {
  if (avgSector === 0) {
    return {
      level: 'N/A',
      color: 'text-muted-foreground',
      percentAbove: 0,
      comparisonText: '',
      isAbove: false
    };
  }
  
  const percentAbove = (intensity - avgSector) / avgSector * 100;
  
  if (percentAbove >= 100) {
    return {
      level: 'Crítico',
      color: riskColors.critico.text,
      percentAbove,
      comparisonText: `${Math.round(percentAbove)}% acima da média`,
      isAbove: true
    };
  }
  if (percentAbove >= 50) {
    return {
      level: 'Alto',
      color: riskColors.alto.text,
      percentAbove,
      comparisonText: `${Math.round(percentAbove)}% acima da média`,
      isAbove: true
    };
  }
  if (percentAbove > 0) {
    return {
      level: 'Médio',
      color: riskColors.medio.text,
      percentAbove,
      comparisonText: `${Math.round(percentAbove)}% acima da média`,
      isAbove: true
    };
  }

  // Abaixo da média
  const percentBelow = Math.abs(percentAbove);
  return {
    level: 'Baixo',
    color: riskColors.baixo.text,
    percentAbove,
    comparisonText: percentBelow < 1 ? 'na média' : `${Math.round(percentBelow)}% abaixo da média`,
    isAbove: false
  };
};
