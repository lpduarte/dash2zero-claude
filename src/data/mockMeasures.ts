import type { Measure, MeasureCategory } from '@/types/actionPlan';
import type { Supplier } from '@/types/supplier';
import { cascaisInfrastructure } from './mockInfrastructure';
import { getSectorName } from './sectors';

export const mockMeasures: Measure[] = [
  // === ÂMBITO 1 - DIRETAS ===
  {
    id: 'measure-001',
    category: 'energia',
    scope: 1,
    name: 'Substituição de Caldeira',
    description: 'Substituir caldeira a gás por bomba de calor de alta eficiência',
    emissionReduction: 25,
    investment: 45000,
    timeline: '6-12 meses',
    priority: 'alta',
    interventionLevel: 'interventiva',
    requiredFunding: {
      category: 'energia',
      minimumAmount: 20000,
      reason: 'Investimento elevado requer apoio financeiro disponível'
    },
    applicableTo: {
      sectors: ['Indústria', 'Serviços'],
      sizes: ['media', 'grande'],
      minEmissions: 100
    },
    additionalBenefits: ['Redução custos energéticos', 'Menor manutenção']
  },
  {
    id: 'measure-002',
    category: 'mobilidade',
    scope: 1,
    name: 'Eletrificação de Frota',
    description: 'Substituir veículos a combustão por elétricos',
    emissionReduction: 35,
    investment: 80000,
    timeline: '12-18 meses',
    priority: 'alta',
    interventionLevel: 'interventiva',
    requiredInfrastructure: {
      key: 'chargingStations',
      minimumValue: 20,
      reason: 'Necessária rede de postos de carregamento no município'
    },
    requiredFunding: {
      category: 'mobilidade',
      minimumAmount: 30000,
      reason: 'Investimento elevado requer incentivos disponíveis'
    },
    applicableTo: {
      sizes: ['pequena', 'media', 'grande'],
      minEmissions: 50
    },
    additionalBenefits: ['Incentivos fiscais', 'Menores custos combustível']
  },
  {
    id: 'measure-003',
    category: 'energia',
    scope: 1,
    name: 'Otimização de Processos',
    description: 'Auditoria e otimização de processos industriais para reduzir desperdício',
    emissionReduction: 15,
    investment: 8000,
    timeline: '3-6 meses',
    priority: 'media',
    interventionLevel: 'soft',
    applicableTo: {
      sectors: ['Indústria', 'Serviços'],
      minEmissions: 30
    },
    additionalBenefits: ['Aumento produtividade', 'Redução custos operacionais']
  },
  
  // === ÂMBITO 2 - ENERGIA ===
  {
    id: 'measure-004',
    category: 'energia',
    scope: 2,
    name: 'Instalação de Painéis Solares',
    description: 'Sistema fotovoltaico para autoconsumo',
    emissionReduction: 40,
    investment: 60000,
    timeline: '6-9 meses',
    priority: 'alta',
    interventionLevel: 'interventiva',
    requiredInfrastructure: {
      key: 'solarPotentialZones',
      minimumValue: 5,
      reason: 'Localização deve estar em zona com potencial solar identificado'
    },
    requiredFunding: {
      category: 'energia',
      minimumAmount: 25000,
      reason: 'Investimento requer apoio para viabilidade'
    },
    applicableTo: {
      sizes: ['pequena', 'media', 'grande'],
      minEmissions: 50
    },
    additionalBenefits: ['Independência energética', 'Proteção contra aumento tarifas']
  },
  {
    id: 'measure-005',
    category: 'energia',
    scope: 2,
    name: 'Contrato Energia Verde',
    description: 'Migrar para fornecedor de energia 100% renovável',
    emissionReduction: 30,
    investment: 2000,
    timeline: '1-2 meses',
    priority: 'alta',
    interventionLevel: 'soft',
    requiredInfrastructure: {
      key: 'greenEnergySuppliers',
      minimumValue: 1,
      reason: 'Necessário fornecedor de energia verde disponível na região'
    },
    applicableTo: {
      sizes: ['pequena', 'media', 'grande']
    },
    additionalBenefits: ['Implementação rápida', 'Sem investimento infraestrutura']
  },
  {
    id: 'measure-006',
    category: 'energia',
    scope: 2,
    name: 'Auditoria Energética',
    description: 'Diagnóstico completo de consumos e oportunidades de eficiência',
    emissionReduction: 10,
    investment: 3000,
    timeline: '1-2 meses',
    priority: 'media',
    interventionLevel: 'soft',
    applicableTo: {
      sizes: ['pequena', 'media', 'grande']
    },
    additionalBenefits: ['Identificação de quick-wins', 'Base para plano de ação']
  },
  {
    id: 'measure-007',
    category: 'energia',
    scope: 2,
    name: 'Iluminação LED',
    description: 'Substituição de iluminação convencional por LED',
    emissionReduction: 8,
    investment: 5000,
    timeline: '1-3 meses',
    priority: 'media',
    interventionLevel: 'soft',
    applicableTo: {
      sizes: ['pequena', 'media', 'grande']
    },
    additionalBenefits: ['ROI rápido', 'Menor manutenção']
  },
  
  // === ÂMBITO 3 - INDIRETAS ===
  {
    id: 'measure-008',
    category: 'mobilidade',
    scope: 3,
    name: 'Otimização de Logística',
    description: 'Consolidação de cargas e otimização de rotas de transporte',
    emissionReduction: 20,
    investment: 12000,
    timeline: '3-6 meses',
    priority: 'alta',
    interventionLevel: 'interventiva',
    applicableTo: {
      sectors: ['Comércio', 'Indústria', 'Serviços'],
      minEmissions: 40
    },
    additionalBenefits: ['Redução custos transporte', 'Menor tempo entrega']
  },
  {
    id: 'measure-009',
    category: 'mobilidade',
    scope: 3,
    name: 'Critérios ESG para Fornecedores',
    description: 'Implementar critérios ambientais na seleção e avaliação de fornecedores',
    emissionReduction: 25,
    investment: 5000,
    timeline: '3-6 meses',
    priority: 'alta',
    interventionLevel: 'soft',
    applicableTo: {
      sizes: ['pequena', 'media', 'grande']
    },
    additionalBenefits: ['Melhoria cadeia de valor', 'Diferenciação mercado']
  },
  {
    id: 'measure-010',
    category: 'mobilidade',
    scope: 3,
    name: 'Programa Mobilidade Colaboradores',
    description: 'Incentivos para uso de transporte público e mobilidade suave',
    emissionReduction: 12,
    investment: 8000,
    timeline: '2-4 meses',
    priority: 'media',
    interventionLevel: 'soft',
    requiredInfrastructure: {
      key: 'publicTransportCoverage',
      minimumValue: 70,
      reason: 'Necessária boa cobertura de transportes públicos na zona'
    },
    applicableTo: {
      sizes: ['media', 'grande'],
      minEmissions: 30
    },
    additionalBenefits: ['Bem-estar colaboradores', 'Redução custos estacionamento']
  },
  {
    id: 'measure-011',
    category: 'mobilidade',
    scope: 3,
    name: 'Frota de Bicicletas Partilhadas',
    description: 'Disponibilizar bicicletas para deslocações de colaboradores',
    emissionReduction: 5,
    investment: 6000,
    timeline: '1-2 meses',
    priority: 'baixa',
    interventionLevel: 'soft',
    requiredInfrastructure: {
      key: 'cyclingNetworkKm',
      minimumValue: 50,
      reason: 'Necessária rede de ciclovias adequada no município'
    },
    applicableTo: {
      sizes: ['media', 'grande']
    },
    additionalBenefits: ['Saúde colaboradores', 'Imagem sustentável']
  },
  
  // === RESÍDUOS (Âmbito 3) ===
  {
    id: 'measure-012',
    category: 'residuos',
    scope: 3,
    name: 'Programa Zero Desperdício',
    description: 'Implementar sistema de redução e triagem de resíduos',
    emissionReduction: 8,
    investment: 4000,
    timeline: '2-4 meses',
    priority: 'media',
    interventionLevel: 'soft',
    requiredInfrastructure: {
      key: 'recyclingCenters',
      minimumValue: 3,
      reason: 'Necessários centros de reciclagem acessíveis'
    },
    applicableTo: {
      sizes: ['pequena', 'media', 'grande']
    },
    additionalBenefits: ['Redução custos gestão resíduos', 'Compliance ambiental']
  },
  {
    id: 'measure-013',
    category: 'residuos',
    scope: 3,
    name: 'Compostagem Industrial',
    description: 'Sistema de compostagem para resíduos orgânicos',
    emissionReduction: 6,
    investment: 10000,
    timeline: '3-6 meses',
    priority: 'baixa',
    interventionLevel: 'interventiva',
    requiredInfrastructure: {
      key: 'compostingFacilities',
      minimumValue: 1,
      reason: 'Necessária infraestrutura de compostagem no município'
    },
    applicableTo: {
      sectors: ['Retalho', 'Serviços'],
      minEmissions: 20
    },
    additionalBenefits: ['Produção de composto', 'Redução aterro']
  },
  
  // === ÁGUA (Âmbito 3) ===
  {
    id: 'measure-014',
    category: 'agua',
    scope: 3,
    name: 'Sistema de Reutilização de Água',
    description: 'Tratamento e reutilização de águas cinzentas',
    emissionReduction: 4,
    investment: 25000,
    timeline: '6-9 meses',
    priority: 'baixa',
    interventionLevel: 'interventiva',
    requiredInfrastructure: {
      key: 'waterReuseInfrastructure',
      minimumValue: 1,
      reason: 'Necessária infraestrutura municipal de apoio'
    },
    applicableTo: {
      sectors: ['Indústria', 'Serviços'],
      sizes: ['media', 'grande'],
      minEmissions: 50
    },
    additionalBenefits: ['Redução custos água', 'Resiliência hídrica']
  }
];

/**
 * Filtra medidas aplicáveis a uma empresa específica
 */
export function getApplicableMeasures(
  supplier: { sector: string; companySize: string; totalEmissions: number },
  allMeasures: Measure[] = mockMeasures
): Measure[] {
  // Traduzir o setor do supplier para português para comparação
  const supplierSectorPT = getSectorName(supplier.sector);
  
  return allMeasures.filter(measure => {
    // Filtro por setor - comparar com nome traduzido
    if (measure.applicableTo.sectors && 
        measure.applicableTo.sectors.length > 0) {
      // Verificar se o setor do supplier (traduzido) está na lista
      const sectorMatch = measure.applicableTo.sectors.some(s => 
        s.toLowerCase() === supplierSectorPT.toLowerCase() ||
        s.toLowerCase() === supplier.sector.toLowerCase()
      );
      if (!sectorMatch) return false;
    }
    
    // Filtro por dimensão
    if (measure.applicableTo.sizes && 
        measure.applicableTo.sizes.length > 0 &&
        !measure.applicableTo.sizes.includes(supplier.companySize as any)) {
      return false;
    }
    
    // Filtro por emissões mínimas
    if (measure.applicableTo.minEmissions && 
        supplier.totalEmissions < measure.applicableTo.minEmissions) {
      return false;
    }
    
    return true;
  });
}

/**
 * Verifica se medida é recomendada com base em infraestrutura e fundos
 */
export function isMeasureRecommended(
  measure: Measure,
  infrastructure: Record<string, any> = cascaisInfrastructure,
  fundingByCategory: { category: string; available: number }[] = []
): { recommended: boolean; reason?: string } {
  // Verificar infraestrutura
  if (measure.requiredInfrastructure) {
    const { key, minimumValue, reason } = measure.requiredInfrastructure;
    const currentValue = infrastructure[key];
    
    if (currentValue === undefined) {
      return { recommended: false, reason: `Infraestrutura não disponível: ${key}` };
    }
    
    // Para booleanos
    if (typeof currentValue === 'boolean') {
      if (!currentValue && minimumValue > 0) {
        return { recommended: false, reason };
      }
    } else if (currentValue < minimumValue) {
      return { recommended: false, reason };
    }
  }
  
  // Verificar fundos
  if (measure.requiredFunding) {
    const { category, minimumAmount, reason } = measure.requiredFunding;
    const availableFund = fundingByCategory.find(f => f.category === category);
    
    if (!availableFund || availableFund.available < minimumAmount) {
      return { recommended: false, reason };
    }
  }
  
  return { recommended: true };
}
