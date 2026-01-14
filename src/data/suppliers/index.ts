// Re-exports
export * from './convertSuppliers';
export * from './empresaSuppliersWithFootprint';
export * from './empresaSuppliersWithoutFootprint';
export * from './municipioSuppliersWithFootprint';
export * from './municipioSuppliersWithoutFootprint';

// Imports para combinações
import { empresaSuppliersWithFootprint } from './empresaSuppliersWithFootprint';
import { empresaSuppliersWithoutFootprint } from './empresaSuppliersWithoutFootprint';
import { municipioSuppliersWithFootprint } from './municipioSuppliersWithFootprint';
import { municipioSuppliersWithoutFootprint } from './municipioSuppliersWithoutFootprint';
import { SupplierWithFootprint, SupplierWithoutFootprint, SupplierAny, hasFootprint } from '@/types/supplierNew';
import { OwnerType } from '@/types/clusterNew';

// Combinações por owner type
export const allEmpresaSuppliers: SupplierAny[] = [
  ...empresaSuppliersWithFootprint,
  ...empresaSuppliersWithoutFootprint,
];

export const allMunicipioSuppliers: SupplierAny[] = [
  ...municipioSuppliersWithFootprint,
  ...municipioSuppliersWithoutFootprint,
];

// Helpers
export const getSuppliersByOwnerType = (ownerType: OwnerType): SupplierAny[] => {
  return ownerType === 'empresa' ? allEmpresaSuppliers : allMunicipioSuppliers;
};

export const getSuppliersWithFootprintByOwnerType = (ownerType: OwnerType): SupplierWithFootprint[] => {
  return ownerType === 'empresa' ? empresaSuppliersWithFootprint : municipioSuppliersWithFootprint;
};

export const getSuppliersWithoutFootprintByOwnerType = (ownerType: OwnerType): SupplierWithoutFootprint[] => {
  return ownerType === 'empresa' ? empresaSuppliersWithoutFootprint : municipioSuppliersWithoutFootprint;
};

// Totais
export const empresaTotals = {
  total: allEmpresaSuppliers.length,
  withFootprint: empresaSuppliersWithFootprint.length,
  withoutFootprint: empresaSuppliersWithoutFootprint.length,
};

export const municipioTotals = {
  total: allMunicipioSuppliers.length,
  withFootprint: municipioSuppliersWithFootprint.length,
  withoutFootprint: municipioSuppliersWithoutFootprint.length,
};

export const getTotalsByOwnerType = (ownerType: OwnerType) => {
  return ownerType === 'empresa' ? empresaTotals : municipioTotals;
};

// Re-export type guard
export { hasFootprint };
