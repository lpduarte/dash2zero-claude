import { Client } from '@/types/user';
import { PERMISSION_PROFILES } from '@/types/permissions';

export const mockClients: Client[] = [
  {
    id: 'cascais',
    name: 'Câmara Municipal de Cascais',
    type: 'municipio',
    logo: '/img/cascais.svg',
    contactEmail: 'ambiente@cm-cascais.pt',
    contactName: 'Dr. António Silva',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-01-20'),
    isArchived: false,
    permissions: PERMISSION_PROFILES['gestao-completa'],
    metrics: {
      totalCompanies: 132,
      totalClusters: 8,
      funnelStats: {
        // Cascais: maioria no início do funil, pouco em pós-decisão
        porContactar: 65,
        semInteracao: 40,
        interessada: 15,
        simple: {
          registada: 5,
          emProgresso: 4,
          completo: 3,
        },
        formulario: {
          emProgresso: 0,
          completo: 0,
        },
      },
      lastActivity: new Date('2026-01-24'),
      emailBounces: 3,
      weeklyCompletions: [1, 2, 0, 1, 3, 2, 1, 0, 2, 1, 1, 2],
    },
  },
  {
    id: 'sintra',
    name: 'SABSEG',
    type: 'empresa',
    logo: '/img/sabseg.svg',
    contactEmail: 'sustentabilidade@cm-sintra.pt',
    contactName: 'Dra. Maria Santos',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2025-01-18'),
    isArchived: false,
    permissions: PERMISSION_PROFILES['gestao-parcial'],
    metrics: {
      totalCompanies: 89,
      totalClusters: 5,
      funnelStats: {
        // Sintra: equilibrado, mais formulário que simple
        porContactar: 20,
        semInteracao: 15,
        interessada: 25,
        simple: {
          registada: 8,
          emProgresso: 6,
          completo: 5,
        },
        formulario: {
          emProgresso: 7,
          completo: 3,
        },
      },
      lastActivity: new Date('2026-01-22'),
      emailBounces: 0,
      weeklyCompletions: [2, 1, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2],
    },
  },
  {
    id: 'montepio',
    name: 'Montepio',
    type: 'empresa',
    logo: '/img/montepio.svg',
    contactEmail: 'esg@montepio.pt',
    contactName: 'João Ferreira',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2025-01-15'),
    isArchived: false,
    permissions: PERMISSION_PROFILES['visualizacao'],
    metrics: {
      totalCompanies: 45,
      totalClusters: 3,
      funnelStats: {
        // Montepio: muito simple, sem formulário
        porContactar: 5,
        semInteracao: 8,
        interessada: 12,
        simple: {
          registada: 10,
          emProgresso: 6,
          completo: 4,
        },
        formulario: {
          emProgresso: 0,
          completo: 0,
        },
      },
      lastActivity: new Date('2026-01-20'),
      emailBounces: 5,
      weeklyCompletions: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    },
    zeroProIntegration: {
      enabled: false,
      syncScope3Data: false,
    },
  },
  {
    id: 'lisboa-archived',
    name: 'Câmara Municipal de Lisboa',
    type: 'municipio',
    logo: '/img/lisboa.svg',
    contactEmail: 'ambiente@cm-lisboa.pt',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-06-30'),
    isArchived: true,
    permissions: PERMISSION_PROFILES['gestao-completa'],
    metrics: {
      totalCompanies: 0,
      totalClusters: 0,
      funnelStats: {
        porContactar: 0,
        semInteracao: 0,
        interessada: 0,
        simple: {
          registada: 0,
          emProgresso: 0,
          completo: 0,
        },
        formulario: {
          emProgresso: 0,
          completo: 0,
        },
      },
      emailBounces: 0,
      weeklyCompletions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
];
