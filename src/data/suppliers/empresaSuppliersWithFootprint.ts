import { SupplierWithFootprint } from '@/types/supplierNew';
import { mockSuppliers } from '@/data/mockSuppliers';
import { convertSuppliersArray } from './convertSuppliers';

// Converter todos os mockSuppliers existentes para o novo formato
// Estes são os suppliers da vista Empresa (todos os municípios)
export const empresaSuppliersWithFootprint: SupplierWithFootprint[] = 
  convertSuppliersArray(mockSuppliers, 'empresa');

// Contagens por cluster
export const empresaWithFootprintCounts = {
  fornecedores: empresaSuppliersWithFootprint.filter(s => s.clusterId === 'emp-cluster-fornecedores').length,
  clientes: empresaSuppliersWithFootprint.filter(s => s.clusterId === 'emp-cluster-clientes').length,
  parceiros: empresaSuppliersWithFootprint.filter(s => s.clusterId === 'emp-cluster-parceiros').length,
  total: empresaSuppliersWithFootprint.length,
};
