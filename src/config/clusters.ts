import {
  Building2, Users, Handshake, ShieldCheck, Eye, LayoutGrid, Factory, Briefcase,
  ShoppingCart, Truck, Heart, Leaf, Zap, Home, Coffee, Bed, Store,
  Globe, MapPin, Package, Plane, Car, Ship, Train, Warehouse,
  Wrench, HardHat, Stethoscope, GraduationCap, Landmark, TreePine, Wheat, Fish
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { getClustersByOwnerType as getDynamicClusters } from '@/data/clusters';

// ClusterType agora aceita qualquer string para suportar IDs dinâmicos
export type ClusterType = string;
export type UserViewType = 'empresa' | 'municipio';

export interface ClusterConfig {
  value: string;
  label: string;
  labelPlural: string;
  icon: LucideIcon;
}

// Mapeamento de icon name (string) para LucideIcon
const iconMap: Record<string, LucideIcon> = {
  Building2,
  Users,
  Handshake,
  ShieldCheck,
  Eye,
  LayoutGrid,
  Factory,
  Briefcase,
  ShoppingCart,
  Truck,
  Heart,
  Leaf,
  Zap,
  Home,
  Coffee,
  Bed,
  Store,
  Globe,
  MapPin,
  Package,
  Plane,
  Car,
  Ship,
  Train,
  Warehouse,
  Wrench,
  HardHat,
  Stethoscope,
  GraduationCap,
  Landmark,
  TreePine,
  Wheat,
  Fish,
};

export const getIconByName = (iconName: string): LucideIcon => {
  return iconMap[iconName] || LayoutGrid;
};

// Main export: get clusters based on user type (usando clusters dinâmicos)
export const getClusterConfig = (userType: UserViewType): ClusterConfig[] => {
  const dynamicClusters = getDynamicClusters(userType === 'municipio' ? 'municipio' : 'empresa');
  
  // Adiciona opção "Todas" no início
  const allOption: ClusterConfig = { 
    value: 'all', 
    label: 'Todas', 
    labelPlural: 'Todas', 
    icon: LayoutGrid 
  };
  
  // Mapeia clusters dinâmicos para ClusterConfig
  const clusterConfigs: ClusterConfig[] = dynamicClusters.map(cluster => ({
    value: cluster.id,
    label: cluster.name,
    labelPlural: cluster.name,
    icon: getIconByName(cluster.icon),
  }));
  
  return [allOption, ...clusterConfigs];
};

// Get a single cluster's config
export const getClusterInfo = (userType: UserViewType, clusterValue: string): ClusterConfig | undefined => {
  const config = getClusterConfig(userType);
  return config.find(c => c.value === clusterValue);
};

// Get cluster label (singular)
export const getClusterLabel = (userType: UserViewType, clusterValue: string): string => {
  const info = getClusterInfo(userType, clusterValue);
  return info?.label || clusterValue;
};

// Get cluster label plural
export const getClusterLabelPlural = (userType: UserViewType, clusterValue: string): string => {
  const info = getClusterInfo(userType, clusterValue);
  return info?.labelPlural || clusterValue;
};

// Get cluster icon component
export const getClusterIcon = (userType: UserViewType, clusterValue: string): LucideIcon => {
  const info = getClusterInfo(userType, clusterValue);
  return info?.icon || LayoutGrid;
};

// Legacy mappings for backward compatibility (empresa view)
export const clusterLabels: Record<string, string> = {
  fornecedor: 'Fornecedores',
  cliente: 'Clientes',
  parceiro: 'Parceiros',
  subcontratado: 'Subcontratados',
  'emp-cluster-fornecedores': 'Fornecedores',
  'emp-cluster-clientes': 'Clientes',
  'emp-cluster-parceiros': 'Parceiros',
  'mun-cluster-apoiadas': 'Apoiadas',
  'mun-cluster-monitorizadas': 'Monitorizadas',
  'mun-cluster-parceiras': 'Parceiras',
};

export const clusterLabelsSingular: Record<string, string> = {
  fornecedor: 'Fornecedor',
  cliente: 'Cliente',
  parceiro: 'Parceiro',
  subcontratado: 'Subcontratado',
  'emp-cluster-fornecedores': 'Fornecedor',
  'emp-cluster-clientes': 'Cliente',
  'emp-cluster-parceiros': 'Parceiro',
  'mun-cluster-apoiadas': 'Apoiada',
  'mun-cluster-monitorizadas': 'Monitorizada',
  'mun-cluster-parceiras': 'Parceira',
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
