import { ClusterDefinition } from '@/types/clusterNew';

export const DEMO_MUNICIPIO_ID = 'municipio-cascais-001';

export const municipioClusters: ClusterDefinition[] = [
  {
    id: 'mun-cluster-apoiadas',
    name: 'Apoiadas',
    icon: 'ShieldCheck',
    color: '#10B981',
    ownerId: DEMO_MUNICIPIO_ID,
    ownerType: 'municipio',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'mun-cluster-monitorizadas',
    name: 'Monitorizadas',
    icon: 'Eye',
    color: '#3B82F6',
    ownerId: DEMO_MUNICIPIO_ID,
    ownerType: 'municipio',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'mun-cluster-parceiras',
    name: 'Parceiras',
    icon: 'Handshake',
    color: '#8B5CF6',
    ownerId: DEMO_MUNICIPIO_ID,
    ownerType: 'municipio',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const getMunicipioClusterById = (id: string): ClusterDefinition | undefined => {
  return municipioClusters.find(c => c.id === id);
};

export const municipioClusterIds = municipioClusters.map(c => c.id);
