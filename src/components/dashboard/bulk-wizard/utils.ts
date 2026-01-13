import { Supplier } from "@/types/supplier";
import { mockMeasures, getApplicableMeasures } from "@/data/mockMeasures";
import { getEligibleFunding } from "@/data/mockFunding";
import type { Measure, FundingSource } from "@/types/actionPlan";

// Helper para âmbito dominante
export const getDominantScope = (supplier: Supplier): string => {
  const scopes = [
    { scope: 'Âmbito 1', value: supplier.scope1 },
    { scope: 'Âmbito 2', value: supplier.scope2 },
    { scope: 'Âmbito 3', value: supplier.scope3 },
  ];
  return scopes.sort((a, b) => b.value - a.value)[0].scope;
};

// Obter medidas recomendadas para uma empresa
export const getRecommendedMeasures = (supplier: Supplier): Measure[] => {
  const applicable = getApplicableMeasures(supplier, mockMeasures);
  // Priorizar medidas Soft (menor investimento) e de maior impacto
  return applicable
    .sort((a, b) => {
      // Primeiro por tipo de intervenção (soft primeiro)
      if (a.interventionLevel === 'soft' && b.interventionLevel !== 'soft') return -1;
      if (a.interventionLevel !== 'soft' && b.interventionLevel === 'soft') return 1;
      // Depois por ROI (emissionReduction / investment)
      const roiA = a.emissionReduction / (a.investment || 1);
      const roiB = b.emissionReduction / (b.investment || 1);
      return roiB - roiA;
    })
    .slice(0, 5); // Máximo 5 medidas por empresa
};

// Obter fundos elegíveis para medidas selecionadas
export const getEligibleFundingForMeasures = (measures: Measure[], supplier: Supplier): FundingSource[] => {
  return getEligibleFunding(measures, supplier.companySize as any, []);
};

// Percentagens de redução para o wizard (heurística para dados mock)
const MEASURE_REFERENCE_EMISSIONS = 100; // toneladas (empresa de referência)
const MAX_REDUCTION_PER_MEASURE = 0.35; // 35%
const MAX_TOTAL_REDUCTION = 0.85; // 85%

export const getMeasureReductionPercentage = (measure: Measure): number => {
  const raw = measure.emissionReduction / MEASURE_REFERENCE_EMISSIONS;
  return Math.min(Math.max(raw, 0), MAX_REDUCTION_PER_MEASURE);
};

export const calculateTotalReductionPercentage = (measures: Measure[]): number => {
  const total = measures.reduce((acc, m) => acc + getMeasureReductionPercentage(m), 0);
  return Math.min(total, MAX_TOTAL_REDUCTION);
};

// Nova intensidade após medidas
export const calculateNewIntensity = (supplier: Supplier, measures: Measure[]): number => {
  const totalReductionPercentage = calculateTotalReductionPercentage(measures);
  return supplier.emissionsPerRevenue * (1 - totalReductionPercentage);
};
