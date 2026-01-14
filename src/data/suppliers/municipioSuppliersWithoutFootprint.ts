import { SupplierWithoutFootprint } from '@/types/supplierNew';

// 15 empresas sem pegada em Cascais: 8 apoiadas + 4 monitorizadas + 3 parceiras
// TODAS com municipality: 'Cascais'

export const municipioSuppliersWithoutFootprint: SupplierWithoutFootprint[] = [
  // ===== APOIADAS SEM PEGADA (8) =====
  {
    id: 'mun-apo-np-001', name: 'Café Central Cascais', clusterId: 'mun-cluster-apoiadas',
    sector: 'services', subsector: 'restauracao', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Cascais',
    companySize: 'micro', employees: 4, area: 65, revenue: 0.22,
    contact: { email: 'cafecentral@mail.pt', phone: '+351 214 810 001', website: '', nif: '513234001' },
    emailsSent: 1, lastContactDate: '2024-11-20',
  },
  {
    id: 'mun-apo-np-002', name: 'Mercearia do Bairro', clusterId: 'mun-cluster-apoiadas',
    sector: 'services', subsector: 'comercio', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Estoril',
    companySize: 'micro', employees: 3, area: 50, revenue: 0.18,
    contact: { email: 'mercearia.bairro@mail.pt', phone: '+351 214 810 002', website: '', nif: '513234002' },
    emailsSent: 0,
  },
  {
    id: 'mun-apo-np-003', name: 'Snack Bar Praia', clusterId: 'mun-cluster-apoiadas',
    sector: 'services', subsector: 'restauracao', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Carcavelos',
    companySize: 'micro', employees: 5, area: 45, revenue: 0.25,
    contact: { email: 'snackpraia@mail.pt', phone: '+351 214 810 003', website: '', nif: '513234003' },
    emailsSent: 2, lastContactDate: '2024-12-05',
  },
  {
    id: 'mun-apo-np-004', name: 'Talho Tradicional', clusterId: 'mun-cluster-apoiadas',
    sector: 'services', subsector: 'comercio', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Parede',
    companySize: 'micro', employees: 4, area: 55, revenue: 0.32,
    contact: { email: 'talho.trad@mail.pt', phone: '+351 214 810 004', website: '', nif: '513234004' },
    emailsSent: 0,
  },
  {
    id: 'mun-apo-np-005', name: 'Papelaria Escolar', clusterId: 'mun-cluster-apoiadas',
    sector: 'services', subsector: 'comercio', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'São Domingos de Rana',
    companySize: 'micro', employees: 2, area: 40, revenue: 0.15,
    contact: { email: 'papelaria.escolar@mail.pt', phone: '+351 214 810 005', website: '', nif: '513234005' },
    emailsSent: 3, lastContactDate: '2024-12-18',
  },
  {
    id: 'mun-apo-np-006', name: 'Frutaria Fresca', clusterId: 'mun-cluster-apoiadas',
    sector: 'services', subsector: 'comercio', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Alcabideche',
    companySize: 'micro', employees: 3, area: 45, revenue: 0.2,
    contact: { email: 'frutaria.fresca@mail.pt', phone: '+351 214 810 006', website: '', nif: '513234006' },
    emailsSent: 1, lastContactDate: '2024-11-10',
  },
  {
    id: 'mun-apo-np-007', name: 'Churrasqueira Popular', clusterId: 'mun-cluster-apoiadas',
    sector: 'services', subsector: 'restauracao', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Cascais',
    companySize: 'micro', employees: 6, area: 80, revenue: 0.35,
    contact: { email: 'churrasqueira@mail.pt', phone: '+351 214 810 007', website: '', nif: '513234007' },
    emailsSent: 0,
  },
  {
    id: 'mun-apo-np-008', name: 'Café Esplanada Sol', clusterId: 'mun-cluster-apoiadas',
    sector: 'services', subsector: 'restauracao', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Estoril',
    companySize: 'micro', employees: 4, area: 60, revenue: 0.28,
    contact: { email: 'esplanadasol@mail.pt', phone: '+351 214 810 008', website: '', nif: '513234008' },
    emailsSent: 2, lastContactDate: '2024-12-12',
  },

  // ===== MONITORIZADAS SEM PEGADA (4) =====
  {
    id: 'mun-mon-np-001', name: 'Residencial Costa', clusterId: 'mun-cluster-monitorizadas',
    sector: 'services', subsector: 'hotelaria', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Parede',
    companySize: 'pequena', employees: 12, area: 450, revenue: 0.95,
    contact: { email: 'reservas@residencialcosta.pt', phone: '+351 214 820 001', website: 'https://residencialcosta.pt', nif: '514234001' },
    emailsSent: 2, lastContactDate: '2024-12-05',
  },
  {
    id: 'mun-mon-np-002', name: 'Pensão Familiar', clusterId: 'mun-cluster-monitorizadas',
    sector: 'services', subsector: 'hotelaria', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Cascais',
    companySize: 'pequena', employees: 8, area: 320, revenue: 0.55,
    contact: { email: 'reservas@pensaofamiliar.pt', phone: '+351 214 820 002', website: '', nif: '514234002' },
    emailsSent: 1, lastContactDate: '2024-11-28',
  },
  {
    id: 'mun-mon-np-003', name: 'Hostel Juventude Cascais', clusterId: 'mun-cluster-monitorizadas',
    sector: 'services', subsector: 'hotelaria', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Carcavelos',
    companySize: 'pequena', employees: 10, area: 380, revenue: 0.72,
    contact: { email: 'info@hosteljuventude.pt', phone: '+351 214 820 003', website: 'https://hosteljuventude.pt', nif: '514234003' },
    emailsSent: 0,
  },
  {
    id: 'mun-mon-np-004', name: 'Apart-Hotel Vista Mar', clusterId: 'mun-cluster-monitorizadas',
    sector: 'services', subsector: 'hotelaria', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Estoril',
    companySize: 'pequena', employees: 15, area: 600, revenue: 1.2,
    contact: { email: 'reservas@vistamar.pt', phone: '+351 214 820 004', website: 'https://vistamar.pt', nif: '514234004' },
    emailsSent: 3, lastContactDate: '2024-12-20',
  },

  // ===== PARCEIRAS SEM PEGADA (3) =====
  {
    id: 'mun-par-np-001', name: 'EcoServiços Cascais', clusterId: 'mun-cluster-parceiras',
    sector: 'services', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Alcabideche',
    companySize: 'micro', employees: 8, area: 120, revenue: 0.45,
    contact: { email: 'geral@ecoservicos.pt', phone: '+351 214 830 001', website: 'https://ecoservicos.pt', nif: '515234001' },
    emailsSent: 0,
  },
  {
    id: 'mun-par-np-002', name: 'Mobilidade Verde', clusterId: 'mun-cluster-parceiras',
    sector: 'services', subsector: 'mobilidade', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'Cascais',
    companySize: 'micro', employees: 6, area: 80, revenue: 0.35,
    contact: { email: 'info@mobilidadeverde.pt', phone: '+351 214 830 002', website: 'https://mobilidadeverde.pt', nif: '515234002' },
    emailsSent: 1, lastContactDate: '2024-11-15',
  },
  {
    id: 'mun-par-np-003', name: 'Consultoria Ambiental Local', clusterId: 'mun-cluster-parceiras',
    sector: 'services', subsector: 'consultoria', region: 'center',
    district: 'Lisboa', municipality: 'Cascais', parish: 'São Domingos de Rana',
    companySize: 'micro', employees: 4, area: 60, revenue: 0.28,
    contact: { email: 'info@consultoriaambiental.pt', phone: '+351 214 830 003', website: '', nif: '515234003' },
    emailsSent: 2, lastContactDate: '2024-12-08',
  },
];

export const municipioWithoutFootprintCounts = {
  apoiadas: municipioSuppliersWithoutFootprint.filter(s => s.clusterId === 'mun-cluster-apoiadas').length,
  monitorizadas: municipioSuppliersWithoutFootprint.filter(s => s.clusterId === 'mun-cluster-monitorizadas').length,
  parceiras: municipioSuppliersWithoutFootprint.filter(s => s.clusterId === 'mun-cluster-parceiras').length,
  total: municipioSuppliersWithoutFootprint.length,
};
