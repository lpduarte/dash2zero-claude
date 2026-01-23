import { ClusterDefinition } from '@/types/clusterNew';

export const DEMO_EMPRESA_ID = 'empresa-demo-001';

export const empresaClusters: ClusterDefinition[] = [
  {
    id: 'emp-cluster-fornecedores',
    name: 'Fornecedores',
    icon: 'Building2',
    ownerId: DEMO_EMPRESA_ID,
    ownerType: 'empresa',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'emp-cluster-clientes',
    name: 'Clientes',
    icon: 'Users',
    ownerId: DEMO_EMPRESA_ID,
    ownerType: 'empresa',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'emp-cluster-parceiros',
    name: 'Parceiros',
    icon: 'Handshake',
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
