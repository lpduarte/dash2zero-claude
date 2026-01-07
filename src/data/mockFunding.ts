import type { FundingSource, Measure, MeasureCategory } from '@/types/actionPlan';

export const mockFunding: FundingSource[] = [
  // SUBSÍDIOS (4 fundos)
  {
    id: 'subsidio-1',
    type: 'subsidio',
    name: 'Fundo Ambiental - Eficiência Energética',
    provider: 'Estado Português',
    maxAmount: 50000,
    percentage: 50,
    deadline: '2025-03-31',
    requirements: [
      'Auditoria energética prévia',
      'Certificado energético do edifício',
      'Empresa sem dívidas à Segurança Social'
    ],
    applicableTo: {
      measureCategories: ['energia']
    }
  },
  {
    id: 'subsidio-2',
    type: 'subsidio',
    name: 'Programa Cascais Sustentável',
    provider: 'Câmara Municipal de Cascais',
    maxAmount: 15000,
    deadline: 'rolling',
    requirements: [
      'Empresa sediada em Cascais',
      'Plano de descarbonização aprovado'
    ],
    applicableTo: {}
  },
  {
    id: 'incentivo-1',
    type: 'incentivo',
    name: 'Incentivo Mobilidade Elétrica',
    provider: 'Fundo Ambiental',
    maxAmount: 20000,
    deadline: '2025-12-31',
    requirements: [
      'Veículos 100% elétricos',
      'Máximo 4.000€ por viatura'
    ],
    applicableTo: {
      measureCategories: ['mobilidade']
    }
  },
  {
    id: 'subsidio-3',
    type: 'subsidio',
    name: 'PRR - Sustentabilidade Empresarial',
    provider: 'Plano de Recuperação e Resiliência',
    maxAmount: 100000,
    percentage: 40,
    deadline: '2025-06-30',
    requirements: [
      'Projeto com redução mínima de 30% emissões',
      'Auditoria externa de impacto'
    ],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade']
    }
  },
  
  // FINANCIAMENTO (2 linhas)
  {
    id: 'financiamento-1',
    type: 'financiamento',
    name: 'Linha PPR - Sustentabilidade',
    provider: 'Sistema Bancário',
    maxAmount: 200000,
    deadline: 'rolling',
    requirements: [
      'Taxa bonificada: Euribor + 1.5%',
      'Prazo até 7 anos',
      'Carência de capital: 12 meses'
    ],
    applicableTo: {}
  },
  {
    id: 'financiamento-2',
    type: 'financiamento',
    name: 'Banco Português de Fomento - Linha Verde',
    provider: 'BPF',
    maxAmount: 500000,
    deadline: 'rolling',
    requirements: [
      'Taxa: Euribor + 2%',
      'Garantia Mútua: 80%',
      'Prazo até 10 anos'
    ],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade', 'agua']
    }
  }
];

/**
 * Calcula fundos elegíveis baseado nas medidas selecionadas
 */
export function getEligibleFunding(
  selectedMeasures: Measure[],
  companySize: 'micro' | 'pequena' | 'media' | 'grande',
  allFunding: FundingSource[] = mockFunding
): FundingSource[] {
  const measureCategories = [...new Set(selectedMeasures.map(m => m.category))];
  
  return allFunding.filter(fund => {
    // Filtro por categoria de medida
    if (fund.applicableTo.measureCategories && 
        fund.applicableTo.measureCategories.length > 0 &&
        !fund.applicableTo.measureCategories.some(cat => 
          measureCategories.includes(cat)
        )) {
      return false;
    }
    
    // Filtro por dimensão máxima da empresa
    if (fund.applicableTo.maxCompanySize) {
      const sizeOrder = ['micro', 'pequena', 'media', 'grande'];
      const maxIndex = sizeOrder.indexOf(fund.applicableTo.maxCompanySize);
      const companyIndex = sizeOrder.indexOf(companySize);
      if (companyIndex > maxIndex) return false;
    }
    
    return true;
  });
}
