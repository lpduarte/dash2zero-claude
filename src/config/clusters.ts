import { Building2, Users, Handshake, ShieldCheck, Eye, LayoutGrid, Factory, Briefcase, ShoppingCart } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type ClusterType = 'all' | 'fornecedor' | 'cliente' | 'parceiro';
export type UserViewType = 'empresa' | 'municipio';

export interface ClusterConfig {
  value: ClusterType;
  label: string;
  labelPlural: string;
  icon: LucideIcon;
}

// Cluster configurations per user type
const empresaClusterConfig: ClusterConfig[] = [
  { value: 'all', label: 'Todos', labelPlural: 'Todas', icon: LayoutGrid },
  { value: 'fornecedor', label: 'Fornecedor', labelPlural: 'Fornecedores', icon: Building2 },
  { value: 'cliente', label: 'Cliente', labelPlural: 'Clientes', icon: Users },
  { value: 'parceiro', label: 'Parceiro', labelPlural: 'Parceiros', icon: Handshake },
];

const municipioClusterConfig: ClusterConfig[] = [
  { value: 'all', label: 'Todas', labelPlural: 'Todas', icon: LayoutGrid },
  { value: 'fornecedor', label: 'Apoiada', labelPlural: 'Apoiadas', icon: ShieldCheck },
  { value: 'cliente', label: 'Monitorizada', labelPlural: 'Monitorizadas', icon: Eye },
  { value: 'parceiro', label: 'Parceira', labelPlural: 'Parceiras', icon: Handshake },
];

// Main export: get clusters based on user type
export const getClusterConfig = (userType: UserViewType): ClusterConfig[] => {
  return userType === 'municipio' ? municipioClusterConfig : empresaClusterConfig;
};

// Get a single cluster's config
export const getClusterInfo = (userType: UserViewType, clusterValue: ClusterType): ClusterConfig | undefined => {
  const config = getClusterConfig(userType);
  return config.find(c => c.value === clusterValue);
};

// Get cluster label (singular)
export const getClusterLabel = (userType: UserViewType, clusterValue: ClusterType): string => {
  const info = getClusterInfo(userType, clusterValue);
  return info?.label || clusterValue;
};

// Get cluster label plural
export const getClusterLabelPlural = (userType: UserViewType, clusterValue: ClusterType): string => {
  const info = getClusterInfo(userType, clusterValue);
  return info?.labelPlural || clusterValue;
};

// Get cluster icon component
export const getClusterIcon = (userType: UserViewType, clusterValue: ClusterType): LucideIcon => {
  const info = getClusterInfo(userType, clusterValue);
  return info?.icon || LayoutGrid;
};

// Legacy mappings for backward compatibility (empresa view)
export const clusterLabels: Record<string, string> = {
  fornecedor: 'Fornecedores',
  cliente: 'Clientes',
  parceiro: 'Parceiros',
  subcontratado: 'Subcontratados',
};

export const clusterLabelsSingular: Record<string, string> = {
  fornecedor: 'Fornecedor',
  cliente: 'Cliente',
  parceiro: 'Parceiro',
  subcontratado: 'Subcontratado',
};

// Icons for charts and tooltips (empresa view - legacy)
export const clusterIcons = {
  fornecedor: Factory,
  cliente: Users,
  parceiro: Handshake,
  subcontratado: Briefcase,
};

// For IncentiveEmailDialog (empresa view)
export const clusterIconsForEmail = {
  fornecedor: ShoppingCart,
  cliente: Users,
  parceiro: Handshake,
};
