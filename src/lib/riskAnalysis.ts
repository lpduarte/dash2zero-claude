import type { Supplier } from '@/types/supplier';

export interface SupplierRisk {
  supplier: Supplier;
  avgSectorIntensity: number;
  riskMultiplier: number;      // Ex: 2.1 (é 2.1x a média)
  riskLevel: 'alto' | 'medio' | 'normal';
}

/**
 * Calcula a média de intensidade de emissões de um setor
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
 * Calcula o nível de risco de um fornecedor vs média do setor
 */
export function calculateSupplierRisk(
  supplier: Supplier,
  allSuppliers: Supplier[]
): SupplierRisk {
  const avgSectorIntensity = calculateSectorAverage(allSuppliers, supplier.sector);
  const riskMultiplier = avgSectorIntensity > 0 
    ? supplier.emissionsPerRevenue / avgSectorIntensity 
    : 1;
  
  let riskLevel: 'alto' | 'medio' | 'normal';
  if (riskMultiplier >= 1.5) {
    riskLevel = 'alto';
  } else if (riskMultiplier >= 1.2) {
    riskLevel = 'medio';
  } else {
    riskLevel = 'normal';
  }
  
  return {
    supplier,
    avgSectorIntensity,
    riskMultiplier,
    riskLevel
  };
}

/**
 * Calcula risco para múltiplos fornecedores
 */
export function calculateSuppliersRisk(
  suppliers: Supplier[],
  allSuppliers: Supplier[]
): SupplierRisk[] {
  return suppliers.map(s => calculateSupplierRisk(s, allSuppliers));
}
