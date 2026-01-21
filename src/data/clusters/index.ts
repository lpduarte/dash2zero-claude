export * from './empresaClusters';
export * from './municipioClusters';

import { empresaClusters, DEMO_EMPRESA_ID } from './empresaClusters';
import { municipioClusters, DEMO_MUNICIPIO_ID } from './municipioClusters';
import { ClusterDefinition, OwnerType, CreateClusterInput, ClusterMembership } from '@/types/clusterNew';

// Clusters dinâmicos (mutáveis para permitir CRUD)
let dynamicEmpresaClusters: ClusterDefinition[] = [...empresaClusters];
let dynamicMunicipioClusters: ClusterDefinition[] = [...municipioClusters];

// Memberships (empresa pode estar em múltiplos clusters)
let clusterMemberships: ClusterMembership[] = [];

// Gerar ID único para novos clusters
const generateClusterId = (ownerType: OwnerType): string => {
  const prefix = ownerType === 'empresa' ? 'emp-cluster' : 'mun-cluster';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
};

// Obter clusters por tipo de owner (não arquivados)
export const getClustersByOwnerType = (ownerType: OwnerType): ClusterDefinition[] => {
  const clusters = ownerType === 'empresa' ? dynamicEmpresaClusters : dynamicMunicipioClusters;
  return clusters.filter(c => !c.isArchived);
};

// Obter todos os clusters (incluindo arquivados)
export const getAllClustersByOwnerType = (ownerType: OwnerType, includeArchived = false): ClusterDefinition[] => {
  const clusters = ownerType === 'empresa' ? dynamicEmpresaClusters : dynamicMunicipioClusters;
  return includeArchived ? clusters : clusters.filter(c => !c.isArchived);
};

export const getAllClusters = (): ClusterDefinition[] => {
  return [...dynamicEmpresaClusters, ...dynamicMunicipioClusters].filter(c => !c.isArchived);
};

export const getClusterById = (id: string): ClusterDefinition | undefined => {
  return [...dynamicEmpresaClusters, ...dynamicMunicipioClusters].find(c => c.id === id);
};

// CRUD Operations
export const createCluster = (
  input: CreateClusterInput,
  ownerType: OwnerType
): ClusterDefinition => {
  const ownerId = ownerType === 'empresa' ? DEMO_EMPRESA_ID : DEMO_MUNICIPIO_ID;

  const newCluster: ClusterDefinition = {
    id: generateClusterId(ownerType),
    name: input.name,
    description: input.description,
    icon: input.icon,
    color: input.color,
    ownerId,
    ownerType,
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
  };

  if (ownerType === 'empresa') {
    dynamicEmpresaClusters = [...dynamicEmpresaClusters, newCluster];
  } else {
    dynamicMunicipioClusters = [...dynamicMunicipioClusters, newCluster];
  }

  return newCluster;
};

export const updateCluster = (
  id: string,
  updates: Partial<Omit<ClusterDefinition, 'id' | 'ownerId' | 'ownerType' | 'createdAt'>>
): ClusterDefinition | undefined => {
  const cluster = getClusterById(id);
  if (!cluster) return undefined;

  const updatedCluster: ClusterDefinition = {
    ...cluster,
    ...updates,
    updatedAt: new Date(),
  };

  if (cluster.ownerType === 'empresa') {
    dynamicEmpresaClusters = dynamicEmpresaClusters.map(c =>
      c.id === id ? updatedCluster : c
    );
  } else {
    dynamicMunicipioClusters = dynamicMunicipioClusters.map(c =>
      c.id === id ? updatedCluster : c
    );
  }

  return updatedCluster;
};

export const archiveCluster = (id: string): boolean => {
  const result = updateCluster(id, { isArchived: true });
  return !!result;
};

export const deleteCluster = (id: string): boolean => {
  const cluster = getClusterById(id);
  if (!cluster) return false;

  if (cluster.ownerType === 'empresa') {
    dynamicEmpresaClusters = dynamicEmpresaClusters.filter(c => c.id !== id);
  } else {
    dynamicMunicipioClusters = dynamicMunicipioClusters.filter(c => c.id !== id);
  }

  // Remover memberships associadas
  clusterMemberships = clusterMemberships.filter(m => m.clusterId !== id);

  return true;
};

export const duplicateCluster = (id: string): ClusterDefinition | undefined => {
  const cluster = getClusterById(id);
  if (!cluster) return undefined;

  return createCluster(
    {
      name: `${cluster.name} (cópia)`,
      description: cluster.description,
      icon: cluster.icon,
      color: cluster.color,
    },
    cluster.ownerType
  );
};

// Membership Operations
export const addCompanyToCluster = (companyId: string, clusterId: string): ClusterMembership => {
  // Verificar se já existe
  const existing = clusterMemberships.find(
    m => m.companyId === companyId && m.clusterId === clusterId
  );
  if (existing) return existing;

  const membership: ClusterMembership = {
    companyId,
    clusterId,
    addedAt: new Date(),
  };

  clusterMemberships = [...clusterMemberships, membership];
  return membership;
};

export const removeCompanyFromCluster = (companyId: string, clusterId: string): boolean => {
  const initialLength = clusterMemberships.length;
  clusterMemberships = clusterMemberships.filter(
    m => !(m.companyId === companyId && m.clusterId === clusterId)
  );
  return clusterMemberships.length < initialLength;
};

export const getCompanyClusters = (companyId: string): ClusterDefinition[] => {
  const membershipClusterIds = clusterMemberships
    .filter(m => m.companyId === companyId)
    .map(m => m.clusterId);

  return getAllClusters().filter(c => membershipClusterIds.includes(c.id));
};

export const getClusterCompanies = (clusterId: string): string[] => {
  return clusterMemberships
    .filter(m => m.clusterId === clusterId)
    .map(m => m.companyId);
};

export const addCompaniesToCluster = (companyIds: string[], clusterId: string): void => {
  companyIds.forEach(companyId => addCompanyToCluster(companyId, clusterId));
};

export const moveCompaniesToCluster = (
  companyIds: string[],
  fromClusterId: string,
  toClusterId: string
): void => {
  companyIds.forEach(companyId => {
    removeCompanyFromCluster(companyId, fromClusterId);
    addCompanyToCluster(companyId, toClusterId);
  });
};

// Validação
export const isClusterNameUnique = (
  name: string,
  ownerType: OwnerType,
  excludeId?: string
): boolean => {
  const clusters = getClustersByOwnerType(ownerType);
  return !clusters.some(
    c => c.name.toLowerCase() === name.toLowerCase() && c.id !== excludeId
  );
};
