// Re-exports
export * from './convertSuppliers';
export * from './empresaSuppliersWithFootprint';
export * from './empresaSuppliersWithoutFootprint';
export * from './municipioSuppliersWithFootprint';
export * from './municipioSuppliersWithoutFootprint';

// Imports para combinações
import { empresaSuppliersWithFootprint } from './empresaSuppliersWithFootprint';
import { empresaSuppliersWithoutFootprint as initialEmpresaSuppliersWithoutFootprint } from './empresaSuppliersWithoutFootprint';
import { municipioSuppliersWithFootprint } from './municipioSuppliersWithFootprint';
import { municipioSuppliersWithoutFootprint as initialMunicipioSuppliersWithoutFootprint } from './municipioSuppliersWithoutFootprint';
import { SupplierWithFootprint, SupplierWithoutFootprint, SupplierAny, hasFootprint } from '@/types/supplierNew';
import { OwnerType } from '@/types/clusterNew';

// Mutable arrays para permitir adicionar novos suppliers
let dynamicEmpresaSuppliersWithoutFootprint: SupplierWithoutFootprint[] = [...initialEmpresaSuppliersWithoutFootprint];
let dynamicMunicipioSuppliersWithoutFootprint: SupplierWithoutFootprint[] = [...initialMunicipioSuppliersWithoutFootprint];

// Helpers
export const getSuppliersByOwnerType = (ownerType: OwnerType): SupplierAny[] => {
  if (ownerType === 'empresa') {
    return [...empresaSuppliersWithFootprint, ...dynamicEmpresaSuppliersWithoutFootprint];
  }
  return [...municipioSuppliersWithFootprint, ...dynamicMunicipioSuppliersWithoutFootprint];
};

export const getSuppliersWithFootprintByOwnerType = (ownerType: OwnerType): SupplierWithFootprint[] => {
  return ownerType === 'empresa' ? empresaSuppliersWithFootprint : municipioSuppliersWithFootprint;
};

export const getSuppliersWithoutFootprintByOwnerType = (ownerType: OwnerType): SupplierWithoutFootprint[] => {
  return ownerType === 'empresa' ? dynamicEmpresaSuppliersWithoutFootprint : dynamicMunicipioSuppliersWithoutFootprint;
};

// Interface para dados de nova empresa (apenas campos obrigatórios)
export interface NewSupplierInput {
  name: string;
  nif: string;
  email: string;
  clusterId: string;
}

// Adicionar novo supplier sem pegada
export const addSupplierWithoutFootprint = (
  input: NewSupplierInput,
  ownerType: OwnerType
): SupplierWithoutFootprint => {
  const newSupplier: SupplierWithoutFootprint = {
    id: `sup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: input.name,
    clusterId: input.clusterId,
    sector: 'other',
    region: 'other',
    district: 'Desconhecido',
    municipality: 'Desconhecido',
    parish: 'Desconhecido',
    companySize: 'micro',
    employees: 0,
    area: 0,
    revenue: 0,
    contact: {
      email: input.email,
      phone: '',
      website: '',
      nif: input.nif,
    },
    emailsSent: 0,
    onboardingStatus: 'por_contactar',
  };

  if (ownerType === 'empresa') {
    dynamicEmpresaSuppliersWithoutFootprint = [...dynamicEmpresaSuppliersWithoutFootprint, newSupplier];
  } else {
    dynamicMunicipioSuppliersWithoutFootprint = [...dynamicMunicipioSuppliersWithoutFootprint, newSupplier];
  }

  return newSupplier;
};

// Adicionar múltiplos suppliers
export const addSuppliersWithoutFootprint = (
  inputs: NewSupplierInput[],
  ownerType: OwnerType
): SupplierWithoutFootprint[] => {
  return inputs.map(input => addSupplierWithoutFootprint(input, ownerType));
};

// Combinações por owner type (for backward compatibility)
export const allEmpresaSuppliers: SupplierAny[] = [
  ...empresaSuppliersWithFootprint,
  ...initialEmpresaSuppliersWithoutFootprint,
];

export const allMunicipioSuppliers: SupplierAny[] = [
  ...municipioSuppliersWithFootprint,
  ...initialMunicipioSuppliersWithoutFootprint,
];

// Totais
export const empresaTotals = {
  total: allEmpresaSuppliers.length,
  withFootprint: empresaSuppliersWithFootprint.length,
  withoutFootprint: initialEmpresaSuppliersWithoutFootprint.length,
};

export const municipioTotals = {
  total: allMunicipioSuppliers.length,
  withFootprint: municipioSuppliersWithFootprint.length,
  withoutFootprint: initialMunicipioSuppliersWithoutFootprint.length,
};

export const getTotalsByOwnerType = (ownerType: OwnerType) => {
  return ownerType === 'empresa' ? empresaTotals : municipioTotals;
};

// Re-export type guard
export { hasFootprint };
