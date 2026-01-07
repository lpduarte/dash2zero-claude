import type { Measure } from '@/types/actionPlan';
import type { Supplier } from '@/types/supplier';

export const mockMeasures: Measure[] = [
  // ENERGIA (4 medidas)
  {
    id: 'energia-1',
    category: 'energia',
    name: 'Auditoria Energética Certificada',
    description: 'Diagnóstico completo do consumo energético com certificação',
    emissionReduction: 150,
    investment: 5000,
    timeline: 3,
    priority: 'alta',
    annualSavings: 15000,
    applicableTo: {
      minEmissions: 200
    }
  },
  {
    id: 'energia-2',
    category: 'energia',
    name: 'Instalação Painéis Solares (100 kWp)',
    description: 'Sistema fotovoltaico para autoconsumo com ligação à rede',
    emissionReduction: 200,
    investment: 80000,
    timeline: 12,
    priority: 'media',
    roi: 7,
    annualSavings: 12000,
    applicableTo: {
      sizes: ['media', 'grande'],
      minEmissions: 500
    }
  },
  {
    id: 'energia-3',
    category: 'energia',
    name: 'Substituição de Caldeira (Bomba de Calor)',
    description: 'Substituir caldeira a gás por bomba de calor de alta eficiência',
    emissionReduction: 100,
    investment: 45000,
    timeline: 6,
    priority: 'baixa',
    roi: 8,
    applicableTo: {
      sectors: ['Indústria', 'Serviços']
    }
  },
  {
    id: 'energia-4',
    category: 'energia',
    name: 'Iluminação LED Completa',
    description: 'Substituição total de iluminação por tecnologia LED',
    emissionReduction: 50,
    investment: 15000,
    timeline: 2,
    priority: 'alta',
    roi: 3,
    annualSavings: 5000,
    applicableTo: {}
  },
  
  // MOBILIDADE (3 medidas)
  {
    id: 'mobilidade-1',
    category: 'mobilidade',
    name: 'Transição Frota Elétrica (5 viaturas)',
    description: 'Substituir 5 viaturas a combustão por veículos elétricos',
    emissionReduction: 80,
    investment: 150000,
    timeline: 6,
    priority: 'media',
    applicableTo: {
      sizes: ['media', 'grande']
    }
  },
  {
    id: 'mobilidade-2',
    category: 'mobilidade',
    name: 'Plano de Mobilidade Sustentável',
    description: 'Incentivos bike-to-work, passes transportes públicos, carsharing',
    emissionReduction: 40,
    investment: 10000,
    timeline: 3,
    priority: 'baixa',
    applicableTo: {
      minEmissions: 300
    }
  },
  {
    id: 'mobilidade-3',
    category: 'mobilidade',
    name: 'Posto de Carregamento Elétrico',
    description: 'Instalação de 2 postos de carregamento rápido',
    emissionReduction: 20,
    investment: 25000,
    timeline: 4,
    priority: 'media',
    applicableTo: {}
  },
  
  // RESÍDUOS (2 medidas)
  {
    id: 'residuos-1',
    category: 'residuos',
    name: 'Programa Resíduos Zero',
    description: 'Sistema de triagem, compostagem e redução de desperdício',
    emissionReduction: 30,
    investment: 8000,
    timeline: 6,
    priority: 'baixa',
    applicableTo: {}
  },
  {
    id: 'residuos-2',
    category: 'residuos',
    name: 'Compostagem de Orgânicos',
    description: 'Equipamento de compostagem para resíduos orgânicos',
    emissionReduction: 15,
    investment: 12000,
    timeline: 3,
    priority: 'baixa',
    applicableTo: {
      sectors: ['Retalho', 'Serviços', 'Agricultura']
    }
  },
  
  // ÁGUA (2 medidas)
  {
    id: 'agua-1',
    category: 'agua',
    name: 'Sistema de Reciclagem de Águas',
    description: 'Tratamento e reutilização de águas cinzentas',
    emissionReduction: 25,
    investment: 35000,
    timeline: 8,
    priority: 'baixa',
    applicableTo: {
      sectors: ['Indústria'],
      minEmissions: 500
    }
  },
  {
    id: 'agua-2',
    category: 'agua',
    name: 'Dispositivos Poupadores de Água',
    description: 'Torneiras, autoclismos e chuveiros eficientes',
    emissionReduction: 10,
    investment: 3000,
    timeline: 1,
    priority: 'media',
    applicableTo: {}
  }
];

/**
 * Filtra medidas aplicáveis a uma empresa específica
 */
export function getApplicableMeasures(
  supplier: Supplier,
  allMeasures: Measure[] = mockMeasures
): Measure[] {
  return allMeasures.filter(measure => {
    // Filtro por setor
    if (measure.applicableTo.sectors && 
        measure.applicableTo.sectors.length > 0 &&
        !measure.applicableTo.sectors.includes(supplier.sector)) {
      return false;
    }
    
    // Filtro por dimensão
    if (measure.applicableTo.sizes && 
        measure.applicableTo.sizes.length > 0 &&
        !measure.applicableTo.sizes.includes(supplier.companySize)) {
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
