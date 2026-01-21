// Novo sistema de clusters dinâmicos

export type OwnerType = 'empresa' | 'municipio';

export interface ClusterDefinition {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color?: string;
  ownerId: string;
  ownerType: OwnerType;
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
}

export interface CreateClusterInput {
  name: string;
  description?: string;
  icon: string;
  color?: string;
}

// Uma empresa pode pertencer a múltiplos clusters
export interface ClusterMembership {
  companyId: string;
  clusterId: string;
  addedAt: Date;
}

export const availableClusterIcons = [
  'Building2',
  'Users',
  'Handshake',
  'ShieldCheck',
  'Eye',
  'Factory',
  'Truck',
  'ShoppingCart',
  'Briefcase',
  'Heart',
  'Leaf',
  'Zap',
  'Home',
  'Coffee',
  'Bed',
  'Store',
] as const;

export type ClusterIconName = typeof availableClusterIcons[number];

export const availableClusterColors = [
  { value: '#3B82F6', label: 'Azul' },
  { value: '#10B981', label: 'Verde' },
  { value: '#8B5CF6', label: 'Roxo' },
  { value: '#F59E0B', label: 'Âmbar' },
  { value: '#EF4444', label: 'Vermelho' },
  { value: '#EC4899', label: 'Rosa' },
  { value: '#06B6D4', label: 'Ciano' },
  { value: '#6B7280', label: 'Cinzento' },
] as const;
