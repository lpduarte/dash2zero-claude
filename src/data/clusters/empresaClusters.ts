import { ClusterDefinition } from '@/types/clusterNew';

export const DEMO_EMPRESA_ID = 'empresa-demo-001';

export const empresaClusters: ClusterDefinition[] = [
  {
    id: 'emp-cluster-fornecedores',
    name: 'Fornecedores',
    icon: 'Building2',
    color: '#3B82F6',
    ownerId: DEMO_EMPRESA_ID,
    ownerType: 'empresa',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'emp-cluster-clientes',
    name: 'Clientes',
    icon: 'Users',
    color: '#10B981',
    ownerId: DEMO_EMPRESA_ID,
    ownerType: 'empresa',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'emp-cluster-parceiros',
    name: 'Parceiros',
    icon: 'Handshake',
    color: '#8B5CF6',
    ownerId: DEMO_EMPRESA_ID,
    ownerType: 'empresa',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const getEmpresaClusterById = (id: string): ClusterDefinition | undefined => {
  return empresaClusters.find(c => c.id === id);
};

export const empresaClusterIds = empresaClusters.map(c => c.id);
