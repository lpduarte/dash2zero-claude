import type { Supplier } from '@/types/supplier';
import { getBestEmissionIntensity } from '@/data/emissionIntensity';

// ============================================================================
// ANÁLISE DE RISCO CARBÓNICO
// ============================================================================
// Compara a intensidade carbónica de fornecedores contra:
// 1. Benchmarks INE (dados oficiais portugueses)
// 2. Média interna dos fornecedores no sistema (opcional)
// ============================================================================

export interface SupplierRisk {
  supplier: Supplier;
  /** Intensidade de referência usada para comparação (benchmark INE ou média interna) */
  benchmarkIntensity: number;
  /** Multiplicador de risco: valores > 1 indicam acima do benchmark */
  riskMultiplier: number;
  /** Nível de risco categórico */
  riskLevel: 'alto' | 'medio' | 'normal';
  /** Fonte do benchmark usado */
  benchmarkSource: 'ine' | 'interno';
}

// Manter interface antiga para compatibilidade
export interface SupplierRiskLegacy {
  supplier: Supplier;
  avgSectorIntensity: number;
  riskMultiplier: number;
  riskLevel: 'alto' | 'medio' | 'normal';
}

/**
 * Obtém o benchmark INE para um fornecedor (considera setor e subsector)
 * @param supplier Fornecedor
 * @returns Intensidade de referência em kg CO₂e/€
 */
export function getINEBenchmark(supplier: Supplier): number {
  return getBestEmissionIntensity(supplier.sector, supplier.subsector);
}

/**
 * Calcula a média de intensidade de emissões de um setor (dados internos)
 * Usa emissionsPerRevenue como métrica de intensidade
 */
export function calculateSectorAverage(
  allSuppliers: Supplier[],
  sector: string
): number {
  const sectorSuppliers = allSuppliers.filter(s => s.sector === sector);
  if (sectorSuppliers.length === 0) return 0;

  const sum = sectorSuppliers.reduce((acc, s) => acc + s.emissionsPerRevenue, 0);
  return sum / sectorSuppliers.length;
}

/**
 * Determina o nível de risco com base no multiplicador
 * - Alto: >= 1.5x o benchmark (50% ou mais acima)
 * - Médio: >= 1.2x o benchmark (20-50% acima)
 * - Normal: < 1.2x o benchmark
 */
export function getRiskLevel(riskMultiplier: number): 'alto' | 'medio' | 'normal' {
  if (riskMultiplier >= 1.5) return 'alto';
  if (riskMultiplier >= 1.2) return 'medio';
  return 'normal';
}

/**
 * Calcula o nível de risco de um fornecedor vs benchmark INE
 * Esta é a função principal recomendada para análise de risco
 */
export function calculateSupplierRiskVsINE(supplier: Supplier): SupplierRisk {
  const benchmarkIntensity = getINEBenchmark(supplier);
  const riskMultiplier = benchmarkIntensity > 0
    ? supplier.emissionsPerRevenue / benchmarkIntensity
    : 1;

  return {
    supplier,
    benchmarkIntensity,
    riskMultiplier,
    riskLevel: getRiskLevel(riskMultiplier),
    benchmarkSource: 'ine'
  };
}

/**
 * Calcula o nível de risco de um fornecedor vs média interna do setor
 * Útil quando se quer comparar contra outros fornecedores no sistema
 */
export function calculateSupplierRiskVsInternal(
  supplier: Supplier,
  allSuppliers: Supplier[]
): SupplierRisk {
  const benchmarkIntensity = calculateSectorAverage(allSuppliers, supplier.sector);
  const riskMultiplier = benchmarkIntensity > 0
    ? supplier.emissionsPerRevenue / benchmarkIntensity
    : 1;

  return {
    supplier,
    benchmarkIntensity,
    riskMultiplier,
    riskLevel: getRiskLevel(riskMultiplier),
    benchmarkSource: 'interno'
  };
}

/**
 * Calcula o nível de risco de um fornecedor vs média do setor
 * @deprecated Use calculateSupplierRiskVsINE para comparação com benchmarks oficiais
 * Mantido para compatibilidade - usa benchmark INE por defeito
 */
export function calculateSupplierRisk(
  supplier: Supplier,
  allSuppliers: Supplier[]
): SupplierRiskLegacy {
  // Usar benchmark INE por defeito para consistência com dados realistas
  const benchmarkIntensity = getINEBenchmark(supplier);
  const riskMultiplier = benchmarkIntensity > 0
    ? supplier.emissionsPerRevenue / benchmarkIntensity
    : 1;

  return {
    supplier,
    avgSectorIntensity: benchmarkIntensity,
    riskMultiplier,
    riskLevel: getRiskLevel(riskMultiplier)
  };
}

/**
 * Calcula risco para múltiplos fornecedores vs benchmark INE
 */
export function calculateSuppliersRiskVsINE(suppliers: Supplier[]): SupplierRisk[] {
  return suppliers.map(s => calculateSupplierRiskVsINE(s));
}

/**
 * Calcula risco para múltiplos fornecedores vs média interna
 */
export function calculateSuppliersRiskVsInternal(
  suppliers: Supplier[],
  allSuppliers: Supplier[]
): SupplierRisk[] {
  return suppliers.map(s => calculateSupplierRiskVsInternal(s, allSuppliers));
}

/**
 * Calcula risco para múltiplos fornecedores
 * @deprecated Use calculateSuppliersRiskVsINE para comparação com benchmarks oficiais
 * Mantido para compatibilidade
 */
export function calculateSuppliersRisk(
  suppliers: Supplier[],
  allSuppliers: Supplier[]
): SupplierRiskLegacy[] {
  return suppliers.map(s => calculateSupplierRisk(s, allSuppliers));
}

/**
 * Obtém estatísticas de risco agregadas para um conjunto de fornecedores
 */
export function getRiskStatistics(suppliers: Supplier[]): {
  total: number;
  alto: number;
  medio: number;
  normal: number;
  percentagemAlto: number;
  percentagemAcimaBenchmark: number;
} {
  const risks = calculateSuppliersRiskVsINE(suppliers);
  const alto = risks.filter(r => r.riskLevel === 'alto').length;
  const medio = risks.filter(r => r.riskLevel === 'medio').length;
  const normal = risks.filter(r => r.riskLevel === 'normal').length;
  const acimaBenchmark = risks.filter(r => r.riskMultiplier > 1).length;

  return {
    total: suppliers.length,
    alto,
    medio,
    normal,
    percentagemAlto: suppliers.length > 0 ? (alto / suppliers.length) * 100 : 0,
    percentagemAcimaBenchmark: suppliers.length > 0 ? (acimaBenchmark / suppliers.length) * 100 : 0,
  };
}
