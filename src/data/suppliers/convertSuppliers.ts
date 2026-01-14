import { Supplier } from '@/types/supplier';
import { SupplierWithFootprint } from '@/types/supplierNew';

// Mapeamento de clusters antigos para novos IDs
const empresaClusterMap: Record<string, string> = {
  'fornecedor': 'emp-cluster-fornecedores',
  'cliente': 'emp-cluster-clientes',
  'parceiro': 'emp-cluster-parceiros',
};

const municipioClusterMap: Record<string, string> = {
  'fornecedor': 'mun-cluster-apoiadas',
  'cliente': 'mun-cluster-monitorizadas',
  'parceiro': 'mun-cluster-parceiras',
};

// Converter Supplier antigo para SupplierWithFootprint
export const convertToSupplierWithFootprint = (
  supplier: Supplier,
  ownerType: 'empresa' | 'municipio' = 'empresa'
): SupplierWithFootprint => {
  const clusterMap = ownerType === 'empresa' ? empresaClusterMap : municipioClusterMap;
  
  return {
    id: supplier.id,
    name: supplier.name,
    clusterId: clusterMap[supplier.cluster] || 'emp-cluster-fornecedores',
    sector: supplier.sector,
    subsector: supplier.subsector,
    region: supplier.region,
    district: supplier.district,
    municipality: supplier.municipality,
    parish: supplier.parish,
    companySize: supplier.companySize,
    employees: supplier.employees,
    area: supplier.area,
    revenue: supplier.revenue,
    contact: supplier.contact,
    scope1: supplier.scope1,
    scope2: supplier.scope2,
    scope3: supplier.scope3,
    totalEmissions: supplier.totalEmissions,
    emissionsPerRevenue: supplier.emissionsPerRevenue,
    emissionsPerEmployee: supplier.emissionsPerEmployee,
    emissionsPerArea: supplier.emissionsPerArea,
    hasSBTi: supplier.hasSBTi,
    certifications: supplier.certifications,
    yearlyProgress: supplier.yearlyProgress,
    sustainabilityReport: supplier.sustainabilityReport,
    rating: supplier.rating,
    dataSource: supplier.dataSource,
  };
};

// Converter array de Suppliers
export const convertSuppliersArray = (
  suppliers: Supplier[],
  ownerType: 'empresa' | 'municipio' = 'empresa'
): SupplierWithFootprint[] => {
  return suppliers.map(s => convertToSupplierWithFootprint(s, ownerType));
};
