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

// Map para adicionar clusterIds extras (supplierId -> clusterIds adicionais)
// Permite adicionar suppliers com pegada (dados estáticos) a clusters adicionais
const additionalClusterIds: Map<string, Set<string>> = new Map();

// Helper para aplicar clusterIds adicionais
const applyAdditionalClusterIds = <T extends SupplierAny>(supplier: T): T => {
  const additional = additionalClusterIds.get(supplier.id);
  if (additional && additional.size > 0) {
    const allClusterIds = [...new Set([...supplier.clusterIds, ...additional])];
    return { ...supplier, clusterIds: allClusterIds };
  }
  return supplier;
};

// Helpers
export const getSuppliersByOwnerType = (ownerType: OwnerType): SupplierAny[] => {
  if (ownerType === 'empresa') {
    return [
      ...empresaSuppliersWithFootprint.map(applyAdditionalClusterIds),
      ...dynamicEmpresaSuppliersWithoutFootprint.map(applyAdditionalClusterIds)
    ];
  }
  return [
    ...municipioSuppliersWithFootprint.map(applyAdditionalClusterIds),
    ...dynamicMunicipioSuppliersWithoutFootprint.map(applyAdditionalClusterIds)
  ];
};

export const getSuppliersWithFootprintByOwnerType = (ownerType: OwnerType): SupplierWithFootprint[] => {
  const suppliers = ownerType === 'empresa' ? empresaSuppliersWithFootprint : municipioSuppliersWithFootprint;
  return suppliers.map(applyAdditionalClusterIds);
};

export const getSuppliersWithoutFootprintByOwnerType = (ownerType: OwnerType): SupplierWithoutFootprint[] => {
  const suppliers = ownerType === 'empresa' ? dynamicEmpresaSuppliersWithoutFootprint : dynamicMunicipioSuppliersWithoutFootprint;
  return suppliers.map(applyAdditionalClusterIds);
};

// Interface para dados de nova empresa (apenas campos obrigatórios)
export interface NewSupplierInput {
  name: string;
  nif: string;
  email: string;
  clusterIds: string[];
}

// Adicionar novo supplier sem pegada
export const addSupplierWithoutFootprint = (
  input: NewSupplierInput,
  ownerType: OwnerType
): SupplierWithoutFootprint => {
  const newSupplier: SupplierWithoutFootprint = {
    id: `sup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: input.name,
    clusterIds: input.clusterIds,
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

// Adicionar múltiplos suppliers (atualiza clusterIds se NIF já existe)
export const addSuppliersWithoutFootprint = (
  inputs: NewSupplierInput[],
  ownerType: OwnerType
): SupplierWithoutFootprint[] => {
  // Obter suppliers existentes indexados por NIF
  const existingSuppliers = ownerType === 'empresa'
    ? dynamicEmpresaSuppliersWithoutFootprint
    : dynamicMunicipioSuppliersWithoutFootprint;
  const existingByNif = new Map(existingSuppliers.map(s => [s.contact.nif, s]));

  const results: SupplierWithoutFootprint[] = [];

  inputs.forEach(input => {
    const existing = existingByNif.get(input.nif);
    if (existing) {
      // NIF já existe - adicionar clusterIds novos
      const newClusterIds = input.clusterIds.filter(id => !existing.clusterIds.includes(id));
      if (newClusterIds.length > 0) {
        if (ownerType === 'empresa') {
          dynamicEmpresaSuppliersWithoutFootprint = dynamicEmpresaSuppliersWithoutFootprint.map(s =>
            s.contact.nif === input.nif
              ? { ...s, clusterIds: [...s.clusterIds, ...newClusterIds] }
              : s
          );
        } else {
          dynamicMunicipioSuppliersWithoutFootprint = dynamicMunicipioSuppliersWithoutFootprint.map(s =>
            s.contact.nif === input.nif
              ? { ...s, clusterIds: [...s.clusterIds, ...newClusterIds] }
              : s
          );
        }
      }
      // Retornar o supplier atualizado
      const updated = (ownerType === 'empresa'
        ? dynamicEmpresaSuppliersWithoutFootprint
        : dynamicMunicipioSuppliersWithoutFootprint
      ).find(s => s.contact.nif === input.nif);
      if (updated) results.push(updated);
    } else {
      // NIF novo - criar supplier
      const newSupplier = addSupplierWithoutFootprint(input, ownerType);
      existingByNif.set(input.nif, newSupplier);
      results.push(newSupplier);
    }
  });

  return results;
};

// Adicionar um supplier a um cluster
export const addSupplierToCluster = (
  supplierId: string,
  clusterId: string,
  ownerType: OwnerType
): boolean => {
  if (ownerType === 'empresa') {
    // Tentar atualizar em suppliers dinâmicos (sem pegada)
    const index = dynamicEmpresaSuppliersWithoutFootprint.findIndex(s => s.id === supplierId);
    if (index !== -1) {
      dynamicEmpresaSuppliersWithoutFootprint = dynamicEmpresaSuppliersWithoutFootprint.map(s =>
        s.id === supplierId && !s.clusterIds.includes(clusterId)
          ? { ...s, clusterIds: [...s.clusterIds, clusterId] }
          : s
      );
      return true;
    }
    // Verificar se existe em suppliers com pegada (dados estáticos)
    if (empresaSuppliersWithFootprint.some(s => s.id === supplierId)) {
      const existing = additionalClusterIds.get(supplierId) || new Set();
      existing.add(clusterId);
      additionalClusterIds.set(supplierId, existing);
      return true;
    }
  } else {
    // Tentar atualizar em suppliers dinâmicos (sem pegada)
    const index = dynamicMunicipioSuppliersWithoutFootprint.findIndex(s => s.id === supplierId);
    if (index !== -1) {
      dynamicMunicipioSuppliersWithoutFootprint = dynamicMunicipioSuppliersWithoutFootprint.map(s =>
        s.id === supplierId && !s.clusterIds.includes(clusterId)
          ? { ...s, clusterIds: [...s.clusterIds, clusterId] }
          : s
      );
      return true;
    }
    // Verificar se existe em suppliers com pegada (dados estáticos)
    if (municipioSuppliersWithFootprint.some(s => s.id === supplierId)) {
      const existing = additionalClusterIds.get(supplierId) || new Set();
      existing.add(clusterId);
      additionalClusterIds.set(supplierId, existing);
      return true;
    }
  }
  return false;
};

// Remover um supplier de um cluster
export const removeSupplierFromCluster = (
  supplierId: string,
  clusterId: string,
  ownerType: OwnerType
): boolean => {
  if (ownerType === 'empresa') {
    // Tentar atualizar em suppliers dinâmicos (sem pegada)
    const index = dynamicEmpresaSuppliersWithoutFootprint.findIndex(s => s.id === supplierId);
    if (index !== -1) {
      dynamicEmpresaSuppliersWithoutFootprint = dynamicEmpresaSuppliersWithoutFootprint.map(s =>
        s.id === supplierId
          ? { ...s, clusterIds: s.clusterIds.filter(id => id !== clusterId) }
          : s
      );
      return true;
    }
    // Verificar se existe em suppliers com pegada (dados estáticos)
    if (empresaSuppliersWithFootprint.some(s => s.id === supplierId)) {
      const existing = additionalClusterIds.get(supplierId);
      if (existing) {
        existing.delete(clusterId);
      }
      return true;
    }
  } else {
    // Tentar atualizar em suppliers dinâmicos (sem pegada)
    const index = dynamicMunicipioSuppliersWithoutFootprint.findIndex(s => s.id === supplierId);
    if (index !== -1) {
      dynamicMunicipioSuppliersWithoutFootprint = dynamicMunicipioSuppliersWithoutFootprint.map(s =>
        s.id === supplierId
          ? { ...s, clusterIds: s.clusterIds.filter(id => id !== clusterId) }
          : s
      );
      return true;
    }
    // Verificar se existe em suppliers com pegada (dados estáticos)
    if (municipioSuppliersWithFootprint.some(s => s.id === supplierId)) {
      const existing = additionalClusterIds.get(supplierId);
      if (existing) {
        existing.delete(clusterId);
      }
      return true;
    }
  }
  return false;
};

// Mover múltiplos suppliers para outro cluster (adiciona ao cluster destino)
export const moveSuppliersToCluster = (
  supplierIds: string[],
  newClusterId: string,
  ownerType: OwnerType
): void => {
  supplierIds.forEach(id => addSupplierToCluster(id, newClusterId, ownerType));
};

// Eliminar suppliers sem pegada
export const deleteSuppliers = (
  supplierIds: string[],
  ownerType: OwnerType
): number => {
  const idsSet = new Set(supplierIds);
  let deletedCount = 0;

  if (ownerType === 'empresa') {
    const before = dynamicEmpresaSuppliersWithoutFootprint.length;
    dynamicEmpresaSuppliersWithoutFootprint = dynamicEmpresaSuppliersWithoutFootprint.filter(
      s => !idsSet.has(s.id)
    );
    deletedCount = before - dynamicEmpresaSuppliersWithoutFootprint.length;
  } else {
    const before = dynamicMunicipioSuppliersWithoutFootprint.length;
    dynamicMunicipioSuppliersWithoutFootprint = dynamicMunicipioSuppliersWithoutFootprint.filter(
      s => !idsSet.has(s.id)
    );
    deletedCount = before - dynamicMunicipioSuppliersWithoutFootprint.length;
  }

  return deletedCount;
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
