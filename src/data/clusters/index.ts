export * from './empresaClusters';
export * from './municipioClusters';

import { empresaClusters } from './empresaClusters';
import { municipioClusters } from './municipioClusters';
import { ClusterDefinition, OwnerType } from '@/types/clusterNew';

export const getClustersByOwnerType = (ownerType: OwnerType): ClusterDefinition[] => {
  return ownerType === 'empresa' ? empresaClusters : municipioClusters;
};

export const getAllClusters = (): ClusterDefinition[] => {
  return [...empresaClusters, ...municipioClusters];
};

export const getClusterById = (id: string): ClusterDefinition | undefined => {
  return getAllClusters().find(c => c.id === id);
};
