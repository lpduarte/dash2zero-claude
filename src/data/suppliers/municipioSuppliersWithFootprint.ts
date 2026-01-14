import { SupplierWithFootprint } from '@/types/supplierNew';
import { mockSuppliers } from '@/data/mockSuppliers';
import { convertToSupplierWithFootprint } from './convertSuppliers';

// Filtrar apenas empresas de Cascais e converter para o formato município
export const municipioSuppliersWithFootprint: SupplierWithFootprint[] = mockSuppliers
  .filter(s => s.municipality === 'Cascais')
  .map(s => convertToSupplierWithFootprint(s, 'municipio'));

// Contagens por cluster
export const municipioWithFootprintCounts = {
  apoiadas: municipioSuppliersWithFootprint.filter(s => s.clusterId === 'mun-cluster-apoiadas').length,
  monitorizadas: municipioSuppliersWithFootprint.filter(s => s.clusterId === 'mun-cluster-monitorizadas').length,
  parceiras: municipioSuppliersWithFootprint.filter(s => s.clusterId === 'mun-cluster-parceiras').length,
  total: municipioSuppliersWithFootprint.length,
};
